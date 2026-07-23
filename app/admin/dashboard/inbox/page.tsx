"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Trash2, CheckCircle, Mail } from "lucide-react";
import { DeleteModal } from "@/components/ui/delete-modal";

export default function InboxAdmin() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setIsLoading(false);
  };

  const markAsRead = async (id: string, currentStatus: boolean) => {
    await supabase.from('messages').update({ is_read: !currentStatus }).eq('id', id);
    fetchData();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await supabase.from('messages').delete().eq('id', deleteId);
    await fetchData();
    setDeleteId(null);
    setIsDeleting(false);
  };

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Inbox</h1>
        <p className="text-slate-400">Messages sent from your portfolio's contact form.</p>
      </div>
      
      <div className="grid gap-4">
        {messages.map((msg) => (
          <Card key={msg.id} className={`bg-slate-900 border ${msg.is_read ? 'border-slate-800 opacity-70' : 'border-indigo-500/50'}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.is_read ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-sm text-indigo-400 hover:underline">{msg.email}</a>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-slate-500">{new Date(msg.created_at).toLocaleString()}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => markAsRead(msg.id, msg.is_read)} className={msg.is_read ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10'}>
                      <CheckCircle className="w-4 h-4 mr-2" /> {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteId(msg.id)} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800/50 text-slate-300 whitespace-pre-wrap">
                {msg.message}
              </div>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 border border-slate-800 rounded-xl bg-slate-900/50">
            <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No messages yet.</p>
          </div>
        )}
      </div>
      <DeleteModal 
        isOpen={!!deleteId} 
        isDeleting={isDeleting} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDeleteConfirm} 
        title="Hapus Pesan" 
        description="Apakah Anda yakin ingin menghapus pesan ini?" 
      />
    </div>
  );
}
