import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import { TaskProvider } from './src/context/TaskContext';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563eb',
    background: '#0f172a',
    card: '#111827',
    text: '#e5e7eb',
    border: '#1f2937',
    notification: '#f59e0b',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <TaskProvider>
        <NavigationContainer theme={navTheme}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: '#38bdf8',
              tabBarInactiveTintColor: '#94a3b8',
              tabBarStyle: { backgroundColor: '#0b1224', borderTopColor: '#1f2937' },
              tabBarIcon: ({ color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap = 'home';
                if (route.name === 'Tasks') iconName = 'checkmark-done';
                if (route.name === 'Resources') iconName = 'information-circle';
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Tasks" component={TasksScreen} />
            <Tab.Screen name="Resources" component={ResourcesScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </TaskProvider>
    </SafeAreaProvider>
  );
}
