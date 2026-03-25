"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";

export const MainChart = memo(({ symbol = "BINANCE:BTCUSDT" }: { symbol?: string }) => {
  const container = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    if (!container.current) return;

    // Clean up previous script if any
    container.current.innerHTML = '';

    const currentTheme = resolvedTheme === "dark" ? "dark" : "light";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${symbol}",
        "interval": "15",
        "timezone": "Asia/Seoul",
        "theme": "${currentTheme}",
        "style": "1",
        "locale": "ko",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "save_image": false,
        "container_id": "tradingview_chart",
        "hide_side_toolbar": false,
        "withdateranges": true,
        "details": false,
        "hotlist": false,
        "calendar": false,
        "show_popup_button": true,
        "popup_width": "1000",
        "popup_height": "650",
        "support_host": "https://www.tradingview.com"
      }`;
    container.current.appendChild(script);
  }, [symbol, resolvedTheme]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-foreground/10 shadow-xl bg-background" ref={container}>
      <div className="tradingview-widget-container" style={{ height: "100%", width: "100%" }}>
        <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
        <div className="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span className="blue-text text-xs opacity-50">Track all markets on TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
});

MainChart.displayName = "MainChart";
