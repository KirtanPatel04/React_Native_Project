import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import ScreenContainer from '../components/ScreenContainer';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import TaskItem from '../components/TaskItem';
import Card from '../components/Card';
import { useTasks } from '../context/TaskContext';

const TasksScreen: React.FC = () => {
  const { tasks, addTask, toggleTask, removeTask } = useTasks();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderAt, setReminderAt] = useState<Date | undefined>();
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  const handleAdd = () => {
    addTask(title, notes, reminderAt?.getTime());
    setTitle('');
    setNotes('');
    setReminderAt(undefined);
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    const currentDate = selectedDate ?? new Date();
    setShowPicker(false);

    if (mode === 'date') {
      const existing = reminderAt ?? new Date();
      const updated = new Date(existing);
      updated.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      if (!reminderAt) {
        updated.setHours(new Date().getHours(), new Date().getMinutes(), 0, 0);
      }
      setReminderAt(updated);
      setMode('time');
      setShowPicker(true);
    } else {
      const existing = reminderAt ?? new Date();
      const updated = new Date(existing);
      updated.setHours(currentDate.getHours(), currentDate.getMinutes(), 0, 0);
      setReminderAt(updated);
      setMode('date');
    }
  };

  const openPicker = (startMode: 'date' | 'time') => {
    setMode(startMode);
    setShowPicker(true);
  };

  return (
    <ScreenContainer>
      <Card>
        <Text style={styles.heading}>Create a new focus item</Text>
        <Text style={styles.helper}>Short, specific tasks keep you moving forward.</Text>
        <TextField label="Title" value={title} onChangeText={setTitle} placeholder="Hydrate, call, stretch..." />
        <TextField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional details or self-kind reminders"
          multiline
        />
        <View style={styles.reminderRow} accessible accessibilityLabel="Reminder day and time">
          <View style={{ flex: 1 }}>
            <Text style={styles.subHeading}>Reminder</Text>
            <Text style={styles.helper}>
              {reminderAt
                ? `Will alert on ${reminderAt.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}`
                : 'Add a day and time to get a notification.'}
            </Text>
          </View>
          <Pressable style={styles.reminderButton} onPress={() => openPicker('date')} accessibilityRole="button">
            <Text style={styles.reminderButtonText}>{reminderAt ? 'Edit' : 'Set time'}</Text>
          </Pressable>
          {reminderAt ? (
            <Pressable
              style={[styles.reminderButton, styles.clearButton]}
              onPress={() => setReminderAt(undefined)}
              accessibilityRole="button"
            >
              <Text style={styles.reminderButtonText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>
        <PrimaryButton label="Add task" onPress={handleAdd} disabled={!title.trim()} />
      </Card>

      <Card role="group">
        <View style={styles.listHeader}>
          <Text style={styles.heading}>Today's list</Text>
          <Text style={styles.helper}>{tasks.length || 'No'} task{tasks.length === 1 ? '' : 's'}</Text>
        </View>
        <FlatList
          data={tasks}
          keyExtractor={(task) => task.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={toggleTask} onRemove={removeTask} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={<Text style={styles.helper}>Add a task to get started.</Text>}
          accessibilityRole="list"
          contentContainerStyle={{ gap: 8 }}
        />
      </Card>
      {showPicker && (
        <DateTimePicker
          value={reminderAt ?? new Date()}
          mode={mode}
          onChange={onChange}
          minimumDate={new Date()}
          minuteInterval={5}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '700',
  },
  helper: {
    color: '#94a3b8',
    marginBottom: 8,
  },
  subHeading: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  reminderButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  clearButton: {
    borderColor: '#ef4444',
  },
  reminderButtonText: {
    color: '#e5e7eb',
    fontWeight: '600',
  },
});

export default TasksScreen;
