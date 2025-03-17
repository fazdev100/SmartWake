import { Tabs } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import { Bell, Clock, Settings, VideoIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? colors.dark.background : colors.light.background,
          borderTopColor: isDark ? colors.dark.border : colors.light.border,
        },
        tabBarActiveTintColor: isDark ? colors.dark.primary : colors.light.primary,
        tabBarInactiveTintColor: isDark ? colors.dark.secondary : colors.light.secondary,
        ...Platform.select({
          web: {
            tabBarLabelPosition: 'below-icon',
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Alarms',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => <VideoIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}