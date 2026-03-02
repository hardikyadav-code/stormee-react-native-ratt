#import <React/RCTEventEmitter.h>
#import <StormeeAudioSpec/StormeeAudioSpec.h>

// Change NSObject to RCTEventEmitter
@interface StormeeAudio : RCTEventEmitter <NativeStormeeAudioSpec>

@end