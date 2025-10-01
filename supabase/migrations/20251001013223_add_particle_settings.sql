/*
  # Add particle settings to particle_images table

  1. Changes
    - Add columns to store particle effect settings
      - `particle_size` (decimal) - Controls the size of particles (0-3)
      - `particle_depth` (decimal) - Controls the depth/z-axis spread (1-10)
      - `particle_random` (decimal) - Controls randomness/dispersion (1-10)
      - `touch_radius` (decimal) - Controls interactive touch radius (0-0.5)
    
  2. Details
    - All fields have sensible defaults based on the original effect
    - These settings allow users to customize the particle behavior
    - Settings are stored per image and used in the embed view
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'particle_images' AND column_name = 'particle_size'
  ) THEN
    ALTER TABLE particle_images ADD COLUMN particle_size decimal DEFAULT 1.5;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'particle_images' AND column_name = 'particle_depth'
  ) THEN
    ALTER TABLE particle_images ADD COLUMN particle_depth decimal DEFAULT 4.0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'particle_images' AND column_name = 'particle_random'
  ) THEN
    ALTER TABLE particle_images ADD COLUMN particle_random decimal DEFAULT 2.0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'particle_images' AND column_name = 'touch_radius'
  ) THEN
    ALTER TABLE particle_images ADD COLUMN touch_radius decimal DEFAULT 0.15;
  END IF;
END $$;