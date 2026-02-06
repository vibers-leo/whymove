"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Send, User, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, push, serverTimestamp, query, limitToLast, orderByChild } from "firebase/database";
import { NicknameModal } from "@/components/auth/nickname-modal";
import { LoginModal } from "@/components/auth/login-modal";
import { useAuth } from "@/components/auth/auth-provider";
import { get, child } from "firebase/database";
export type MessageType = "chat" | "alert" | "donation";

export interface ChatMessage {
  id: string;
  type: MessageType;
  user?: string;
  photoURL?: string;
  text: string;
  timestamp: string | number;
  amount?: string;
  side?: "bull" | "bear";
  sentiment?: "bullish" | "bearish" | "neutral";
}

// Initial/Fallback Data
const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "1", type: "chat", text: "System: Connecting to live channel...", timestamp: "Now" },
];



export const ChatRoom = ({ className }: { className?: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [userNickname, setUserNickname] = useState<string | null>(null);

  // Check/Load user profile on login
  useEffect(() => {
    if (user && rtdb) {
        // 1. Try local storage first for speed
        const cached = localStorage.getItem("whymove_nickname");
        if (cached) {
            setUserNickname(cached);
        }

        // 2. Verify with DB (source of truth)
        get(child(ref(rtdb), `users/${user.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setUserNickname(data.nickname);
                localStorage.setItem("whymove_nickname", data.nickname);
            } else {
                // New user! Trigger Onboarding
                setIsNicknameModalOpen(true);
            }
        }).catch((err) => {
            console.error("Error fetching profile:", err);
        });
    } else {
        setUserNickname(null);
    }
  }, [user]);

  // Subscribe to Firebase Realtime Database
  useEffect(() => {
    if (!rtdb) return;

    const messagesRef = query(ref(rtdb, "messages"), orderByChild("timestamp"), limitToLast(50));
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Omit<ChatMessage, "id">),
        }));
        loadedMessages.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
        setMessages(loadedMessages);
      } else {
        setMessages([]); 
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Auth Check
    if (!user) {
        setIsLoginModalOpen(true);
        return;
    }

    // Onboarding Check
    if (!userNickname) {
        setIsNicknameModalOpen(true);
        return;
    }

    if (!input.trim()) return;

    try {
        if (!rtdb) throw new Error("Database not initialized");

        await push(ref(rtdb, "messages"), {
            user: userNickname, // Use nickname instead of displayName
            photoURL: user.photoURL,
            text: input,
            type: "chat",
            timestamp: serverTimestamp(),
        });
        setInput("");
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Message failed to send. Check console.");
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-background border border-foreground/10 rounded-xl overflow-hidden", className)}>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      <NicknameModal 
        isOpen={isNicknameModalOpen} 
        onComplete={(name) => {
            setUserNickname(name);
            setIsNicknameModalOpen(false);
        }} 
      />

      {/* Header */}
      <div className="px-4 py-3 border-b border-foreground/10 bg-foreground/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="font-bold text-foreground/80">Live Chat</span>
        </div>
        <div className="text-xs text-foreground/40 flex items-center gap-1 cursor-pointer hover:text-foreground/80" onClick={() => !user && setIsLoginModalOpen(true)}>
           {user ? (
             <div className="flex items-center gap-2" onClick={() => setIsNicknameModalOpen(true)} title="Change Nickname">
                {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoURL} alt="user" className="w-4 h-4 rounded-full" />
                ) : (
                    <User size={12} />
                )}
                <span className={userNickname ? "text-cyan-500 font-bold" : ""}>{userNickname || "Setting up..."}</span>
             </div>
           ) : (
             <span className="text-cyan-500 font-bold flex items-center gap-1">
                <User size={12} /> Sign In
             </span>
           )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm scrollbar-thin scrollbar-thumb-foreground/10">
         {messages.length === 0 && (
             <div className="text-center text-foreground/20 py-10 opacity-50">
                 Connecting to secure channel... <br/>
                 (If this persists, check .env.local)
             </div>
         )}

         {messages.map((msg) => (
           <div key={msg.id} className={cn("animate-in fade-in slide-in-from-bottom-2 duration-300", 
               msg.type === 'donation' ? "border-l-4 border-yellow-500 bg-yellow-500/10 p-2 rounded" : 
               msg.type === 'alert' ? (msg.side === 'bull' ? "bg-green-500/10 border-l-2 border-green-500 p-1" : "bg-red-500/10 border-l-2 border-red-500 p-1") : ""
           )}>
              {/* Chat Message */}
              {msg.type === 'chat' && (
                 <div className="flex items-start gap-2">
                    <span className={cn("font-bold whitespace-nowrap flex items-center gap-1", msg.user === userNickname ? "text-cyan-500" : "text-foreground/40")}>
                        {msg.photoURL && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={msg.photoURL} alt="avatar" className="w-4 h-4 rounded-full inline-block" />
                        )}
                        {msg.user}:
                    </span>
                    <span className="text-foreground/80 break-words leading-relaxed">{msg.text}</span>
                 </div>
              )}

              {/* Alert Message */}
              {msg.type === 'alert' && (
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      {msg.side === 'bull' ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500" />}
                      <span className={msg.side === 'bull' ? "text-green-500" : "text-red-500"}>{msg.text}</span>
                  </div>
              )}

              {/* Donation Message */}
              {msg.type === 'donation' && (
                  <div className="flex items-center gap-2 text-yellow-500">
                      <DollarSign size={16} fill="currentColor" />
                      <span className="font-bold">{msg.user} donated {msg.amount}!</span>
                      <span className="text-foreground text-xs ml-2">&quot;{msg.text}&quot;</span>
                  </div>
              )}
           </div>
         ))}
         <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 bg-foreground/5 border-t border-foreground/10 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={user ? (userNickname ? `Chat as ${userNickname}...` : "Setting up profile...") : "Sign in to chat..."}
          className="flex-1 bg-background border border-foreground/10 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button 
          type="submit"
          className={cn("p-2 rounded transition-colors text-background", user ? "bg-cyan-600 hover:bg-cyan-500" : "bg-foreground/50 hover:bg-foreground/60")}
        >
           <Send size={16} />
        </button>
      </form>
    </div>
  );
};
