"use client";

import React, { useState, useCallback } from "react";
import { MainChart } from "@/components/chart/main-chart";
import { ChatRoom } from "@/components/community/chat-room";
import { SocialFeed } from "@/components/feed/social-feed";
import { MarketCalendar } from "@/components/ui/market-calendar";
import { VolatilityControlPanel, ChartEventOverlay, ChartEvent } from "@/components/chart/volatility-control-panel";

interface DashboardProps {
  handleTrigger: (type: "trump" | "cpi" | "war" | "pump") => void;
}

export const DraggableDashboard = ({
  handleTrigger,
}: DashboardProps) => {
  const [chartEvents, setChartEvents] = useState<ChartEvent[]>([]);

  const handleEventTrigger = useCallback((type: "trump" | "cpi" | "war" | "pump") => {
    const newEvent: ChartEvent = {
      id: `${Date.now()}-${type}`,
      type: type as "trump" | "cpi" | "pump",
      label: type === "trump" 
        ? "🔥 Trump Tweet Detected!" 
        : type === "cpi" 
          ? "📊 CPI Data Released!" 
          : "🚀 Musk Pump Alert!",
      color: type === "trump" ? "orange" : type === "cpi" ? "red" : "cyan",
      timestamp: new Date(),
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
        {/* Chart Widget - 70% */}
        <div className="flex-[7] min-h-0 border border-foreground/10 rounded-xl bg-foreground/5 backdrop-blur-md overflow-hidden shadow-xl relative">
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

        {/* Bottom Row - 30% */}
        <div className="flex-[3] min-h-0 flex gap-3">
          {/* Social Feed Widget - Real-time posts from influencers */}
          <div className="flex-1 border border-foreground/10 rounded-xl bg-foreground/5 backdrop-blur-md overflow-hidden shadow-xl flex flex-col p-3">
            <SocialFeed maxPosts={10} showHeader={true} />
          </div>

          {/* Calendar Widget - Now with real data */}
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
