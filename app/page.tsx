import { createClient } from "@/utils/supabase/server";
import WelcomeClient from "@/components/welcome-client";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: hero } = await supabase.from('hero').select('*').single();

  const name = hero?.name || "Muhammad Izzat Farahidi";
  const tagline = hero?.tagline || "Software Engineer & AI Enthusiast";
  const title = `Welcome — ${name}`;
  const description = `Welcome to the digital workspace of ${name}, ${tagline}.`;

  return {
    title,
    description,
    authors: [{ name }],
    creator: name,
    openGraph: {
      type: "website",
      title,
      description,
      siteName: `${name} Welcome Portal`,
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page() {
  const supabase = await createClient();
  const { data: hero } = await supabase.from('hero').select('*').single();

  return <WelcomeClient hero={hero} />;
}
