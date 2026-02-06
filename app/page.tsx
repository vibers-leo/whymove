"use client";

import React, { useState } from "react";
import { GridBackground } from "@/components/ui/grid-background";
import { Spotlight } from "@/components/ui/spotlight";
import { LiveTicker } from "@/components/ui/live-ticker";
import { ReasonFeed, Reason } from "@/components/ui/reason-feed";
import { MainChart } from "@/components/chart/main-chart";
import { ChatRoom } from "@/components/community/chat-room";
import { Header } from "@/components/layout/header";
import { MarketCalendar, CalendarEvent } from "@/components/ui/market-calendar";

export default function Home() {
  // Static ticker data
  const tickerItems = [
    { symbol: "BTC/USDT", price: "98,420", change: "+4.2%", isUp: true, tvSymbol: "BINANCE:BTCUSDT" },
    { symbol: "ETH/USDT", price: "2,850", change: "+1.2%", isUp: true, tvSymbol: "BINANCE:ETHUSDT" },
    { symbol: "SOL/USDT", price: "145", change: "-0.5%", isUp: false, tvSymbol: "BINANCE:SOLUSDT" },
    { symbol: "BNB/USDT", price: "620", change: "+0.8%", isUp: true, tvSymbol: "BINANCE:BNBUSDT" },
    { symbol: "XRP/USDT", price: "1.20", change: "-2.1%", isUp: false, tvSymbol: "BINANCE:XRPUSDT" },
  ];

  // Placeholder for reasons (can be connected to an API later)
  // Placeholder for simulated AI crawled data
  const [reasons] = useState<Reason[]>([
    {
      id: "1",
      title: "Bitcoin Surges Past $98k as ETF Inflows Hit Record Highs",
      url: "https://www.coindesk.com/markets/2024/11/21/bitcoin-price-hits-record-high/",
      sentiment: "bullish",
      timestamp: "10 mins ago",
      tags: ["Bitcoin", "ETF"],
      impact: "high",
      votes: 1242
    },
    {
      id: "2",
      title: "Solana ETF Approval Odds Increase to 70%, Says Bloomberg Analyst",
      url: "https://cointelegraph.com/news/solana-etf-approval-odds-increase",
      sentiment: "bullish",
      timestamp: "35 mins ago",
      tags: ["Solana", "Regulation"],
      impact: "medium",
      votes: 856
    },
    {
      id: "3",
      title: "Fed Chair Powell Signals Rate Cuts May Be Delayed Until Late 2025",
      url: "https://www.cnbc.com/2024/11/20/fed-powell-rate-cuts.html",
      sentiment: "bearish",
      timestamp: "1 hour ago",
      tags: ["Macro", "Fed"],
      impact: "high",
      votes: 430
    }
  ]);

  // Static Calendar Data (Mock)
  const [calendarEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      date: "Today",
      time: "14:00 PM",
      title: "FOMC Meeting Minutes Release",
      category: "Macro",
      impact: "high",
      description: "Detailed release of the Fed's recent policy meeting."
    },
    {
      id: "2",
      date: "Today",
      time: "16:00 PM",
      title: "NVIDIA (NVDA) Q4 Earnings Call",
      category: "BigTech",
      impact: "high",
      description: "Market expects major volatility based on AI guidance."
    },
    {
      id: "3",
      date: "Tomorrow",
      time: "09:00 AM",
      title: "President Trump: White House Briefing",
      category: "Gov",
      impact: "medium",
      description: "Expected remarks on crypto regulation."
    },
    {
      id: "4",
      date: "Feb 24",
      time: "10:00 AM",
      title: "Vitalik Buterin Speech at ETH Denver",
      category: "Crypto",
      impact: "medium"
    }
  ]);

  return (
    <main className="h-screen w-full bg-background relative overflow-hidden text-foreground font-sans selection:bg-cyan-500/30 flex flex-col transition-colors duration-300">
      <Header />
      
      {/* Background with lower z-index */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <GridBackground className="h-full w-full opacity-40" />
         <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      </div>

      <div className="relative z-10 flex flex-col h-full pt-16">
          {/* Ticker - Reduced vertical padding */}
          <div className="w-full border-b border-foreground/5 bg-background/40 backdrop-blur-md h-10 flex-none z-20">
             <LiveTicker items={tickerItems} speed="normal" />
          </div>

          {/* Main Dashboard - Flex Layout for 100% height usage */}
          <div className="flex-1 w-full max-w-[1920px] mx-auto p-3 gap-3 flex flex-col lg:flex-row overflow-hidden">
            
            {/* LEFT COLUMN: Chart & Info */}
            <div className="flex-1 flex flex-col gap-3 min-w-0 h-full">
               
               {/* Top: Chart (Flex Grow) */}
                <div className="flex-1 min-h-0 border border-foreground/10 rounded-2xl bg-foreground/5 backdrop-blur-md relative overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />
                  <div className="h-full w-full rounded-xl bg-background flex flex-col">
                      <MainChart />
                  </div>
               </div>

               {/* Bottom: Drivers & Calendar (Fixed Height ~25-30%) */}
               <div className="h-[280px] flex gap-3 flex-none min-h-0">
                  {/* Drivers (Wider) */}
                  <div className="flex-[2] border border-foreground/10 rounded-2xl bg-foreground/5 backdrop-blur-md p-4 overflow-hidden flex flex-col">
                     <h2 className="text-sm font-bold text-neutral-100 mb-3 flex items-center gap-2 flex-none">
                        <span className="w-1 h-4 bg-cyan-500 rounded-full" />
                        Market Drivers
                     </h2>
                     <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        <ReasonFeed reasons={reasons} />
                     </div>
                  </div>

                  {/* Calendar (Narrower, Fixed) */}
                  <div className="flex-1 border border-foreground/10 rounded-2xl bg-foreground/5 backdrop-blur-md p-4 overflow-hidden flex flex-col min-w-[300px]">
                      <MarketCalendar events={calendarEvents} />
                  </div>
               </div>
            </div>

            {/* RIGHT COLUMN: Chat (Fixed Width ~350-400px) */}
            <div className="w-full lg:w-[380px] xl:w-[420px] flex-none border border-foreground/10 rounded-2xl bg-foreground/5 backdrop-blur-md overflow-hidden shadow-2xl h-full">
               <ChatRoom className="h-full" />
            </div>

          </div>
      </div>
    </main>
  );
}
