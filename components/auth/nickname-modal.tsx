"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase";
import { UserCheck } from "lucide-react";

interface NicknameModalProps {
  isOpen: boolean;
  onComplete: (nickname: string) => void;
}

export function NicknameModal({ isOpen, onComplete }: NicknameModalProps) {
  const { user } = useAuth();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    if (nickname.length > 12) {
        setError("Nickname too long (max 12 chars)");
        return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          nickname: nickname,
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          updated_at: new Date().toISOString(),
        });

      if (upsertError) {
        if (upsertError.code === '23505') {
          setError("This nickname is already taken.");
        } else {
          throw upsertError;
        }
        return;
      }

      // Save to local storage as backup/cache
      localStorage.setItem("whymove_nickname", nickname);
      
      onComplete(nickname);
    } catch (err) {
      console.error("Error saving nickname:", err);
      setError("Failed to save. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-background border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-cyan-500/10 blur-[50px] rounded-full" />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-2">
                <UserCheck size={32} className="text-cyan-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground">Choose Identity</h2>
            <p className="text-foreground/60 text-sm">
                How should we call you in the chat? <br/>
                <span className="text-xs opacity-70">(This will be your trading alias)</span>
            </p>

            <form onSubmit={handleSubmit} className="w-full mt-2 space-y-3">
                <div className="relative">
                    <input 
                        type="text" 
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Ex: CryptoKing"
                        className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-cyan-500 transition-colors text-center font-bold"
                        autoFocus
                    />
                </div>
                
                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

                <button 
                    type="submit" 
                    disabled={loading || !nickname.trim()}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-background font-bold py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Registering..." : "Enter Market"}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
