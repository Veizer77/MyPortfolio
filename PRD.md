# Product Requirements Document (PRD)
## Website Portfolio Profesional — Muhammad Izzat

---

**Versi:** 1.0  
**Tanggal:** 18 Juli 2026  
**Author:** Muhammad Izzat  
**Status:** Draft

---

## 1. Ringkasan Eksekutif

### 1.1 Latar Belakang

Muhammad Izzat adalah lulusan baru Informatika Universitas Muhammadiyah Malang yang hendak memasuki dunia kerja profesional di bidang Software Engineering, AI/ML, dan Cybersecurity. Dibutuhkan sebuah website portfolio online yang merepresentasikan identitas, keahlian, pengalaman, dan proyek secara profesional kepada calon perekrut dan klien.

### 1.2 Pernyataan Masalah

Tidak adanya media digital terpusat yang dapat menampilkan profil profesional secara lengkap dan terstruktur, serta kemampuan untuk memperbarui konten sewaktu-waktu tanpa harus mengubah kode secara langsung.

### 1.3 Solusi

Membangun website portfolio satu halaman (single-page) yang profesional, dilengkapi dengan **halaman Admin Panel** berbasis autentikasi yang memungkinkan pengelolaan seluruh konten halaman utama (teks, data, media) secara dinamis tanpa menyentuh kode.

---

## 2. Tujuan & Sasaran

| # | Tujuan | Indikator Keberhasilan |
|---|--------|------------------------|
| 1 | Menampilkan profil profesional secara digital | Pengunjung memahami identitas dan kompetensi dalam < 30 detik |
| 2 | Meningkatkan peluang perekrutan | Mendapatkan respons dari minimal 5 rekruter dalam 3 bulan pertama |
| 3 | Memudahkan pembaruan konten | Pemilik dapat update konten tanpa menyentuh kode |
| 4 | Memberikan kesan teknikal yang kuat | Website mencerminkan kemampuan pengembangan web pemiliknya |

---

## 3. Pengguna Target

### 3.1 Pengguna Utama (Admin)
- **Siapa:** Muhammad Izzat (pemilik website)
- **Kebutuhan:** Memperbarui informasi pribadi, pengalaman kerja, proyek, dan keahlian kapan saja secara mudah melalui antarmuka yang intuitif
- **Ekspektasi teknis:** Familiar dengan web, tidak perlu mengedit kode

### 3.2 Pengguna Sekunder (Pengunjung / Publik)
- **HRD / Rekruter** dari perusahaan teknologi
- **Technical Interviewer** yang ingin memverifikasi kemampuan
- **Klien potensial** yang membutuhkan jasa freelance
- **Kolega / Akademisi** dari lingkungan kampus

---

## 4. Ruang Lingkup Proyek

### 4.1 In-Scope
- Halaman utama portfolio (public, responsive)
- Halaman Admin Panel (private, behind authentication)
- Sistem CRUD untuk setiap seksi halaman utama
- Penyimpanan data dinamis (database / headless CMS)
- Upload & manajemen aset media (foto, dokumen CV)
- Sistem autentikasi sederhana untuk admin

### 4.2 Out-of-Scope (Versi 1.0)
- Blog / artikel
- Multi-user admin
- Sistem komentar publik
- Integrasi pembayaran
- Versi multi-bahasa (i18n)

---

## 5. Arsitektur & Stack Teknologi

### 5.1 Rekomendasi Stack

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| **Frontend** | Next.js (React) + TypeScript | SSR/SSG untuk SEO, ekosistem luas |
| **Styling** | Tailwind CSS | Cepat, utility-first, mudah responsif |
| **Backend / CMS** | Supabase (PostgreSQL + Auth + Storage) | Open-source, gratis tier cukup, mudah diintegrasikan |
| **Autentikasi Admin** | Supabase Auth (email + password) | Built-in, aman, tidak perlu setup server terpisah |
| **Deployment** | Vercel | Gratis, CI/CD otomatis dari GitHub, CDN global |
| **Domain** | Custom domain (opsional) | `izzatzet.dev` atau serupa |

### 5.2 Struktur Direktori Proyek

```
portfolio/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Halaman utama (public)
│   ├── admin/
│   │   ├── login/page.tsx  # Halaman login admin
│   │   └── dashboard/
│   │       ├── page.tsx             # Dashboard utama admin
│   │       ├── hero/page.tsx        # Edit seksi Hero
│   │       ├── about/page.tsx       # Edit seksi About
│   │       ├── skills/page.tsx      # Edit seksi Skills
│   │       ├── experience/page.tsx  # Edit seksi Experience
│   │       ├── education/page.tsx   # Edit seksi Education
│   │       ├── projects/page.tsx    # Edit seksi Projects
│   │       └── contact/page.tsx     # Edit seksi Contact
├── components/             # Komponen React yang dapat digunakan ulang
├── lib/                    # Utilitas, Supabase client, helpers
├── public/                 # Aset statis
└── types/                  # TypeScript interfaces
```

---

## 6. Halaman Utama — Seksi & Konten

Halaman utama adalah halaman publik single-page yang terbagi menjadi beberapa seksi berikut:

---

### 6.1 Seksi Hero (Header / Landing)

**Tujuan:** Kesan pertama yang kuat, memperkenalkan identitas.

**Elemen yang ditampilkan:**
- Foto profil profesional
- Nama lengkap: **Muhammad Izzat**
- Tagline / Judul profesional (contoh: *"Fresh Graduate | Software Engineer & AI Enthusiast"*)
- Lokasi: Jombang, Jawa Timur, Indonesia
- Tombol CTA: **"Download CV"** dan **"Hubungi Saya"**
- Link sosial media (LinkedIn, GitHub, Email, WhatsApp)

**Elemen yang dapat diedit via Admin:**
- Foto profil (upload file)
- Nama lengkap
- Tagline / subtitle
- File CV (upload PDF)
- URL sosial media (LinkedIn, GitHub, Email, WhatsApp)

---

### 6.2 Seksi Tentang Saya (About)

**Tujuan:** Memberikan konteks profesional dan personal kepada pengunjung.

**Elemen yang ditampilkan:**
- Paragraf ringkasan profesional (dari CV: minat pada Software Development, AI/ML, Cybersecurity, penelitian tugas akhir, keterbukaan terhadap peluang kerja)
- Statistik singkat (contoh: jumlah proyek, tahun belajar, bidang keahlian)

**Konten awal (dari CV):**
> Lulusan baru Program Studi Informatika Universitas Muhammadiyah Malang yang memiliki minat besar pada pengembangan perangkat lunak, Artificial Intelligence, Machine Learning, Cybersecurity, dan Penetration Testing. Penelitian tugas akhir berfokus pada klasifikasi data poisoning pada dataset MovieLens menggunakan Sentence-BERT dan XGBoost.

**Elemen yang dapat diedit via Admin:**
- Paragraf ringkasan (rich text / textarea)
- Statistik singkat (label + nilai, multiple entry)

---

### 6.3 Seksi Keahlian (Skills)

**Tujuan:** Memperlihatkan kompetensi teknis dan non-teknis secara visual.

**Elemen yang ditampilkan:**
- Kartu atau badge keahlian, dikelompokkan berdasarkan kategori
- Progress bar atau level indikator (opsional)

**Kategori & Data Awal (dari CV):**

| Kategori | Keahlian |
|----------|----------|
| **Programming** | Python, Dart (Flutter), Java (Android), JavaScript |
| **AI / ML** | Sentence-BERT, XGBoost, NLP, Scikit-learn |
| **Web Development** | HTML, CSS, Next.js / React |
| **Mobile Development** | Flutter, Android Native |
| **Cybersecurity** | Penetration Testing, Vulnerability Assessment |
| **Tools & Platform** | Firebase, Git, GitHub, VS Code, Android Studio |
| **Database** | PostgreSQL, Firebase Firestore |

**Elemen yang dapat diedit via Admin:**
- Tambah / hapus / edit keahlian
- Nama keahlian, kategori, ikon (URL atau pilihan preset), level

---

### 6.4 Seksi Pengalaman Kerja (Experience)

**Tujuan:** Menampilkan riwayat profesional secara kronologis.

**Elemen yang ditampilkan:**
- Timeline pengalaman kerja
- Nama perusahaan, posisi, lokasi, periode, deskripsi tugas

**Data Awal (dari CV):**

| Perusahaan | Posisi | Lokasi | Periode |
|------------|--------|--------|---------|
| BKPSDM Kota Batu | Secretary | Batu, Jawa Timur | Juli 2025 – Agustus 2025 |
| Erlangga Computindo | Technical Support Specialist | Jombang, Jawa Timur | Januari 2021 – April 2021 |

- **BKPSDM Kota Batu:** Membantu tugas kesekretariatan dan administrasi kepegawaian di lingkungan pemerintah kota.
- **Erlangga Computindo:** Lokasi di Ruko R-8, Jl. Kapten Pierre Tendean, Pulo Lor, Kec. Jombang. Melakukan perawatan dan perbaikan perangkat keras serta dukungan teknis kepada pelanggan.

**Elemen yang dapat diedit via Admin:**
- Tambah / hapus / edit entri pengalaman
- Field: nama perusahaan, posisi, lokasi, tanggal mulai, tanggal selesai, deskripsi (bullet points), logo perusahaan (upload)

---

### 6.5 Seksi Pendidikan (Education)

**Tujuan:** Menampilkan latar belakang akademik.

**Elemen yang ditampilkan:**
- Nama institusi, gelar, program studi, periode, deskripsi (opsional)

**Data Awal (dari CV):**

| Institusi | Gelar | Program Studi | Periode |
|-----------|-------|---------------|---------|
| Universitas Muhammadiyah Malang | Sarjana (S1) | Informatika | September 2022 – September 2026 |

Deskripsi: Penelitian tugas akhir mengenai klasifikasi data poisoning pada dataset MovieLens menggunakan Sentence-BERT (SBERT) sebagai metode ekstraksi fitur dan XGBoost sebagai algoritma klasifikasi.

**Elemen yang dapat diedit via Admin:**
- Tambah / hapus / edit entri pendidikan
- Field: nama institusi, gelar, program studi, tanggal mulai, tanggal selesai, deskripsi, logo institusi (upload)

---

### 6.6 Seksi Proyek (Projects)

**Tujuan:** Memperlihatkan portofolio proyek nyata sebagai bukti kemampuan teknis.

**Elemen yang ditampilkan:**
- Grid kartu proyek
- Per kartu: nama proyek, deskripsi singkat, tech stack, thumbnail, link (GitHub / Live Demo)

**Data Awal (proyek yang disebutkan dalam CV):**

| Proyek | Deskripsi | Tech Stack |
|--------|-----------|------------|
| Data Poisoning Detection - MovieLens | Sistem klasifikasi data poisoning menggunakan SBERT untuk ekstraksi fitur dan XGBoost untuk klasifikasi | Python, SBERT, XGBoost, Scikit-learn, NLTK |
| (Proyek Flutter) | Pengembangan aplikasi mobile selama perkuliahan | Flutter, Firebase, Dart |
| (Proyek Android) | Pengembangan aplikasi Android | Java/Kotlin, Android Studio |

**Elemen yang dapat diedit via Admin:**
- Tambah / hapus / edit proyek
- Field: judul, deskripsi, tech stack (tags), thumbnail (upload), URL GitHub, URL demo, status (featured / regular)

---

### 6.7 Seksi Kontak (Contact)

**Tujuan:** Memudahkan calon rekruter atau klien menghubungi pemilik.

**Elemen yang ditampilkan:**
- Form kontak (nama, email, pesan) → kirim ke email pemilik
- Informasi kontak langsung:
  - **Email:** izzatfarahidi@gmail.com
  - **WhatsApp:** 0895386011371
  - **LinkedIn:** linkedin.com/in/muhammad-izzat-458355379
  - **Alamat:** Jogoroto, Kabupaten Jombang, Jawa Timur, Indonesia
- Embed peta lokasi (Google Maps, opsional)

**Elemen yang dapat diedit via Admin:**
- Email, nomor WhatsApp, URL LinkedIn, URL GitHub
- Alamat lengkap
- Teks ajakan (call-to-action text)

---

### 6.8 Footer

**Elemen yang ditampilkan:**
- Nama & tagline singkat
- Link navigasi cepat
- Link sosial media
- Copyright notice

**Elemen yang dapat diedit via Admin:**
- Teks copyright
- Link sosial media

---

## 7. Halaman Admin Panel

### 7.1 Autentikasi

- Akses Admin melalui route tersembunyi: `/admin/login`
- Login menggunakan email dan password (Supabase Auth)
- Satu akun admin (single-user untuk versi 1.0)
- Session management otomatis (token JWT)
- Redirect ke `/admin/dashboard` jika sudah login
- Logout dengan invalidasi session

**Keamanan:**
- Route `/admin/*` dilindungi dengan middleware autentikasi
- Gagal autentikasi → redirect ke halaman login
- Rate limiting untuk mencegah brute-force (bawaan Supabase)

---

### 7.2 Dashboard Admin

**Tampilan:** Sidebar navigasi + area konten utama

**Sidebar berisi link ke:**
- Overview / Dashboard Home
- Hero Section
- About Section
- Skills
- Experience
- Education
- Projects
- Contact & Social Links
- Pengaturan Umum (metadata SEO, favicon)
- Logout

**Dashboard Home menampilkan:**
- Ringkasan status setiap seksi (apakah sudah diisi / lengkap)
- Tombol cepat ke setiap editor seksi
- Preview link ke halaman publik

---

### 7.3 Fitur Editor Per Seksi

Setiap halaman editor seksi memiliki pola yang konsisten:

```
┌──────────────────────────────────────┐
│  Edit Seksi: [Nama Seksi]            │
│                                      │
│  [Form fields berdasarkan seksi]     │
│                                      │
│  [Upload area jika ada media]        │
│                                      │
│  [ Simpan Perubahan ]  [ Preview ]   │
└──────────────────────────────────────┘
```

**Fitur umum di semua editor:**
- Auto-save draft (opsional)
- Tombol "Simpan" → update database langsung, perubahan live di halaman publik
- Tombol "Preview" → buka halaman publik di tab baru
- Validasi form (field wajib, format URL, dll.)
- Notifikasi sukses / error

---

### 7.4 Manajemen Media

- Upload foto profil (format: JPG, PNG, WebP; maks 2MB)
- Upload file CV (format: PDF; maks 5MB)
- Upload logo perusahaan / institusi per entri pengalaman & pendidikan
- Upload thumbnail proyek (format: JPG, PNG, WebP; maks 1MB)
- Semua file disimpan di Supabase Storage
- Preview sebelum simpan

---

## 8. Persyaratan Teknis Non-Fungsional

### 8.1 Performa
- Skor Lighthouse ≥ 90 untuk Performance, Accessibility, SEO
- First Contentful Paint (FCP) < 1.5 detik
- Gambar dioptimalkan menggunakan `next/image` (WebP, lazy loading)
- Font dimuat dengan strategi `font-display: swap`

### 8.2 Responsivitas
- Desain mobile-first
- Breakpoint: Mobile (< 768px), Tablet (768px–1024px), Desktop (> 1024px)
- Admin panel juga responsif di tablet

### 8.3 SEO
- Meta title dan description yang dapat diedit via admin
- Open Graph tags untuk preview di sosial media
- Schema markup (JSON-LD) untuk Person
- URL canonical
- Sitemap.xml otomatis
- robots.txt (exclude `/admin/*`)

### 8.4 Keamanan
- HTTPS wajib (otomatis di Vercel)
- Sanitasi semua input pada admin panel
- File upload divalidasi tipe dan ukuran di sisi server
- API routes Next.js dilindungi dengan pengecekan session
- Variabel sensitif (API keys) di environment variables, tidak di-commit ke repository

### 8.5 Aksesibilitas
- Semantic HTML (heading hierarchy, landmark roles)
- Alt text untuk semua gambar
- Kontras warna memenuhi WCAG 2.1 AA
- Keyboard navigable

---

## 9. Desain & Branding

### 9.1 Palet Warna (Usulan)
| Elemen | Warna |
|--------|-------|
| Background | `#0F172A` (Slate 900 — mode gelap) |
| Surface / Card | `#1E293B` (Slate 800) |
| Accent / Primary | `#6366F1` (Indigo 500) |
| Text Utama | `#F1F5F9` (Slate 100) |
| Text Sekunder | `#94A3B8` (Slate 400) |
| Border | `#334155` (Slate 700) |

> Mode terang sebagai opsional di versi mendatang.

### 9.2 Tipografi
- **Heading:** `Inter` atau `Plus Jakarta Sans` (Google Fonts)
- **Body:** `Inter`
- **Kode / Monospace:** `JetBrains Mono` (untuk badge tech stack)

### 9.3 Gaya Visual
- Tema gelap (dark mode) profesional
- Efek glassmorphism pada kartu (opsional, subtle)
- Animasi scroll reveal yang halus (Framer Motion)
- Ikon dari `Lucide React` atau `React Icons`
- Gradien aksen pada elemen CTA dan heading utama

---

## 10. Skema Database (Supabase / PostgreSQL)

```sql
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

-- Tabel: about
CREATE TABLE about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary TEXT NOT NULL,
  stats JSONB, -- [{ "label": "Proyek", "value": "10+" }]
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER CHECK (level BETWEEN 1 AND 5),
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Tabel: experience
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT[], -- array of bullet points
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0
);

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

-- Tabel: projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[], -- ['Python', 'XGBoost', 'SBERT']
  thumbnail_url TEXT,
  github_url TEXT,
  demo_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

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

-- Tabel: seo_settings
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Row Level Security (RLS):**
- Tabel bersifat `SELECT` publik untuk pengunjung
- `INSERT`, `UPDATE`, `DELETE` hanya untuk user yang terautentikasi (admin)

---

## 11. User Stories

### Sebagai Admin:
| ID | User Story | Prioritas |
|----|------------|-----------|
| A01 | Saya dapat login ke admin panel dengan email dan password | Tinggi |
| A02 | Saya dapat memperbarui foto profil dan informasi di seksi Hero | Tinggi |
| A03 | Saya dapat mengedit teks ringkasan di seksi About | Tinggi |
| A04 | Saya dapat menambah, mengedit, dan menghapus entri keahlian | Tinggi |
| A05 | Saya dapat menambah, mengedit, dan menghapus entri pengalaman kerja | Tinggi |
| A06 | Saya dapat menambah, mengedit, dan menghapus entri pendidikan | Tinggi |
| A07 | Saya dapat menambah, mengedit, dan menghapus proyek beserta thumbnail | Tinggi |
| A08 | Saya dapat memperbarui informasi kontak dan link sosial media | Tinggi |
| A09 | Saya dapat mengupload file PDF CV yang dapat diunduh pengunjung | Tinggi |
| A10 | Saya dapat melihat preview halaman publik setelah menyimpan perubahan | Sedang |
| A11 | Saya dapat mengedit meta title dan meta description untuk SEO | Sedang |
| A12 | Saya dapat logout dari admin panel | Tinggi |

### Sebagai Pengunjung:
| ID | User Story | Prioritas |
|----|------------|-----------|
| V01 | Saya dapat melihat profil lengkap Muhammad Izzat di halaman utama | Tinggi |
| V02 | Saya dapat mengunduh file CV dalam format PDF | Tinggi |
| V03 | Saya dapat mengklik link LinkedIn dan GitHub untuk melihat profil | Tinggi |
| V04 | Saya dapat menghubungi via WhatsApp langsung dari website | Tinggi |
| V05 | Saya dapat melihat proyek-proyek yang pernah dikerjakan beserta tech stack-nya | Tinggi |
| V06 | Saya dapat mengakses link GitHub atau demo live setiap proyek | Sedang |
| V07 | Saya dapat mengisi form kontak untuk mengirim pesan | Sedang |
| V08 | Website dapat diakses dengan nyaman dari perangkat mobile saya | Tinggi |

---

## 12. Milestone & Timeline

| Fase | Deskripsi | Estimasi Durasi |
|------|-----------|-----------------|
| **Fase 1** | Setup proyek, konfigurasi Supabase & Vercel, skema database | 2 hari |
| **Fase 2** | Pengembangan halaman utama (semua seksi, data statis) | 5 hari |
| **Fase 3** | Integrasi Supabase — halaman utama mengambil data dari database | 2 hari |
| **Fase 4** | Pengembangan Admin Panel (autentikasi + semua halaman editor) | 5 hari |
| **Fase 5** | Fitur upload media ke Supabase Storage | 2 hari |
| **Fase 6** | Optimasi (SEO, performa, responsivitas, aksesibilitas) | 2 hari |
| **Fase 7** | Testing menyeluruh, perbaikan bug, deployment final | 2 hari |
| **Total** | | **~20 hari** |

---

## 13. Kriteria Penerimaan (Definition of Done)

Fitur dianggap selesai jika:
- [ ] Semua data di halaman utama bersumber dari database (tidak ada data hardcoded)
- [ ] Admin dapat melakukan CRUD pada semua seksi tanpa menyentuh kode
- [ ] Perubahan dari admin langsung terlihat di halaman publik
- [ ] Halaman utama responsif di semua breakpoint
- [ ] Skor Lighthouse ≥ 90 di semua kategori
- [ ] Route admin tidak dapat diakses tanpa login
- [ ] Upload media berfungsi dan file tersimpan di Supabase Storage
- [ ] Form kontak dapat mengirim pesan ke email pemilik
- [ ] Website terdeploy di Vercel dan dapat diakses secara publik

---

## 14. Risiko & Mitigasi

| Risiko | Dampak | Kemungkinan | Mitigasi |
|--------|--------|-------------|----------|
| Batas kuota gratis Supabase terlampaui | Tinggi | Rendah | Monitor usage, optimalkan query, upgrade jika perlu |
| Performa buruk karena gambar tidak dioptimalkan | Sedang | Sedang | Wajib gunakan `next/image` dengan kompresi otomatis |
| Keamanan admin panel bocor | Tinggi | Rendah | Middleware autentikasi ketat, environment variables, RLS Supabase |
| Konten tidak update real-time | Rendah | Rendah | Gunakan `revalidatePath` Next.js atau ISR |

---

## 15. Referensi & Sumber Daya

- **CV Sumber:** Muhammad Izzat — Lulusan Informatika UMM 2026
- **LinkedIn:** [linkedin.com/in/muhammad-izzat-458355379](https://www.linkedin.com/in/muhammad-izzat-458355379)
- **Kontak:** izzatfarahidi@gmail.com | 0895386011371
- **Dokumentasi Next.js:** https://nextjs.org/docs
- **Dokumentasi Supabase:** https://supabase.com/docs
- **Dokumentasi Tailwind CSS:** https://tailwindcss.com/docs
- **Vercel Deployment:** https://vercel.com/docs

---

*Dokumen ini merupakan acuan pengembangan versi 1.0. Perubahan dan penambahan fitur akan didokumentasikan dalam versi PRD berikutnya.*