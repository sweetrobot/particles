/*
  # Create Particle Images Schema

  1. New Tables
    - `particle_images`
      - `id` (uuid, primary key) - Unique identifier for each particle image
      - `user_id` (uuid) - Reserved for future auth implementation
      - `title` (text) - User-friendly title for the image
      - `original_url` (text) - URL to the original uploaded image in storage
      - `thumbnail_url` (text) - URL to thumbnail version
      - `width` (integer) - Original image width
      - `height` (integer) - Original image height
      - `file_size` (integer) - File size in bytes
      - `mime_type` (text) - Image MIME type (image/jpeg, image/png, etc.)
      - `embed_code` (text) - Generated unique code for embedding
      - `view_count` (integer) - Number of times the particle effect has been viewed
      - `particle_config` (jsonb) - Configuration settings for the particle effect
      - `created_at` (timestamptz) - Timestamp of upload
      - `updated_at` (timestamptz) - Timestamp of last update
  
  2. Storage
    - Create 'particle-images' bucket for storing uploaded images
  
  3. Security
    - Enable RLS on `particle_images` table
    - Allow public read access for viewing particle effects
    - Allow anyone to insert (upload) images for now
    - Allow users to update/delete their own images (prepared for future auth)
  
  4. Indexes
    - Index on `embed_code` for fast lookups when embedding
    - Index on `created_at` for sorting in dashboard
*/

-- Create particle_images table
CREATE TABLE IF NOT EXISTS particle_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL,
  original_url text NOT NULL,
  thumbnail_url text,
  width integer NOT NULL,
  height integer NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  embed_code text UNIQUE NOT NULL,
  view_count integer DEFAULT 0,
  particle_config jsonb DEFAULT '{
    "uRandom": 1.0,
    "uDepth": 2.0,
    "uSize": 1.5
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE particle_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access for viewing particle effects
CREATE POLICY "Anyone can view particle images"
  ON particle_images FOR SELECT
  USING (true);

-- Allow anyone to insert images for now (will be restricted with auth later)
CREATE POLICY "Anyone can upload images"
  ON particle_images FOR INSERT
  WITH CHECK (true);

-- Allow updates to own images (prepared for auth)
CREATE POLICY "Users can update own images"
  ON particle_images FOR UPDATE
  USING (user_id IS NULL OR auth.uid() = user_id)
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Allow deletes of own images (prepared for auth)
CREATE POLICY "Users can delete own images"
  ON particle_images FOR DELETE
  USING (user_id IS NULL OR auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_particle_images_embed_code ON particle_images(embed_code);
CREATE INDEX IF NOT EXISTS idx_particle_images_created_at ON particle_images(created_at DESC);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('particle-images', 'particle-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the bucket
CREATE POLICY "Anyone can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'particle-images');

CREATE POLICY "Anyone can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'particle-images');

CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'particle-images');

CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'particle-images');
