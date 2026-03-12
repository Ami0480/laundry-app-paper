import { useState, useEffect, useCallback } from 'react';
import { WashingMachine, AlertCircle } from 'lucide-react';

import type { WeatherCurrent, ForecastDay } from './types/weather';
import { calculateDryingScore } from './lib/DryingLogic';
import {
  fetchCurrentWeather,
  fetchCurrentWeatherByCoords,
  fetchForecast,
  fetchForecastByCoords,
  getUserCoords,
} from './lib/WeatherService';

import { HeroSection }        from './components/HeroSection';
import { ForecastGrid }       from './components/ForecastGrid';
import { MetricCards }        from './components/MetricCards';
import { SaveLogPanel }       from './components/SaveLogPanel';
import { LocationSearch }     from './components/LocationSearch';
import { HomeLocationButton } from './components/HomeLocationButton';

const DEFAULT_CITY = 'London';

export default function App() {
  const [weather,  setWeather]  = useState<WeatherCurrent | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const loadByCity = useCallback(async (city: string) => {
    setLoading(true);
    setError('');
    try {
      const [w, f] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
      ]);
      setWeather(w);
      setForecast(f);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadByGeo = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { lat, lon } = await getUserCoords();
      const [w, f] = await Promise.all([
        fetchCurrentWeatherByCoords(lat, lon),
        fetchForecastByCoords(lat, lon),
      ]);
      setWeather(w);
      setForecast(f);
    } catch {
      loadByCity(DEFAULT_CITY);
    } finally {
      setLoading(false);
    }
  }, [loadByCity]);

  // Load home city from localStorage on startup, fallback to geolocation
  useEffect(() => {
    const homeCity = localStorage.getItem('home_city');
    if (homeCity) {
      loadByCity(homeCity);
    } else {
      loadByGeo();
    }
  }, [loadByCity, loadByGeo]);

  const drying = weather
    ? calculateDryingScore(weather.humidity, weather.windSpeed, weather.temp)
    : null;

  return (
    <div className="min-h-screen bg-paper-100 text-ink font-sans">
      {/* Nav */}
      <header className="sticky top-0 z-10 bg-paper-100/80 backdrop-blur border-b border-paper-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <WashingMachine size={20} className="text-ink" />
            <span className="font-black tracking-tight text-ink">Laundry</span>
            <span className="font-light text-ink-muted ml-1">Weather</span>
          </div>
          <LocationSearch
            onSearch={loadByCity}
            onGeolocate={loadByGeo}
            loading={loading}
            homeCity={localStorage.getItem('home_city')}
          />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {loading && !weather && (
          <div className="space-y-4 animate-pulse">
            <div className="h-64 bg-paper-200 rounded-2xl" />
            <div className="grid grid-cols-5 gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-40 bg-paper-200 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-paper-200 rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        {weather && drying && (
          <>
            <HeroSection
              weather={weather}
              drying={drying}
              onRefresh={() => loadByCity(weather.city)}
              loading={loading}
            />
            {forecast.length > 0 && <ForecastGrid forecast={forecast} />}
            <MetricCards weather={weather} />
            <SaveLogPanel weather={weather} drying={drying} />
            <HomeLocationButton weather={weather} />
          </>
        )}

        <footer className="text-center text-xs text-ink-light pt-4 pb-8">
          Powered by OpenWeatherMap · Logs saved locally
        </footer>
      </main>
    </div>
  );
}
