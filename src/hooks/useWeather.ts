import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { fetchWeather, WeatherSnapshot } from '../lib/api';

interface WeatherState {
  data?: WeatherSnapshot;
  loading: boolean;
  error?: string;
  permissionStatus?: Location.PermissionStatus;
}

export const useWeather = () => {
  const [state, setState] = useState<WeatherState>({ loading: false });

  const loadWeather = async () => {
    setState((prev) => ({ ...prev, loading: true, error: undefined }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        setState({ loading: false, error: 'Location permission was denied', permissionStatus: status });
        return;
      }
      const coords = await Location.getCurrentPositionAsync({});
      const snapshot = await fetchWeather(coords.coords.latitude, coords.coords.longitude);
      setState({ loading: false, data: snapshot, permissionStatus: status });
    } catch (error) {
      setState({ loading: false, error: 'We could not load the weather. Try again shortly.' });
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  return { ...state, reload: loadWeather };
};
