"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationPermission = "default" | "granted" | "denied";

interface PushNotificationManagerProps {
  className?: string;
}

// Extended alert types for futures/crypto traders
export type AlertType =
  | "trump"        // Trump/political statements
  | "cpi"          // CPI/economic data releases
  | "musk"         // Elon Musk/influencer activity
  | "general"      // General alerts
  | "volatility"   // Auto-detected volatility spike
  | "pre_event"    // Scheduled event countdown
  | "war"          // Geopolitical/war events
  | "whale"        // Large transactions
  | "liquidation"; // Mass liquidation events

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn("Push notifications not supported");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    } catch (err) {
      console.error("Failed to request notification permission:", err);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== "granted") {
        console.warn("Cannot send notification: permission not granted");
        return null;
      }

      try {
        const notification = new Notification(title, {
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: "whymove-alert",
          ...options,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        return notification;
      } catch (err) {
        console.error("Failed to send notification:", err);
        return null;
      }
    },
    [isSupported, permission]
  );

  // Send a volatility alert with extended types
  const sendVolatilityAlert = useCallback(
    (type: AlertType, message: string) => {
      const titles: Record<AlertType, string> = {
        trump: "🔥 트럼프 발언 감지!",
        cpi: "📊 경제지표 발표!",
        musk: "🚀 일론 머스크 트윗!",
        general: "⚡ 변동성 알림",
        volatility: "🚨 급변동 감지!",
        pre_event: "⏰ 이벤트 임박!",
        war: "⚔️ 지정학적 이슈!",
        whale: "🐋 고래 알림!",
        liquidation: "💥 대규모 청산!",
      };

      const title = titles[type] || titles.general;

      return sendNotification(title, {
        body: message,
        requireInteraction: type === "volatility" || type === "war" || type === "pre_event",
      });
    },
    [sendNotification]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    sendVolatilityAlert,
  };
}

// UI Component for enabling/disabling notifications
export function PushNotificationManager({ className }: PushNotificationManagerProps) {
  const { isSupported, permission, requestPermission } = usePushNotifications();
  const [isLoading, setIsLoading] = useState(false);

  if (!isSupported) {
    return null;
  }

  const handleEnable = async () => {
    setIsLoading(true);
    await requestPermission();
    setIsLoading(false);
  };

  if (permission === "granted") {
    return (
      <div className={cn("flex items-center gap-2 text-emerald-400 text-sm", className)}>
        <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Bell className="w-4 h-4" />
        </div>
        <span className="hidden sm:inline">알림 활성화됨</span>
        <Check className="w-4 h-4" />
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className={cn("flex items-center gap-2 text-red-400 text-sm", className)}>
        <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
          <BellOff className="w-4 h-4" />
        </div>
        <span className="hidden sm:inline text-xs">알림 차단됨</span>
        <X className="w-3 h-3" />
      </div>
    );
  }

  return (
    <button
      onClick={handleEnable}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
        "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400",
        "hover:bg-cyan-500/20 hover:border-cyan-500/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <Bell className={cn("w-4 h-4", isLoading && "animate-pulse")} />
      <span className="hidden sm:inline">{isLoading ? "요청 중..." : "알림 받기"}</span>
    </button>
  );
}

// Toast notification for in-app alerts
interface ToastProps {
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info" | "volatility";
  onClose: () => void;
}

export function Toast({ title, message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, type === "volatility" ? 10000 : 5000);
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const colors = {
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    error: "bg-red-500/10 border-red-500/30 text-red-400",
    info: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    volatility: "bg-orange-500/10 border-orange-500/30 text-orange-400 ring-1 ring-orange-500/20",
  };

  return (
    <div
      className={cn(
        "fixed top-20 right-4 z-50 p-4 rounded-xl border backdrop-blur-md shadow-lg",
        "animate-in slide-in-from-right-full fade-in duration-300",
        colors[type]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-bold text-sm">{title}</h4>
          <p className="text-xs opacity-80 mt-1">{message}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
