// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://nnhergvhnqhoxdmvszww.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uaGVyZ3ZobnFob3hkbXZzend3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2Mzk5NzAsImV4cCI6MjA4MDIxNTk3MH0.OESWXSrwmc4J22UPlkdgUWciQgTUWQfjc1wKYONVQc0'; // ← Get this from Supabase Dashboard → Settings → API

export const supabase = createClient(supabaseUrl, supabaseAnonKey);