#import "StormeeAudio.h"

@implementation StormeeAudio

// This allows the module to send events (like audio data) to JS
- (NSArray<NSString *> *)supportedEvents {
  return @[@"onAudioData"];
}

// Required for the New Architecture / TurboModules
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeStormeeAudioSpecJSI>(params);
}

// --- ADDED METHODS TO STOP THE CRASH ---

RCT_EXPORT_METHOD(startRecording:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"Native: startRecording called");
    // Eventually, add your microphone logic here
    resolve(@YES);
}

RCT_EXPORT_METHOD(stopRecording:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"Native: stopRecording called");
    resolve(@YES);
}

// --- KEEPING YOUR ORIGINAL MULTIPLY ---

- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);
    return result;
}

+ (NSString *)moduleName
{
  return @"StormeeAudio";
}

// Important: This tells React Native to run these methods on the Main Thread if needed
- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

@end