import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type AlarmType = 'audio' | 'voice' | 'video';
export type RepeatType = 'once' | 'daily' | 'weekdays' | 'custom';

export interface Alarm {
  id: string;
  time: string;
  date: string;
  type: AlarmType;
  repeat: RepeatType;
  mediaUri?: string;
  volume: number;
  fadeIn: boolean;
  enabled: boolean;
  days?: number[];
  label?: string;
}

interface AlarmState {
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  removeAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => void;
}

const STORAGE_KEY = '@alarms';

export const useAlarmStore = create<AlarmState>((set) => ({
  alarms: [],
  addAlarm: (alarm) => {
    set((state) => {
      const newAlarm = { 
        ...alarm, 
        id: Math.random().toString(36).slice(2),
        volume: alarm.volume ?? 1,
        fadeIn: alarm.fadeIn ?? false
      };
      const newAlarms = [...state.alarms, newAlarm];
      if (Platform.OS !== 'web') {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAlarms));
      }
      return { alarms: newAlarms };
    });
  },
  removeAlarm: (id) => {
    set((state) => {
      const newAlarms = state.alarms.filter((alarm) => alarm.id !== id);
      if (Platform.OS !== 'web') {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAlarms));
      }
      return { alarms: newAlarms };
    });
  },
  toggleAlarm: (id) => {
    set((state) => {
      const newAlarms = state.alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      );
      if (Platform.OS !== 'web') {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAlarms));
      }
      return { alarms: newAlarms };
    });
  },
  updateAlarm: (id, updatedAlarm) => {
    set((state) => {
      const newAlarms = state.alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, ...updatedAlarm } : alarm
      );
      if (Platform.OS !== 'web') {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAlarms));
      }
      return { alarms: newAlarms };
    });
  },
}));