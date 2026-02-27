package com.stormeeaudio

import com.facebook.react.bridge.ReactApplicationContext

class StormeeAudioModule(reactContext: ReactApplicationContext) :
  NativeStormeeAudioSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeStormeeAudioSpec.NAME
  }
}
