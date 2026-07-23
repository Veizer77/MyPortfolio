const postgres = require('postgres');

const sql = postgres('postgresql://postgres:Lxekc6i7GDvzmdyk@db.xizgddrzriqndgtgpvsu.supabase.co:5432/postgres', {
  max: 1,
  idle_timeout: 1
});

async function main() {
  try {
    console.log("Menambahkan izin baca/tulis untuk Admin pada tabel messages...");
    await sql.unsafe(`
      DO $$ 
      BEGIN
        BEGIN
          CREATE POLICY "Admin can select messages" ON messages FOR SELECT TO authenticated USING (true);
        EXCEPTION WHEN duplicate_object THEN NULL; END;
        BEGIN
          CREATE POLICY "Admin can update messages" ON messages FOR UPDATE TO authenticated USING (true);
        EXCEPTION WHEN duplicate_object THEN NULL; END;
        BEGIN
          CREATE POLICY "Admin can delete messages" ON messages FOR DELETE TO authenticated USING (true);
        EXCEPTION WHEN duplicate_object THEN NULL; END;
      END $$;
    `);
    console.log("Sukses!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sql.end();
  }
}

main();
