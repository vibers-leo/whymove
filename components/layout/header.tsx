"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Bell, User, LogOut, Settings } from "lucide-react";
import { LoginModal } from "@/components/auth/login-modal";
import { getAuth, signOut } from "firebase/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNewNews, setHasNewNews] = useState(true); // Simulated "new news" state

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/50 backdrop-blur-md border-b border-foreground/10 z-50 flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-[0_0_15px_rgba(6,182,212,0.5)]">
             W
           </div>
           <span className="font-bold text-lg tracking-tight text-foreground hidden md:block">
             WhyMove
           </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
           {/* Theme Toggle */}
           <ThemeToggle />

           {/* News Notification */}
           <button 
             className="relative p-2 text-neutral-400 hover:text-foreground transition-colors"
             onClick={() => setHasNewNews(false)}
             title="News Alerts"
           >
             <Bell size={20} />
             {hasNewNews && (
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
             )}
           </button>


           {/* User Menu */}
           {user ? (
             <div className="relative group">
                <button 
                  className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                   <span className="text-sm font-medium text-neutral-200 hidden md:block ml-2">
                     {user.displayName || "Trader"}
                   </span>
                   {user.photoURL ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/20" />
                   ) : (
                     <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                        <User size={16} />
                     </div>
                   )}
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-foreground/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block hover:block animation-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-foreground/10">
                       <p className="text-sm text-foreground font-bold truncate">{user.displayName || "Unknown"}</p>
                       <p className="text-xs text-foreground/50 truncate">{user.email}</p>
                    </div>
                    <button className="w-full text-left px-4 py-3 text-sm text-foreground/70 hover:bg-foreground/5 flex items-center gap-2 transition-colors">
                       <User size={14} /> My Page
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm text-foreground/70 hover:bg-foreground/5 flex items-center gap-2 transition-colors">
                       <Settings size={14} /> Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors border-t border-foreground/10"
                    >
                       <LogOut size={14} /> Sign Out
                    </button>
                </div>
             </div>
           ) : (
             <button 
               onClick={() => setIsLoginModalOpen(true)}
               className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
             >
               Sign In
             </button>
           )}
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
