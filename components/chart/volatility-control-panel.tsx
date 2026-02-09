"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, TrendingUp, Zap, Radio, GripVertical, X } from "lucide-react";

interface VolatilityControlPanelProps {
  onTrigger: (type: "trump" | "cpi" | "war" | "pump") => void;
  className?: string;
}

// Event type for chart overlay
export interface ChartEvent {
  id: string;
  type: "trump" | "cpi" | "pump";
  label: string;
  color: string;
  timestamp: Date;
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
        "relative flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-foreground/10 bg-background text-foreground/70 text-xs font-medium transition-all group overflow-hidden",
        "hover:border-foreground/30 hover:text-foreground hover:scale-105 active:scale-95"
      )}
    >
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity", color)} />
      <Icon className={cn("w-3 h-3", color.replace("bg-", "text-"))} />
      <span>{label}</span>
      <div className="absolute inset-0 rounded-lg ring-1 ring-foreground/5 group-hover:ring-foreground/10" />
    </button>
  );
};

export const VolatilityControlPanel = ({ onTrigger, className }: VolatilityControlPanelProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="p-2 bg-background/80 backdrop-blur border border-foreground/10 rounded-lg hover:bg-foreground/10 transition-colors"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <Radio className="w-4 h-4 text-red-500 animate-pulse" />
      </button>
    );
  }

  return (
    <div 
      ref={panelRef}
      className={cn(
        "flex gap-2 items-center p-2 bg-background/90 backdrop-blur-md border border-foreground/10 rounded-xl shadow-lg",
        isDragging && "cursor-grabbing opacity-80",
        className
      )}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {/* Drag Handle */}
      <div 
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-foreground/10 rounded transition-colors"
        onMouseDown={handleDragStart}
      >
        <GripVertical className="w-4 h-4 text-foreground/30" />
      </div>

      <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
        <Radio className="w-3 h-3 text-red-500 animate-pulse" />
        Event
      </span>
      
      <TriggerButton 
        label="Trump" 
        icon={AlertTriangle} 
        color="bg-orange-500" 
        onClick={() => onTrigger("trump")} 
      />
      <TriggerButton 
        label="CPI" 
        icon={TrendingUp} 
        color="bg-red-500" 
        onClick={() => onTrigger("cpi")} 
      />
      <TriggerButton 
        label="Musk" 
        icon={Zap} 
        color="bg-cyan-500" 
        onClick={() => onTrigger("pump")} 
      />

      {/* Minimize Button */}
      <button
        onClick={() => setIsMinimized(true)}
        className="p-1 hover:bg-foreground/10 rounded transition-colors ml-1"
      >
        <X className="w-3 h-3 text-foreground/30" />
      </button>
    </div>
  );
};

// Chart Event Overlay Component - displays triggered events on the chart
export const ChartEventOverlay = ({ events, onDismiss }: { 
  events: ChartEvent[]; 
  onDismiss: (id: string) => void;
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {events.map((event, index) => (
        <div
          key={event.id}
          className={cn(
            "absolute right-4 pointer-events-auto animate-in slide-in-from-right-full fade-in duration-500",
            "flex items-center gap-2 px-4 py-2 rounded-lg border shadow-lg backdrop-blur-md",
            event.type === "trump" && "bg-orange-500/20 border-orange-500/50 text-orange-300",
            event.type === "cpi" && "bg-red-500/20 border-red-500/50 text-red-300",
            event.type === "pump" && "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
          )}
          style={{ top: `${60 + index * 60}px` }}
        >
          {event.type === "trump" && <AlertTriangle className="w-5 h-5" />}
          {event.type === "cpi" && <TrendingUp className="w-5 h-5" />}
          {event.type === "pump" && <Zap className="w-5 h-5" />}
          <div className="flex flex-col">
            <span className="text-sm font-bold">{event.label}</span>
            <span className="text-xs opacity-70">
              {event.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <button 
            onClick={() => onDismiss(event.id)}
            className="ml-2 p-1 hover:bg-white/10 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
