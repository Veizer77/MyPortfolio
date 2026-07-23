"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function HeroAdmin() {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: hero } = await supabase.from('hero').select('*').single();
    if (hero) setData(hero);
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (data.id) {
      await supabase.from('hero').update(data).eq('id', data.id);
    } else {
      const res = await supabase.from('hero').insert([data]).select().single();
      if (res.data) setData({...data, id: res.data.id});
    }
    setIsSaving(false);
    toast.success("Berhasil disimpan!");
  };

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Hero Section</h1>
        <p className="text-slate-400">Manage your main introduction on the homepage.</p>
      </div>
      
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-slate-300">Name</Label>
                <Input value={data.name || ''} onChange={e => setData({...data, name: e.target.value})} required className="bg-slate-950 border-slate-800 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Location</Label>
                <Input value={data.location || ''} onChange={e => setData({...data, location: e.target.value})} className="bg-slate-950 border-slate-800 text-white" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-slate-300">Custom Logo Text (Optional)</Label>
                <Input placeholder="e.g. MyBrand" value={data.logo_text || ''} onChange={e => setData({...data, logo_text: e.target.value})} className="bg-slate-950 border-slate-800 text-white" />
                <p className="text-xs text-slate-500">Overrides initials if provided.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Custom Logo Image URL (Optional)</Label>
                <Input placeholder="e.g. https://.../logo.png" value={data.logo_image || ''} onChange={e => setData({...data, logo_image: e.target.value})} className="bg-slate-950 border-slate-800 text-white" />
                <p className="text-xs text-slate-500">Overrides text if provided.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Tagline / Title</Label>
              <Input value={data.tagline || ''} onChange={e => setData({...data, tagline: e.target.value})} className="bg-slate-950 border-slate-800 text-white" />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-slate-300">Photo URL</Label>
                <Input value={data.photo_url || ''} onChange={e => setData({...data, photo_url: e.target.value})} className="bg-slate-950 border-slate-800 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">CV Download URL</Label>
                <Input value={data.cv_url || ''} onChange={e => setData({...data, cv_url: e.target.value})} className="bg-slate-950 border-slate-800 text-white" />
              </div>
            </div>
            
            <Button type="submit" disabled={isSaving} className="bg-indigo-500 hover:bg-indigo-600 text-white">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
