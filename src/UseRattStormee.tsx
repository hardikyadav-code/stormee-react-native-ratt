import { useState, useEffect, useCallback, useRef } from 'react';
import { RattCaptureService } from './RattCaptureService';

export interface StormeeConfig {
  conciergeId: string;
  organizationId: string;
  organizationName: string;
  username: string;
  useremailId: string;
  rlefVoiceTaskId: string;
  assistant_type?: string;
  userId: string;
  voiceAgentMongoId: string;
  environmentUrl?: string;
}
/* eslint-disable no-bitwise */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export function useStormeeAudio(config: StormeeConfig) {
  // The only piece of state we expose to the frontend
  const [transcription, setTranscription] = useState<string>('');
  const serviceRef = useRef<RattCaptureService | null>(null);

  useEffect(() => {
    const agentDetails = {
      conciergeName: 'stormee',
      requestId: `request-${generateUUID()}`,
      chatSessionId: `session-${generateUUID()}`,
      client_id: `client-${generateUUID()}`,
      isAudioRequest: true,
      conciergeId: config.conciergeId,
      organizationId: config.organizationId,
      organizationName: config.organizationName,
      username: config.username,
      useremailId: config.useremailId,
      rlefVoiceTaskId: config.rlefVoiceTaskId,
      assistant_type: config.assistant_type || 'normal',
      userId: config.userId,
      agentSettings: { voiceAgentMongoId: config.voiceAgentMongoId },
    };

    const baseUrl =
      config.environmentUrl || 'wss://devllmstudio.creativeworkspace.ai';
    const serverUrl = `${baseUrl}/audioStreamingWebsocket?sessionId=${agentDetails.chatSessionId}&clientId=${agentDetails.client_id}`;

    const service = new RattCaptureService(
      serverUrl,
      agentDetails,
      (text) => setTranscription(text), // Feed live transcription to state
      () => {} // We are hiding internal state changes from the frontend
    );

    service.init();
    serviceRef.current = service;

    return () => {
      service.stopSession();
      serviceRef.current = null;
    };
  }, [config]); // Only reconnect if the user changes

  // Expose the Start function
  const startRecording = useCallback(() => {
    if (serviceRef.current) {
      setTranscription(''); // Clear old text
      serviceRef.current.startSession();
    }
  }, []);

  // Expose the Stop function
  const stopRecording = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stopSession();
    }
  }, []);

  // Return ONLY the 3 things the frontend developer asked for
  return {
    startRecording,
    stopRecording,
    transcription,
  };
}
