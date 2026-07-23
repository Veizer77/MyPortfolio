"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { DeleteModal } from "@/components/ui/delete-modal";

export default function ExperienceAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeletingModal, setIsDeletingModal] = useState(false);
  const supabase = createClient();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: res } = await supabase.from('experience').select('*').order('start_date', { ascending: false });
    if (res) setData(res);
    setIsLoading(false);
  };

  const handleAddNew = () => {
    setEditingId('new');
    setFormData({ company: "", position: "", location: "", start_date: "", end_date: "", is_current: false, description: [] });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    let description = formData.description;
    if (typeof description === 'string') {
      description = description.split('\n').map((s: string) => s.trim()).filter(Boolean);
    }
    const payload = { ...formData, description };

    if (editingId === 'new') {
      await supabase.from('experience').insert([payload]);
    } else {
      await supabase.from('experience').update(payload).eq('id', editingId);
    }
    await fetchData();
    toast.success("Berhasil disimpan!");
    setEditingId(null);
    setIsSaving(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeletingModal(true);
    await supabase.from('experience').delete().eq('id', deleteId);
    await fetchData();
    setDeleteId(null);
    setIsDeletingModal(false);
  };

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Experience</h1>
          <p className="text-slate-400">Manage your work history.</p>
        </div>
        {!editingId && (
          <Button onClick={handleAddNew} className="bg-indigo-500 hover:bg-indigo-600 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Experience
          </Button>
        )}
      </div>
      
      {editingId ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Company</Label>
                  <Input value={formData.company || ''} onChange={e => setFormData({...formData, company: e.target.value})} required className="bg-slate-950 border-slate-800 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Position</Label>
                  <Input value={formData.position || ''} onChange={e => setFormData({...formData, position: e.target.value})} required className="bg-slate-950 border-slate-800 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Location</Label>
                <Input value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-slate-950 border-slate-800 text-white" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Start Date</Label>
                  <Input type="date" value={formData.start_date || ''} onChange={e => setFormData({...formData, start_date: e.target.value})} required className="bg-slate-950 border-slate-800 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">End Date</Label>
                  <Input type="date" value={formData.end_date || ''} onChange={e => setFormData({...formData, end_date: e.target.value})} disabled={formData.is_current} className="bg-slate-950 border-slate-800 text-white disabled:opacity-50" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="current" checked={formData.is_current || false} onChange={e => setFormData({...formData, is_current: e.target.checked, end_date: e.target.checked ? null : formData.end_date})} className="rounded border-slate-800 bg-slate-950" />
                <Label htmlFor="current" className="text-slate-300 cursor-pointer">I currently work here</Label>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Description (One point per line)</Label>
                <Textarea value={Array.isArray(formData.description) ? formData.description.join('\n') : formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-slate-950 border-slate-800 text-white min-h-[120px]" placeholder="Developed the main dashboard...&#10;Lead a team of 3 engineers..." />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSaving} className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  {isSaving ? "Saving..." : "Save Experience"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">{item.position} <span className="text-slate-400 font-normal">at {item.company}</span></h3>
                <p className="text-sm text-indigo-400">{item.start_date} - {item.is_current ? 'Present' : item.end_date}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditingId(item.id); setFormData(item); }} className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDeleteId(item.id)} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {data.length === 0 && <p className="text-slate-500 text-center py-8">No experience entries yet.</p>}
        </div>
      )}
      <DeleteModal 
        isOpen={!!deleteId} 
        isDeleting={isDeletingModal} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDeleteConfirm} 
        title="Hapus Pengalaman" 
      />
    </div>
  );
}
