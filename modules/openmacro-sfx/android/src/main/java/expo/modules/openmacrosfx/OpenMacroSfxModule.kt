package expo.modules.openmacrosfx

import android.media.AudioAttributes
import android.media.SoundPool
import android.net.Uri
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File

/**
 * Low-latency playback for the app's short feedback sounds.
 *
 * SoundPool decodes each clip once and plays it from memory, which is what it
 * exists for; the ExoPlayer behind `expo-audio` starts a sound noticeably
 * later. JS falls back to that player whenever `play` returns false.
 */
class OpenMacroSfxModule : Module() {
  private val pool: SoundPool by lazy {
    SoundPool.Builder()
      .setMaxStreams(6)
      .setAudioAttributes(
        AudioAttributes.Builder()
          .setUsage(AudioAttributes.USAGE_GAME)
          .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
          .build()
      )
      .build()
      .also { it.setOnLoadCompleteListener { _, soundId, status -> onLoaded(soundId, status) } }
  }

  /** Loaded sounds, by the id JS gave them. */
  private val sounds = mutableMapOf<String, Int>()

  /** Loads still in flight: SoundPool's sound id to the promise waiting on it. */
  private val pending = mutableMapOf<Int, Pair<String, Promise>>()

  override fun definition() = ModuleDefinition {
    Name("OpenMacroSfx")

    // Decodes a sound file into the pool under `id`.
    AsyncFunction("load") { id: String, uri: String, promise: Promise ->
      val path = try {
        localPath(id, Uri.parse(uri))
      } catch (error: Exception) {
        promise.reject(CodedException("BadUri", "Cannot read $uri", error))
        return@AsyncFunction
      }
      synchronized(pending) {
        val soundId = pool.load(path, 1)
        pending[soundId] = id to promise
      }
    }

    // Plays a loaded clip now. Returns false when it cannot, so the caller
    // can fall back to its own player.
    Function("play") { id: String ->
      val soundId = synchronized(pending) { sounds[id] } ?: return@Function false
      pool.play(soundId, 1f, 1f, 1, 0, 1f) != 0
    }

    OnDestroy {
      pool.release()
    }
  }

  private fun onLoaded(soundId: Int, status: Int) {
    val (id, promise) = synchronized(pending) { pending.remove(soundId) } ?: return
    if (status == 0) {
      synchronized(pending) { sounds[id] = soundId }
      promise.resolve(null)
    } else {
      promise.reject(CodedException("LoadFailed", "SoundPool could not load $id (status $status)", null))
    }
  }

  /**
   * A filesystem path SoundPool can open. `file://` URIs are used directly;
   * anything else (a bundled resource, a content URI) is copied to the cache
   * once, since SoundPool only loads from paths and descriptors.
   */
  private fun localPath(id: String, uri: Uri): String {
    if (uri.scheme == "file") return uri.path ?: throw IllegalArgumentException("Empty path")
    val context = appContext.reactContext ?: throw IllegalStateException("No context")
    val target = File(context.cacheDir, "openmacro-sfx-$id")
    val input = if (uri.scheme == "asset") {
      context.assets.open(uri.path!!.trimStart('/'))
    } else {
      context.contentResolver.openInputStream(uri) ?: throw IllegalArgumentException("Cannot open $uri")
    }
    input.use { source -> target.outputStream().use { source.copyTo(it) } }
    return target.absolutePath
  }
}
