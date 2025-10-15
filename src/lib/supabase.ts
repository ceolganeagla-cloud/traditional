import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Tune {
  id: string;
  title: string;
  type: string;
  abc_notation: string;
  artist: string;
  region: string;
  difficulty: string;
  description: string;
  audio_url: string;
  pdf_url: string;
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: string;
  title: string;
  lyrics: string;
  type: string;
  language: string;
  region: string;
  artist: string;
  description: string;
  audio_url: string;
  created_at: string;
}

export interface EducationalContent {
  id: string;
  category: string;
  title: string;
  content: string;
  order_index: number;
  created_at: string;
}

export interface UserRecording {
  id: string;
  tune_id: string;
  user_id: string;
  recording_data: string;
  notes: string;
  created_at: string;
}
