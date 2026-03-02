import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

// 🔥 Look at this! Just one clean import from your new library!
import { useStormeeAudio } from 'react-native-stormee-audio';

export default function App() {
  // 🎯 The ONLY three things your UI needs!
  const { startRecording, stopRecording, transcription } = useStormeeAudio({
    conciergeId: 'e2fceecc-a300-43f0-aa33-2e3e10189385',
    organizationId: '684035984caaf94cc4a1d166',
    organizationName: 'techolution',
    username: 'Hardik Yadav',
    useremailId: 'hardik.yadav@techolution.com',
    rlefVoiceTaskId: '687507ba3bb9b5c033f2b82d',
    userId: '0804b20a-2414-40c8-afd1-1bf0703e9d6e',
    voiceAgentMongoId: '687507ff54d0a7db72e7a29d',
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. LIVE TRANSCRIPTION */}
      <View style={styles.textContainer}>
        <Text style={styles.transcriptionText}>
          {transcription || 'Waiting for audio...'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* 2. START RECORDING */}
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={startRecording}
        >
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>

        {/* 3. STOP RECORDING */}
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopRecording}
        >
          <Text style={styles.buttonText}>STOP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Just some basic styles for the buttons
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0f' },
  textContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  transcriptionText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 50,
  },
  button: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10 },
  startButton: { backgroundColor: '#2563eb' },
  stopButton: { backgroundColor: '#ef4444' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '900' },
});
