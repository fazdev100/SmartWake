import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Video } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function JournalScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Video Journal</Text>
      <View style={styles.emptyState}>
        <Video size={48} color="#666" />
        <Text style={styles.emptyText}>No journal entries yet</Text>
        <Text style={styles.emptySubtext}>
          Your alarm dismissal videos will appear here
        </Text>
      </View>
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