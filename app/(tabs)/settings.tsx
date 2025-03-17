import { View, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { LargeTitle } from '@/components/Typography';
import { colors } from '@/constants/colors';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LargeTitle>Settings</LargeTitle>
      </View>
      <ScrollView
        style={[
          styles.content,
          {
            backgroundColor: isDark ? colors.dark.secondaryBackground : colors.light.secondaryBackground,
          },
        ]}></ScrollView>
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});