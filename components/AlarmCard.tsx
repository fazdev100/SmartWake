import { View, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Title2, Caption1 } from './Typography';
import { colors } from '@/constants/colors';
import { Switch } from 'react-native';
import { format } from 'date-fns';

interface AlarmCardProps {
  time: Date;
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
  onPress: () => void;
}

export function AlarmCard({ time, label, isEnabled, onToggle, onPress }: AlarmCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.dark.secondaryBackground : colors.light.secondaryBackground,
        },
      ]}>
      <View style={styles.content}>
        <Title2>{format(time, 'HH:mm')}</Title2>
        <Caption1 style={{ color: isDark ? colors.dark.secondaryText : colors.light.secondaryText }}>
          {label}
        </Caption1>
      </View>
      <Switch
        value={isEnabled}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: isDark ? colors.dark.primary : colors.light.primary }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    flex: 1,
  },
});