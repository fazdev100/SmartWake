import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { FileSystem } from 'expo-file-system';
import { Mic, Play, Square, Volume2 } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_RECORDING_DURATION = 30000; // 30 seconds

export type MediaType = {
  uri: string;
  type: 'audio' | 'voice' | 'video' | 'youtube';
  volume: number;
  fadeIn: boolean;
};

interface MediaPickerProps {
  onMediaSelect: (media: MediaType) => void;
  type: 'audio' | 'voice' | 'video';
}

export default function MediaPicker({ onMediaSelect, type }: MediaPickerProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fadeIn, setFadeIn] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);

      // Stop recording after 30 seconds
      setTimeout(() => {
        if (recording.getStatusAsync().then((status) => status.isRecording)) {
          stopRecording();
        }
      }, MAX_RECORDING_DURATION);
    } catch (err) {
      setError('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        onMediaSelect({ uri, type: 'voice', volume, fadeIn });
      }
    } catch (err) {
      setError('Failed to stop recording');
    }
  };

  const playSound = async (uri: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      setError('Failed to play media');
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: type === 'audio' ? ['audio/*'] : ['video/*'],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        
        if (fileInfo.size && fileInfo.size > MAX_FILE_SIZE) {
          setError('File size must be less than 50MB');
          return;
        }

        onMediaSelect({
          uri: asset.uri,
          type: type === 'audio' ? 'audio' : 'video',
          volume,
          fadeIn,
        });
      }
    } catch (err) {
      setError('Failed to pick file');
    }
  };

  const validateYoutubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
  };

  const handleYoutubeSubmit = () => {
    if (validateYoutubeUrl(youtubeUrl)) {
      onMediaSelect({
        uri: youtubeUrl,
        type: 'youtube',
        volume,
        fadeIn,
      });
      setError(null);
    } else {
      setError('Invalid YouTube URL');
    }
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      {type === 'voice' ? (
        <View style={styles.recordingContainer}>
          <TouchableOpacity
            style={[styles.button, recording && styles.buttonActive]}
            onPress={recording ? stopRecording : startRecording}
          >
            {recording ? (
              <Square size={24} color="#fff" />
            ) : (
              <Mic size={24} color="#fff" />
            )}
            <Text style={styles.buttonText}>
              {recording ? 'Stop Recording' : 'Start Recording'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : type === 'video' ? (
        <View style={styles.videoContainer}>
          <TouchableOpacity style={styles.button} onPress={pickFile}>
            <Text style={styles.buttonText}>Select Video File</Text>
          </TouchableOpacity>
          
          <Text style={styles.orText}>or</Text>
          
          <View style={styles.youtubeContainer}>
            <TextInput
              style={styles.input}
              placeholder="Paste YouTube URL"
              placeholderTextColor="#666"
              value={youtubeUrl}
              onChangeText={setYoutubeUrl}
            />
            <TouchableOpacity 
              style={styles.button}
              onPress={handleYoutubeSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={pickFile}>
          <Text style={styles.buttonText}>Select Audio File</Text>
        </TouchableOpacity>
      )}

      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <Volume2 size={24} color="#fff" />
          <Animated.View style={styles.slider}>
            {/* Volume Slider Implementation */}
          </Animated.View>
        </View>

        <TouchableOpacity
          style={[styles.option, fadeIn && styles.optionActive]}
          onPress={() => setFadeIn(!fadeIn)}
        >
          <Text style={styles.optionText}>Fade In</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginTop: 16,
  },
  error: {
    color: '#ff4444',
    marginBottom: 16,
    fontFamily: 'Poppins-Regular',
  },
  recordingContainer: {
    alignItems: 'center',
  },
  videoContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonActive: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  orText: {
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  youtubeContainer: {
    gap: 8,
  },
  input: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  controls: {
    marginTop: 16,
    gap: 16,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  option: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
});