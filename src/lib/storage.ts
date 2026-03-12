// ─── Types ───────────────────────────────────────────────────────────────────

export interface DryingLog {
  id: string;
  created_at: string;
  city: string;
  score: number;
  temp: number;
  humidity: number;
  wind_speed: number;
  advice: string;
}

const STORAGE_KEY = 'drying_logs';

function readLogs(): DryingLog[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function saveDryingLog(log: Omit<DryingLog, 'id' | 'created_at'>) {
  const logs = readLogs();
  logs.unshift({
    ...log,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function fetchRecentLogs(limit = 10): DryingLog[] {
  return readLogs().slice(0, limit);
}
