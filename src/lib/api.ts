export interface CurrentConditions {
  temperature: number;
  description: string;
  updatedAt: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  description: string;
  precipitationChance?: number;
}

export interface DailyForecast {
  date: string;
  max: number;
  min: number;
  description: string;
  precipitationChance?: number;
}

export interface WeatherSnapshot {
  current: CurrentConditions;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  timezone: string;
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
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,weather_code` +
    `&hourly=temperature_2m,precipitation_probability,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code` +
    `&timezone=auto&forecast_days=7`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to reach the weather service');
  }
  const json = await response.json();
  const current = json.current;
  const description = weatherCodeMap[current.weather_code] ?? 'Weather update';

  const hourly: HourlyForecast[] = (json.hourly?.time ?? []).slice(0, 24).map((time: string, index: number) => ({
    time,
    temperature: json.hourly.temperature_2m?.[index],
    description: weatherCodeMap[json.hourly.weather_code?.[index]] ?? 'Update',
    precipitationChance: json.hourly.precipitation_probability?.[index],
  }));

  const daily: DailyForecast[] = (json.daily?.time ?? []).map((date: string, index: number) => ({
    date,
    max: json.daily.temperature_2m_max?.[index],
    min: json.daily.temperature_2m_min?.[index],
    description: weatherCodeMap[json.daily.weather_code?.[index]] ?? 'Update',
    precipitationChance: json.daily.precipitation_probability_max?.[index],
  }));

  return {
    current: {
      temperature: current.temperature_2m,
      description,
      updatedAt: new Date().toLocaleTimeString(),
    },
    hourly,
    daily,
    timezone: json.timezone,
  };
};
