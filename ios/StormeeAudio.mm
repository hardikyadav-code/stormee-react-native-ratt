#import "StormeeAudio.h"
#import <AVFoundation/AVFoundation.h>

@implementation StormeeAudio {
  AVAudioEngine *_audioEngine;
}

RCT_EXPORT_MODULE(StormeeAudio)

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onMicAudioChunk"];
}

// 🛑 Fix for the Emitter: Must call super, or events won't send!
- (void)addListener:(NSString *)eventName {
    [super addListener:eventName];
}

- (void)removeListeners:(double)count {
    [super removeListeners:count];
}

// 🎤 Native instance method matching the TurboModule Spec perfectly
- (void)startRecording:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    
    // 1. WAKE UP THE iOS AUDIO SESSION
    // If we don't do this, AVFoundation will crash because the mic is asleep.
    NSError *sessionError = nil;
    AVAudioSession *session = [AVAudioSession sharedInstance];
    [session setCategory:AVAudioSessionCategoryPlayAndRecord 
                    mode:AVAudioSessionModeDefault 
                 options:AVAudioSessionCategoryOptionDefaultToSpeaker 
                   error:&sessionError];
    [session setActive:YES error:&sessionError];
    
    if (sessionError) {
        reject(@"session_error", @"Failed to setup iOS audio session", sessionError);
        return;
    }

    _audioEngine = [[AVAudioEngine alloc] init];
    AVAudioInputNode *inputNode = _audioEngine.inputNode;
    
    // 2. SET THE EXACT AUDIO FORMAT RATT-LIB WANTS
    // 16kHz, 1 Channel (Mono), 16-bit PCM
    AVAudioFormat *recordingFormat = [[AVAudioFormat alloc] initWithCommonFormat:AVAudioPCMFormatInt16 
                                                                      sampleRate:16000 
                                                                        channels:1 
                                                                     interleaved:NO];
    
    // 3. INSTALL THE TAP
    [inputNode installTapOnBus:0 bufferSize:1024 format:recordingFormat block:^(AVAudioPCMBuffer *buffer, AVAudioTime *when) {
        
        // Guard against empty buffers
        if (buffer.frameLength == 0) return;
        
        NSData *audioData = [NSData dataWithBytes:buffer.int16ChannelData[0] length:buffer.frameLength * sizeof(int16_t)];
        NSString *base64String = [audioData base64EncodedStringWithOptions:0];
        [self sendEventWithName:@"onMicAudioChunk" body:base64String];
    }];

    // 4. START THE ENGINE
    NSError *error;
    [_audioEngine startAndReturnError:&error];
    
    if (error) {
        reject(@"error", @"Could not start audio engine", error);
    } else {
        resolve(@YES);
    }
}

// 🎤 Native instance method matching the TurboModule Spec perfectly
- (void)stopRecording:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    if (_audioEngine != nil) {
        [_audioEngine stop];
        [_audioEngine.inputNode removeTapOnBus:0];
        _audioEngine = nil;
    }
    
    // Politely put the audio session back to sleep so other apps can use audio
    NSError *sessionError = nil;
    [[AVAudioSession sharedInstance] setActive:NO 
                                 withOptions:AVAudioSessionSetActiveOptionNotifyOthersOnDeactivation 
                                       error:&sessionError];
    
    resolve(@YES);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeStormeeAudioSpecJSI>(params);
}

@end