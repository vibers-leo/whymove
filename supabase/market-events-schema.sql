-- Market Events Archive Schema
-- Stores major market-moving events with price impact data
-- Used by the WhyMove event archive feature

CREATE TABLE IF NOT EXISTS market_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Event classification
  event_type TEXT NOT NULL CHECK (event_type IN (
    'geopolitical',   -- wars, sanctions, diplomacy (e.g., US-Iran)
    'economic',       -- CPI, NFP, GDP, interest rates
    'regulatory',     -- SEC decisions, crypto regulations
    'earnings',       -- major company earnings
    'whale',          -- large crypto/futures transactions
    'social',         -- influential tweets, statements
    'technical',      -- exchange outages, flash crashes
    'political'       -- elections, policy announcements
  )),

  -- Event details
  title TEXT NOT NULL,
  title_kr TEXT,
  summary TEXT,
  summary_kr TEXT,
  source_url TEXT,
  source_name TEXT,     -- 'Reuters', 'Bloomberg', 'Twitter/X', etc.

  -- Impact assessment
  impact_level TEXT NOT NULL DEFAULT 'medium' CHECK (impact_level IN ('critical', 'high', 'medium', 'low')),
  affected_assets TEXT[] DEFAULT '{}',  -- ['BTCUSDT', 'ES', 'NQ', 'CL']

  -- Price data at event time
  price_snapshot JSONB DEFAULT '{}',    -- {"BTCUSDT": 95000, "ES": 5800}
  price_change_1h JSONB DEFAULT '{}',   -- {"BTCUSDT": "+2.3%", "ES": "-0.5%"}
  price_change_24h JSONB DEFAULT '{}',  -- updated after 24 hours

  -- Metadata
  tags TEXT[] DEFAULT '{}',             -- ['war', 'iran', 'oil', 'sanctions']
  event_datetime TIMESTAMPTZ,           -- when the event actually occurred
  is_archived BOOLEAN DEFAULT true,
  archived_by TEXT DEFAULT 'system',    -- 'system' or user_id

  -- For auto-detected events (from volatility spikes)
  volatility_alert_id TEXT,             -- link to the VolatilityAlert that triggered archival
  auto_detected BOOLEAN DEFAULT false
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_market_events_type ON market_events(event_type);
CREATE INDEX IF NOT EXISTS idx_market_events_impact ON market_events(impact_level);
CREATE INDEX IF NOT EXISTS idx_market_events_datetime ON market_events(event_datetime DESC);
CREATE INDEX IF NOT EXISTS idx_market_events_created ON market_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_events_tags ON market_events USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_market_events_assets ON market_events USING GIN(affected_assets);

-- Enable Row Level Security
ALTER TABLE market_events ENABLE ROW LEVEL SECURITY;

-- Everyone can read events
CREATE POLICY "market_events_read_all" ON market_events
  FOR SELECT USING (true);

-- Only authenticated users can insert
CREATE POLICY "market_events_insert_auth" ON market_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only the creator or system can update
CREATE POLICY "market_events_update_owner" ON market_events
  FOR UPDATE USING (
    archived_by = 'system' OR archived_by = auth.uid()::text
  );

-- Economic Calendar table (dynamic version)
CREATE TABLE IF NOT EXISTS economic_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  title TEXT NOT NULL,
  title_kr TEXT,
  event_datetime TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('macro', 'fed', 'employment', 'political', 'earnings', 'crypto')),
  impact TEXT NOT NULL DEFAULT 'medium' CHECK (impact IN ('high', 'medium', 'low')),
  country TEXT DEFAULT 'US',

  description TEXT,
  description_kr TEXT,
  previous_value TEXT,
  forecast TEXT,
  actual_value TEXT,        -- filled after event occurs
  source TEXT,

  -- Alert settings
  alert_before_minutes INT[] DEFAULT '{1440, 60, 30, 5}',  -- D-1, H-1, M-30, M-5
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_economic_calendar_datetime ON economic_calendar(event_datetime);
CREATE INDEX IF NOT EXISTS idx_economic_calendar_category ON economic_calendar(category);

-- Enable RLS
ALTER TABLE economic_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "economic_calendar_read_all" ON economic_calendar
  FOR SELECT USING (true);

CREATE POLICY "economic_calendar_insert_auth" ON economic_calendar
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
