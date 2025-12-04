-- Supabase Database Schema for Azeroth Chronicles WoW Blog
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT 'default'
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author TEXT DEFAULT 'Admin',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on articles" ON articles
  FOR SELECT USING (true);

-- Create policies for authenticated write access (for admin)
CREATE POLICY "Allow authenticated insert on categories" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on categories" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on categories" ON categories
  FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on articles" ON articles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update on articles" ON articles
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete on articles" ON articles
  FOR DELETE USING (true);

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('Guides', 'guides', 'Comprehensive guides for all aspects of WoW', 'guides'),
  ('News', 'news', 'Latest World of Warcraft news and updates', 'news'),
  ('Raids', 'raids', 'Raid strategies, boss guides, and tactics', 'raids'),
  ('PvP', 'pvp', 'PvP strategies, arena guides, and battleground tips', 'pvp'),
  ('Class Guides', 'class-guides', 'Class-specific guides and builds', 'class'),
  ('Lore', 'lore', 'Explore the rich lore of Azeroth', 'lore')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
