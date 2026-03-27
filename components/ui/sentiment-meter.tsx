"use client";

import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

type SentimentMeterProps = {
  bullish: number;
  bearish: number;
  className?: string;
};

export function SentimentMeter({ bullish, bearish, className }: SentimentMeterProps) {
  const total = bullish + bearish;
  const bullPercentage = Math.round((bullish / total) * 100) || 50;

  return (
    <div className={cn("flex items-center gap-3 w-full max-w-md", className)}>
      {/* 베어리시 */}
      <div className="flex items-center gap-2">
        <div className="bg-red-500/10 p-1.5 rounded-lg border border-red-500/20 text-red-400">
          <ArrowDown size={14} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-foreground/30 uppercase font-bold tracking-wider">Bearish</span>
          <span className="text-sm font-bold text-red-400 tabular-nums">{100 - bullPercentage}%</span>
        </div>
      </div>

      {/* 바 */}
      <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden relative">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500/80 to-red-400/80 transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${100 - bullPercentage}%` }}
        />
        <div
          className="absolute inset-y-0 right-0 bg-gradient-to-l from-emerald-500/80 to-emerald-400/80 transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${bullPercentage}%` }}
        />
        {/* 인디케이터 */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/60 z-10 transition-all duration-1000 ease-out"
          style={{ left: `${100 - bullPercentage}%` }}
        />
      </div>

      {/* 불리시 */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-foreground/30 uppercase font-bold tracking-wider">Bullish</span>
          <span className="text-sm font-bold text-emerald-400 tabular-nums">{bullPercentage}%</span>
        </div>
        <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 text-emerald-400">
          <ArrowUp size={14} />
        </div>
      </div>
    </div>
  );
}
