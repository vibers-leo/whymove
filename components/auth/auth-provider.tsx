"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  // Firebase 호환 필드
  photoURL?: string;
  displayName?: string;
  uid?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signInWithGoogle = async () => {
    // Google OAuth: 팝업으로 구글 로그인 후 토큰을 /api/auth/google로 전송
    const { GoogleAuthProvider, signInWithPopup, getAuth } = await import("firebase/auth");
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    };
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleId: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        avatarUrl: firebaseUser.photoURL,
      }),
    });
    if (!res.ok) throw new Error("Google 로그인에 실패했습니다.");
    const data = await res.json();
    setUser(data.user);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "로그인에 실패했습니다.");
    }
    const data = await res.json();
    setUser(data.user);
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "회원가입에 실패했습니다.");
    }
    const data = await res.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
