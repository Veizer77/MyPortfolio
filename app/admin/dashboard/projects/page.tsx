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

export default function ProjectsAdmin() {
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
    const { data: res } = await supabase.from('projects').select('*').order('sort_order');
    if (res) setData(res);
    setIsLoading(false);
  };

  const handleAddNew = () => {
    setEditingId('new');
    setFormData({ title: "", description: "", tech_stack: [], thumbnail_url: "", github_url: "", demo_url: "" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    let tech_stack = formData.tech_stack;
    if (typeof tech_stack === 'string') {
      tech_stack = tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    const payload = { ...formData, tech_stack };

    if (editingId === 'new') {
      await supabase.from('projects').insert([payload]);
    } else {
      await supabase.from('projects').update(payload).eq('id', editingId);
    }
    await fetchData();
    toast.success("Berhasil disimpan!");
    setEditingId(null);
    setIsSaving(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeletingModal(true);
    await supabase.from('projects').delete().eq('id', deleteId);
    await fetchData();
    setDeleteId(null);
    setIsDeletingModal(false);
  };

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage your portfolio projects.</p>
        </div>
        {!editingId && (
          <Button onClick={handleAddNew} className="bg-indigo-500 hover:bg-indigo-600 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        )}
      </div>
      
      {editingId ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Title</Label>
                <Input value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required className="bg-slate-950 border-slate-800 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required className="bg-slate-950 border-slate-800 text-white min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Tech Stack (comma separated)</Label>
                <Input value={Array.isArray(formData.tech_stack) ? formData.tech_stack.join(', ') : formData.tech_stack || ''} onChange={e => setFormData({...formData, tech_stack: e.target.value})} className="bg-slate-950 border-slate-800 text-white" placeholder="React, Node.js, Tailwind" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Thumbnail URL</Label>
                  <Input value={formData.thumbnail_url || ''} onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} className="bg-slate-950 border-slate-800 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Demo URL</Label>
                  <Input value={formData.demo_url || ''} onChange={e => setFormData({...formData, demo_url: e.target.value})} className="bg-slate-950 border-slate-800 text-white" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSaving} className="bg-indigo-500 hover:bg-indigo-600 text-white">
                  {isSaving ? "Saving..." : "Save Project"}
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
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 truncate max-w-md">{item.description}</p>
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
          {data.length === 0 && <p className="text-slate-500 text-center py-8">No projects yet.</p>}
        </div>
      )}
      <DeleteModal 
        isOpen={!!deleteId} 
        isDeleting={isDeletingModal} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDeleteConfirm} 
        title="Hapus Proyek" 
      />
    </div>
  );
}
