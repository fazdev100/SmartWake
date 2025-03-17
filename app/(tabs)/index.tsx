import { View, StyleSheet, ScrollView } from 'react-native';
import { LargeTitle } from '@/components/Typography';
import { AlarmCard } from '@/components/AlarmCard';
import { useAlarmStore } from '@/stores/alarmStore';
import { Link } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';
import { colors } from '@/constants/colors';

export default function AlarmsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { alarms, toggleAlarm } = useAlarmStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LargeTitle>Alarms</LargeTitle>
        <Link href="/new-alarm" asChild>
          <TouchableOpacity>
            <Plus color={isDark ? colors.dark.primary : colors.light.primary} size={24} />
          </TouchableOpacity>
        </Link>
      </View>
      <ScrollView style={styles.content}>
        {alarms.map((alarm) => (
          <AlarmCard
            key={alarm.id}
            time={alarm.time}
            label={alarm.label}
            isEnabled={alarm.isEnabled}
            onToggle={() => toggleAlarm(alarm.id)}
            onPress={() => {}}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
});