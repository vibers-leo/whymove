// Volatility Detection Algorithm
// Monitors price feeds and triggers alerts when abnormal movements detected

import { PriceHistory, PriceUpdate, FuturesSymbol, FUTURES_SYMBOLS } from "./market-data";

export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertDirection = "up" | "down";

export interface VolatilityAlert {
  id: string;
  symbol: string;
  symbolName: string;
  symbolNameKr: string;
  severity: AlertSeverity;
  direction: AlertDirection;
  changePercent: number;
  priceFrom: number;
  priceTo: number;
  windowSeconds: number;  // 60, 300, or 900
  timestamp: number;
  message: string;
  messageKr: string;
}

// Thresholds per asset category and time window
interface ThresholdConfig {
  window60s: number;   // 1 minute % threshold
  window300s: number;  // 5 minute % threshold
  window900s: number;  // 15 minute % threshold
}

const THRESHOLDS: Record<string, ThresholdConfig> = {
  us_futures: {
    window60s: 0.3,   // 0.3% in 1 min = unusual
    window300s: 0.8,   // 0.8% in 5 min
    window900s: 1.5,   // 1.5% in 15 min
  },
  crypto: {
    window60s: 1.0,    // 1% in 1 min
    window300s: 3.0,    // 3% in 5 min
    window900s: 5.0,    // 5% in 15 min
  },
  commodity: {
    window60s: 0.5,
    window300s: 1.2,
    window900s: 2.0,
  },
};

function getSeverity(changePercent: number, threshold: number): AlertSeverity {
  const ratio = Math.abs(changePercent) / threshold;
  if (ratio >= 3) return "critical";
  if (ratio >= 2) return "high";
  if (ratio >= 1.5) return "medium";
  return "low";
}

function formatChangeMessage(
  symbol: string,
  nameKr: string,
  direction: AlertDirection,
  changePercent: number,
  windowSeconds: number
): { message: string; messageKr: string } {
  const windowLabel = windowSeconds === 60 ? "1분" : windowSeconds === 300 ? "5분" : "15분";
  const windowLabelEn = windowSeconds === 60 ? "1min" : windowSeconds === 300 ? "5min" : "15min";
  const arrow = direction === "up" ? "+" : "";

  return {
    message: `${symbol} ${arrow}${changePercent.toFixed(2)}% in ${windowLabelEn}`,
    messageKr: `${nameKr} ${windowLabel}간 ${arrow}${changePercent.toFixed(2)}% 변동`,
  };
}

export class VolatilityDetector {
  private histories: Map<string, PriceHistory> = new Map();
  private alertCallbacks: Set<(alert: VolatilityAlert) => void> = new Set();
  private lastAlertTime: Map<string, number> = new Map(); // cooldown per symbol
  private cooldownMs: number = 30000; // 30 second cooldown between alerts for same symbol

  constructor(cooldownMs: number = 30000) {
    this.cooldownMs = cooldownMs;
  }

  // Register a price update from any data source
  processPriceUpdate(update: PriceUpdate) {
    if (!this.histories.has(update.symbol)) {
      this.histories.set(update.symbol, new PriceHistory());
    }

    const history = this.histories.get(update.symbol)!;
    history.push(update);

    // Check all time windows
    this.checkVolatility(update.symbol, history, update);
  }

  private checkVolatility(symbol: string, history: PriceHistory, currentUpdate: PriceUpdate) {
    const symbolInfo = FUTURES_SYMBOLS[symbol as FuturesSymbol];
    if (!symbolInfo) return;

    const thresholds = THRESHOLDS[symbolInfo.category];
    if (!thresholds) return;

    // Check cooldown
    const lastAlert = this.lastAlertTime.get(symbol) || 0;
    if (Date.now() - lastAlert < this.cooldownMs) return;

    const windows: [number, number][] = [
      [60, thresholds.window60s],
      [300, thresholds.window300s],
      [900, thresholds.window900s],
    ];

    for (const [windowSeconds, threshold] of windows) {
      const pastUpdate = history.getPriceAt(windowSeconds);
      if (!pastUpdate) continue;

      const changePercent = ((currentUpdate.price - pastUpdate.price) / pastUpdate.price) * 100;

      if (Math.abs(changePercent) >= threshold) {
        const direction: AlertDirection = changePercent > 0 ? "up" : "down";
        const severity = getSeverity(changePercent, threshold);
        const { message, messageKr } = formatChangeMessage(
          symbol,
          symbolInfo.nameKr,
          direction,
          changePercent,
          windowSeconds
        );

        const alert: VolatilityAlert = {
          id: `vol-${symbol}-${Date.now()}`,
          symbol,
          symbolName: symbolInfo.name,
          symbolNameKr: symbolInfo.nameKr,
          severity,
          direction,
          changePercent,
          priceFrom: pastUpdate.price,
          priceTo: currentUpdate.price,
          windowSeconds,
          timestamp: Date.now(),
          message,
          messageKr,
        };

        this.lastAlertTime.set(symbol, Date.now());
        this.emitAlert(alert);
        break; // Only fire one alert per check cycle (shortest window wins)
      }
    }
  }

  onAlert(callback: (alert: VolatilityAlert) => void): () => void {
    this.alertCallbacks.add(callback);
    return () => {
      this.alertCallbacks.delete(callback);
    };
  }

  private emitAlert(alert: VolatilityAlert) {
    this.alertCallbacks.forEach(cb => cb(alert));
  }

  getHistory(symbol: string): PriceHistory | undefined {
    return this.histories.get(symbol);
  }

  // Update thresholds at runtime (user preferences)
  setCooldown(ms: number) {
    this.cooldownMs = ms;
  }
}

// Singleton instance
let detectorInstance: VolatilityDetector | null = null;

export function getVolatilityDetector(): VolatilityDetector {
  if (!detectorInstance) {
    detectorInstance = new VolatilityDetector();
  }
  return detectorInstance;
}
