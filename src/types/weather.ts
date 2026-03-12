export interface WeatherCurrent {
  city: string;
  country: string;
  temp: number;          // °C
  feelsLike: number;
  humidity: number;      // %
  windSpeed: number;     // m/s
  description: string;
  icon: string;
  timestamp: number;
}

export interface ForecastDay {
  date: string;          // ISO date string
  dayLabel: string;      // e.g. "Mon", "Tue"
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  pop: number;           // probability of precipitation 0-1
}

export interface DryingResult {
  score: number;         // 0–100
  label: string;
  advice: string;
  tier: 'great' | 'good' | 'fair' | 'poor';
}
