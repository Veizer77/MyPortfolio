"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    messages: 0,
    unreadMessages: 0
  });
  
  const [status, setStatus] = useState([
    { name: "Hero Section", complete: false },
    { name: "About Section", complete: false },
    { name: "Skills", complete: false },
    { name: "Experience", complete: false },
    { name: "Education", complete: false },
    { name: "Projects", complete: false },
  ]);
  
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOverview() {
      try {
        // Fetch counts for stats
        const { count: skillsCount } = await supabase.from('skills').select('*', { count: 'exact', head: true });
        const { count: projectsCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        const { count: messagesCount } = await supabase.from('messages').select('*', { count: 'exact', head: true });
        const { count: unreadCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false);
        
        setStats({
          skills: skillsCount || 0,
          projects: projectsCount || 0,
          messages: messagesCount || 0,
          unreadMessages: unreadCount || 0
        });

        // Fetch completion status
        const { count: heroCount } = await supabase.from('hero').select('*', { count: 'exact', head: true });
        const { count: aboutCount } = await supabase.from('about').select('*', { count: 'exact', head: true });
        const { count: expCount } = await supabase.from('experience').select('*', { count: 'exact', head: true });
        const { count: eduCount } = await supabase.from('education').select('*', { count: 'exact', head: true });

        setStatus([
          { name: "Hero Section", complete: (heroCount || 0) > 0 },
          { name: "About Section", complete: (aboutCount || 0) > 0 },
          { name: "Skills", complete: (skillsCount || 0) > 0 },
          { name: "Experience", complete: (expCount || 0) > 0 },
          { name: "Education", complete: (eduCount || 0) > 0 },
          { name: "Projects", complete: (projectsCount || 0) > 0 },
        ]);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchOverview();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back. Here is the real-time overview of your portfolio data.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.skills}</div>
            <p className="text-xs text-indigo-400 mt-1">Acquired skills</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.projects}</div>
            <p className="text-xs text-indigo-400 mt-1">Portfolio projects</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Inbox Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.messages}</div>
            <p className="text-xs text-amber-500 mt-1">{stats.unreadMessages} unread messages</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl text-white">Content Completion Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {status.map((item) => (
              <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-950/50">
                {item.complete ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                )}
                <span className="text-sm font-medium text-slate-300">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
