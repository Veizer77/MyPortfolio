"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Code2, Cpu, ShieldCheck, Smartphone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  heroData: {
    name: string;
    tagline: string;
    location: string;
    photoUrl?: string;
    logo_image?: string | null;
    logo_text?: string | null;
  };
  aboutSummary?: string;
  onEnter: () => void;
}

export default function WelcomeScreen({ heroData, aboutSummary, onEnter }: WelcomeScreenProps) {
  const highlights = [
    { icon: Smartphone, label: "Mobile Dev (Flutter)" },
    { icon: Code2, label: "Web Dev (Next.js)" },
    { icon: Cpu, label: "AI & ML" },
    { icon: ShieldCheck, label: "Cybersecurity" },
  ];

  return (
    <motion.div
      key="welcome-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-2xl overflow-y-auto"
    >
      {/* Background ambient lighting effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]"
        />
      </div>

      {/* Main Glassmorphism Portal Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="relative z-10 w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-500/10 text-center flex flex-col items-center my-auto"
      >
        {/* Top Status & Welcome Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Selamat Datang</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
        </motion.div>

        {/* Profile Avatar / Logo with Glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
          className="relative mb-6 group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-950 flex items-center justify-center shadow-inner">
            {heroData.photoUrl ? (
              <img
                src={heroData.photoUrl}
                alt={heroData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-black text-indigo-400">
                {heroData.name ? heroData.name.split(" ").map((n) => n[0]).join("") : "MI"}
              </span>
            )}
          </div>
        </motion.div>

        {/* Name & Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
        >
          {heroData.name || "Muhammad Izzat Farahidi"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="text-sm sm:text-base font-medium bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent mt-1"
        >
          {heroData.tagline || "Software Engineer & AI Enthusiast"}
        </motion.p>

        {heroData.location && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center gap-1.5 text-xs text-slate-400 mt-2"
          >
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>{heroData.location}</span>
          </motion.div>
        )}

        {/* Short Bio / Intro Explanation */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="text-xs sm:text-sm text-slate-300/90 leading-relaxed mt-4 max-w-md"
        >
          {aboutSummary ||
            "Selamat datang di portofolio digital saya! Di sini Anda dapat mengeksplorasi latar belakang, keahlian, proyek-proyek terbaru, dan pengalaman profesional saya dalam pengembangan software & AI."}
        </motion.p>

        {/* Skill Highlights Chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mt-5"
        >
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700/60 text-slate-300 shadow-sm hover:border-indigo-500/50 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-400" />
                {item.label}
              </span>
            );
          })}
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-6" />

        {/* CTA Enter Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="w-full"
        >
          <Button
            onClick={onEnter}
            size="lg"
            className="group relative w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Masuk ke Portofolio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
