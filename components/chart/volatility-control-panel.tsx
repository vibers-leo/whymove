"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, TrendingUp, Zap, Radio } from "lucide-react";

interface VolatilityControlPanelProps {
  onTrigger: (type: "trump" | "cpi" | "war" | "pump") => void;
  className?: string;
}

const TriggerButton = ({ 
  onClick, 
  label, 
  icon: Icon, 
  color 
}: { 
  onClick: () => void; 
  label: string; 
  icon: React.ElementType; 
  color: string 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-foreground/10 bg-background text-foreground/70 text-sm font-medium transition-all group overflow-hidden",
        "hover:border-foreground/30 hover:text-foreground"
      )}
    >
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity", color)} />
      <Icon className={cn("w-4 h-4", color.replace("bg-", "text-"))} />
      <span>{label}</span>
      <div className="absolute inset-0 rounded-lg ring-1 ring-foreground/5 group-hover:ring-foreground/10" />
    </button>
  );
};

export const VolatilityControlPanel = ({ onTrigger, className }: VolatilityControlPanelProps) => {
  return (
    <div className={cn("flex gap-2 items-center p-2 bg-background/80 backdrop-blur border border-foreground/10 rounded-xl self-start", className)}>
      <span className="text-xs font-bold text-foreground/50 px-2 uppercase tracking-wider flex items-center gap-1">
        <Radio className="w-3 h-3 text-red-500 animate-pulse" />
        Inject Event:
      </span>
      
      <TriggerButton 
        label="Trump Tweet" 
        icon={AlertTriangle} 
        color="bg-orange-500" 
        onClick={() => onTrigger("trump")} 
      />
      <TriggerButton 
        label="CPI Release" 
        icon={TrendingUp} 
        color="bg-red-500" 
        onClick={() => onTrigger("cpi")} 
      />
      <TriggerButton 
        label="Musk Pump" 
        icon={Zap} 
        color="bg-cyan-500" 
        onClick={() => onTrigger("pump")} 
      />
    </div>
  );
};
