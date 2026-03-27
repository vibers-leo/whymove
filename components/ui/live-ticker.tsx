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
    tvSymbol: string;
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
          containerRef.current.style.setProperty("--animation-direction", "forwards");
        } else {
          containerRef.current.style.setProperty("--animation-direction", "reverse");
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
        "scroller relative z-20 max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-6 py-2 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {[...items, ...items, ...items].map((item, idx) => (
          <li
            key={idx}
            className="w-auto max-w-full relative flex-shrink-0"
          >
            <button
              onClick={() => onSymbolSelect?.(item.tvSymbol)}
              className="flex items-center gap-3 px-3 py-1 rounded-md hover:bg-white/[0.04] transition-colors duration-200 cursor-pointer group"
            >
              <span className="font-bold text-foreground/80 text-xs tracking-wide group-hover:text-foreground transition-colors">
                {item.symbol}
              </span>
              <span className="text-foreground/40 text-xs font-mono">
                ${item.price}
              </span>
              <span
                className={cn(
                  "text-xs font-bold font-mono tabular-nums",
                  item.isUp ? "text-emerald-400" : "text-red-400"
                )}
              >
                {item.change}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
