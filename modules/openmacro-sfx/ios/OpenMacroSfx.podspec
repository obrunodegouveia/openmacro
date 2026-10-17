Pod::Spec.new do |s|
  s.name           = 'OpenMacroSfx'
  s.version        = '1.0.0'
  s.summary        = 'Low-latency playback for short feedback sounds'
  s.description    = 'Decodes short clips into memory and plays them through AVAudioEngine.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
