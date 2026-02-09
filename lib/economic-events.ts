// Economic Calendar Data
// This file contains upcoming economic events that may cause market volatility
// Data should be updated regularly

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
  source?: string;
}

// February 2026 Economic Calendar
// Times are in UTC
export const economicEvents: EconomicEvent[] = [
  // FOMC & Fed Events
  {
    id: "fomc-feb-2026",
    title: "FOMC Interest Rate Decision",
    titleKr: "FOMC 금리 결정",
    datetime: "2026-02-19T19:00:00Z", // 한국시간 02.20 04:00
    category: "fed",
    impact: "high",
    country: "US",
    description: "Federal Reserve announces interest rate decision",
    descriptionKr: "연방준비제도 기준금리 발표",
    forecast: "4.25%",
    previousValue: "4.25%",
  },
  {
    id: "fomc-minutes-feb-2026",
    title: "FOMC Meeting Minutes",
    titleKr: "FOMC 회의록 공개",
    datetime: "2026-02-20T19:00:00Z",
    category: "fed",
    impact: "medium",
    country: "US",
    description: "Detailed minutes from the previous FOMC meeting",
    descriptionKr: "이전 FOMC 회의 상세 회의록",
  },
  
  // CPI & Inflation
  {
    id: "cpi-feb-2026",
    title: "US CPI (Consumer Price Index)",
    titleKr: "미국 소비자물가지수 (CPI)",
    datetime: "2026-02-12T13:30:00Z", // 한국시간 22:30
    category: "macro",
    impact: "high",
    country: "US",
    description: "January CPI data - Key inflation indicator",
    descriptionKr: "1월 CPI 데이터 - 인플레이션 핵심 지표",
    forecast: "2.9%",
    previousValue: "2.9%",
  },
  {
    id: "core-cpi-feb-2026",
    title: "US Core CPI (ex Food & Energy)",
    titleKr: "미국 근원 CPI (식품/에너지 제외)",
    datetime: "2026-02-12T13:30:00Z",
    category: "macro",
    impact: "high",
    country: "US",
    description: "Core CPI excluding volatile food and energy prices",
    descriptionKr: "변동성 높은 식품/에너지 제외한 CPI",
    forecast: "3.2%",
    previousValue: "3.2%",
  },
  {
    id: "ppi-feb-2026",
    title: "US PPI (Producer Price Index)",
    titleKr: "미국 생산자물가지수 (PPI)",
    datetime: "2026-02-13T13:30:00Z",
    category: "macro",
    impact: "medium",
    country: "US",
    description: "January PPI data - Leading indicator for CPI",
    descriptionKr: "1월 PPI 데이터 - CPI 선행 지표",
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
  },
  {
    id: "jobless-claims-1",
    title: "Initial Jobless Claims",
    titleKr: "신규 실업수당 청구건수",
    datetime: "2026-02-13T13:30:00Z",
    category: "employment",
    impact: "medium",
    country: "US",
    description: "Weekly jobless claims data",
    descriptionKr: "주간 실업수당 청구 데이터",
  },
  {
    id: "jobless-claims-2",
    title: "Initial Jobless Claims",
    titleKr: "신규 실업수당 청구건수",
    datetime: "2026-02-20T13:30:00Z",
    category: "employment",
    impact: "medium",
    country: "US",
  },
  
  // Political Events
  {
    id: "trump-speech-feb-2026",
    title: "President Trump - State of the Union",
    titleKr: "트럼프 대통령 - 국정연설",
    datetime: "2026-02-25T02:00:00Z", // 한국시간 11:00
    category: "political",
    impact: "high",
    country: "US",
    description: "Annual address to Congress - May include crypto/tariff comments",
    descriptionKr: "연례 의회 연설 - 암호화폐/관세 언급 가능성",
  },
  {
    id: "powell-speech-feb-2026",
    title: "Fed Chair Powell Speech",
    titleKr: "파월 연준 의장 연설",
    datetime: "2026-02-18T15:00:00Z",
    category: "fed",
    impact: "high",
    country: "US",
    description: "Powell speaks at economic forum",
    descriptionKr: "파월 의장 경제 포럼 연설",
  },
  
  // Big Tech Earnings (Example)
  {
    id: "nvda-earnings-feb-2026",
    title: "NVIDIA (NVDA) Q4 Earnings",
    titleKr: "엔비디아 (NVDA) 4분기 실적",
    datetime: "2026-02-26T21:00:00Z",
    category: "earnings",
    impact: "high",
    country: "US",
    description: "AI chip leader earnings - Major market catalyst",
    descriptionKr: "AI 칩 선두주자 실적 발표 - 시장 촉매제",
  },
  
  // Crypto Specific
  {
    id: "btc-etf-deadline",
    title: "SEC ETF Decision Deadline",
    titleKr: "SEC ETF 결정 마감일",
    datetime: "2026-02-28T23:59:00Z",
    category: "crypto",
    impact: "high",
    country: "US",
    description: "Final deadline for SEC decision on pending ETF applications",
    descriptionKr: "대기 중인 ETF 신청에 대한 SEC 최종 결정 마감",
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
    return { days: 0, hours: 0, minutes: 0, isPast: true, label: "Completed" };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  let label = "";
  if (days > 0) {
    label = `D-${days}`;
  } else if (hours > 0) {
    label = `${hours}h ${minutes}m`;
  } else {
    label = `${minutes}m`;
  }
  
  return { days, hours, minutes, isPast: false, label };
}
