import type { DryingResult } from '../types/weather';

/**
 * Calculates a Drying Score (0–100) based on humidity, wind speed, and temperature.
 *
 * Scoring formula:
 *  - Temperature score  (0–40 pts): optimal range 18–35°C
 *  - Humidity score     (0–40 pts): lower is better, >85% = 0 pts
 *  - Wind score         (0–20 pts): gentle breeze is best, calm or storm = low pts
 */
export function calculateDryingScore(
  humidity: number,       // % (0–100)
  windSpeed: number,      // m/s
  tempCelsius: number,
  precipProbability = 0,  // 0–1
): DryingResult {
  // --- Temperature score (0–40) ---
  let tempScore = 0;
  if (tempCelsius >= 18 && tempCelsius <= 35) {
    // Peak at 28°C
    tempScore = 40 - Math.abs(tempCelsius - 28) * 1.5;
  } else if (tempCelsius > 35) {
    // Hot but still drying, diminishing returns
    tempScore = Math.max(0, 40 - (tempCelsius - 35) * 3);
  } else if (tempCelsius >= 10) {
    // Cool but usable
    tempScore = Math.max(0, (tempCelsius - 10) * 2.5);
  }
  tempScore = clamp(tempScore, 0, 40);

  // --- Humidity score (0–40) ---
  // Linear: 0% humidity → 40 pts, 100% → 0 pts
  const humidityScore = clamp(40 - humidity * 0.4, 0, 40);

  // --- Wind score (0–20) ---
  // Ideal: 3–8 m/s. Too calm or too strong is worse.
  let windScore = 0;
  if (windSpeed >= 3 && windSpeed <= 8) {
    windScore = 20;
  } else if (windSpeed > 8 && windSpeed <= 15) {
    windScore = 20 - (windSpeed - 8) * 2;
  } else if (windSpeed > 15) {
    windScore = 0; // storm risk
  } else {
    windScore = windSpeed * (20 / 3); // 0–3 m/s linearly
  }
  windScore = clamp(windScore, 0, 20);

  // --- Rain penalty ---
  const rainPenalty = precipProbability * 30;

  const raw = tempScore + humidityScore + windScore - rainPenalty;
  const score = Math.round(clamp(raw, 0, 100));

  return buildResult(score);
}

function buildResult(score: number): DryingResult {
  if (score >= 80) {
    return {
      score,
      label: 'PERFECT DAY TO HANG UP',
      advice: 'Perfect day! Hang up those heavy linens.',
      tier: 'great',
    };
  }
  if (score >= 60) {
    return {
      score,
      label: 'NICE DAY TO HANG UP',
      advice: 'Good drying conditions, but watch the clouds.',
      tier: 'good',
    };
  }
  if (score >= 30) {
    return {
      score,
      label: 'FAIR CONDITIONS',
      advice: 'Marginal drying day. Light items only.',
      tier: 'fair',
    };
  }
  return {
    score,
    label: "DON'T HANG TODAY",
    advice: "Don't hang today. High humidity / rain risk.",
    tier: 'poor',
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Colour helpers consumed by components */
export function tierColor(tier: DryingResult['tier']): string {
  switch (tier) {
    case 'great': return '#16a34a'; // green-600
    case 'good':  return '#2563eb'; // blue-600
    case 'fair':  return '#d97706'; // amber-600
    case 'poor':  return '#dc2626'; // red-600
  }
}

export function tierBg(tier: DryingResult['tier']): string {
  switch (tier) {
    case 'great': return 'bg-green-50 border-green-200';
    case 'good':  return 'bg-blue-50 border-blue-200';
    case 'fair':  return 'bg-amber-50 border-amber-200';
    case 'poor':  return 'bg-red-50 border-red-200';
  }
}
