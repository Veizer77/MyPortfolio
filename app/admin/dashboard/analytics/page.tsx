"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Users, 
  Globe, 
  Smartphone, 
  Laptop, 
  Calendar, 
  Trash2, 
  RefreshCw, 
  Search, 
  Monitor, 
  ShieldAlert,
  Clock,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface VisitorLog {
  id: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  browser: string;
  os: string;
  page_path: string;
  city: string;
  country: string;
  created_at: string;
}

export default function VisitorAnalyticsPage() {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDevice, setFilterDevice] = useState<string>("ALL");
  const supabase = createClient();

  const fetchLogs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("visitor_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("Error fetching visitor logs:", error);
      toast.error("Gagal mengambil data statistik pengunjung");
    } else {
      setLogs(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDeleteLog = async (id: string) => {
    const { error } = await supabase.from("visitor_logs").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus log");
    } else {
      toast.success("Log pengunjung berhasil dihapus");
      setLogs((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleClearAllLogs = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus semua log pengunjung?")) return;

    const { error } = await supabase.from("visitor_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      toast.error("Gagal membersihkan log");
    } else {
      toast.success("Semua log pengunjung berhasil dibersihkan");
      setLogs([]);
    }
  };

  // Metrics calculations
  const stats = useMemo(() => {
    const totalVisits = logs.length;

    const todayStr = new Date().toISOString().split("T")[0];
    const todayVisits = logs.filter((log) => log.created_at.startsWith(todayStr)).length;

    const uniqueIPs = new Set(logs.map((log) => log.ip_address)).size;

    const deviceCounts: Record<string, number> = {};
    logs.forEach((log) => {
      const dev = log.device_type || "Desktop";
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    });

    let topDevice = "Desktop";
    let maxDevCount = 0;
    Object.entries(deviceCounts).forEach(([dev, count]) => {
      if (count > maxDevCount) {
        maxDevCount = count;
        topDevice = dev;
      }
    });

    return { totalVisits, todayVisits, uniqueIPs, topDevice };
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.ip_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.browser && log.browser.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.os && log.os.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.city && log.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.country && log.country.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.page_path && log.page_path.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDevice = filterDevice === "ALL" || log.device_type?.toUpperCase() === filterDevice;

      return matchesSearch && matchesDevice;
    });
  }, [logs, searchQuery, filterDevice]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-400" /> Statistik Pengunjung
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Pantau trafik pengunjung, alamat IP, dan identitas perangkat secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchLogs}
            variant="outline"
            disabled={isLoading}
            className="border-slate-800 text-slate-300 hover:bg-slate-900"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          {logs.length > 0 && (
            <Button
              onClick={handleClearAllLogs}
              variant="destructive"
              className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Hapus Semua
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Kunjungan</p>
            <p className="text-3xl font-extrabold text-white mt-1">{stats.totalVisits}</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Kunjungan Hari Ini</p>
            <p className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.todayVisits}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total IP Unik</p>
            <p className="text-3xl font-extrabold text-purple-400 mt-1">{stats.uniqueIPs}</p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Perangkat Utama</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1 capitalize">{stats.topDevice}</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            {stats.topDevice === "Mobile" ? <Smartphone className="w-6 h-6" /> : <Laptop className="w-6 h-6" />}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Cari IP, Browser, OS, Lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-500 mr-1" />
          {["ALL", "DESKTOP", "MOBILE", "TABLET"].map((dev) => (
            <Button
              key={dev}
              variant={filterDevice === dev ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterDevice(dev)}
              className={
                filterDevice === dev
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                  : "border-slate-800 text-slate-400 hover:bg-slate-950"
              }
            >
              {dev}
            </Button>
          ))}
        </div>
      </div>

      {/* Visitor Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Log Kunjungan Terbaru
          </h2>
          <span className="text-xs text-slate-400">Menampilkan {filteredLogs.length} data</span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-3" />
            <p>Memuat data statistik pengunjung...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <ShieldAlert className="w-10 h-10 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-medium">Belum ada log pengunjung</p>
            <p className="text-xs text-slate-600 mt-1">Data akan muncul otomatis ketika pengunjung mengakses portfolio.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Alamat IP</th>
                  <th className="px-6 py-4">Perangkat & OS</th>
                  <th className="px-6 py-4">Browser</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4">Halaman</th>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* IP Address */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-white">{log.ip_address}</span>
                        {log.ip_address.includes("Localhost") && (
                          <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                            DEV
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Device & OS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {log.device_type === "Mobile" ? (
                          <Smartphone className="w-4 h-4 text-emerald-400" />
                        ) : log.device_type === "Tablet" ? (
                          <TabletIcon className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Monitor className="w-4 h-4 text-indigo-400" />
                        )}
                        <span>{log.os || "Unknown OS"}</span>
                        <span className="text-xs text-slate-500">({log.device_type})</span>
                      </div>
                    </td>

                    {/* Browser */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700">
                        {log.browser || "Unknown"}
                      </Badge>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Globe className="w-3.5 h-3.5 text-slate-500" />
                        <span>{log.city ? `${log.city}, ${log.country}` : log.country || "Indonesia"}</span>
                      </div>
                    </td>

                    {/* Page Path */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-indigo-300">
                      {log.page_path || "/"}
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                      {formatDate(log.created_at)}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLog(log.id)}
                        className="w-8 h-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function TabletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
      <line x1="12" x2="12.01" y1="18" y2="18"/>
    </svg>
  );
}
