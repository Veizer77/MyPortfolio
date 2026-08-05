"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function getDirectImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
  }
  return url;
}

interface WelcomeClientProps {
  hero: any;
}

export default function WelcomeClient({ hero }: WelcomeClientProps) {
  const [showSplash, setShowSplash] = useState(true);

  const heroData = {
    name: hero?.name || "Muhammad Izzat Farahidi",
    tagline: hero?.tagline || "Software Engineer & AI Enthusiast",
    location: hero?.location || "Jombang, Jawa Timur, Indonesia",
    photoUrl: getDirectImageUrl(hero?.photo_url),
    logo_text: hero?.logo_text || null,
    logo_image: hero?.logo_image || null,
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setShowSplash(false);
      document.body.style.overflow = 'unset';
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const renderLogo = (isLarge: boolean = false) => {
    if (heroData?.logo_image) {
      return (
        <img
          src={getDirectImageUrl(heroData.logo_image) || heroData.logo_image}
          alt="Logo"
          className={isLarge ? "h-24 md:h-32 w-auto object-contain mb-8" : "h-8 w-auto object-contain"}
        />
      );
    }
    const textClass = isLarge
      ? "text-6xl md:text-8xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-8 bg-[length:200%_auto] animate-gradient"
      : "text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent";
    const textStr = heroData?.logo_text
      ? heroData.logo_text
      : heroData?.name
      ? heroData.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
      : "MI";
    return <div className={textClass}>{textStr}</div>;
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center overflow-hidden selection:bg-indigo-500/30">
      {/* Balanced Ambient Glowing Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [-50, 40, -50],
            y: [-30, 50, -30],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[26rem] h-[26rem] bg-indigo-500/40 rounded-full blur-[110px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
            x: [50, -40, 50],
            y: [30, -50, 30],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute w-[26rem] h-[26rem] bg-purple-500/40 rounded-full blur-[110px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute w-[20rem] h-[20rem] bg-cyan-500/35 rounded-full blur-[100px]"
        />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Splash Screen Loading */}
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              {renderLogo(true)}
              <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: "0%", x: "-100%" }}
                  animate={{ width: "100%", x: "0%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-slate-400 mt-6 text-sm tracking-[0.3em] uppercase"
              >
                Memuat Portofolio
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          /* Balanced Glassmorphism Card */
          <motion.div
            key="welcome-card"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "rgba(15, 23, 42, 0.35)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
            className="relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center m-4 overflow-hidden"
          >
            {/* Logo Image (Clean Without Circular Frame) */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, type: "spring", stiffness: 200 }}
              className="mb-6 flex justify-center"
            >
              <img
                src="/assets/zet.png"
                alt="Logo ZET"
                className="w-28 sm:w-36 h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            {/* Welcome Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent tracking-tight mb-6"
            >
              Welcome to My Profile
            </motion.h1>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-4" />

            {/* Masuk ke Portofolio Button (Link to /portfolio) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="w-full mt-2"
            >
              <Link
                href="/portfolio"
                className="group relative w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] text-white font-semibold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Masuk ke Portofolio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
