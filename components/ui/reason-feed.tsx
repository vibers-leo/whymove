import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

export type Reason = {
  id: string;
  title: string;
  url: string; 
  sentiment: "bullish" | "bearish" | "neutral";
  timestamp: string;
  tags: string[];
  impact: "high" | "medium" | "low";
  votes: number; // New field
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
    e.stopPropagation(); // Prevent card click
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
      className="group relative overflow-hidden rounded-lg border border-foreground/10 bg-foreground/5 p-3 hover:border-foreground/20 transition-colors backdrop-blur-sm cursor-pointer active:scale-[0.99]"
    >
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 transition-colors",
          isBullish ? "bg-green-500" : isBearish ? "bg-red-500" : "bg-blue-500"
        )}
      />

      <div className="relative z-10 flex flex-col gap-2 pl-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-foreground/40 font-mono">
            {reason.timestamp}
          </span>
          <div className="flex items-center gap-2">
             <button
                onClick={handleVote}
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all border",
                  hasVoted 
                    ? "bg-orange-500/20 text-orange-500 border-orange-500/50 shadow-[0_0_10px_-4px_rgba(251,146,60,0.5)]" 
                    : "bg-foreground/5 text-foreground/40 border-transparent hover:bg-foreground/10 hover:text-foreground/60"
                )}
             >
               🔥 {votes}
             </button>
             <div
               className={cn(
                 "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider",
                 isBullish
                   ? "bg-green-500/10 text-green-500"
                   : isBearish
                   ? "bg-red-500/10 text-red-500"
                   : "bg-blue-500/10 text-blue-500"
               )}
             >
               {reason.sentiment.toUpperCase()}
             </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-4">
           <h3 className="font-bold text-foreground/90 text-sm leading-snug group-hover:text-cyan-500 transition-colors line-clamp-2">
            {reason.title}
           </h3>
           <Activity size={14} className="text-foreground/20 group-hover:text-cyan-500 transition-all shrink-0" />
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          {reason.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-foreground/40 border border-foreground/10 rounded px-1.5 py-0.5 uppercase tracking-wider"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
