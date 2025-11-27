import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/task';
import PrimaryButton from './PrimaryButton';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const TaskItem: React.FC<Props> = ({ task, onToggle, onRemove }) => (
  <View style={styles.row} accessibilityRole="listitem">
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: task.completed }}
      onPress={() => onToggle(task.id)}
      style={[styles.checkbox, task.completed && styles.checkboxDone]}
    />
    <View style={styles.textContainer}>
      <Text style={[styles.title, task.completed && styles.completed]}>{task.title}</Text>
      {task.notes ? <Text style={styles.notes}>{task.notes}</Text> : null}
      {task.reminderAt ? (
        <Text style={styles.reminder}>
          Reminder: {new Date(task.reminderAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
        </Text>
      ) : null}
    </View>
    <PrimaryButton label="Remove" onPress={() => onRemove(task.id)} />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#38bdf8',
  },
  checkboxDone: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700',
  },
  notes: {
    color: '#cbd5e1',
    marginTop: 2,
  },
  reminder: {
    color: '#38bdf8',
    marginTop: 4,
    fontSize: 13,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
});

export default TaskItem;
