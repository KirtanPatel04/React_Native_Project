import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Task } from '../types/task';

interface TaskContextValue {
  tasks: Task[];
  addTask: (title: string, notes?: string, reminderAt?: number) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  hydrate: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);
const STORAGE_KEY = 'smart-day-tasks';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowAlert: true,
      }),
    });

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('reminders', {
        name: 'Task reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }, []);

  const persistTasks = async (updated: Task[]) => {
    try {
      setTasks(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      Alert.alert('Save issue', 'Tasks could not be saved. Please try again.');
    }
  };

  const scheduleReminder = async (reminderAt?: number) => {
    if (!reminderAt) return undefined;

    const permission = await Notifications.getPermissionsAsync();
    if (!permission.granted && permission.status !== Notifications.PermissionStatus.PROVISIONAL) {
      const request = await Notifications.requestPermissionsAsync();
      if (!request.granted && request.status !== Notifications.PermissionStatus.PROVISIONAL) {
        Alert.alert('Notification blocked', 'Enable alerts to get reminder pop-ups.');
        return undefined;
      }
    }

    try {
      const trigger = new Date(reminderAt);
      return await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Smart Day reminder',
          body: 'A task is waiting for you.',
        },
        trigger,
        channelId: 'reminders',
      });
    } catch (error) {
      Alert.alert('Reminder issue', 'Could not schedule the notification.');
      return undefined;
    }
  };

  const addTask = (title: string, notes?: string, reminderAt?: number) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      title: title.trim(),
      notes: notes?.trim(),
      createdAt: Date.now(),
      completed: false,
      reminderAt,
    };
    scheduleReminder(reminderAt).then((notificationId) => {
      persistTasks([{ ...newTask, notificationId }, ...tasks]);
    });
  };

  const toggleTask = (id: string) => {
    tasks
      .filter((task) => task.id === id && task.notificationId)
      .forEach((task) => Notifications.cancelScheduledNotificationAsync(task.notificationId!));

    persistTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const removeTask = (id: string) => {
    const existing = tasks.find((task) => task.id === id);
    if (existing?.notificationId) {
      Notifications.cancelScheduledNotificationAsync(existing.notificationId);
    }
    persistTasks(tasks.filter((task) => task.id !== id));
  };

  const hydrate = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTasks(JSON.parse(stored));
    } catch (error) {
      Alert.alert('Load issue', 'Saved tasks could not be loaded.');
    }
  };

  useEffect(() => {
    hydrate();
  }, []);

  const value = useMemo(
    () => ({ tasks, addTask, toggleTask, removeTask, hydrate }),
    [tasks],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return ctx;
};
