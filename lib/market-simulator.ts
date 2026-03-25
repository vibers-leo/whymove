
export interface Candle {
  time: string | number; // Time in seconds (UNIX) or YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
}

// Initial Data Generator
export const generateInitialData = (count: number = 1000, startPrice: number = 50000): Candle[] => {
  const data: Candle[] = [];
  let currentPrice = startPrice;
  // Start from 1000 minutes ago
  const time = Math.floor(Date.now() / 1000) - (count * 60); 

  for (let i = 0; i < count; i++) {
    const volatility = 0.002; // 0.2% per candle
    const change = currentPrice * (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.abs(change) * Math.random();
    const low = Math.min(open, close) - Math.abs(change) * Math.random();

    data.push({
      time: time + (i * 60), // Add 1 minute
      open,
      high,
      low,
      close
    });

    currentPrice = close;
  }

  return data;
};

// Next Candle Generator (Real-time updates)
export const generateNextCandle = (lastCandle: Candle, volatility: number = 0.001): Candle => {
  const currentPrice = lastCandle.close;
  const change = currentPrice * (Math.random() - 0.5) * volatility;
  const open = currentPrice;
  const close = currentPrice + change;
  const high = Math.max(open, close) + Math.abs(change) * Math.random();
  const low = Math.min(open, close) - Math.abs(change) * Math.random();

  return {
    time: (lastCandle.time as number) + 60, // Next minute
    open,
    high,
    low,
    close
  };
};

export const SYMBOLS = [
  { id: "BTC/USD", name: "Bitcoin", price: 95000, volatility: 0.005 },
  { id: "ETH/USD", name: "Ethereum", price: 3200, volatility: 0.006 },
  { id: "NVDA", name: "NVIDIA", price: 1450, volatility: 0.008 },
  { id: "XAU/USD", name: "Gold", price: 2950, volatility: 0.002 },
];
