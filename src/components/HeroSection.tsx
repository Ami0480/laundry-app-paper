import { Wind, Droplets, MapPin, RefreshCw } from 'lucide-react';
import type { WeatherCurrent } from '../types/weather';
import type { DryingResult } from '../types/weather';
import { tierColor } from '../lib/DryingLogic';

interface Props {
  weather: WeatherCurrent;
  drying: DryingResult;
  onRefresh: () => void;
  loading: boolean;
}

export function HeroSection({ weather, drying, onRefresh, loading }: Props) {
  const color = tierColor(drying.tier);

  return (
    <section className="relative bg-paper-50 border border-paper-200 rounded-2xl p-8 md:p-12 shadow-paper overflow-hidden">
      {/* Tape strip decoration */}
      <div className="absolute top-0 left-16 w-20 h-4 bg-paper-300 opacity-60 rounded-b-sm" />

      {/* Header row */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-2 text-ink-muted text-sm font-medium">
          <MapPin size={14} />
          <span>{weather.city}, {weather.country}</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-ink-muted hover:text-ink transition-colors"
          aria-label="Refresh weather"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row md:items-end gap-8">
        {/* Temperature */}
        <div className="flex-shrink-0">
          <div className="text-[7rem] md:text-[9rem] font-black leading-none tracking-tighter text-ink">
            {weather.temp}°
          </div>
          <div className="text-sm text-ink-muted mt-1 capitalize">
            {weather.description} · Feels like {weather.feelsLike}°C
          </div>
        </div>

        {/* Laundry Status */}
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
            Daily Laundry Insight
          </p>
          <h2
            className="text-4xl md:text-5xl font-black leading-tight tracking-tight"
            style={{ color }}
          >
            {drying.label}
          </h2>
          <p className="mt-3 text-ink-muted text-sm max-w-xs">
            {drying.advice}
          </p>

          {/* Drying Score bar */}
          <div className="mt-4 max-w-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-ink-muted">Drying Score</span>
              <span className="text-sm font-bold" style={{ color }}>
                {drying.score}%
              </span>
            </div>
            <div className="h-2 bg-paper-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${drying.score}%`, backgroundColor: color }}
              />
            </div>
          </div>
        </div>

        {/* Quick metrics */}
        <div className="flex md:flex-col gap-4 md:gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-blue-400" />
            <span className="text-xs text-ink-muted">Humidity</span>
            <span className="text-sm font-bold text-ink ml-auto">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind size={16} className="text-teal-500" />
            <span className="text-xs text-ink-muted">Wind</span>
            <span className="text-sm font-bold text-ink ml-auto">{weather.windSpeed.toFixed(1)} m/s</span>
          </div>
        </div>
      </div>
    </section>
  );
}
