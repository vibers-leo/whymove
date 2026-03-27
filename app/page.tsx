"use client";

import React from "react";
import { LiveTicker } from "@/components/ui/live-ticker";
import { Header } from "@/components/layout/header";
import { DraggableDashboard } from "@/components/dashboard/draggable-dashboard";

export default function Home() {
  // 정적 티커 데이터
  const tickerItems = [
    { symbol: "BTC/USDT", price: "98,420", change: "+4.2%", isUp: true, tvSymbol: "BINANCE:BTCUSDT" },
    { symbol: "ETH/USDT", price: "2,850", change: "+1.2%", isUp: true, tvSymbol: "BINANCE:ETHUSDT" },
    { symbol: "SOL/USDT", price: "145", change: "-0.5%", isUp: false, tvSymbol: "BINANCE:SOLUSDT" },
    { symbol: "BNB/USDT", price: "620", change: "+0.8%", isUp: true, tvSymbol: "BINANCE:BNBUSDT" },
    { symbol: "XRP/USDT", price: "1.20", change: "-2.1%", isUp: false, tvSymbol: "BINANCE:XRPUSDT" },
  ];

  const handleTrigger = async (type: string) => {
    let alertText = "";
    let side: "bull" | "bear" = "bull";

    switch (type) {
      case "trump":
        alertText = "트럼프가 비트코인 지지 발언을 했습니다";
        side = "bull";
        break;
      case "cpi":
        alertText = "CPI 데이터: 예상보다 높은 인플레이션";
        side = "bear";
        break;
      case "pump":
        alertText = "머스크가 DOGE 심볼로 바이오를 변경했습니다";
        side = "bull";
        break;
    }

    // TODO: 실시간 백엔드 연동 시 이벤트 전송 구현
    console.log("[Trigger]", { type, alertText, side });
  };

  return (
    <main className="min-h-[100dvh] w-full bg-background relative overflow-hidden text-foreground font-sans flex flex-col">
      <Header />

      {/* 배경 — 그래디언트 메시 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 에메랄드 앰비언트 */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/[0.02] rounded-full blur-[128px]" />
        {/* 미묘한 그리드 */}
        <div className="absolute inset-0 dark:bg-grid-white bg-grid-black opacity-40" />
        {/* 비네트 마스크 */}
        <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_20%,black)]" />
      </div>

      <div className="relative z-10 flex flex-col h-[100dvh] pt-14">
        {/* 티커 — 유리 효과 */}
        <div className="w-full border-b border-white/[0.04] bg-background/40 backdrop-blur-xl h-11 flex-none z-20 flex items-center">
          <LiveTicker items={tickerItems} speed="normal" />
        </div>

        {/* 메인 대시보드 */}
        <div className="flex-1 w-full max-w-[1920px] mx-auto p-3 overflow-hidden">
          <DraggableDashboard handleTrigger={handleTrigger} />
        </div>
      </div>
    </main>
  );
}
