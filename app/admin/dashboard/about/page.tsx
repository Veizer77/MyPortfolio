"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AboutAdmin() {
  const [data, setData] = useState<any>({ summary: "", stats: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: about } = await supabase.from('about').select('*').single();
    if (about) {
      setData({
        ...about,
        stats: typeof about.stats === 'string' ? JSON.parse(about.stats) : (about.stats || [])
      });
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { summary: data.summary, stats: data.stats };
    if (data.id) {
      await supabase.from('about').update(payload).eq('id', data.id);
    } else {
      const res = await supabase.from('about').insert([payload]).select().single();
      if (res.data) setData({...data, id: res.data.id});
    }
    toast.success("Berhasil disimpan!");
    setIsSaving(false);
  };

  const addStat = () => setData({...data, stats: [...(data.stats || []), { label: "", value: "" }]});
  
  const updateStat = (index: number, field: 'label' | 'value', val: string) => {
    const newStats = [...data.stats];
    newStats[index][field] = val;
    setData({...data, stats: newStats});
  };

  const removeStat = (index: number) => {
    const newStats = data.stats.filter((_: any, i: number) => i !== index);
    setData({...data, stats: newStats});
  };

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">About Section</h1>
        <p className="text-slate-400">Manage your summary and statistic numbers.</p>
      </div>
      
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-300">Summary / Biography</Label>
              <Textarea value={data.summary || ''} onChange={e => setData({...data, summary: e.target.value})} required className="min-h-[150px] bg-slate-950 border-slate-800 text-white" />
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <Label className="text-slate-300">Quick Stats</Label>
                <Button type="button" variant="outline" size="sm" onClick={addStat} className="border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add Stat
                </Button>
              </div>
              
              {data.stats && data.stats.map((stat: any, i: number) => (
                <div key={i} className="flex items-center gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="flex-1 space-y-2">
                    <Label className="text-slate-400 text-xs">Label</Label>
                    <Input value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} className="bg-slate-900 border-slate-700 text-white h-8" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-slate-400 text-xs">Value</Label>
                    <Input value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} className="bg-slate-900 border-slate-700 text-white h-8" />
                  </div>
                  <Button type="button" variant="ghost" onClick={() => removeStat(i)} className="mt-6 text-slate-500 hover:text-red-500 hover:bg-red-500/10 h-8 w-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit" disabled={isSaving} className="bg-indigo-500 hover:bg-indigo-600 text-white w-full md:w-auto">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
