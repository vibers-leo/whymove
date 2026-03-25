"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { 
  Twitter, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  Zap,
  RefreshCw
} from "lucide-react";

// Platform icons
const TruthSocialIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

export interface SocialPost {
  id: string;
  created_at: string;
  platform: "twitter" | "truth_social" | "threads" | "telegram";
  author_handle: string;
  author_name: string;
  author_avatar?: string;
  author_verified: boolean;
  content: string;
  content_translated?: string;
  post_url?: string;
  impact_level: "high" | "medium" | "low";
  sentiment?: "bullish" | "bearish" | "neutral";
  keywords?: string[];
  likes_count?: number;
  retweets_count?: number;
}

interface SocialFeedProps {
  maxPosts?: number;
  showHeader?: boolean;
  className?: string;
}

export function SocialFeed({ 
  maxPosts = 10, 
  showHeader = true,
  className 
}: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("social_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(maxPosts);

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Failed to fetch social posts:", err);
      setError("Failed to load feed");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [maxPosts]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("social-posts-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "social_posts" },
        (payload) => {
          const newPost = payload.new as SocialPost;
          setPosts((prev) => [newPost, ...prev.slice(0, maxPosts - 1)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [maxPosts]);

  if (isLoading && posts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <RefreshCw className="w-5 h-5 text-foreground/30 animate-spin" />
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-foreground/40 text-sm">
        <AlertTriangle className="w-5 h-5 mb-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {showHeader && (
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-cyan-500 rounded-full" />
            <h2 className="text-sm font-bold text-foreground">Live Feed</h2>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              LIVE
            </span>
          </div>
          <button 
            onClick={fetchPosts}
            className="p-1 hover:bg-foreground/10 rounded transition-colors"
          >
            <RefreshCw className={cn("w-3 h-3 text-foreground/40", isLoading && "animate-spin")} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {posts.length === 0 ? (
          <div className="text-center text-foreground/40 text-sm py-8">
            No posts yet. Waiting for updates...
          </div>
        ) : (
          posts.map((post) => (
            <SocialPostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

function SocialPostCard({ post }: { post: SocialPost }) {
  const timeAgo = getTimeAgo(post.created_at);

  const getPlatformIcon = () => {
    switch (post.platform) {
      case "twitter":
        return <Twitter className="w-3 h-3" />;
      case "truth_social":
        return <TruthSocialIcon />;
      default:
        return <Twitter className="w-3 h-3" />;
    }
  };

  const getPlatformColor = () => {
    switch (post.platform) {
      case "twitter":
        return "text-blue-400";
      case "truth_social":
        return "text-red-400";
      case "threads":
        return "text-foreground";
      case "telegram":
        return "text-sky-400";
      default:
        return "text-foreground/50";
    }
  };

  const getSentimentIcon = () => {
    switch (post.sentiment) {
      case "bullish":
        return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case "bearish":
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-foreground/30" />;
    }
  };

  return (
    <div 
      className={cn(
        "group relative rounded-lg border p-3 transition-all",
        "bg-foreground/5 border-foreground/10 hover:bg-foreground/10",
        post.impact_level === "high" && "border-l-2 border-l-red-500"
      )}
    >
      {/* Header: Platform + Author + Time */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Platform Icon */}
          <span className={cn("p-1 rounded", getPlatformColor())}>
            {getPlatformIcon()}
          </span>
          {/* Author */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-foreground/90">
              {post.author_name}
            </span>
            {post.author_verified && (
              <span className="text-blue-400">✓</span>
            )}
          </div>
          <span className="text-[10px] text-foreground/40">
            @{post.author_handle}
          </span>
        </div>
        {/* Time + Sentiment */}
        <div className="flex items-center gap-2">
          {getSentimentIcon()}
          <span className="text-[10px] text-foreground/40">{timeAgo}</span>
        </div>
      </div>

      {/* Content */}
      <p className="text-xs text-foreground/80 leading-relaxed mb-2">
        {post.content_translated || post.content}
      </p>

      {/* Original (if translated) */}
      {post.content_translated && (
        <p className="text-[10px] text-foreground/40 italic mb-2 line-clamp-1">
          원문: {post.content}
        </p>
      )}

      {/* Footer: Keywords + Impact + Link */}
      <div className="flex items-center justify-between">
        {/* Keywords */}
        <div className="flex items-center gap-1 flex-wrap">
          {post.keywords?.slice(0, 3).map((keyword) => (
            <span 
              key={keyword}
              className="text-[9px] px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/50"
            >
              #{keyword}
            </span>
          ))}
        </div>

        {/* Impact & Link */}
        <div className="flex items-center gap-2">
          {post.impact_level === "high" && (
            <span className="flex items-center gap-0.5 text-[9px] text-red-400">
              <Zap className="w-3 h-3" />
              HIGH
            </span>
          )}
          {post.post_url && (
            <a 
              href={post.post_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground/30 hover:text-foreground/60 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper: Calculate time ago
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}
