import { useState } from 'react';
import { BookmarkPlus, Check, Loader } from 'lucide-react';
import type { WeatherCurrent } from '../types/weather';
import type { DryingResult } from '../types/weather';
import { saveDryingLog } from '../lib/supabase';

interface Props {
  weather: WeatherCurrent;
  drying: DryingResult;
}

type Status = 'idle' | 'saving' | 'saved' | 'error';

export function SaveLogPanel({ weather, drying }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError]   = useState('');

  async function handleSave() {
    setStatus('saving');
    setError('');
    try {
      await saveDryingLog({
        city:       weather.city,
        score:      drying.score,
        temp:       weather.temp,
        humidity:   weather.humidity,
        wind_speed: weather.windSpeed,
        advice:     drying.advice,
      });
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
      setStatus('error');
    }
  }

  return (
    <section className="bg-paper-100 border border-paper-200 rounded-2xl p-6 shadow-paper">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-1">
            Log this reading
          </p>
          <p className="text-sm text-ink">
            Save today's drying conditions for <strong>{weather.city}</strong> —&nbsp;
            score <strong>{drying.score}%</strong>.
          </p>
          {status === 'error' && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={status === 'saving' || status === 'saved'}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
            transition-all duration-200
            ${status === 'saved'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-ink text-white hover:bg-ink/80 active:scale-95'}
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
        >
          {status === 'saving' && <Loader size={14} className="animate-spin" />}
          {status === 'saved'  && <Check size={14} />}
          {status === 'idle'   && <BookmarkPlus size={14} />}
          {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved!' : 'Save Log'}
        </button>
      </div>
    </section>
  );
}
