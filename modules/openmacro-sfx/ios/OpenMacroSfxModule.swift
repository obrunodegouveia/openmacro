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

  private let engine = AVAudioEngine()
  private var buffers: [String: AVAudioPCMBuffer] = [:]
  private var voices: [AVAudioPlayerNode] = []
  private var voiceFormat: AVAudioFormat?
  private var nextVoice = 0
  private let lock = NSLock()

  public func definition() -> ModuleDefinition {
    Name("OpenMacroSfx")

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
        // Stopped by an interruption or a route change; bring it back.
        do { try self.engine.start() } catch { return false }
      }
      let voice = self.voices[self.nextVoice]
      self.nextVoice = (self.nextVoice + 1) % self.voices.count
      // `.interrupts` starts this clip now, replacing whatever the voice was
      // playing, instead of queueing behind it.
      voice.scheduleBuffer(buffer, at: nil, options: .interrupts, completionHandler: nil)
      if !voice.isPlaying { voice.play() }
      return true
    }

    OnDestroy {
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
    try engine.start()
  }
}
