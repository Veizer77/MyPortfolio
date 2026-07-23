import { createClient } from "@/utils/supabase/server";
import PortfolioClient from "@/components/portfolio-client";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: hero } = await supabase.from('hero').select('*').single();
  const { data: about } = await supabase.from('about').select('*').single();

  const name = hero?.name || "Muhammad Izzat Farahidi";
  const tagline = hero?.tagline || "Software Engineer & AI Enthusiast";
  const summary = about?.summary || "Portfolio website";
  const photoUrl = hero?.photo_url || "";
  const location = hero?.location || "";

  const title = `${name} — ${tagline}`;
  const description = summary.length > 160 ? summary.substring(0, 157) + "..." : summary;

  return {
    title,
    description,
    keywords: [
      name,
      "Portfolio",
      "Software Engineer",
      "AI Enthusiast",
      "Flutter Developer",
      "Next.js",
      location,
    ].filter(Boolean),
    authors: [{ name }],
    creator: name,
    openGraph: {
      type: "website",
      title,
      description,
      siteName: `${name} Portfolio`,
      images: photoUrl ? [{ url: photoUrl, width: 1200, height: 630, alt: name }] : [],
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: photoUrl ? [photoUrl] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function Page() {
  const supabase = await createClient();
  
  // Fetch data in parallel for speed
  const [
    { data: hero },
    { data: about },
    { data: skills },
    { data: experience },
    { data: education },
    { data: projects },
    { data: contact }
  ] = await Promise.all([
    supabase.from('hero').select('*').single(),
    supabase.from('about').select('*').single(),
    supabase.from('skills').select('*').order('sort_order'),
    supabase.from('experience').select('*').order('start_date', { ascending: false }),
    supabase.from('education').select('*').order('start_date', { ascending: false }),
    supabase.from('projects').select('*').order('sort_order'),
    supabase.from('contact').select('*').single()
  ]);

  return (
    <PortfolioClient 
      hero={hero}
      about={about}
      skills={skills}
      experience={experience}
      education={education}
      projects={projects}
      contact={contact}
    />
  );
}

