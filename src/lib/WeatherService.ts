import type { WeatherCurrent, ForecastDay } from '../types/weather';

const API_KEY = import.meta.env.VITE_OWM_API_KEY as string;
const BASE    = 'https://api.openweathermap.org/data/2.5';

// ─── Current Weather ─────────────────────────────────────────────────────────

export async function fetchCurrentWeather(city: string): Promise<WeatherCurrent> {
  const url = `${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.statusText}`);
  const d = await res.json();
  return {
    city:        d.name,
    country:     d.sys.country,
    temp:        Math.round(d.main.temp),
    feelsLike:   Math.round(d.main.feels_like),
    humidity:    d.main.humidity,
    windSpeed:   d.wind.speed,
    description: d.weather[0].description,
    icon:        d.weather[0].icon,
    timestamp:   d.dt,
  };
}

export async function fetchCurrentWeatherByCoords(
  lat: number,
  lon: number,
): Promise<WeatherCurrent> {
  const url = `${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.statusText}`);
  const d = await res.json();
  return {
    city:        d.name,
    country:     d.sys.country,
    temp:        Math.round(d.main.temp),
    feelsLike:   Math.round(d.main.feels_like),
    humidity:    d.main.humidity,
    windSpeed:   d.wind.speed,
    description: d.weather[0].description,
    icon:        d.weather[0].icon,
    timestamp:   d.dt,
  };
}

// ─── 5-Day Forecast ──────────────────────────────────────────────────────────

export async function fetchForecast(city: string): Promise<ForecastDay[]> {
  const url = `${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&cnt=40`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast fetch failed: ${res.statusText}`);
  const d = await res.json();
  return aggregateForecast(d.list);
}

export async function fetchForecastByCoords(
  lat: number,
  lon: number,
): Promise<ForecastDay[]> {
  const url = `${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=40`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast fetch failed: ${res.statusText}`);
  const d = await res.json();
  return aggregateForecast(d.list);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// OWM /forecast returns 3-hourly data. We group by day and pick midday slot.
function aggregateForecast(list: OWMForecastItem[]): ForecastDay[] {
  const byDay: Record<string, OWMForecastItem[]> = {};

  for (const item of list) {
    const dateKey = item.dt_txt.slice(0, 10); // "YYYY-MM-DD"
    if (!byDay[dateKey]) byDay[dateKey] = [];
    byDay[dateKey].push(item);
  }

  const days = Object.entries(byDay).slice(0, 5); // next 5 days

  return days.map(([dateStr, items]) => {
    const midday = items.find(i => i.dt_txt.includes('12:00')) ?? items[Math.floor(items.length / 2)];
    const temps  = items.map(i => i.main.temp);
    const date   = new Date(dateStr + 'T12:00:00');

    return {
      date:        dateStr,
      dayLabel:    date.toLocaleDateString('en-US', { weekday: 'short' }),
      tempMin:     Math.round(Math.min(...temps)),
      tempMax:     Math.round(Math.max(...temps)),
      humidity:    midday.main.humidity,
      windSpeed:   midday.wind.speed,
      description: midday.weather[0].description,
      icon:        midday.weather[0].icon,
      pop:         Math.max(...items.map(i => i.pop ?? 0)),
    };
  });
}

interface OWMForecastItem {
  dt: number;
  dt_txt: string;
  main: { temp: number; humidity: number };
  wind: { speed: number };
  weather: { description: string; icon: string }[];
  pop?: number;
}

// ─── OWM icon → URL ──────────────────────────────────────────────────────────
export function owmIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

// ─── Geolocation helper ───────────────────────────────────────────────────────
export function getUserCoords(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => reject(err),
      { timeout: 8000 },
    );
  });
}
