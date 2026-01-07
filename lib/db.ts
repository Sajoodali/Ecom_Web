
/**
 * DATABASE CONNECTION CONFIGURATION
 * URI: postgresql://postgres:[qF92%3!V?KNnPbB]@db.fblgnxekjrmqypwvdruu.supabase.co:5432/postgres
 * 
 * Note: For Next.js/Web environments, we use the Supabase Client (HTTP-based)
 * which is already configured in lib/supabase.ts. This file is kept for 
 * architectural documentation.
 */

export const DB_CONFIG = {
  provider: 'postgresql',
  host: 'db.fblgnxekjrmqypwvdruu.supabase.co',
  database: 'postgres',
  port: 5432
};
