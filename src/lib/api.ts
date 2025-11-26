export interface WeatherSnapshot {
  temperature: number;
  description: string;
  updatedAt: string;
}

const weatherCodeMap: Record<number, string> = {
  0: 'Clear skies',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Dense drizzle',
  61: 'Light rain',
  63: 'Rainy',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snowy',
  75: 'Heavy snow',
  80: 'Showers',
  95: 'Thunderstorm',
};

export const fetchWeather = async (latitude: number, longitude: number): Promise<WeatherSnapshot> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to reach the weather service');
  }
  const json = await response.json();
  const current = json.current;
  const description = weatherCodeMap[current.weather_code] ?? 'Weather update';
  return {
    temperature: current.temperature_2m,
    description,
    updatedAt: new Date().toLocaleTimeString(),
  };
};
