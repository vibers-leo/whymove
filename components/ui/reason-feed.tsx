import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Activity, Flame } from "lucide-react";

export type Reason = {
  id: string;
  title: string;
  url: string;
  sentiment: "bullish" | "bearish" | "neutral";
  timestamp: string;
  tags: string[];
  impact: "high" | "medium" | "low";
  votes: number;
};

export function ReasonFeed({ reasons }: { reasons: Reason[] }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {reasons.map((reason) => (
        <ReasonCard key={reason.id} reason={reason} />
      ))}
    </div>
  );
}

function ReasonCard({ reason }: { reason: Reason }) {
  const isBullish = reason.sentiment === "bullish";
  const isBearish = reason.sentiment === "bearish";
  const [votes, setVotes] = useState(reason.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleUrlClick = () => {
    if (reason.url) {
      window.open(reason.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasVoted) {
      setVotes(v => v + 1);
      setHasVoted(true);
    } else {
      setVotes(v => v - 1);
      setHasVoted(false);
    }
  };

  return (
    <div
      onClick={handleUrlClick}
      className="group relative overflow-hidden rounded-lg glass-card p-3 cursor-pointer active:scale-[0.99] transition-all duration-200"
    >
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-0.5 transition-colors",
          isBullish ? "bg-emerald-500" : isBearish ? "bg-red-400" : "bg-zinc-500"
        )}
      />

      <div className="relative z-10 flex flex-col gap-2 pl-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-foreground/30 font-mono tabular-nums">
            {reason.timestamp}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleVote}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all border",
                hasVoted
                  ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                  : "bg-white/[0.02] text-foreground/30 border-transparent hover:bg-white/[0.04] hover:text-foreground/50"
              )}
            >
              <Flame size={10} /> {votes}
            </button>
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider",
                isBullish
                  ? "bg-emerald-500/10 text-emerald-400"
                  : isBearish
                  ? "bg-red-500/10 text-red-400"
                  : "bg-zinc-500/10 text-zinc-400"
              )}
            >
              {reason.sentiment.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <h3 className="font-bold text-foreground/80 text-sm leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2 break-keep-all">
            {reason.title}
          </h3>
          <Activity size={14} className="text-foreground/10 group-hover:text-emerald-400 transition-all shrink-0" />
        </div>

        <div className="flex flex-wrap gap-1.5 mt-1">
          {reason.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-foreground/30 border border-white/[0.06] rounded px-1.5 py-0.5 uppercase tracking-wider"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
