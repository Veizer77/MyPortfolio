"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactAdmin() {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: contact } = await supabase.from('contact').select('*').single();
    if (contact) setData(contact);
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (data.id) {
      await supabase.from('contact').update(data).eq('id', data.id);
    } else {
      const res = await supabase.from('contact').insert([data]).select().single();
      if (res.data) setData({...data, id: res.data.id});
    }
    toast.success("Berhasil disimpan!");
    setIsSaving(false);
  };

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Contact Details</h1>
        <p className="text-slate-400">Manage your contact information and social links.</p>
      </div>
      
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-slate-300">Email Address</Label>
                <Input value={data.email || ''} onChange={e => setData({...data, email: e.target.value})} required type="email" className="bg-slate-950 border-slate-800 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">WhatsApp / Phone</Label>
                <Input value={data.whatsapp || ''} onChange={e => setData({...data, whatsapp: e.target.value})} className="bg-slate-950 border-slate-800 text-white" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-slate-300">LinkedIn URL</Label>
                <Input value={data.linkedin_url || ''} onChange={e => setData({...data, linkedin_url: e.target.value})} type="url" className="bg-slate-950 border-slate-800 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">GitHub URL</Label>
                <Input value={data.github_url || ''} onChange={e => setData({...data, github_url: e.target.value})} type="url" className="bg-slate-950 border-slate-800 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Location Address</Label>
              <Input value={data.address || ''} onChange={e => setData({...data, address: e.target.value})} className="bg-slate-950 border-slate-800 text-white" />
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
