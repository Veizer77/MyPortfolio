const postgres = require('postgres');

const sql = postgres('postgresql://postgres:Lxekc6i7GDvzmdyk@db.xizgddrzriqndgtgpvsu.supabase.co:5432/postgres', {
  max: 1,
  idle_timeout: 1
});

async function main() {
  try {
    console.log("Membuat tabel visitor_logs di Supabase...");
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS visitor_logs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        ip_address TEXT NOT NULL,
        user_agent TEXT,
        device_type TEXT,
        browser TEXT,
        os TEXT,
        page_path TEXT DEFAULT '/',
        city TEXT,
        country TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

      DO $$ 
      BEGIN
        BEGIN
          CREATE POLICY "Allow anon insert visitor_logs" ON visitor_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
        EXCEPTION WHEN duplicate_object THEN NULL; END;

        BEGIN
          CREATE POLICY "Allow auth select visitor_logs" ON visitor_logs FOR SELECT TO authenticated USING (true);
        EXCEPTION WHEN duplicate_object THEN NULL; END;

        BEGIN
          CREATE POLICY "Allow auth delete visitor_logs" ON visitor_logs FOR DELETE TO authenticated USING (true);
        EXCEPTION WHEN duplicate_object THEN NULL; END;
      END $$;
    `);
    console.log("Sukses membuat tabel visitor_logs dan ijin RLS!");
  } catch (err) {
    console.error("Error creating visitor_logs table:", err);
  } finally {
    await sql.end();
  }
}

main();
