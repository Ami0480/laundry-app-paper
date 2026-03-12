import { Wind, Droplets, Thermometer, Eye } from 'lucide-react';
import type { WeatherCurrent } from '../types/weather';

interface Props {
  weather: WeatherCurrent;
}

export function MetricCards({ weather }: Props) {
  const metrics = [
    {
      icon: <Droplets size={20} className="text-blue-500" />,
      label: 'Humidity',
      value: `${weather.humidity}%`,
      sub: humidityLabel(weather.humidity),
      color: 'text-blue-600',
    },
    {
      icon: <Wind size={20} className="text-teal-500" />,
      label: 'Wind Speed',
      value: `${weather.windSpeed.toFixed(1)}`,
      unit: 'm/s',
      sub: windLabel(weather.windSpeed),
      color: 'text-teal-600',
    },
    {
      icon: <Thermometer size={20} className="text-orange-500" />,
      label: 'Feels Like',
      value: `${weather.feelsLike}°`,
      unit: 'C',
      sub: feelsLikeLabel(weather.feelsLike),
      color: 'text-orange-600',
    },
    {
      icon: <Eye size={20} className="text-purple-500" />,
      label: 'Conditions',
      value: '',
      sub: weather.description,
      color: 'text-purple-600',
      wide: true,
    },
  ];

  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
        Detailed Conditions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map(m => (
          <div
            key={m.label}
            className="bg-paper-50 border border-paper-200 rounded-2xl p-5 shadow-paper"
          >
            <div className="flex items-center gap-2 mb-3">
              {m.icon}
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                {m.label}
              </span>
            </div>
            {m.value && (
              <div className="text-3xl font-black text-ink tracking-tight">
                {m.value}
                {m.unit && <span className="text-lg font-semibold text-ink-muted ml-0.5">{m.unit}</span>}
              </div>
            )}
            <p className={`text-sm mt-1 font-medium capitalize ${m.value ? 'text-ink-muted' : `text-2xl font-black text-ink`}`}>
              {m.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function humidityLabel(h: number): string {
  if (h < 30) return 'Very dry';
  if (h < 50) return 'Comfortable';
  if (h < 65) return 'Moderate';
  if (h < 80) return 'Humid';
  return 'Very humid';
}

function windLabel(ws: number): string {
  if (ws < 0.5) return 'Calm';
  if (ws < 3.3) return 'Light breeze';
  if (ws < 8)   return 'Gentle–moderate';
  if (ws < 14)  return 'Fresh breeze';
  if (ws < 21)  return 'Strong wind';
  return 'Storm';
}

function feelsLikeLabel(t: number): string {
  if (t < 0)   return 'Freezing';
  if (t < 10)  return 'Cold';
  if (t < 18)  return 'Cool';
  if (t < 26)  return 'Comfortable';
  if (t < 33)  return 'Warm';
  return 'Hot';
}
