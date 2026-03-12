import { WashingMachine, CloudRain } from 'lucide-react';
import type { ForecastDay } from '../types/weather';
import { calculateDryingScore, tierColor, tierBg } from '../lib/DryingLogic';
import { owmIconUrl } from '../lib/WeatherService';

interface Props {
  forecast: ForecastDay[];
}

export function ForecastGrid({ forecast }: Props) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {forecast.map(day => {
          const drying = calculateDryingScore(day.humidity, day.windSpeed, day.tempMax, day.pop);
          const color  = tierColor(drying.tier);
          const bgBorder = tierBg(drying.tier);

          return (
            <div
              key={day.date}
              className={`relative bg-paper-50 border rounded-2xl p-4 shadow-paper flex flex-col gap-2 ${bgBorder}`}
            >
              {/* Day label */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-ink">
                  {day.dayLabel}
                </span>
                {day.pop > 0.3 && (
                  <span className="flex items-center gap-1 text-xs text-blue-500">
                    <CloudRain size={12} />
                    {Math.round(day.pop * 100)}%
                  </span>
                )}
              </div>

              {/* Weather icon */}
              <img
                src={owmIconUrl(day.icon)}
                alt={day.description}
                className="w-10 h-10 -my-1"
              />

              {/* Temps */}
              <div className="text-sm font-semibold text-ink">
                {day.tempMax}°<span className="text-ink-muted font-normal">–{day.tempMin}°</span>
              </div>

              {/* Drying score */}
              <div className="mt-auto">
                <div className="flex items-center gap-1.5">
                  <WashingMachine size={12} style={{ color }} />
                  <span className="text-xs font-bold" style={{ color }}>
                    {drying.score}%
                  </span>
                </div>
                <div className="h-1 bg-paper-200 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${drying.score}%`, backgroundColor: color }}
                  />
                </div>
              </div>

              {/* Condition label */}
              <p className="text-[10px] text-ink-muted capitalize leading-tight">
                {day.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
