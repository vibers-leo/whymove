"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import {
  Globe, BarChart3, Shield, TrendingUp, Flame, MessageCircle,
  Zap, AlertTriangle, ChevronDown, ChevronUp, ExternalLink,
  Clock, Filter, Search
} from "lucide-react";

interface MarketEvent {
  id: string;
  created_at: string;
  event_type: string;
  title: string;
  title_kr?: string;
  summary?: string;
  summary_kr?: string;
  source_url?: string;
  source_name?: string;
  impact_level: string;
  affected_assets: string[];
  price_snapshot: Record<string, number>;
  price_change_1h: Record<string, string>;
  price_change_24h: Record<string, string>;
  tags: string[];
  event_datetime?: string;
  auto_detected: boolean;
}

const EVENT_TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  geopolitical: { icon: Globe, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", label: "지정학" },
  economic: { icon: BarChart3, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", label: "경제지표" },
  regulatory: { icon: Shield, color: "text-purple-400 bg-purple-500/10 border-purple-500/20", label: "규제" },
  earnings: { icon: TrendingUp, color: "text-green-400 bg-green-500/10 border-green-500/20", label: "실적" },
  whale: { icon: Zap, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", label: "고래" },
  social: { icon: MessageCircle, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20", label: "소셜" },
  technical: { icon: AlertTriangle, color: "text-red-400 bg-red-500/10 border-red-500/20", label: "기술" },
  political: { icon: Flame, color: "text-orange-400 bg-orange-500/10 border-orange-500/20", label: "정치" },
};

const IMPACT_COLORS: Record<string, string> = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-blue-500 text-white",
};

interface EventArchiveProps {
  maxEvents?: number;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

export const EventArchive = ({
  maxEvents = 20,
  showHeader = true,
  compact = false,
  className,
}: EventArchiveProps) => {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("market_events")
          .select("*")
          .order("event_datetime", { ascending: false })
          .limit(maxEvents);

        if (filterType) {
          query = query.eq("event_type", filterType);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Failed to fetch market events:", error);
          // Use demo data if table doesn't exist yet
          setEvents(DEMO_EVENTS);
        } else {
          setEvents(data?.length ? data : DEMO_EVENTS);
        }
      } catch {
        setEvents(DEMO_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [maxEvents, filterType]);

  // Subscribe to real-time inserts
  useEffect(() => {
    const channel = supabase
      .channel("market_events_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "market_events" }, (payload) => {
        setEvents((prev) => [payload.new as MarketEvent, ...prev].slice(0, maxEvents));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [maxEvents]);

  const filteredEvents = events.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.title_kr?.toLowerCase().includes(q) ||
      e.tags?.some((t) => t.toLowerCase().includes(q)) ||
      e.affected_assets?.some((a) => a.toLowerCase().includes(q))
    );
  });

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {showHeader && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground/80 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-500" />
            이벤트 아카이브
          </h3>
          <span className="text-[10px] text-foreground/40">{filteredEvents.length}건</span>
        </div>
      )}

      {/* Search + Filter Bar */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색 (BTC, 전쟁, CPI...)"
            className="w-full pl-7 pr-2 py-1.5 text-xs bg-foreground/5 border border-foreground/10 rounded-lg text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <div className="relative">
          <select
            value={filterType || ""}
            onChange={(e) => setFilterType(e.target.value || null)}
            className="appearance-none pl-6 pr-6 py-1.5 text-xs bg-foreground/5 border border-foreground/10 rounded-lg text-foreground/70 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="">전체</option>
            {Object.entries(EVENT_TYPE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <Filter className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground/30 pointer-events-none" />
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-foreground/10">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-foreground/30 text-xs">
            로딩 중...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-foreground/30 text-xs">
            이벤트가 없습니다
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              expanded={expandedId === event.id}
              onToggle={() => setExpandedId(expandedId === event.id ? null : event.id)}
              compact={compact}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Individual Event Card
const EventCard = ({
  event,
  expanded,
  onToggle,
  compact,
}: {
  event: MarketEvent;
  expanded: boolean;
  onToggle: () => void;
  compact: boolean;
}) => {
  const config = EVENT_TYPE_CONFIG[event.event_type] || EVENT_TYPE_CONFIG.technical;
  const Icon = config.icon;
  const eventDate = event.event_datetime ? new Date(event.event_datetime) : new Date(event.created_at);

  return (
    <div
      className={cn(
        "border rounded-lg transition-all cursor-pointer",
        config.color,
        expanded && "ring-1 ring-foreground/20"
      )}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-start gap-2 p-2.5">
        <div className={cn("p-1.5 rounded-md border shrink-0", config.color)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold uppercase", IMPACT_COLORS[event.impact_level])}>
              {event.impact_level}
            </span>
            {event.auto_detected && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-foreground/10 text-foreground/50">
                자동감지
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-foreground/90 mt-1 truncate">
            {event.title_kr || event.title}
          </h4>
          {!compact && (
            <div className="flex items-center gap-2 mt-1 text-[10px] text-foreground/40">
              <span>{eventDate.toLocaleDateString("ko-KR")} {eventDate.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</span>
              {event.source_name && <span>· {event.source_name}</span>}
            </div>
          )}
        </div>
        <div className="shrink-0 text-foreground/30">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-2.5 pb-2.5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Summary */}
          {(event.summary_kr || event.summary) && (
            <p className="text-xs text-foreground/60 leading-relaxed">
              {event.summary_kr || event.summary}
            </p>
          )}

          {/* Affected Assets */}
          {event.affected_assets?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.affected_assets.map((asset) => (
                <span key={asset} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-foreground/10 text-foreground/60">
                  {asset}
                </span>
              ))}
            </div>
          )}

          {/* Price Impact */}
          {event.price_change_1h && Object.keys(event.price_change_1h).length > 0 && (
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(event.price_change_1h).map(([symbol, change]) => {
                const isPositive = String(change).startsWith("+");
                return (
                  <div key={symbol} className="flex items-center justify-between px-2 py-1 rounded bg-foreground/5 text-xs">
                    <span className="text-foreground/50">{symbol}</span>
                    <span className={isPositive ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                      {change} (1h)
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tags */}
          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag) => (
                <span key={tag} className="text-[10px] text-foreground/40 before:content-['#']">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Source Link */}
          {event.source_url && (
            <a
              href={event.source_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              원문 보기
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// Demo events for when the database table doesn't exist yet
const DEMO_EVENTS: MarketEvent[] = [
  {
    id: "demo-1",
    created_at: new Date().toISOString(),
    event_type: "geopolitical",
    title: "US-Iran Tensions Escalate",
    title_kr: "미국-이란 긴장 고조: 호르무즈 해협 봉쇄 위협",
    summary: "Iran threatens to block Strait of Hormuz following new US sanctions",
    summary_kr: "미국의 새로운 제재에 이란이 호르무즈 해협 봉쇄를 위협하면서 원유 선물 급등",
    source_name: "Reuters",
    impact_level: "critical",
    affected_assets: ["CL", "ES", "NQ", "GC"],
    price_snapshot: { CL: 78.5, ES: 5750, NQ: 20100, GC: 3050 },
    price_change_1h: { CL: "+4.2%", ES: "-1.8%", NQ: "-2.1%", GC: "+1.5%" },
    price_change_24h: { CL: "+6.8%", ES: "-2.5%", NQ: "-3.0%", GC: "+2.8%" },
    tags: ["iran", "war", "oil", "sanctions", "geopolitics"],
    event_datetime: new Date(Date.now() - 3600000).toISOString(),
    auto_detected: false,
  },
  {
    id: "demo-2",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    event_type: "economic",
    title: "US CPI Comes In Hot",
    title_kr: "미국 CPI 예상치 상회: 3.1% (예상 2.9%)",
    summary: "February CPI data shows inflation remains sticky",
    summary_kr: "2월 CPI 3.1%로 예상치 2.9% 상회, 인플레이션 지속 우려 확대",
    source_name: "BLS",
    impact_level: "high",
    affected_assets: ["ES", "NQ", "BTCUSDT"],
    price_snapshot: { ES: 5820, NQ: 20300, BTCUSDT: 92000 },
    price_change_1h: { ES: "-1.2%", NQ: "-1.5%", BTCUSDT: "-3.1%" },
    price_change_24h: { ES: "-0.8%", NQ: "-1.0%", BTCUSDT: "-1.5%" },
    tags: ["cpi", "inflation", "fed", "interest-rate"],
    event_datetime: new Date(Date.now() - 86400000).toISOString(),
    auto_detected: false,
  },
  {
    id: "demo-3",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    event_type: "social",
    title: "Trump Crypto Reserve Announcement",
    title_kr: "트럼프: '미국 전략적 암호화폐 비축 추진'",
    summary_kr: "트럼프 대통령이 미국 전략적 암호화폐 비축 정책 발표, BTC/ETH/SOL 급등",
    source_name: "Truth Social",
    impact_level: "critical",
    affected_assets: ["BTCUSDT", "ETHUSDT", "ES"],
    price_snapshot: { BTCUSDT: 88000, ETHUSDT: 2400, ES: 5900 },
    price_change_1h: { BTCUSDT: "+8.5%", ETHUSDT: "+12.3%", ES: "+0.5%" },
    price_change_24h: { BTCUSDT: "+15.2%", ETHUSDT: "+18.0%", ES: "+1.2%" },
    tags: ["trump", "crypto", "reserve", "regulation"],
    event_datetime: new Date(Date.now() - 172800000).toISOString(),
    auto_detected: false,
  },
  {
    id: "demo-4",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    event_type: "technical",
    title: "BTC Flash Crash: -5% in 2 minutes",
    title_kr: "BTC 급락: 2분간 -5% 변동 감지",
    summary_kr: "대규모 청산 연쇄 반응으로 BTC 2분 내 5% 급락, 총 청산액 $2.3B",
    impact_level: "high",
    affected_assets: ["BTCUSDT", "ETHUSDT"],
    price_snapshot: { BTCUSDT: 93000, ETHUSDT: 3100 },
    price_change_1h: { BTCUSDT: "-5.2%", ETHUSDT: "-6.8%" },
    price_change_24h: {},
    tags: ["flash-crash", "liquidation", "volatility"],
    event_datetime: new Date(Date.now() - 7200000).toISOString(),
    auto_detected: true,
  },
];
