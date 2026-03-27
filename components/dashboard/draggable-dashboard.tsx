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
        ? "트럼프 트윗 감지"
        : type === "cpi"
          ? "CPI 데이터 발표"
          : "머스크 펌프 알림",
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
    <div className="w-full h-full flex gap-2.5">
      {/* 좌측 컬럼 */}
      <div className="flex-1 flex flex-col gap-2.5 min-w-0">
        {/* 차트 위젯 — 70% */}
        <div className="flex-[7] min-h-0 glass-card rounded-xl overflow-hidden relative">
          {/* 이벤트 컨트롤 패널 */}
          <div className="absolute top-2 left-2 z-30">
            <VolatilityControlPanel onTrigger={handleEventTrigger} />
          </div>

          {/* 차트 이벤트 오버레이 */}
          <ChartEventOverlay events={chartEvents} onDismiss={dismissEvent} />

          {/* 차트 */}
          <div className="h-full w-full bg-background">
            <MainChart />
          </div>
        </div>

        {/* 하단 행 — 30% */}
        <div className="flex-[3] min-h-0 flex gap-2.5">
          {/* 소셜 피드 위젯 */}
          <div className="flex-1 glass-card rounded-xl overflow-hidden flex flex-col p-3">
            <SocialFeed maxPosts={10} showHeader={true} />
          </div>

          {/* 캘린더 위젯 */}
          <div className="flex-1 glass-card rounded-xl overflow-hidden flex flex-col p-3">
            <MarketCalendar useRealData={true} maxEvents={5} />
          </div>
        </div>
      </div>

      {/* 우측 컬럼 — 채팅 */}
      <div className="w-[360px] xl:w-[400px] shrink-0 glass-card rounded-xl overflow-hidden">
        <ChatRoom className="h-full border-none rounded-none" />
      </div>
    </div>
  );
};
