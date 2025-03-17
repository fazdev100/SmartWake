import { create } from 'zustand';

interface Alarm {
  id: string;
  time: Date;
  label: string;
  isEnabled: boolean;
  days: number[];
  videoRequired: boolean;
  soundType: 'default' | 'custom';
  soundUrl?: string;
}

interface AlarmStore {
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  toggleAlarm: (id: string) => void;
  removeAlarm: (id: string) => void;
  updateAlarm: (id: string, alarm: Partial<Alarm>) => void;
}

export const useAlarmStore = create<AlarmStore>((set) => ({
  alarms: [],
  addAlarm: (alarm) =>
    set((state) => ({
      alarms: [...state.alarms, { ...alarm, id: Math.random().toString(36).substr(2, 9) }],
    })),
  toggleAlarm: (id) =>
    set((state) => ({
      alarms: state.alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, isEnabled: !alarm.isEnabled } : alarm,
      ),
    })),
  removeAlarm: (id) =>
    set((state) => ({
      alarms: state.alarms.filter((alarm) => alarm.id !== id),
    })),
  updateAlarm: (id, updatedAlarm) =>
    set((state) => ({
      alarms: state.alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, ...updatedAlarm } : alarm,
      ),
    })),
}));