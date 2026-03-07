"use client";

import React, { useState, useCallback } from "react";
import { MainChart } from "@/components/chart/main-chart";
import { ChatRoom } from "@/components/community/chat-room";
import { SocialFeed } from "@/components/feed/social-feed";
import { MarketCalendar } from "@/components/ui/market-calendar";
import { VolatilityControlPanel, ChartEventOverlay, type ChartEvent, type ChartEventType } from "@/components/chart/volatility-control-panel";
import { EventArchive } from "@/components/archive/event-archive";

interface DashboardProps {
  handleTrigger: (type: string) => void;
}

export const DraggableDashboard = ({
  handleTrigger,
}: DashboardProps) => {
  const [chartEvents, setChartEvents] = useState<ChartEvent[]>([]);

  const handleEventTrigger = useCallback((type: ChartEventType) => {
    const eventConfig: Record<string, { label: string; labelKr: string; color: string }> = {
      trump: { label: "Trump Tweet Detected!", labelKr: "🔥 트럼프 발언 감지!", color: "orange" },
      cpi: { label: "CPI Data Released!", labelKr: "📊 CPI 데이터 발표!", color: "red" },
      pump: { label: "Musk Pump Alert!", labelKr: "🚀 머스크 펌프 알림!", color: "cyan" },
      war: { label: "Geopolitical Alert!", labelKr: "⚔️ 지정학적 이슈 발생!", color: "amber" },
    };

    const config = eventConfig[type] || { label: `${type} Alert`, labelKr: `${type} 알림`, color: "blue" };

    const newEvent: ChartEvent = {
      id: `${Date.now()}-${type}`,
      type,
      label: config.label,
      labelKr: config.labelKr,
      color: config.color,
      timestamp: new Date(),
      severity: "high",
      dismissable: true,
    };

    setChartEvents(prev => [...prev, newEvent]);
    setTimeout(() => {
      setChartEvents(prev => prev.filter(e => e.id !== newEvent.id));
    }, 10000);

    handleTrigger(type);
  }, [handleTrigger]);

  const dismissEvent = useCallback((id: string) => {
    setChartEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <div className="w-full h-full flex gap-3">
      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        {/* Chart Widget - 65% */}
        <div className="flex-[6.5] min-h-0 border border-foreground/10 rounded-xl bg-foreground/5 backdrop-blur-md overflow-hidden shadow-xl relative">
          {/* Event Control Panel */}
          <div className="absolute top-2 left-2 z-30">
            <VolatilityControlPanel onTrigger={handleEventTrigger} />
          </div>

          {/* Chart Events Overlay */}
          <ChartEventOverlay events={chartEvents} onDismiss={dismissEvent} />

          {/* Chart */}
          <div className="h-full w-full bg-background">
            <MainChart />
          </div>
        </div>

        {/* Bottom Row - 35% */}
        <div className="flex-[3.5] min-h-0 flex gap-3">
          {/* Social Feed Widget */}
          <div className="flex-1 border border-foreground/10 rounded-xl bg-foreground/5 backdrop-blur-md overflow-hidden shadow-xl flex flex-col p-3">
            <SocialFeed maxPosts={10} showHeader={true} />
          </div>

          {/* Event Archive Widget */}
          <div className="flex-1 border border-foreground/10 rounded-xl bg-foreground/5 backdrop-blur-md overflow-hidden shadow-xl flex flex-col p-3">
            <EventArchive maxEvents={10} showHeader={true} compact={true} />
          </div>

          {/* Calendar Widget */}
          <div className="flex-1 border border-foreground/10 rounded-xl bg-foreground/5 backdrop-blur-md overflow-hidden shadow-xl flex flex-col p-3">
            <MarketCalendar useRealData={true} maxEvents={5} />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Chat */}
      <div className="w-[360px] xl:w-[400px] shrink-0 border border-foreground/10 rounded-xl bg-foreground/5 backdrop-blur-md overflow-hidden shadow-xl">
        <ChatRoom className="h-full border-none rounded-none" />
      </div>
    </div>
  );
};
