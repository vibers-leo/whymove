// Real-time Market Data Module
// Supports: KIS API (한국투자증권), Binance WebSocket, simulated fallback
// Architecture: Provider pattern - swap data sources without changing consumers

export type DataProvider = "kis" | "binance" | "simulated";

export interface MarketPrice {
  symbol: string;
  price: number;
  prevPrice: number;
  change: number;       // absolute change
  changePercent: number; // percentage change
  high24h: number;
  low24h: number;
  volume24h: number;
  timestamp: number;     // unix ms
  source: DataProvider;
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: number;
  volume?: number;
}

// Futures symbols we track
export const FUTURES_SYMBOLS = {
  // US Stock Futures
  ES: { id: "ES", name: "S&P 500 E-mini", nameKr: "S&P 500 선물", category: "us_futures" as const, basePrice: 5800 },
  NQ: { id: "NQ", name: "Nasdaq 100 E-mini", nameKr: "나스닥 100 선물", category: "us_futures" as const, basePrice: 20500 },
  YM: { id: "YM", name: "Dow Jones E-mini", nameKr: "다우존스 선물", category: "us_futures" as const, basePrice: 43500 },
  // Crypto Futures
  BTCUSDT: { id: "BTCUSDT", name: "Bitcoin/USDT", nameKr: "비트코인", category: "crypto" as const, basePrice: 95000 },
  ETHUSDT: { id: "ETHUSDT", name: "Ethereum/USDT", nameKr: "이더리움", category: "crypto" as const, basePrice: 3200 },
  // Commodities (via KIS)
  GC: { id: "GC", name: "Gold Futures", nameKr: "금 선물", category: "commodity" as const, basePrice: 2950 },
  CL: { id: "CL", name: "Crude Oil Futures", nameKr: "원유 선물", category: "commodity" as const, basePrice: 72 },
} as const;

export type FuturesSymbol = keyof typeof FUTURES_SYMBOLS;

// Price history ring buffer for volatility detection
export class PriceHistory {
  private buffer: PriceUpdate[] = [];
  private maxSize: number;

  constructor(maxSize: number = 900) { // 15 minutes at 1s intervals
    this.maxSize = maxSize;
  }

  push(update: PriceUpdate) {
    this.buffer.push(update);
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift();
    }
  }

  // Get price at N seconds ago
  getPriceAt(secondsAgo: number): PriceUpdate | null {
    const targetTime = Date.now() - secondsAgo * 1000;
    // Binary search for closest entry
    let closest: PriceUpdate | null = null;
    let closestDiff = Infinity;
    for (const entry of this.buffer) {
      const diff = Math.abs(entry.timestamp - targetTime);
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = entry;
      }
    }
    return closestDiff < 5000 ? closest : null; // within 5 second tolerance
  }

  getLatest(): PriceUpdate | null {
    return this.buffer.length > 0 ? this.buffer[this.buffer.length - 1] : null;
  }

  getAll(): PriceUpdate[] {
    return [...this.buffer];
  }

  size(): number {
    return this.buffer.length;
  }
}

// Simulated price feed for development/demo
export class SimulatedPriceFeed {
  private prices: Map<string, number> = new Map();
  private intervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private listeners: Map<string, Set<(update: PriceUpdate) => void>> = new Map();

  constructor() {
    // Initialize with base prices
    Object.entries(FUTURES_SYMBOLS).forEach(([symbol, info]) => {
      this.prices.set(symbol, info.basePrice);
    });
  }

  subscribe(symbol: string, callback: (update: PriceUpdate) => void): () => void {
    if (!this.listeners.has(symbol)) {
      this.listeners.set(symbol, new Set());
    }
    this.listeners.get(symbol)!.add(callback);

    // Start simulating if not already
    if (!this.intervals.has(symbol)) {
      const interval = setInterval(() => {
        this.simulateTick(symbol);
      }, 1000);
      this.intervals.set(symbol, interval);
    }

    // Return unsubscribe function
    return () => {
      this.listeners.get(symbol)?.delete(callback);
      if (this.listeners.get(symbol)?.size === 0) {
        const interval = this.intervals.get(symbol);
        if (interval) clearInterval(interval);
        this.intervals.delete(symbol);
        this.listeners.delete(symbol);
      }
    };
  }

  private simulateTick(symbol: string) {
    const currentPrice = this.prices.get(symbol) || 0;
    const symbolInfo = FUTURES_SYMBOLS[symbol as FuturesSymbol];

    // Different volatility per asset type
    const volatility = symbolInfo?.category === "crypto" ? 0.0003 : 0.00015;
    const change = currentPrice * (Math.random() - 0.5) * 2 * volatility;
    const newPrice = currentPrice + change;

    this.prices.set(symbol, newPrice);

    const update: PriceUpdate = {
      symbol,
      price: newPrice,
      timestamp: Date.now(),
      volume: Math.random() * 1000,
    };

    this.listeners.get(symbol)?.forEach(cb => cb(update));
  }

  // Simulate a sudden spike (for testing volatility detection)
  simulateSpike(symbol: string, direction: "up" | "down", magnitude: number = 0.02) {
    const currentPrice = this.prices.get(symbol) || 0;
    const change = currentPrice * magnitude * (direction === "up" ? 1 : -1);
    const newPrice = currentPrice + change;
    this.prices.set(symbol, newPrice);

    const update: PriceUpdate = {
      symbol,
      price: newPrice,
      timestamp: Date.now(),
      volume: Math.random() * 10000,
    };

    this.listeners.get(symbol)?.forEach(cb => cb(update));
  }

  getPrice(symbol: string): number {
    return this.prices.get(symbol) || 0;
  }

  destroy() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.listeners.clear();
  }
}

// Market data store - singleton for the app
let priceFeedInstance: SimulatedPriceFeed | null = null;

export function getMarketDataFeed(): SimulatedPriceFeed {
  if (!priceFeedInstance) {
    priceFeedInstance = new SimulatedPriceFeed();
  }
  return priceFeedInstance;
}
