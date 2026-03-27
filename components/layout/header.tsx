"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { User, LogOut, Settings, Activity } from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { PushNotificationManager } from "@/components/notification/push-notification";
import Link from "next/link";

export function Header() {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const displayName = user?.displayName || "Trader";
  const photoURL = user?.photoURL;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-4 md:px-6">
        {/* 글래스 배경 */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border-b border-white/[0.04]" />

        <div className="relative z-10 flex items-center justify-between w-full max-w-[1920px] mx-auto">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-zinc-950 text-sm transition-transform duration-300 group-hover:scale-105">
              W
              <div className="absolute inset-0 rounded-lg bg-emerald-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-foreground hidden md:block">
                WhyMove
              </span>
              <div className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                <Activity size={10} className="text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
              </div>
            </div>
          </Link>

          {/* 우측 액션 */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <PushNotificationManager />

            {/* 유저 메뉴 */}
            {user ? (
              <div className="relative group">
                <button
                  className="flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="text-sm font-medium text-foreground/80 hidden md:block">
                    {displayName}
                  </span>
                  {photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoURL} alt="프로필" className="w-7 h-7 rounded-full border border-white/10" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <User size={14} />
                    </div>
                  )}
                </button>

                {/* 드롭다운 */}
                <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl overflow-hidden hidden group-hover:block hover:block">
                  <div className="px-4 py-3 border-b border-white/[0.04]">
                    <p className="text-sm text-foreground font-bold truncate">{displayName}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-foreground/70 hover:bg-white/[0.04] flex items-center gap-2 transition-colors">
                    <User size={14} /> 마이페이지
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-foreground/70 hover:bg-white/[0.04] flex items-center gap-2 transition-colors">
                    <Settings size={14} /> 설정
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors border-t border-white/[0.04]"
                  >
                    <LogOut size={14} /> 로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 bg-emerald-500 text-zinc-950 text-sm font-bold rounded-lg hover:bg-emerald-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
