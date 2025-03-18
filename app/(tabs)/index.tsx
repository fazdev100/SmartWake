import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useAlarmStore } from '@/store/alarmStore';
import { format } from 'date-fns';
import { Bell, Video, Mic } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AlarmListScreen() {
  const { alarms, toggleAlarm } = useAlarmStore();
  const insets = useSafeAreaInsets();

  const getAlarmIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={24} color="#fff" />;
      case 'voice':
        return <Mic size={24} color="#fff" />;
      default:
        return <Bell size={24} color="#fff" />;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.alarmItem, { opacity: item.enabled ? 1 : 0.5 }]}
      onPress={() => toggleAlarm(item.id)}>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{item.time}</Text>
        <Text style={styles.date}>
          {format(new Date(item.date), 'MMM d, yyyy')}
        </Text>
        <Text style={styles.repeat}>{item.repeat}</Text>
      </View>
      <View style={styles.iconContainer}>{getAlarmIcon(item.type)}</View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Your Alarms</Text>
      {alarms.length === 0 ? (
        <View style={styles.emptyState}>
          <Bell size={48} color="#666" />
          <Text style={styles.emptyText}>No alarms set</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to create your first alarm
          </Text>
        </View>
      ) : (
        <FlatList
          data={alarms}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    padding: 20,
  },
  list: {
    padding: 20,
  },
  alarmItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flex: 1,
  },
  time: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  repeat: {
    fontSize: 14,
    color: '#666',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#333',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});