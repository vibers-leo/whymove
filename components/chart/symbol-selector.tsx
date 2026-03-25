"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SymbolSelectorProps {
  currentSymbol: string;
  onSelect: (symbolId: string) => void;
  symbols: { id: string; name: string; price: number }[];
}

export const SymbolSelector = ({ currentSymbol, onSelect, symbols }: SymbolSelectorProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-background hover:bg-foreground/5 border border-foreground/10 rounded text-foreground/70 text-sm font-medium transition-colors"
      >
        <span className="text-emerald-500 font-bold">●</span> {/* Live Indicator */}
        {currentSymbol}
        <ChevronDown className="w-4 h-4 text-foreground/40" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-foreground/10 rounded shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {symbols.map((sym) => (
            <button
              key={sym.id}
              onClick={() => {
                onSelect(sym.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm hover:bg-foreground/5 transition-colors flex justify-between items-center",
                currentSymbol === sym.id ? "text-cyan-500 bg-cyan-500/10 font-bold" : "text-foreground/70"
              )}
            >
              <span>{sym.id}</span>
              {/* <span className="text-xs text-foreground/40">{sym.name}</span> */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
