import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type EstimatedDuration = '15min' | '1hour' | '1day' | '1week' | '1month';

export interface Task {
  id: string;
  text: string;
  is_important: boolean;
  is_urgent: boolean;
  is_high_impact: boolean;
  status: 'active' | 'waiting' | 'completed' | 'deferred';
  priority_order: number;
  estimated_duration: EstimatedDuration;
  progress: number;
  created_at: string;
  completed_at: string | null;
}
