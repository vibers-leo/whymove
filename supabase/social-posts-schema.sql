-- Social Posts Table
-- Stores posts from tracked influencers (X, Truth Social, Threads)

-- Create the social_posts table
CREATE TABLE IF NOT EXISTS public.social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Source info
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'truth_social', 'threads', 'telegram')),
  post_id TEXT, -- Original post ID from the platform
  post_url TEXT,
  
  -- Author info
  author_handle TEXT NOT NULL, -- @elonmusk, @realDonaldTrump, etc.
  author_name TEXT NOT NULL, -- Display name
  author_avatar TEXT, -- Avatar URL
  author_verified BOOLEAN DEFAULT false,
  
  -- Content
  content TEXT NOT NULL,
  content_translated TEXT, -- Korean translation
  media_urls TEXT[], -- Array of media URLs
  
  -- Analysis
  impact_level TEXT DEFAULT 'medium' CHECK (impact_level IN ('high', 'medium', 'low')),
  sentiment TEXT CHECK (sentiment IN ('bullish', 'bearish', 'neutral')),
  keywords TEXT[], -- Extracted keywords like ['bitcoin', 'tariff', 'fed']
  
  -- Engagement (optional, for reference)
  likes_count INTEGER DEFAULT 0,
  retweets_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  
  -- Status
  is_processed BOOLEAN DEFAULT false,
  is_notified BOOLEAN DEFAULT false -- Whether we sent alerts for this
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS social_posts_created_at_idx ON public.social_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS social_posts_platform_idx ON public.social_posts (platform);
CREATE INDEX IF NOT EXISTS social_posts_author_handle_idx ON public.social_posts (author_handle);
CREATE INDEX IF NOT EXISTS social_posts_impact_level_idx ON public.social_posts (impact_level);

-- Enable Row Level Security
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read posts
CREATE POLICY "Anyone can read social posts"
  ON public.social_posts
  FOR SELECT
  TO public
  USING (true);

-- Policy: Only authenticated users can insert (for admin/system use)
CREATE POLICY "Authenticated users can insert posts"
  ON public.social_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_posts;

-- ===========================================
-- Tracked Influencers Table
-- ===========================================

CREATE TABLE IF NOT EXISTS public.tracked_influencers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'truth_social', 'threads', 'telegram')),
  handle TEXT NOT NULL, -- @username
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  
  -- Categorization
  category TEXT CHECK (category IN ('political', 'crypto', 'finance', 'tech', 'other')),
  importance TEXT DEFAULT 'medium' CHECK (importance IN ('critical', 'high', 'medium', 'low')),
  
  -- Tracking settings
  is_active BOOLEAN DEFAULT true,
  notify_immediately BOOLEAN DEFAULT false, -- Send push notification immediately
  
  -- Description
  description TEXT,
  
  UNIQUE(platform, handle)
);

-- Insert some default influencers to track
INSERT INTO public.tracked_influencers (platform, handle, display_name, category, importance, notify_immediately, description) VALUES
  ('twitter', 'elonmusk', 'Elon Musk', 'crypto', 'critical', true, 'Tesla/SpaceX CEO, known for market-moving tweets'),
  ('twitter', 'realDonaldTrump', 'Donald Trump', 'political', 'critical', true, 'Former & Current US President'),
  ('truth_social', 'realDonaldTrump', 'Donald Trump', 'political', 'critical', true, 'Primary platform for Trump'),
  ('twitter', 'VitalikButerin', 'Vitalik Buterin', 'crypto', 'high', true, 'Ethereum co-founder'),
  ('twitter', 'saborowski', 'Vince Saborowski', 'crypto', 'high', false, 'Crypto analyst'),
  ('twitter', 'CryptoCapo_', 'Il Capo Of Crypto', 'crypto', 'medium', false, 'Crypto trader/analyst'),
  ('twitter', 'inversebrah', 'inversebrah', 'crypto', 'medium', false, 'Crypto meme account'),
  ('twitter', 'FedGuy12', 'Joseph Wang', 'finance', 'high', true, 'Former Fed trader, macro expert'),
  ('twitter', 'zaborowski', 'Nick Timiraos', 'finance', 'high', true, 'WSJ Fed reporter'),
  ('telegram', 'WuBlockchain', 'Wu Blockchain', 'crypto', 'high', false, 'Chinese crypto news')
ON CONFLICT (platform, handle) DO NOTHING;

-- ===========================================
-- Insert Sample Posts for Demo
-- ===========================================

INSERT INTO public.social_posts (platform, author_handle, author_name, content, content_translated, impact_level, sentiment, keywords, author_verified) VALUES
  ('twitter', 'elonmusk', 'Elon Musk', '🚀 Dogecoin to the moon!', '🚀 도지코인 달까지!', 'high', 'bullish', ARRAY['dogecoin', 'crypto'], true),
  ('truth_social', 'realDonaldTrump', 'Donald Trump', 'Bitcoin is the future of America. We will make America the crypto capital of the world!', '비트코인은 미국의 미래입니다. 우리는 미국을 세계 암호화폐의 수도로 만들 것입니다!', 'high', 'bullish', ARRAY['bitcoin', 'crypto', 'america'], true),
  ('twitter', 'VitalikButerin', 'Vitalik Buterin', 'Important update on Ethereum scaling. Read the new proposal here.', '이더리움 스케일링에 대한 중요 업데이트. 새 제안서를 읽어보세요.', 'medium', 'neutral', ARRAY['ethereum', 'scaling'], true),
  ('twitter', 'FedGuy12', 'Joseph Wang', 'CPI coming in hot tomorrow. Market pricing in 25bps cut is aggressive.', '내일 CPI 발표 예정. 시장의 25bp 인하 기대는 공격적임.', 'high', 'bearish', ARRAY['cpi', 'fed', 'rates'], true);
