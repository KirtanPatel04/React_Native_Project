import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { useWeather } from '../hooks/useWeather';
import { useTasks } from '../context/TaskContext';
import { HourlyForecast } from '../lib/api';

const HomeScreen: React.FC = () => {
  const { data, loading, error, reload, permissionStatus } = useWeather();
  const { tasks } = useTasks();
  const completed = tasks.filter((task) => task.completed).length;

  const todayHourly = useMemo(() => data?.hourly ?? [], [data]);
  const weekly = useMemo(() => data?.daily ?? [], [data]);

  const renderHour = ({ item }: { item: HourlyForecast }) => {
    const time = new Date(item.time);
    const label = time.toLocaleTimeString([], { hour: 'numeric' });
    return (
      <View style={styles.hourChip} accessibilityLabel={`${label}: ${Math.round(item.temperature)} degrees`}>
        <Text style={styles.hourLabel}>{label}</Text>
        <Text style={styles.hourTemp}>{Math.round(item.temperature)}°</Text>
        {typeof item.precipitationChance === 'number' && (
          <Text style={styles.muted}>{item.precipitationChance}% rain</Text>
        )}
      </View>
    );
  };

  const renderDay = (day: typeof weekly[number]) => {
    const date = new Date(day.date);
    const label = date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    return (
      <View key={day.date} style={styles.dailyRow}>
        <Text style={[styles.bodyText, { flex: 1 }]}>{label}</Text>
        <Text style={styles.bodyText}>{Math.round(day.min)}° / {Math.round(day.max)}°</Text>
        <Text style={[styles.muted, { width: 96, textAlign: 'right' }]}>{day.description}</Text>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Smart Day Companion</Text>
        <Text style={styles.subtitle}>Weather + daily tasks in one place.</Text>
      </View>

      <Card role="summary">
        <Text style={styles.cardTitle}>Local weather</Text>
        {loading && <ActivityIndicator color="#38bdf8" accessibilityLabel="Loading weather" />}
        {error && (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        )}
        {permissionStatus === 'denied' && (
          <Text style={styles.error}>
            Please allow location to personalize your forecast.
          </Text>
        )}
        {data && !loading && (
          <>
            <View style={styles.weatherRow}>
              <Text style={styles.weatherTemp}>{Math.round(data.current.temperature)}°</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.weatherDesc}>{data.current.description}</Text>
                <Text style={styles.muted}>Updated at {data.current.updatedAt}</Text>
                <Text style={styles.muted}>Timezone: {data.timezone}</Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={styles.sectionHeading}>Today (hourly)</Text>
              <FlatList
                data={todayHourly}
                renderItem={renderHour}
                keyExtractor={(item) => item.time}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={styles.sectionHeading}>7-day outlook</Text>
              <View style={{ gap: 10 }}>
                {weekly.map(renderDay)}
              </View>
            </View>
          </>
        )}
        <PrimaryButton label="Refresh forecast" onPress={reload} accessibilityLabel="Refresh the weather forecast" />
      </Card>

      <Card role="summary">
        <Text style={styles.cardTitle}>Tasks overview</Text>
        <Text style={styles.bodyText}>
          You have <Text style={styles.emphasis}>{tasks.length}</Text> task{tasks.length === 1 ? '' : 's'} and
          {' '}
          <Text style={styles.emphasis}>{completed}</Text> marked done.
        </Text>
        <Text style={styles.bodyText}>
          Keep your list realistic and accessible by adding small, meaningful steps.
        </Text>
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  title: {
    color: '#e2e8f0',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
  },
  cardTitle: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  weatherTemp: {
    fontSize: 44,
    color: '#38bdf8',
    fontWeight: '800',
  },
  weatherDesc: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionHeading: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '700',
  },
  muted: {
    color: '#94a3b8',
  },
  bodyText: {
    color: '#cbd5e1',
    fontSize: 15,
    marginBottom: 6,
  },
  emphasis: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  error: {
    color: '#f472b6',
    marginBottom: 8,
  },
  hourChip: {
    backgroundColor: '#0f172a',
    borderColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minWidth: 110,
    gap: 4,
  },
  hourLabel: {
    color: '#94a3b8',
    fontWeight: '700',
  },
  hourTemp: {
    color: '#38bdf8',
    fontSize: 22,
    fontWeight: '800',
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default HomeScreen;
