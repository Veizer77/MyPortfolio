-- Tabel: hero
CREATE TABLE hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  location TEXT,
  photo_url TEXT,
  cv_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON hero FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON hero FOR ALL USING (auth.role() = 'authenticated');

-- Tabel: about
CREATE TABLE about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary TEXT NOT NULL,
  stats JSONB, 
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON about FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON about FOR ALL USING (auth.role() = 'authenticated');

-- Tabel: skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER CHECK (level BETWEEN 1 AND 5),
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0
);
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON skills FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON skills FOR ALL USING (auth.role() = 'authenticated');

-- Tabel: experience
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT[],
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0
);
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON experience FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON experience FOR ALL USING (auth.role() = 'authenticated');

-- Tabel: education
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0
);
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON education FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON education FOR ALL USING (auth.role() = 'authenticated');

-- Tabel: projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[],
  thumbnail_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Tabel: contact
CREATE TABLE contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  whatsapp TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  address TEXT,
  cta_text TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON contact FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON contact FOR ALL USING (auth.role() = 'authenticated');

-- Tabel: seo_settings
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON seo_settings FOR ALL USING (auth.role() = 'authenticated');
