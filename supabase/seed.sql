-- Pastikan tabel messages ada dan memiliki RLS yang benar untuk publik
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_read BOOLEAN DEFAULT FALSE
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert a message" ON messages;
CREATE POLICY "Anyone can insert a message" ON messages FOR INSERT TO public WITH CHECK (true);

-- ============================================================================
-- INSERT DATA DUMMY
-- ============================================================================

-- Insert Data untuk Hero
INSERT INTO hero (name, tagline, location, photo_url, cv_url)
SELECT 'Muhammad Izzat', 'Fresh Graduate | Software Engineer & AI Enthusiast', 'Jombang, Jawa Timur, Indonesia', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Izzat&backgroundColor=6366f1', '#'
WHERE NOT EXISTS (SELECT 1 FROM hero);

-- Insert Data untuk About
INSERT INTO about (summary, stats)
SELECT 'Lulusan baru Program Studi Informatika Universitas Muhammadiyah Malang yang memiliki minat besar pada pengembangan perangkat lunak, Artificial Intelligence, Machine Learning, Cybersecurity, dan Penetration Testing. Penelitian tugas akhir berfokus pada klasifikasi data poisoning pada dataset MovieLens menggunakan Sentence-BERT dan XGBoost.', '[{"label":"Proyek","value":"10+"},{"label":"Pengalaman","value":"2 Tahun"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM about);

-- Insert Data untuk Contact
INSERT INTO contact (email, whatsapp, linkedin_url, github_url, address)
SELECT 'izzatfarahidi@gmail.com', '', '#', '#', 'Jombang, Jawa Timur'
WHERE NOT EXISTS (SELECT 1 FROM contact);

-- Insert Data untuk Education
INSERT INTO education (institution, degree, field_of_study, start_date, end_date, description)
SELECT 'Universitas Muhammadiyah Malang', 'Sarjana (S1)', 'Informatika', '2022-09-01', '2026-09-01', 'Penelitian tugas akhir mengenai klasifikasi data poisoning pada dataset MovieLens menggunakan Sentence-BERT (SBERT) sebagai metode ekstraksi fitur dan XGBoost sebagai algoritma klasifikasi.'
WHERE NOT EXISTS (SELECT 1 FROM education);

-- Insert Data untuk Experience
INSERT INTO experience (company, position, location, start_date, end_date, is_current, description)
SELECT 'BKPSDM Kota Batu', 'Secretary', 'Batu, Jawa Timur', '2025-07-01', '2025-08-31', false, ARRAY['Membantu tugas kesekretariatan dan administrasi kepegawaian di lingkungan pemerintah kota.']
WHERE NOT EXISTS (SELECT 1 FROM experience WHERE company = 'BKPSDM Kota Batu');

INSERT INTO experience (company, position, location, start_date, end_date, is_current, description)
SELECT 'Erlangga Computindo', 'Technical Support Specialist', 'Jombang, Jawa Timur', '2021-01-01', '2021-04-30', false, ARRAY['Melakukan perawatan dan perbaikan perangkat keras serta dukungan teknis kepada pelanggan.']
WHERE NOT EXISTS (SELECT 1 FROM experience WHERE company = 'Erlangga Computindo');

-- Insert Data untuk Projects
INSERT INTO projects (title, description, tech_stack, thumbnail_url, github_url, demo_url, sort_order)
SELECT 'Data Poisoning Detection - MovieLens', 'Sistem klasifikasi data poisoning menggunakan SBERT untuk ekstraksi fitur dan XGBoost untuk klasifikasi.', ARRAY['Python', 'SBERT', 'XGBoost', 'Scikit-learn'], 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop', '#', '#', 1
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'Data Poisoning Detection - MovieLens');

INSERT INTO projects (title, description, tech_stack, thumbnail_url, github_url, demo_url, sort_order)
SELECT 'E-Commerce App (Flutter)', 'Pengembangan aplikasi mobile e-commerce komprehensif selama perkuliahan dengan integrasi backend.', ARRAY['Flutter', 'Firebase', 'Dart'], 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop', '#', '#', 2
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = 'E-Commerce App (Flutter)');

-- Insert Data untuk Skills (Menambahkan ON CONFLICT DO NOTHING but since it might not have UNIQUE constraint, we'll just TRUNCATE and insert if empty)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM skills) THEN
        INSERT INTO skills (name, category, level, sort_order) VALUES
        ('Python', 'Programming', 5, 1),
        ('Dart (Flutter)', 'Programming', 5, 2),
        ('Java (Android)', 'Programming', 4, 3),
        ('JavaScript', 'Programming', 4, 4),
        ('Sentence-BERT', 'AI / ML', 5, 5),
        ('XGBoost', 'AI / ML', 5, 6),
        ('NLP', 'AI / ML', 4, 7),
        ('Scikit-learn', 'AI / ML', 5, 8),
        ('HTML', 'Web Development', 5, 9),
        ('CSS', 'Web Development', 5, 10),
        ('Next.js / React', 'Web Development', 4, 11),
        ('Flutter', 'Mobile Development', 5, 12),
        ('Android Native', 'Mobile Development', 4, 13),
        ('Penetration Testing', 'Cybersecurity', 4, 14),
        ('Vulnerability Assessment', 'Cybersecurity', 4, 15),
        ('Firebase', 'Tools & Platform', 5, 16),
        ('Git', 'Tools & Platform', 5, 17),
        ('GitHub', 'Tools & Platform', 5, 18),
        ('VS Code', 'Tools & Platform', 5, 19),
        ('Android Studio', 'Tools & Platform', 5, 20),
        ('PostgreSQL', 'Database', 4, 21),
        ('Firebase Firestore', 'Database', 5, 22);
    END IF;
END $$;
