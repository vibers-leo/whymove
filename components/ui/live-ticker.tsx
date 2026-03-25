"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const LiveTicker = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  onSymbolSelect,
}: {
  items: {
    symbol: string;
    price: string;
    change: string;
    isUp: boolean;
    tvSymbol: string; // TradingView symbol
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  onSymbolSelect?: (symbol: string) => void;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const [start, setStart] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setStart(true));
  }, []);

  useEffect(() => {
    const getDirection = () => {
      if (containerRef.current) {
        if (direction === "left") {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "forwards"
          );
        } else {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "reverse"
          );
        }
      }
    };

    const getSpeed = () => {
      if (containerRef.current) {
        if (speed === "fast") {
          containerRef.current.style.setProperty("--animation-duration", "20s");
        } else if (speed === "normal") {
          containerRef.current.style.setProperty("--animation-duration", "40s");
        } else {
          containerRef.current.style.setProperty("--animation-duration", "80s");
        }
      }
    };

    if (containerRef.current && scrollerRef.current) {
      getDirection();
      getSpeed();
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap", // Increased gap
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {/* Render items twice to create seamless loop without losing event handlers on clones */}
        {[...items, ...items, ...items].map((item, idx) => (
          <li
            key={idx}
            className="w-auto max-w-full relative rounded-2xl flex-shrink-0"
          >
             <button
               onClick={() => onSymbolSelect?.(item.tvSymbol)}
               className="px-6 py-2 flex items-center space-x-3 bg-foreground/5 border border-foreground/10 rounded-2xl hover:bg-foreground/10 transition-colors cursor-pointer"
             >
                <div className="flex flex-col items-start">
                   <span className="font-bold text-foreground text-sm">{item.symbol}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-foreground/60 text-xs">{item.price}</span>
                   <span
                     className={cn(
                       "text-xs font-bold",
                       item.isUp ? "text-green-500" : "text-red-500"
                     )}
                   >
                     {item.change}
                   </span>
                </div>
             </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
