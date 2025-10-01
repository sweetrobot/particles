import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ryidnlxzevyhfvabvfwh.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aWRubHh6ZXZ5aGZ2YWJ2ZndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNzI3OTcsImV4cCI6MjA3NDg0ODc5N30.kq_d-2JNklQs4u1uqQo_lD7jRQW1elSIvYh387a3o3A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
