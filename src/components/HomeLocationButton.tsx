import { useState } from 'react';
import { Home, Check } from 'lucide-react';
import type { WeatherCurrent } from '../types/weather';

interface Props {
  weather: WeatherCurrent;
}

export function HomeLocationButton({ weather }: Props) {
  const saved = localStorage.getItem('home_city');
  const isHome = saved === weather.city;
  const [justSaved, setJustSaved] = useState(false);

  function handleSet() {
    localStorage.setItem('home_city', weather.city);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  return (
    <button
      onClick={handleSet}
      title={isHome ? 'This is your home location' : 'Set as home location'}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
        border transition-all duration-200
        ${isHome || justSaved
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-paper-50 border-paper-200 text-ink-muted hover:text-ink hover:bg-paper-100'}
      `}
    >
      {isHome || justSaved ? <Check size={12} /> : <Home size={12} />}
      {justSaved ? 'Saved!' : isHome ? 'Home' : 'Set as Home'}
    </button>
  );
}
