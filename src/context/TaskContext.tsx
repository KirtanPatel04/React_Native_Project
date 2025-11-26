import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { Task } from '../types/task';

interface TaskContextValue {
  tasks: Task[];
  addTask: (title: string, notes?: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  hydrate: () => void;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);
const STORAGE_KEY = 'smart-day-tasks';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const persistTasks = async (updated: Task[]) => {
    try {
      setTasks(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      Alert.alert('Save issue', 'Tasks could not be saved. Please try again.');
    }
  };

  const addTask = (title: string, notes?: string) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      title: title.trim(),
      notes: notes?.trim(),
      createdAt: Date.now(),
      completed: false,
    };
    persistTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    persistTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  };

  const removeTask = (id: string) => {
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
