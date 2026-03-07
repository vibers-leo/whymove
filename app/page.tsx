"use client";

import React from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { Spotlight } from "@/components/ui/spotlight";
import { LiveTicker } from "@/components/ui/live-ticker";
import { Header } from "@/components/layout/header";
import { supabase } from "@/lib/supabase";
import { DraggableDashboard } from "@/components/dashboard/draggable-dashboard";

export default function Home() {
  // Ticker items: US futures + crypto futures (core niche)
  const tickerItems = [
    // US Stock Futures
    { symbol: "S&P 500", price: "—", change: "—", isUp: true, tvSymbol: "CME_MINI:ES1!" },
    { symbol: "NASDAQ", price: "—", change: "—", isUp: true, tvSymbol: "CME_MINI:NQ1!" },
    { symbol: "DOW", price: "—", change: "—", isUp: true, tvSymbol: "CBOT_MINI:YM1!" },
    // Crypto
    { symbol: "BTC/USDT", price: "—", change: "—", isUp: true, tvSymbol: "BINANCE:BTCUSDT" },
    { symbol: "ETH/USDT", price: "—", change: "—", isUp: true, tvSymbol: "BINANCE:ETHUSDT" },
    // Commodities
    { symbol: "Gold", price: "—", change: "—", isUp: true, tvSymbol: "COMEX:GC1!" },
    { symbol: "Crude Oil", price: "—", change: "—", isUp: false, tvSymbol: "NYMEX:CL1!" },
    // VIX (fear gauge)
    { symbol: "VIX", price: "—", change: "—", isUp: false, tvSymbol: "TVC:VIX" },
  ];

  const handleTrigger = async (type: string) => {
    let alertText = "";
    let side: "bull" | "bear" = "bull";
    
    switch (type) {
      case "trump":
        alertText = "🚨 ALERT: Donald Trump just tweeted about Bitcoin Support!";
        side = "bull";
        break;
      case "cpi":
        alertText = "📊 MARKET IMPACT: CPI Data shows higher inflation than expected.";
        side = "bear";
        break;
      case "pump":
        alertText = "🚀 WHALE ALERT: Elon Musk updated his Bio with DOGE symbol!";
        side = "bull";
        break;
      case "war":
        alertText = "⚔️ GEOPOLITICAL ALERT: Major escalation detected - Oil & Gold surging, equities dropping!";
        side = "bear";
        break;
    }

    try {
      // Insert into chat
      await supabase.from('messages').insert({
        type: "alert",
        user_nickname: "SYSTEM",
        text: alertText,
        side: side,
      });

      // Also insert into social_posts for the feed
      await supabase.from('social_posts').insert({
        platform: type === "trump" ? "truth_social" : "twitter",
        author_handle: type === "trump" ? "realDonaldTrump" : "elonmusk",
        author_name: type === "trump" ? "Donald Trump" : "Elon Musk",
        content: alertText,
        content_translated: alertText,
        impact_level: "high",
        sentiment: side === "bull" ? "bullish" : "bearish",
        keywords: type === "trump" ? ["bitcoin", "trump"] : type === "cpi" ? ["cpi", "inflation"] : ["doge", "musk"],
        author_verified: true,
      });
    } catch (err) {
      console.error("Failed to trigger event:", err);
    }
  };

  return (
    <main className="h-screen w-full bg-background relative overflow-hidden text-foreground font-sans selection:bg-cyan-500/30 flex flex-col transition-colors duration-300">
      <Header />
      
      {/* Background with lower z-index */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <GridBackground className="h-full w-full opacity-40" />
         <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 text-cyan-500/10" fill="currentColor" />
      </div>

      <div className="relative z-10 flex flex-col h-full pt-16">
          {/* Ticker - Compact height */}
          <div className="w-full border-b border-foreground/5 bg-background/40 backdrop-blur-md h-12 flex-none z-20 flex items-center">
             <LiveTicker items={tickerItems} speed="normal" />
          </div>

          {/* Main Dashboard - Fixed height, no scroll */}
          <div className="flex-1 w-full max-w-[1920px] mx-auto p-3 overflow-hidden">
             <DraggableDashboard handleTrigger={handleTrigger} />
          </div>
      </div>
    </main>
  );
}
