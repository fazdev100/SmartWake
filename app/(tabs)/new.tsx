import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Video, Mic, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlarmStore, AlarmType, RepeatType } from '@/store/alarmStore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewAlarmScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addAlarm } = useAlarmStore();

  const [date, setDate] = useState(new Date());
  const [type, setType] = useState<AlarmType>('audio');
  const [repeat, setRepeat] = useState<RepeatType>('once');
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const handleSave = () => {
    addAlarm({
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      date: date.toISOString(),
      type,
      repeat,
      enabled: true,
    });
    router.back();
  };

  const AlarmTypeButton = ({ title, value, icon: Icon }) => (
    <TouchableOpacity
      style={[styles.typeButton, type === value && styles.typeButtonActive]}
      onPress={() => setType(value)}>
      <Icon
        size={24}
        color={type === value ? '#fff' : '#666'}
      />
      <Text
        style={[
          styles.typeButtonText,
          type === value && styles.typeButtonTextActive,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}>
      <Text style={styles.title}>New Alarm</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time</Text>
        {Platform.OS === 'ios' ? (
          <DateTimePicker
            value={date}
            mode="time"
            display="spinner"
            onChange={(event, selectedDate) => {
              setDate(selectedDate || date);
            }}
            style={styles.picker}
          />
        ) : (
          <TouchableOpacity
            style={styles.androidTimeButton}
            onPress={() => setShowPicker(true)}>
            <Text style={styles.androidTimeText}>
              {date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alarm Type</Text>
        <View style={styles.typeButtons}>
          <AlarmTypeButton title="Sound" value="audio" icon={Bell} />
          <AlarmTypeButton title="Voice" value="voice" icon={Mic} />
          <AlarmTypeButton title="Video" value="video" icon={Video} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Repeat</Text>
        <View style={styles.repeatButtons}>
          {(['once', 'daily', 'weekdays', 'custom'] as RepeatType[]).map(
            (value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.repeatButton,
                  repeat === value && styles.repeatButtonActive,
                ]}
                onPress={() => setRepeat(value)}>
                <Text
                  style={[
                    styles.repeatButtonText,
                    repeat === value && styles.repeatButtonTextActive,
                  ]}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Alarm</Text>
      </TouchableOpacity>

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={false}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  picker: {
    height: 180,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
  },
  androidTimeButton: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  androidTimeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: '#333',
  },
  typeButtonText: {
    color: '#666',
    marginTop: 8,
    fontSize: 16,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  repeatButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -4,
  },
  repeatButton: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
    margin: 4,
  },
  repeatButtonActive: {
    backgroundColor: '#333',
  },
  repeatButtonText: {
    color: '#666',
    fontSize: 16,
  },
  repeatButtonTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});