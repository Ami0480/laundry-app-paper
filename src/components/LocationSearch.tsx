import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface Props {
  onSearch: (city: string) => void;
  onGeolocate: () => void;
  loading: boolean;
  homeCity: string | null;
}

export function LocationSearch({ onSearch, onGeolocate, loading, homeCity }: Props) {
  const [input, setInput] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  }

  function handlePin() {
    if (homeCity) {
      onSearch(homeCity);
    } else {
      onGeolocate();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search city…"
          className="
            w-full pl-8 pr-3 py-2 text-sm bg-paper-50 border border-paper-200
            rounded-xl focus:outline-none focus:ring-2 focus:ring-ink/20
            placeholder:text-ink-light text-ink
          "
        />
      </div>
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="px-4 py-2 text-sm font-semibold bg-ink text-white rounded-xl
          hover:bg-ink/80 disabled:opacity-40 transition-colors"
      >
        Go
      </button>
      <button
        type="button"
        onClick={handlePin}
        disabled={loading}
        title={homeCity ? `Go to home: ${homeCity}` : 'Use my location'}
        className={`p-2 border rounded-xl transition-colors disabled:opacity-40
          ${homeCity
            ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'
            : 'text-ink-muted hover:text-ink border-paper-200 bg-paper-50 hover:bg-paper-100'
          }`}
      >
        <MapPin size={16} />
      </button>
    </form>
  );
}
