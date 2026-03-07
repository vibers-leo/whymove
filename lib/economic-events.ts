// Economic Calendar Data
// This file contains upcoming economic events that may cause market volatility
// TODO: Migrate to Supabase economic_calendar table for dynamic updates

export interface EconomicEvent {
  id: string;
  title: string;
  titleKr?: string; // Korean translation
  datetime: string; // ISO 8601 format: "2026-02-10T22:30:00Z"
  category: "macro" | "fed" | "employment" | "political" | "earnings" | "crypto";
  impact: "high" | "medium" | "low";
  country: "US" | "EU" | "JP" | "KR" | "CN" | "GLOBAL";
  description?: string;
  descriptionKr?: string;
  previousValue?: string;
  forecast?: string;
  actualValue?: string;
  source?: string;
  alertBeforeMinutes?: number[]; // e.g., [1440, 60, 30, 5] for D-1, H-1, M-30, M-5
}

// March 2026 Economic Calendar
// Times are in UTC
export const economicEvents: EconomicEvent[] = [
  // FOMC & Fed Events
  {
    id: "fomc-mar-2026",
    title: "FOMC Interest Rate Decision",
    titleKr: "FOMC 금리 결정",
    datetime: "2026-03-18T18:00:00Z",
    category: "fed",
    impact: "high",
    country: "US",
    description: "Federal Reserve announces interest rate decision",
    descriptionKr: "연방준비제도 기준금리 발표",
    forecast: "4.25%",
    previousValue: "4.25%",
    alertBeforeMinutes: [1440, 60, 30, 5],
  },
  {
    id: "fomc-press-mar-2026",
    title: "Fed Chair Powell Press Conference",
    titleKr: "파월 의장 기자회견",
    datetime: "2026-03-18T18:30:00Z",
    category: "fed",
    impact: "high",
    country: "US",
    descriptionKr: "FOMC 금리 결정 후 파월 의장 기자회견",
    alertBeforeMinutes: [30, 5],
  },

  // CPI & Inflation
  {
    id: "cpi-mar-2026",
    title: "US CPI (Consumer Price Index)",
    titleKr: "미국 소비자물가지수 (CPI)",
    datetime: "2026-03-12T12:30:00Z",
    category: "macro",
    impact: "high",
    country: "US",
    description: "February CPI data - Key inflation indicator",
    descriptionKr: "2월 CPI 데이터 - 인플레이션 핵심 지표",
    forecast: "2.9%",
    previousValue: "3.0%",
    alertBeforeMinutes: [1440, 60, 30, 5],
  },
  {
    id: "core-cpi-mar-2026",
    title: "US Core CPI (ex Food & Energy)",
    titleKr: "미국 근원 CPI (식품/에너지 제외)",
    datetime: "2026-03-12T12:30:00Z",
    category: "macro",
    impact: "high",
    country: "US",
    descriptionKr: "변동성 높은 식품/에너지 제외한 CPI",
    forecast: "3.2%",
    previousValue: "3.3%",
  },
  {
    id: "ppi-mar-2026",
    title: "US PPI (Producer Price Index)",
    titleKr: "미국 생산자물가지수 (PPI)",
    datetime: "2026-03-13T12:30:00Z",
    category: "macro",
    impact: "medium",
    country: "US",
    descriptionKr: "2월 PPI 데이터 - CPI 선행 지표",
  },
  {
    id: "retail-sales-mar-2026",
    title: "US Retail Sales",
    titleKr: "미국 소매판매",
    datetime: "2026-03-17T12:30:00Z",
    category: "macro",
    impact: "medium",
    country: "US",
    descriptionKr: "2월 소매판매 데이터 - 소비 동향 지표",
  },
  {
    id: "pce-mar-2026",
    title: "US PCE Price Index",
    titleKr: "미국 PCE 물가지수",
    datetime: "2026-03-28T12:30:00Z",
    category: "macro",
    impact: "high",
    country: "US",
    description: "Fed's preferred inflation measure",
    descriptionKr: "연준 선호 인플레이션 지표 (핵심 PCE)",
    alertBeforeMinutes: [1440, 60, 30, 5],
  },

  // Employment
  {
    id: "nfp-mar-2026",
    title: "US Non-Farm Payrolls (NFP)",
    titleKr: "미국 비농업 고용지표 (NFP)",
    datetime: "2026-03-07T13:30:00Z",
    category: "employment",
    impact: "high",
    country: "US",
    description: "February employment report - Major market mover",
    descriptionKr: "2월 고용보고서 - 시장 핵심 지표",
    forecast: "180K",
    alertBeforeMinutes: [1440, 60, 30, 5],
  },
  {
    id: "jobless-claims-mar-1",
    title: "Initial Jobless Claims",
    titleKr: "신규 실업수당 청구건수",
    datetime: "2026-03-13T13:30:00Z",
    category: "employment",
    impact: "medium",
    country: "US",
  },
  {
    id: "jobless-claims-mar-2",
    title: "Initial Jobless Claims",
    titleKr: "신규 실업수당 청구건수",
    datetime: "2026-03-20T13:30:00Z",
    category: "employment",
    impact: "medium",
    country: "US",
  },
  {
    id: "jobless-claims-mar-3",
    title: "Initial Jobless Claims",
    titleKr: "신규 실업수당 청구건수",
    datetime: "2026-03-27T13:30:00Z",
    category: "employment",
    impact: "medium",
    country: "US",
  },

  // Political Events
  {
    id: "us-iran-tensions",
    title: "US-Iran Diplomatic Talks",
    titleKr: "미국-이란 외교 협상",
    datetime: "2026-03-15T14:00:00Z",
    category: "political",
    impact: "high",
    country: "US",
    descriptionKr: "미국-이란 긴장 관련 외교 협상 - 원유/금 선물 변동성 주의",
    alertBeforeMinutes: [1440, 60, 30],
  },

  // Earnings
  {
    id: "orcl-earnings-mar-2026",
    title: "Oracle (ORCL) Q3 Earnings",
    titleKr: "오라클 (ORCL) 3분기 실적",
    datetime: "2026-03-10T21:00:00Z",
    category: "earnings",
    impact: "medium",
    country: "US",
    descriptionKr: "클라우드/AI 인프라 수혜 기업 실적",
  },
  {
    id: "adbe-earnings-mar-2026",
    title: "Adobe (ADBE) Q1 Earnings",
    titleKr: "어도비 (ADBE) 1분기 실적",
    datetime: "2026-03-18T21:00:00Z",
    category: "earnings",
    impact: "medium",
    country: "US",
    descriptionKr: "AI 소프트웨어 수혜 기업 실적",
  },

  // Crypto Events
  {
    id: "eth-pectra-upgrade",
    title: "Ethereum Pectra Upgrade",
    titleKr: "이더리움 Pectra 업그레이드",
    datetime: "2026-03-25T12:00:00Z",
    category: "crypto",
    impact: "high",
    country: "GLOBAL",
    descriptionKr: "이더리움 네트워크 대규모 업그레이드 - ETH 변동성 주의",
    alertBeforeMinutes: [1440, 60, 30, 5],
  },

  // April preview
  {
    id: "nfp-apr-2026",
    title: "US Non-Farm Payrolls (NFP)",
    titleKr: "미국 비농업 고용지표 (NFP)",
    datetime: "2026-04-03T12:30:00Z",
    category: "employment",
    impact: "high",
    country: "US",
    descriptionKr: "3월 고용보고서",
    alertBeforeMinutes: [1440, 60, 30, 5],
  },
];

// Helper function to get upcoming events (sorted by date)
export function getUpcomingEvents(limit?: number): EconomicEvent[] {
  const now = new Date();
  const upcoming = economicEvents
    .filter(event => new Date(event.datetime) > now)
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  return limit ? upcoming.slice(0, limit) : upcoming;
}

// Helper function to get events happening today
export function getTodayEvents(): EconomicEvent[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  return economicEvents.filter(event => {
    const eventDate = new Date(event.datetime);
    return eventDate >= todayStart && eventDate < todayEnd;
  });
}

// Helper to get time until event
export function getTimeUntilEvent(datetime: string): {
  days: number;
  hours: number;
  minutes: number;
  isPast: boolean;
  label: string;
} {
  const now = new Date();
  const eventDate = new Date(datetime);
  const diff = eventDate.getTime() - now.getTime();

  if (diff < 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true, label: "완료" };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let label = "";
  if (days > 0) {
    label = `D-${days}`;
  } else if (hours > 0) {
    label = `${hours}시간 ${minutes}분`;
  } else {
    label = `${minutes}분`;
  }

  return { days, hours, minutes, isPast: false, label };
}

// Get events that need alerts (within their alert windows)
export function getEventsNeedingAlert(): { event: EconomicEvent; minutesUntil: number }[] {
  const now = new Date();
  const results: { event: EconomicEvent; minutesUntil: number }[] = [];

  for (const event of economicEvents) {
    if (!event.alertBeforeMinutes) continue;
    const eventDate = new Date(event.datetime);
    const minutesUntil = (eventDate.getTime() - now.getTime()) / (1000 * 60);

    if (minutesUntil <= 0) continue;

    // Check if we're within any alert window
    for (const alertMinutes of event.alertBeforeMinutes) {
      // Trigger alert if we're within 1 minute of the alert time
      if (Math.abs(minutesUntil - alertMinutes) < 1) {
        results.push({ event, minutesUntil: Math.round(minutesUntil) });
        break;
      }
    }
  }

  return results;
}
