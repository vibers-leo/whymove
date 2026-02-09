"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  CalendarClock, 
  TrendingUp, 
  Building2, 
  Briefcase, 
  Bitcoin,
  Mic2,
  Clock,
  AlertTriangle
} from "lucide-react";
import { 
  EconomicEvent, 
  getUpcomingEvents, 
  getTimeUntilEvent 
} from "@/lib/economic-events";

// Legacy type for backward compatibility
export type CalendarEvent = {
  id: string;
  date: string;
  time: string;
  title: string;
  category: "Gov" | "BigTech" | "Macro" | "Crypto";
  impact: "high" | "medium" | "low";
  description?: string;
};

interface MarketCalendarProps {
  events?: CalendarEvent[]; // Legacy prop
  useRealData?: boolean;
  maxEvents?: number;
}

export function MarketCalendar({ 
  events: legacyEvents, 
  useRealData = true,
  maxEvents = 5 
}: MarketCalendarProps) {
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [, setTick] = useState(0); // For forcing re-render to update countdowns

  useEffect(() => {
    if (useRealData) {
      setEconomicEvents(getUpcomingEvents(maxEvents));
    }
  }, [useRealData, maxEvents]);

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const displayEvents = useRealData ? economicEvents : [];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 bg-purple-500 rounded-full" />
          <h2 className="text-sm font-bold text-foreground">Economic Calendar</h2>
        </div>
        <span className="text-[10px] text-foreground/40 border border-foreground/10 px-1.5 py-0.5 rounded">
          KST
        </span>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {displayEvents.map((event) => (
          <EconomicEventCard key={event.id} event={event} />
        ))}
        {displayEvents.length === 0 && (
          <div className="text-foreground/40 text-center py-4 text-xs italic">
            No upcoming events
          </div>
        )}
      </div>
    </div>
  );
}

function EconomicEventCard({ event }: { event: EconomicEvent }) {
  const timeInfo = getTimeUntilEvent(event.datetime);
  const eventDate = new Date(event.datetime);
  
  // Format for KST
  const kstTime = eventDate.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const getIcon = () => {
    switch (event.category) {
      case "fed": return <Building2 size={12} />;
      case "macro": return <TrendingUp size={12} />;
      case "employment": return <Briefcase size={12} />;
      case "political": return <Mic2 size={12} />;
      case "crypto": return <Bitcoin size={12} />;
      case "earnings": return <CalendarClock size={12} />;
      default: return <CalendarClock size={12} />;
    }
  };

  const getCategoryColor = () => {
    switch (event.category) {
      case "fed": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "macro": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "employment": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "political": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "crypto": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "earnings": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-foreground/40 bg-foreground/5 border-foreground/10";
    }
  };

  const getImpactBadge = () => {
    if (event.impact === "high") {
      return (
        <span className="flex items-center gap-0.5 text-[9px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-1 py-0.5 rounded">
          <AlertTriangle size={8} />
          HIGH
        </span>
      );
    }
    if (event.impact === "medium") {
      return (
        <span className="text-[9px] font-medium text-yellow-400/80 bg-yellow-500/10 border border-yellow-500/20 px-1 py-0.5 rounded">
          MED
        </span>
      );
    }
    return null;
  };

  const isUrgent = timeInfo.days === 0 && !timeInfo.isPast;
  const isToday = timeInfo.days === 0;

  return (
    <div 
      className={cn(
        "group relative rounded-lg border p-2.5 transition-all cursor-pointer",
        "bg-foreground/5 border-foreground/10 hover:bg-foreground/10",
        isUrgent && "border-red-500/30 bg-red-500/5 animate-pulse"
      )}
    >
      {/* Top Row: Category Icon + Time + Impact */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {/* Category Icon */}
          <div className={cn(
            "w-5 h-5 rounded flex items-center justify-center border",
            getCategoryColor()
          )}>
            {getIcon()}
          </div>
          {/* Time */}
          <div className="flex items-center gap-1 text-[10px] text-foreground/50">
            <Clock size={10} />
            <span className={cn(isToday && "text-purple-400 font-medium")}>
              {kstTime}
            </span>
          </div>
        </div>
        {/* D-Day + Impact */}
        <div className="flex items-center gap-1.5">
          {!timeInfo.isPast && (
            <span className={cn(
              "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded",
              timeInfo.days === 0 
                ? "text-red-400 bg-red-500/20" 
                : timeInfo.days <= 1 
                  ? "text-yellow-400 bg-yellow-500/20"
                  : "text-foreground/50 bg-foreground/10"
            )}>
              {timeInfo.label}
            </span>
          )}
          {getImpactBadge()}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xs font-bold text-foreground/90 leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
        {event.titleKr || event.title}
      </h3>

      {/* Forecast / Previous (if available) */}
      {(event.forecast || event.previousValue) && (
        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-foreground/40">
          {event.forecast && (
            <span>예상: <span className="text-foreground/60">{event.forecast}</span></span>
          )}
          {event.previousValue && (
            <span>이전: <span className="text-foreground/60">{event.previousValue}</span></span>
          )}
        </div>
      )}
    </div>
  );
}
