"use client";

import { cn } from "@/lib/utils";
import { CalendarClock, Zap, Building2, User } from "lucide-react";

export type CalendarEvent = {
  id: string;
  date: string; // e.g., "Today", "Tomorrow", "Feb 24"
  time: string;
  title: string;
  category: "Gov" | "BigTech" | "Macro" | "Crypto";
  impact: "high" | "medium" | "low";
  description?: string;
};

export function MarketCalendar({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1 h-6 bg-purple-500 rounded-full" />
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
           Upcoming Scedule
           <span className="text-xs font-normal text-foreground/40 border border-foreground/10 px-2 py-0.5 rounded-full">KST (UTC+9)</span>
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} isLast={index === events.length - 1} />
        ))}
        {events.length === 0 && (
          <div className="text-foreground/40 text-center py-8 text-sm italic">
            No upcoming events scheduled.
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, isLast }: { event: CalendarEvent; isLast: boolean }) {
  const getIcon = () => {
    switch (event.category) {
      case "Gov": return <Building2 size={14} />;
      case "BigTech": return <Zap size={14} />;
      case "Macro": return <CalendarClock size={14} />;
      case "Crypto": return <User size={14} />; // Using User for influencers/figures for now
      default: return <CalendarClock size={14} />;
    }
  };

  const getColor = () => {
    switch (event.category) {
      case "Gov": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "BigTech": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "Macro": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Crypto": return "text-cyan-500 bg-cyan-500/10 border-cyan-500/20";
      default: return "text-foreground/40 bg-foreground/5 border-foreground/10";
    }
  };

  return (
    <div className="relative pl-6">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-[-12px] w-[2px] bg-foreground/10" />
      )}
      
      {/* Timeline Dot */}
      <div className={cn(
        "absolute left-0 top-3 w-[24px] h-[24px] rounded-full flex items-center justify-center border bg-background z-10",
        getColor()
      )}>
        {getIcon()}
      </div>

      <div className="group rounded-xl border border-foreground/10 bg-foreground/5 p-4 hover:bg-foreground/10 transition-colors backdrop-blur-sm">
        <div className="flex items-start justify-between">
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold text-purple-500">{event.date}</span>
                 <span className="text-xs text-foreground/20">|</span>
                 <span className="text-xs font-mono text-foreground/40">{event.time}</span>
              </div>
              <h3 className="text-foreground/90 font-bold text-sm leading-snug group-hover:text-purple-500 transition-colors">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-xs text-foreground/40 mt-1 line-clamp-1">{event.description}</p>
              )}
           </div>

           <span className={cn(
              "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border",
              event.impact === 'high' ? "border-red-500/20 text-red-500 shadow-[0_0_8px_-2px_rgba(239,68,68,0.3)]" : 
              event.impact === 'medium' ? "border-yellow-500/20 text-yellow-500" :
              "border-foreground/10 text-foreground/30"
           )}>
             {event.impact}
           </span>
        </div>
      </div>
    </div>
  );
}
