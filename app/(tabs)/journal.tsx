import { View, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { LargeTitle, Caption1 } from '@/components/Typography';
import { colors } from '@/constants/colors';

export default function JournalScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LargeTitle>Video Journal</LargeTitle>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.emptyState}>
          <Caption1
            style={{ color: isDark ? colors.dark.secondaryText : colors.light.secondaryText }}>
            No journal entries yet
          </Caption1>
        </View>
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
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
});