import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
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

  const handleAdd = () => {
    addTask(title, notes);
    setTitle('');
    setNotes('');
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
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default TasksScreen;
