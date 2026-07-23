-- Tabel: messages (untuk menyimpan pesan dari form kontak)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_read BOOLEAN DEFAULT FALSE
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- Pengunjung hanya boleh INSERT (mengirim pesan), tidak boleh SELECT/UPDATE/DELETE
CREATE POLICY "Anyone can insert a message" ON messages FOR INSERT WITH CHECK (true);
-- Admin (authenticated) boleh ALL (baca, hapus)
CREATE POLICY "Admin can view and manage messages" ON messages FOR ALL USING (auth.role() = 'authenticated');
