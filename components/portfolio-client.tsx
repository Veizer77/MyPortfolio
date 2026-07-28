"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Mail, Sun, Moon, MapPin, Download, ChevronRight, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { LampContainer } from "@/components/ui/lamp";

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

// Dummy Data Fallbacks
const dummyHero = {
  name: "Muhammad Izzat", tagline: "Fresh Graduate | Software Engineer & AI Enthusiast", location: "Jombang, Jawa Timur, Indonesia",
  photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Izzat&backgroundColor=6366f1", cvUrl: "#",
};

const dummyAbout = {
  summary: "Lulusan baru Program Studi Informatika Universitas Muhammadiyah Malang yang memiliki minat besar pada pengembangan perangkat lunak, Artificial Intelligence, Machine Learning, Cybersecurity, dan Penetration Testing. Penelitian tugas akhir berfokus pada klasifikasi data poisoning pada dataset MovieLens menggunakan Sentence-BERT dan XGBoost.",
  stats: [ { label: "Proyek", value: "10+" }, { label: "Pengalaman", value: "2 Tahun" } ]
};

const dummySkills = [
  { category: "Programming", skills: ["Python", "Dart (Flutter)", "Java (Android)", "JavaScript"] },
  { category: "AI / ML", skills: ["Sentence-BERT", "XGBoost", "NLP", "Scikit-learn"] },
  { category: "Web Development", skills: ["HTML", "CSS", "Next.js / React"] },
  { category: "Mobile Development", skills: ["Flutter", "Android Native"] },
  { category: "Cybersecurity", skills: ["Penetration Testing", "Vulnerability Assessment"] },
  { category: "Tools & Platform", skills: ["Firebase", "Git", "GitHub", "VS Code", "Android Studio"] },
  { category: "Database", skills: ["PostgreSQL", "Firebase Firestore"] },
];

const dummyExperience = [
  { company: "BKPSDM Kota Batu", position: "Secretary", location: "Batu, Jawa Timur", period: "Juli 2025 – Agustus 2025", description: ["Membantu tugas kesekretariatan dan administrasi kepegawaian di lingkungan pemerintah kota."] },
  { company: "Erlangga Computindo", position: "Technical Support Specialist", location: "Jombang, Jawa Timur", period: "Januari 2021 – April 2021", description: ["Melakukan perawatan dan perbaikan perangkat keras serta dukungan teknis kepada pelanggan."] }
];

const dummyEducation = [
  { institution: "Universitas Muhammadiyah Malang", degree: "Sarjana (S1)", field: "Informatika", period: "September 2022 – September 2026", description: "Penelitian tugas akhir mengenai klasifikasi data poisoning pada dataset MovieLens menggunakan Sentence-BERT (SBERT) sebagai metode ekstraksi fitur dan XGBoost sebagai algoritma klasifikasi." }
];

const dummyProjects = [
  { title: "Data Poisoning Detection - MovieLens", description: "Sistem klasifikasi data poisoning menggunakan SBERT untuk ekstraksi fitur dan XGBoost untuk klasifikasi.", techStack: ["Python", "SBERT", "XGBoost", "Scikit-learn"], thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop", githubUrl: "#", demoUrl: "#" },
  { title: "E-Commerce App (Flutter)", description: "Pengembangan aplikasi mobile e-commerce komprehensif selama perkuliahan dengan integrasi backend.", techStack: ["Flutter", "Firebase", "Dart"], thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop", githubUrl: "#", demoUrl: "#" }
];

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [10, -10]);
  const rotateY = useTransform(x, [-200, 200], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX - width / 2);
    y.set(mouseY - height / 2);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

export default function PortfolioClient({ hero, about, skills, experience, education, projects, contact }: any) {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);


  const renderLogo = (isLarge: boolean = false) => {
    if (heroData?.logo_image) {
      return <img src={getDirectImageUrl(heroData.logo_image) || heroData.logo_image} alt="Logo" className={isLarge ? "h-24 md:h-32 w-auto object-contain mb-8" : "h-8 w-auto object-contain"} />;
    }
    const textClass = isLarge 
      ? "text-6xl md:text-8xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-8 bg-[length:200%_auto] animate-gradient"
      : "text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent";
    const textStr = heroData?.logo_text ? heroData.logo_text : (heroData?.name ? heroData.name.split(" ").map((n: string) => n[0]).join("") : "MI");
    return <div className={textClass}>{textStr}</div>;
  };

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const supabase = createClient();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // Kunci scroll saat splash screen muncul
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Hilangkan splash setelah 2.5 detik
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [showSplash]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    const { error } = await supabase.from('messages').insert([
      { name: formName, email: formEmail, message: formMessage }
    ]);
    if (error) {
      console.error("Supabase Error Full:", error);
      toast.error(`Gagal mengirim pesan: ${error.message} (Code: ${error.code})`);
      setSubmitStatus("error");
    } else {
      toast.success("Pesan terkirim!", { description: "Terima kasih sudah menghubungi saya." });
      setSubmitStatus("success");
      setFormName(""); setFormEmail(""); setFormMessage("");
    }
    setIsSubmitting(false);
  };

  // Safe Data parsing
  const h = hero || dummyHero;
  // map DB fields if they exist
  const heroData = {
    name: h.name,
    tagline: h.tagline,
    location: h.location,
    photoUrl: h.photo_url || h.photoUrl,
    cvUrl: h.cv_url || h.cvUrl,
    logo_text: h.logo_text || null,
    logo_image: h.logo_image || null,
  };

  const a = about || dummyAbout;
  const aboutData = {
    summary: a.summary,
    stats: typeof a.stats === 'string' ? JSON.parse(a.stats) : a.stats,
  };

  let groupedSkills = dummySkills;
  if (skills && skills.length > 0) {
    const map = new Map();
    skills.forEach((s: any) => {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category).push(s.name);
    });
    groupedSkills = Array.from(map, ([category, skills]) => ({ category, skills }));
  }

  const expData = experience && experience.length > 0 ? experience.map((e: any) => ({
    company: e.company, position: e.position, location: e.location,
    period: `${new Date(e.start_date).getFullYear()} - ${e.is_current ? 'Present' : e.end_date ? new Date(e.end_date).getFullYear() : 'Present'}`,
    description: e.description || []
  })) : dummyExperience;

  const eduData = education && education.length > 0 ? education.map((e: any) => ({
    institution: e.institution, degree: e.degree, field: e.field_of_study,
    period: `${new Date(e.start_date).getFullYear()} - ${e.end_date ? new Date(e.end_date).getFullYear() : 'Present'}`,
    description: e.description
  })) : dummyEducation;

  const projData = projects && projects.length > 0 ? projects.map((p: any) => ({
    title: p.title, description: p.description, techStack: p.tech_stack || [],
    thumbnail: p.thumbnail_url, githubUrl: p.github_url, demoUrl: p.demo_url
  })) : dummyProjects;

  const contactData = contact || { email: "izzatfarahidi@gmail.com", linkedin_url: "#", location: heroData.location };

  return (
    <>
      {/* Spotlight Mouse Cursor Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.08), transparent 40%)`
        }}
      />

      {/* Floating Animated Orbs in Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0], scale: [1, 1.2, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -80, 50, 0], y: [0, 80, -30, 0], scale: [1, 0.8, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="absolute top-2/3 right-1/4 w-[30rem] h-[30rem] bg-purple-500/10 rounded-full blur-[120px]"
        />
      </div>

      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              {renderLogo(true)}
              <div className="w-48 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
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
                className="text-slate-500 dark:text-slate-400 mt-6 text-sm tracking-[0.3em] uppercase"
              >
                Memuat Portofolio
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500/30 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        
        {/* Scroll Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 origin-left z-[60]" 
          style={{ scaleX }} 
        />

        {/* Floating Dynamic Island Navbar */}
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <motion.nav 
            layout
            onMouseEnter={() => setIsNavHovered(true)}
            onMouseLeave={() => setIsNavHovered(false)}
            animate={{ 
              maxWidth: (!isScrolled || isNavHovered) ? "1152px" : "100px",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25, mass: 1.2 }}
            className="pointer-events-auto w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-full shadow-2xl shadow-slate-200/50 dark:shadow-indigo-500/10 overflow-hidden flex items-center justify-center"
          >
            <div className="h-16 flex items-center justify-between w-full px-2">
              <motion.div 
                layout
                className="flex-shrink-0 flex items-center justify-center px-4"
                animate={{ 
                  flex: (!isScrolled || isNavHovered) ? "0 0 auto" : "1 1 0%" 
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderLogo(false)}
              </motion.div>
              
              <AnimatePresence>
                {(!isScrolled || isNavHovered) && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, width: "100%", filter: "blur(0px)" }}
                    exit={{ opacity: 0, width: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-between w-full pr-4 overflow-hidden whitespace-nowrap"
                  >
                    <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 ml-4">
                      <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</a>
                      <a href="#skills" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Skills</a>
                      <a href="#experience" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Experience</a>
                      <a href="#projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Projects</a>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                      <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="relative flex items-center w-14 h-7 p-1 rounded-full bg-slate-200 dark:bg-slate-800 transition-colors shadow-inner cursor-pointer border border-slate-300 dark:border-slate-700"
                      >
                        <div className="absolute left-1.5 z-10 text-yellow-500"><Sun className="w-3.5 h-3.5" /></div>
                        <div className="absolute right-1.5 z-10 text-indigo-400"><Moon className="w-3.5 h-3.5" /></div>
                        <motion.div 
                          layout
                          initial={false}
                          animate={{ x: isDarkMode ? 28 : 0 }}
                          className="w-5 h-5 bg-white dark:bg-slate-950 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.2)] dark:shadow-[0_2px_5px_rgba(0,0,0,0.5)] z-20"
                        />
                      </button>
                      <a href="#contact" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-6 shadow-md shadow-indigo-500/20">
                        Contact
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>
        </div>

      <main className="pt-24 pb-16">
        
        {/* HERO SECTION */}
        <section id="hero" className="max-w-6xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex-1 space-y-6 text-center md:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.2, duration: 0.5, type: "spring" }}
            >
              <Badge variant="secondary" className="relative overflow-hidden bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 px-4 py-1.5 text-sm">
                <span className="relative z-10">Welcome to my portfolio</span>
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
                  className="absolute inset-0 z-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
              </Badge>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 2.3 }}
              className="text-5xl md:text-7xl font-bold tracking-tight"
            >
              Hi, I'm <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{heroData.name}</span>
            </motion.h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 flex flex-wrap justify-center md:justify-start overflow-hidden">
              {heroData.tagline?.split("").map((char: string, i: number) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, display: "none" }}
                  animate={{ opacity: 1, display: "inline-block" }}
                  transition={{ duration: 0.1, delay: 2.5 + (i * 0.05) }}
                  className="whitespace-pre"
                >
                  {char}
                </motion.span>
              ))}
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8, delay: 2.5 }}
                className="inline-block w-1 h-6 md:h-8 bg-indigo-500 ml-1 translate-y-1 md:translate-y-2"
              />
            </p>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
              className="flex items-center justify-center md:justify-start gap-2 text-slate-600 dark:text-slate-400"
            >
              <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-bounce" />
              <span>{heroData.location}</span>
            </motion.div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-shadow duration-300 transform hover:-translate-y-1">
                <Download className="w-5 h-5 mr-2" /> Download CV
              </Button>
              <div className="flex gap-4">
                <motion.a whileHover={{ scale: 1.15, rotate: 5, y: -5 }} whileTap={{ scale: 0.9 }} href={contactData.github_url || "#"} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "icon", className: "rounded-full w-12 h-12 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-lg" })}>
                  <FaGithub className="w-5 h-5" />
                </motion.a>
                <motion.a whileHover={{ scale: 1.15, rotate: -5, y: -5 }} whileTap={{ scale: 0.9 }} href={contactData.linkedin_url || "#"} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "icon", className: "rounded-full w-12 h-12 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 shadow-lg" })}>
                  <FaLinkedin className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="flex-1 flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-80 md:w-80 md:h-[24rem] rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-500 p-1 animate-gradient bg-[length:200%_auto] shadow-2xl shadow-indigo-500/20 group cursor-pointer hover:-translate-y-2 transition-transform duration-500">
              <div className="w-full h-full rounded-[1.4rem] bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
                <img src={getDirectImageUrl(heroData.photoUrl)} alt={heroData.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About <span className="text-indigo-600 dark:text-indigo-400">Me</span></h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                {aboutData.summary}
              </p>
              <div className="flex gap-8">
                {aboutData.stats?.map((stat: any, i: number) => (
                  <div key={i}>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-6">Education Highlight</h3>
              <div className="relative border-l-2 border-indigo-500/30 dark:border-indigo-500/20 ml-3 space-y-8">
                {eduData.map((edu: any, i: number) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{edu.degree} in {edu.field}</h4>
                    <p className="text-indigo-600 dark:text-indigo-400 mb-2">{edu.institution}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{edu.period}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{edu.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="max-w-6xl mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My <span className="text-indigo-600 dark:text-indigo-400">Skills</span></h2>
            <p className="text-slate-600 dark:text-slate-400">Technologies and tools I work with.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedSkills.map((category: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                key={i}
              >
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none h-full">
                  <CardHeader>
                    <CardTitle className="text-lg text-indigo-600 dark:text-indigo-400">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2 pt-4">
                    {category.skills.map((skill: string, j: number) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.1 + j * 0.05, type: "spring", stiffness: 200 }}
                      >
                        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-slate-900 dark:text-white transition-colors px-3 py-1 cursor-default">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="max-w-4xl mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Work <span className="text-indigo-600 dark:text-indigo-400">Experience</span></h2>
          </motion.div>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {expData.map((exp: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white dark:bg-slate-900 group-[.is-active]:bg-indigo-500 text-slate-500 dark:text-slate-400 group-[.is-active]:text-slate-900 dark:text-white group-[.is-active]:border-indigo-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none shadow-xl">
                  <div className="flex flex-col mb-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{exp.company}</span>
                    <span className="text-slate-900 dark:text-white text-xl font-bold">{exp.position}</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                    {exp.period} • {exp.location}
                  </div>
                  <ul className="text-slate-600 dark:text-slate-400 text-sm list-disc list-inside space-y-1">
                    {exp.description.map((desc: string, j: number) => (
                      <li key={j}>{desc}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="max-w-6xl mx-auto px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="text-indigo-600 dark:text-indigo-400">Projects</span></h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projData.map((project: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: i * 0.15 }}
                key={i}
              >
                <TiltCard className="group relative h-full">
                  <div className="absolute -inset-px bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" style={{ transform: "translateZ(-10px)" }} />
                  <Card className="relative bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden h-full flex flex-col rounded-xl" style={{ transform: "translateZ(20px)" }}>
                    <div className="relative h-64 md:h-72 overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
                      <img src={getDirectImageUrl(project.thumbnail) || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop"} alt={project.title} className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/5 dark:bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    <CardHeader className="relative z-10 bg-white dark:bg-slate-900 pt-6" style={{ transform: "translateZ(30px)" }}>
                      <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">{project.title}</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 pt-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10 flex-1 flex flex-col justify-end bg-white dark:bg-slate-900 pb-6" style={{ transform: "translateZ(30px)" }}>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.map((tech: string, j: number) => (
                          <Badge key={j} variant="outline" className="border-slate-300 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800/50 text-indigo-500 dark:text-indigo-300">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <a href={project.githubUrl || "#"} className={buttonVariants({ variant: "secondary", className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-slate-900 dark:text-white flex-1 transition-colors" })}>
                          <FaGithub className="w-4 h-4 mr-2" /> Code
                        </a>
                        <a href={project.demoUrl || "#"} className={buttonVariants({ variant: "secondary", className: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-700 flex-1 transition-colors" })}>
                          <ExternalLink className="w-4 h-4 mr-2" /> Demo
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="max-w-4xl mx-auto px-6 py-20">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/5">
            <LampContainer className="pt-2">
              <motion.div 
                initial={{ opacity: 0.5, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                className="text-center px-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Let's <span className="text-indigo-600 dark:text-indigo-400">Connect</span></h2>
                <p className="text-slate-600 dark:text-slate-400">I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
              </motion.div>
            </LampContainer>

            <div className="grid md:grid-cols-2 gap-12 p-8 md:p-12 pt-0 md:pt-4">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                    <p className="text-slate-900 dark:text-white font-medium">{contactData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FaLinkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">LinkedIn</p>
                    <p className="text-slate-900 dark:text-white font-medium hover:text-indigo-600 dark:text-indigo-400 transition-colors">
                      <a href={contactData.linkedin_url || "#"} target="_blank" rel="noreferrer">Connect with me</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Location</p>
                    <p className="text-slate-900 dark:text-white font-medium">{contactData.location || heroData.location}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Name</Label>
                  <Input id="name" required value={formName} onChange={e => setFormName(e.target.value)} placeholder="John Doe" className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-600 focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                  <Input id="email" required value={formEmail} onChange={e => setFormEmail(e.target.value)} type="email" placeholder="john@example.com" className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-600 focus-visible:ring-indigo-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-700 dark:text-slate-300">Message</Label>
                  <Textarea id="message" required value={formMessage} onChange={e => setFormMessage(e.target.value)} placeholder="Hi, I think we need a design system..." className="min-h-[120px] bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-600 focus-visible:ring-indigo-500" />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                  {isSubmitting ? "Sending..." : "Send Message"} <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                {submitStatus === "success" && <p className="text-green-500 text-sm mt-2">Message sent successfully!</p>}
                {submitStatus === "error" && <p className="text-red-500 text-sm mt-2">Failed to send message. Please try again.</p>}
              </form>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} {heroData.name}. All rights reserved.</p>
      </footer>
      
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center transition-colors border-2 border-white dark:border-slate-900"
          >
            <ChevronRight className="w-6 h-6 -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
