-- whymove schema in vibers_main DB
CREATE SCHEMA IF NOT EXISTS whymove;

CREATE TABLE IF NOT EXISTS whymove.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  google_id VARCHAR(255) UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whymove.social_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES whymove.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  content TEXT,
  url TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whymove.tracked_influencers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES whymove.users(id) ON DELETE CASCADE,
  handle VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, handle, platform)
);
