"use client";

import React from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { Spotlight } from "@/components/ui/spotlight";
import { LiveTicker } from "@/components/ui/live-ticker";
import { Header } from "@/components/layout/header";
import { supabase } from "@/lib/supabase";
import { DraggableDashboard } from "@/components/dashboard/draggable-dashboard";

export default function Home() {
  // Static ticker data
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
