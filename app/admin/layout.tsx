"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, User, Code2, Briefcase, GraduationCap, FolderGit2, Mail, Settings, LogOut, MessageSquare, BarChart3 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@/utils/supabase/client";

const sidebarLinks = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Visitor Analytics", href: "/admin/dashboard/analytics", icon: BarChart3 },
  { name: "Hero Section", href: "/admin/dashboard/hero", icon: ImageIcon },
  { name: "About", href: "/admin/dashboard/about", icon: User },
  { name: "Skills", href: "/admin/dashboard/skills", icon: Code2 },
  { name: "Experience", href: "/admin/dashboard/experience", icon: Briefcase },
  { name: "Education", href: "/admin/dashboard/education", icon: GraduationCap },
  { name: "Projects", href: "/admin/dashboard/projects", icon: FolderGit2 },
  { name: "Contact", href: "/admin/dashboard/contact", icon: Mail },
  { name: "Inbox", href: "/admin/dashboard/inbox", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  // If it's the login page, don't show the sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold text-white">Admin Panel</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-end px-8 border-b border-slate-800 bg-slate-950/50 backdrop-blur">
          <a href="/" target="_blank" className={buttonVariants({ variant: "outline", className: "border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white" })}>
            View Live Site
          </a>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </main>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
