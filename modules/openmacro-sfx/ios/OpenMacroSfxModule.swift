import AVFoundation
import ExpoModulesCore

/**
 * Low-latency playback for the app's short feedback sounds.
 *
 * `expo-audio` plays through AVPlayer, which is built for streams and takes
 * tens of milliseconds to start a sound: long enough that a tap's click felt
 * late even when it was fired on touch-down. This decodes each clip once into
 * an in-memory PCM buffer and plays it through AVAudioEngine, where starting
 * a buffer that is already in memory is close to immediate.
 *
 * It uses the app's shared audio session, which `expo-audio` configures
 * (mix with others, silenced by the silent switch), so it behaves exactly
 * like the player it replaces. JS falls back to that player whenever `play`
 * returns false.
 */
public class OpenMacroSfxModule: Module {
  /** Enough voices for a burst of fast taps to overlap instead of cutting off. */
  private static let voiceCount = 6

  /**
   * The hardware buffer to ask for, in seconds. A clip scheduled now starts
   * at the next render cycle, so the cycle length is latency on every cue:
   * about 23 ms by default, 5 ms with this. iOS treats it as a preference and
   * may round it; the cost is the render thread waking more often while the
   * app is open, which a few short clips do not notice.
   */
  private static let ioBufferDuration: TimeInterval = 0.005

  private let engine = AVAudioEngine()
  private var buffers: [String: AVAudioPCMBuffer] = [:]
  private var voices: [AVAudioPlayerNode] = []
  private var voiceFormat: AVAudioFormat?
  private var nextVoice = 0
  private let lock = NSLock()
  private var observers: [NSObjectProtocol] = []
  private var latencyLogged = false

  public func definition() -> ModuleDefinition {
    Name("OpenMacroSfx")

    // iOS stops the engine on a route or category change (headphones, a
    // lesson video, the session being reconfigured) and on an interruption.
    // Restart it as soon as that happens, off the hot path; otherwise the
    // next tap would wait in `play` while the engine started.
    OnCreate {
      let center = NotificationCenter.default
      self.observers = [
        center.addObserver(
          forName: .AVAudioEngineConfigurationChange, object: self.engine, queue: .main
        ) { [weak self] _ in self?.resume() },
        center.addObserver(
          forName: AVAudioSession.interruptionNotification, object: nil, queue: .main
        ) { [weak self] note in
          let raw = note.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt
          if raw == AVAudioSession.InterruptionType.ended.rawValue { self?.resume() }
        },
      ]
    }

    OnAppBecomesActive {
      self.resume()
    }

    // Decodes a local sound file into memory under `id`. Every clip must
    // share one sample rate and channel count; the first one loaded sets it.
    AsyncFunction("load") { (id: String, uri: String) in
      guard let url = URL(string: uri), url.isFileURL else {
        throw Exception(name: "BadUri", description: "Expected a file:// URI, got \(uri)")
      }
      let file = try AVAudioFile(forReading: url)
      guard let buffer = AVAudioPCMBuffer(
        pcmFormat: file.processingFormat,
        frameCapacity: AVAudioFrameCount(file.length)
      ) else {
        throw Exception(name: "NoBuffer", description: "Could not allocate a buffer for \(id)")
      }
      try file.read(into: buffer)

      self.lock.lock()
      defer { self.lock.unlock() }
      try self.prepareVoices(for: buffer.format)
      guard buffer.format == self.voiceFormat else {
        throw Exception(name: "FormatMismatch", description: "\(id) does not match the other clips' format")
      }
      self.buffers[id] = buffer
    }

    // Plays a loaded clip now. Returns false when it cannot, so the caller
    // can fall back to its own player.
    Function("play") { (id: String) -> Bool in
      self.lock.lock()
      defer { self.lock.unlock() }
      guard let buffer = self.buffers[id], !self.voices.isEmpty else { return false }
      if !self.engine.isRunning {
        // Stopped, and `resume` has not run yet; bring it back here.
        do { try self.startEngine() } catch { return false }
      }
      let voice = self.voices[self.nextVoice]
      self.nextVoice = (self.nextVoice + 1) % self.voices.count
      // `.interrupts` starts this clip now, replacing whatever the voice was
      // playing, instead of queueing behind it.
      voice.scheduleBuffer(buffer, at: nil, options: .interrupts, completionHandler: nil)
      if !voice.isPlaying { voice.play() }
      return true
    }

    // What the hardware actually granted, in milliseconds, or nil before the
    // engine has started. `ioBuffer` is the render cycle a scheduled clip
    // waits for; `output` is the route's own delay after it (a few ms on the
    // speaker, far more over Bluetooth, where nothing here can help).
    Function("latency") { () -> [String: Double]? in
      self.lock.lock()
      defer { self.lock.unlock() }
      guard self.engine.isRunning else { return nil }
      return self.latency()
    }

    OnDestroy {
      self.observers.forEach { NotificationCenter.default.removeObserver($0) }
      self.observers = []
      self.engine.stop()
    }
  }

  /** Attaches the voices and starts the engine, once, for the clips' format. */
  private func prepareVoices(for format: AVAudioFormat) throws {
    if voiceFormat != nil { return }
    voiceFormat = format
    for _ in 0..<Self.voiceCount {
      let voice = AVAudioPlayerNode()
      engine.attach(voice)
      engine.connect(voice, to: engine.mainMixerNode, format: format)
      voices.append(voice)
    }
    engine.prepare()
    try startEngine()
  }

  /**
   * Starts the engine and puts every voice in the playing state, with nothing
   * scheduled, so `play` only has to schedule a buffer: a node that is
   * already playing starts it at the next render cycle, without first
   * starting the node. Each voice is stopped first, because one the engine
   * stopped under it can still report that it is playing.
   *
   * Each voice then renders a few milliseconds of silence, so whatever a
   * node sets up on its first render happens now rather than on the first
   * tap. Call with `lock` held.
   */
  private func startEngine() throws {
    // Before the engine starts, so its first render cycle is already short.
    try? AVAudioSession.sharedInstance().setPreferredIOBufferDuration(Self.ioBufferDuration)
    try engine.start()
    let silence = voiceFormat.flatMap { format in
      AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(format.sampleRate / 100))
    }
    // A new buffer's frames are zeroed: it only needs its length set.
    silence?.frameLength = silence?.frameCapacity ?? 0
    for voice in voices {
      voice.stop()
      if let silence { voice.scheduleBuffer(silence, at: nil, options: [], completionHandler: nil) }
      voice.play()
    }
    if !latencyLogged {
      latencyLogged = true
      let granted = latency()
      NSLog(
        "[OpenMacroSfx] engine started: io buffer %.2f ms, output latency %.2f ms, %.0f Hz",
        granted["ioBuffer"] ?? 0, granted["output"] ?? 0, granted["sampleRate"] ?? 0
      )
    }
  }

  /** The session's granted buffer and route latency, in ms, and its sample rate. */
  private func latency() -> [String: Double] {
    let session = AVAudioSession.sharedInstance()
    return [
      "ioBuffer": session.ioBufferDuration * 1000,
      "output": session.outputLatency * 1000,
      "sampleRate": session.sampleRate,
    ]
  }

  /** Brings a stopped engine back, and its voices with it. Free when running. */
  private func resume() {
    lock.lock()
    defer { lock.unlock() }
    guard !voices.isEmpty, !engine.isRunning else { return }
    try? startEngine()
  }
}
