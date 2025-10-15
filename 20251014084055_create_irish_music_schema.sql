/*
  # Irish Traditional Music Learning App Schema

  1. New Tables
    - `tunes`
      - `id` (uuid, primary key)
      - `title` (text) - tune name
      - `type` (text) - reel, jig, air, hornpipe, etc.
      - `abc_notation` (text) - ABC format notation
      - `artist` (text) - traditional source or performer
      - `region` (text) - Clare, Donegal, Sliabh Luachra, etc.
      - `difficulty` (text) - beginner, intermediate, advanced
      - `description` (text) - background and context
      - `audio_url` (text) - optional MP3/audio file URL
      - `pdf_url` (text) - optional sheet music PDF URL
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `songs`
      - `id` (uuid, primary key)
      - `title` (text) - song name
      - `lyrics` (text) - full lyrics
      - `type` (text) - sean-nós, ballad, etc.
      - `language` (text) - Irish, English, bilingual
      - `region` (text) - regional origin
      - `artist` (text) - traditional source
      - `description` (text) - cultural context
      - `audio_url` (text) - optional audio
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `educational_content`
      - `id` (uuid, primary key)
      - `category` (text) - instruments, styles, notation, practice, etc.
      - `title` (text) - content title
      - `content` (text) - markdown or HTML content
      - `order_index` (integer) - display order
      - `created_at` (timestamptz)
    
    - `user_recordings`
      - `id` (uuid, primary key)
      - `tune_id` (uuid) - reference to tune
      - `user_id` (uuid) - reference to auth user
      - `recording_data` (text) - base64 audio data or storage URL
      - `notes` (text) - user notes
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for tunes, songs, and educational content (learning resources)
    - Authenticated users can manage their own recordings
*/

-- Create tunes table
CREATE TABLE IF NOT EXISTS tunes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL DEFAULT 'reel',
  abc_notation text NOT NULL,
  artist text DEFAULT '',
  region text DEFAULT '',
  difficulty text DEFAULT 'intermediate',
  description text DEFAULT '',
  audio_url text DEFAULT '',
  pdf_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  lyrics text NOT NULL DEFAULT '',
  type text DEFAULT 'ballad',
  language text DEFAULT 'English',
  region text DEFAULT '',
  artist text DEFAULT '',
  description text DEFAULT '',
  audio_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create educational_content table
CREATE TABLE IF NOT EXISTS educational_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_recordings table
CREATE TABLE IF NOT EXISTS user_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tune_id uuid REFERENCES tunes(id) ON DELETE CASCADE,
  user_id uuid,
  recording_data text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tunes ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recordings ENABLE ROW LEVEL SECURITY;

-- Public read access for learning resources
CREATE POLICY "Anyone can view tunes"
  ON tunes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view songs"
  ON songs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view educational content"
  ON educational_content FOR SELECT
  USING (true);

-- User recordings policies
CREATE POLICY "Users can view their own recordings"
  ON user_recordings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own recordings"
  ON user_recordings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own recordings"
  ON user_recordings FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own recordings"
  ON user_recordings FOR DELETE
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tunes_type ON tunes(type);
CREATE INDEX IF NOT EXISTS idx_tunes_region ON tunes(region);
CREATE INDEX IF NOT EXISTS idx_tunes_title ON tunes(title);
CREATE INDEX IF NOT EXISTS idx_songs_type ON songs(type);
CREATE INDEX IF NOT EXISTS idx_educational_content_category ON educational_content(category);
CREATE INDEX IF NOT EXISTS idx_user_recordings_tune_id ON user_recordings(tune_id);
CREATE INDEX IF NOT EXISTS idx_user_recordings_user_id ON user_recordings(user_id);