import { TurboModuleRegistry, type TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  // Your original method
  multiply(a: number, b: number): number;

  // 🎤 ADD THESE: Tell JavaScript your microphone methods exist!
  startRecording(): Promise<boolean>;
  stopRecording(): Promise<boolean>;

  // 🛑 ADD THESE: Tell NativeEventEmitter its required methods exist!
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('StormeeAudio');
