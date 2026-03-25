"use client";

import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

type SentimentMeterProps = {
  bullish: number; // 0-100
  bearish: number; // 0-100
  className?: string;
};

export function SentimentMeter({ bullish, bearish, className }: SentimentMeterProps) {
  const total = bullish + bearish;
  const bullPercentage = Math.round((bullish / total) * 100) || 50;
  
  return (
    <div className={cn("flex items-center gap-3 w-full max-w-md", className)}>
      {/* Bearish Side */}
      <div className="flex items-center gap-2">
        <div className="bg-red-500/10 p-1.5 rounded-lg border border-red-500/20 text-red-500">
           <ArrowDown size={14} />
        </div>
        <div className="flex flex-col">
           <span className="text-[10px] text-neutral-500 uppercase font-bold">Bearish</span>
           <span className="text-sm font-bold text-red-500">{100 - bullPercentage}%</span>
        </div>
      </div>

      {/* Bar */}
      <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden relative">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-500 transition-all duration-1000 ease-out"
          style={{ width: `${100 - bullPercentage}%` }}
        />
        <div 
          className="absolute inset-y-0 right-0 bg-gradient-to-l from-green-600 to-green-500 transition-all duration-1000 ease-out"
          style={{ width: `${bullPercentage}%` }}
        />
        {/* Indicator Line */}
        <div 
           className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10 transition-all duration-1000 ease-out"
           style={{ left: `${100 - bullPercentage}%` }}
        />
      </div>

      {/* Bullish Side */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end">
           <span className="text-[10px] text-neutral-500 uppercase font-bold">Bullish</span>
           <span className="text-sm font-bold text-green-500">{bullPercentage}%</span>
        </div>
        <div className="bg-green-500/10 p-1.5 rounded-lg border border-green-500/20 text-green-500">
           <ArrowUp size={14} />
        </div>
      </div>
    </div>
  );
}
