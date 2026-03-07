"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  AlertTriangle, TrendingUp, TrendingDown, Zap, Radio, GripVertical, X,
  Flame, Siren, BarChart3, Globe, Filter
} from "lucide-react";
import type { VolatilityAlert } from "@/lib/volatility-detector";

// Extended event types
export type ChartEventType =
  | "trump" | "cpi" | "pump"           // manual triggers (legacy)
  | "volatility_spike"                  // auto-detected price spike
  | "news"                              // breaking news
  | "war"                               // geopolitical events
  | "pre_event"                         // upcoming scheduled event countdown
  | "whale";                            // large transactions

export interface ChartEvent {
  id: string;
  type: ChartEventType;
  label: string;
  labelKr?: string;
  color: string;
  timestamp: Date;
  severity?: "critical" | "high" | "medium" | "low";
  changePercent?: number;
  direction?: "up" | "down";
  symbol?: string;
  dismissable?: boolean;
}

// Convert a VolatilityAlert to a ChartEvent
export function volatilityAlertToChartEvent(alert: VolatilityAlert): ChartEvent {
  const directionEmoji = alert.direction === "up" ? "📈" : "📉";
  const severityColor = {
    critical: "red",
    high: "orange",
    medium: "yellow",
    low: "blue",
  }[alert.severity];

  return {
    id: alert.id,
    type: "volatility_spike",
    label: `${directionEmoji} ${alert.message}`,
    labelKr: alert.messageKr,
    color: severityColor,
    timestamp: new Date(alert.timestamp),
    severity: alert.severity,
    changePercent: alert.changePercent,
    direction: alert.direction,
    symbol: alert.symbol,
    dismissable: true,
  };
}

// Create a pre-event countdown ChartEvent
export function createPreEventChartEvent(
  eventTitle: string,
  eventTitleKr: string,
  minutesUntil: number
): ChartEvent {
  const timeLabel = minutesUntil >= 60
    ? `${Math.floor(minutesUntil / 60)}h ${minutesUntil % 60}m`
    : `${minutesUntil}m`;

  return {
    id: `pre-event-${Date.now()}`,
    type: "pre_event",
    label: `⏰ ${eventTitle} in ${timeLabel}`,
    labelKr: `⏰ ${eventTitleKr} ${timeLabel} 후`,
    color: "purple",
    timestamp: new Date(),
    severity: minutesUntil <= 5 ? "critical" : minutesUntil <= 30 ? "high" : "medium",
    dismissable: true,
  };
}

interface VolatilityControlPanelProps {
  onTrigger: (type: ChartEventType) => void;
  className?: string;
}

// Event type filter state
type EventFilterKey = "volatility_spike" | "news" | "pre_event" | "manual";

const TriggerButton = ({
  onClick,
  label,
  icon: Icon,
  color,
}: {
  onClick: () => void;
  label: string;
  icon: React.ElementType;
  color: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-foreground/10 bg-background text-foreground/70 text-xs font-medium transition-all group overflow-hidden",
        "hover:border-foreground/30 hover:text-foreground hover:scale-105 active:scale-95"
      )}
    >
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity", color)} />
      <Icon className={cn("w-3 h-3", color.replace("bg-", "text-"))} />
      <span>{label}</span>
      <div className="absolute inset-0 rounded-lg ring-1 ring-foreground/5 group-hover:ring-foreground/10" />
    </button>
  );
};

export const VolatilityControlPanel = ({ onTrigger, className }: VolatilityControlPanelProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<EventFilterKey, boolean>>({
    volatility_spike: true,
    news: true,
    pre_event: true,
    manual: true,
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const toggleFilter = (key: EventFilterKey) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="p-2 bg-background/80 backdrop-blur border border-foreground/10 rounded-lg hover:bg-foreground/10 transition-colors"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <Radio className="w-4 h-4 text-red-500 animate-pulse" />
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        "flex flex-col gap-2 p-2 bg-background/90 backdrop-blur-md border border-foreground/10 rounded-xl shadow-lg",
        isDragging && "cursor-grabbing opacity-80",
        className
      )}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {/* Top row: drag handle + triggers */}
      <div className="flex gap-2 items-center">
        <div
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-foreground/10 rounded transition-colors"
          onMouseDown={handleDragStart}
        >
          <GripVertical className="w-4 h-4 text-foreground/30" />
        </div>

        <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
          <Radio className="w-3 h-3 text-red-500 animate-pulse" />
          Event
        </span>

        <TriggerButton label="Trump" icon={AlertTriangle} color="bg-orange-500" onClick={() => onTrigger("trump")} />
        <TriggerButton label="CPI" icon={TrendingUp} color="bg-red-500" onClick={() => onTrigger("cpi")} />
        <TriggerButton label="Musk" icon={Zap} color="bg-cyan-500" onClick={() => onTrigger("pump")} />
        <TriggerButton label="War" icon={Flame} color="bg-amber-600" onClick={() => onTrigger("war")} />

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "p-1.5 rounded transition-colors",
            showFilters ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-foreground/10 text-foreground/40"
          )}
          title="알림 필터"
        >
          <Filter className="w-3 h-3" />
        </button>

        <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-foreground/10 rounded transition-colors ml-1">
          <X className="w-3 h-3 text-foreground/30" />
        </button>
      </div>

      {/* Filter row (collapsible) */}
      {showFilters && (
        <div className="flex gap-1.5 pl-7 animate-in fade-in slide-in-from-top-2 duration-200">
          <FilterChip
            label="변동감지"
            icon={BarChart3}
            active={filters.volatility_spike}
            onClick={() => toggleFilter("volatility_spike")}
          />
          <FilterChip
            label="뉴스"
            icon={Globe}
            active={filters.news}
            onClick={() => toggleFilter("news")}
          />
          <FilterChip
            label="사전알림"
            icon={Siren}
            active={filters.pre_event}
            onClick={() => toggleFilter("pre_event")}
          />
          <FilterChip
            label="수동"
            icon={Zap}
            active={filters.manual}
            onClick={() => toggleFilter("manual")}
          />
        </div>
      )}
    </div>
  );
};

// Small filter chip component
const FilterChip = ({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all border",
      active
        ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
        : "bg-foreground/5 border-foreground/10 text-foreground/30 hover:text-foreground/50"
    )}
  >
    <Icon className="w-2.5 h-2.5" />
    {label}
  </button>
);

// Chart Event Overlay - displays triggered events on the chart
export const ChartEventOverlay = ({
  events,
  onDismiss,
}: {
  events: ChartEvent[];
  onDismiss: (id: string) => void;
}) => {
  const eventStyles: Record<string, string> = {
    trump: "bg-orange-500/20 border-orange-500/50 text-orange-300",
    cpi: "bg-red-500/20 border-red-500/50 text-red-300",
    pump: "bg-cyan-500/20 border-cyan-500/50 text-cyan-300",
    volatility_spike: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
    news: "bg-blue-500/20 border-blue-500/50 text-blue-300",
    war: "bg-amber-600/20 border-amber-600/50 text-amber-300",
    pre_event: "bg-purple-500/20 border-purple-500/50 text-purple-300",
    whale: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
  };

  const eventIcons: Record<string, React.ElementType> = {
    trump: AlertTriangle,
    cpi: TrendingUp,
    pump: Zap,
    volatility_spike: BarChart3,
    news: Globe,
    war: Flame,
    pre_event: Siren,
    whale: TrendingDown,
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {events.map((event, index) => {
        const Icon = eventIcons[event.type] || AlertTriangle;
        const style = eventStyles[event.type] || eventStyles.news;

        return (
          <div
            key={event.id}
            className={cn(
              "absolute right-4 pointer-events-auto animate-in slide-in-from-right-full fade-in duration-500",
              "flex items-center gap-2 px-4 py-2 rounded-lg border shadow-lg backdrop-blur-md",
              style,
              event.severity === "critical" && "animate-pulse ring-2 ring-red-500/50"
            )}
            style={{ top: `${60 + index * 60}px` }}
          >
            <Icon className="w-5 h-5" />
            <div className="flex flex-col">
              <span className="text-sm font-bold">{event.labelKr || event.label}</span>
              {event.changePercent !== undefined && (
                <span className="text-xs opacity-70">
                  {event.direction === "up" ? "+" : ""}{event.changePercent.toFixed(2)}%
                  {event.symbol && ` · ${event.symbol}`}
                </span>
              )}
              <span className="text-xs opacity-50">
                {event.timestamp.toLocaleTimeString()}
              </span>
            </div>
            {event.dismissable !== false && (
              <button
                onClick={() => onDismiss(event.id)}
                className="ml-2 p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
