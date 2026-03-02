import { NativeEventEmitter } from 'react-native';
import { Buffer } from 'buffer';
import {
  AssistantClient,
  type AssistantOptions,
  AssistantEvent,
} from 'ratt-lib';

// 🔥 IMPORT DIRECTLY FROM YOUR TURBOMODULE SPEC
// (Make sure this path points exactly to where your NativeStormeeAudio.ts file lives)
import StormeeAudio from './NativeStormeeAudio';

// Create the emitter using the strongly-typed TurboModule
const micEmitter = new NativeEventEmitter(StormeeAudio as any);

export class RattCaptureService {
  private client: AssistantClient | null = null;
  private micSubscription: any = null;

  constructor(
    private serverUrl: string,
    private rattAgentDetails: any,
    public onTranscription: (text: string) => void,
    public onStateChange: (state: any) => void
  ) {}

  async init() {
    if (this.client) return;

    const opts: AssistantOptions = {
      url: this.serverUrl,
      requestId: { current: this.rattAgentDetails.requestId },
      rattAgentDetails: this.rattAgentDetails,
      externalAudio: true, // 🚀 Crucial: Tells ratt-lib we will provide the PCM audio from iOS
    };

    this.client = new AssistantClient(opts);

    // 1. Handle WebSockets & State
    this.client.on(AssistantEvent.READY, () =>
      this.onStateChange({ wsReady: true })
    );

    this.client.on(AssistantEvent.TRANSCRIPTION, (e: any) => {
      this.onTranscription(e?.detail?.text ?? '');
    });

    // 2. Handle Server Commands
    this.client.on(AssistantEvent.SOCKET_MESSAGE, async (e: any) => {
      const parsed = e?.detail?.parsed;
      console.log('ws events', parsed);

      if (!parsed) return;

      // Server says "I am ready, give me audio!"
      if (parsed.start_audio) {
        this.onStateChange({ isRecording: true });
        await this.startNativeMic();
      }

      // Server says "I heard enough" or timeout
      if (parsed.stop_audio || parsed.disconnect) {
        await this.stopNativeMic();
        this.onStateChange({ isRecording: false });
      }
    });

    await this.client.connect();
  }

  // User taps "Hold to Talk" -> Tells server to prepare
  async startSession() {
    if (!this.client) await this.init();
    await this.client!.startSession();
  }

  // User releases "Hold to Talk" -> Stops mic and tells server
  async stopSession() {
    await this.stopNativeMic();
    if (this.client) await this.client.stopAudio();
    this.onStateChange({ isRecording: false });
  }

  // ── Native iOS Mic Bridge ──
  private async startNativeMic() {
    if (this.micSubscription) return;

    // 1. Listen for chunks from iOS
    this.micSubscription = micEmitter.addListener(
      'onMicAudioChunk',
      (base64String: any) => {
        if (!this.client) return;

        // 2. Decode Base64 to Buffer
        const buf = Buffer.from(base64String, 'base64');

        // 3. Convert to Int16Array (16-bit PCM)
        const pcm16 = new Int16Array(
          buf.buffer,
          buf.byteOffset,
          buf.byteLength / 2
        );

        // 4. Feed directly into ratt-lib!
        this.client.pushPCM16(pcm16);
      }
    );

    // 5. Turn the iOS mic on
    // Put this right before await StormeeAudio.startRecording();
    console.log('🔍 WHAT IS STORMEEAUDIO?', StormeeAudio);
    console.log('🔍 KEYS ON STORMEEAUDIO:', Object.keys(StormeeAudio || {}));
    console.log(
      '🔍 IS START RECORDING THERE?',
      typeof StormeeAudio?.startRecording
    );
    await StormeeAudio.startRecording();
  }

  private async stopNativeMic() {
    await StormeeAudio.stopRecording();
    if (this.micSubscription) {
      this.micSubscription.remove();
      this.micSubscription = null;
    }
  }
}
