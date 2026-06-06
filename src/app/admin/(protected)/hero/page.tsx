'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Upload, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface HeroConfig {
  name: string; designation: string; taglines: string[]; bio: string;
  profileImage: string; resumeUrl: string; ctaText: string;
  socialLinks: { platform: string; url: string; icon: string }[];
}

export default function HeroAdminPage() {
  const [config, setConfig] = useState<HeroConfig>({ name: '', designation: '', taglines: [], bio: '', profileImage: '', resumeUrl: '', ctaText: '', socialLinks: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'profile' | 'resume' | null>(null);
  const [taglineInput, setTaglineInput] = useState('');

  useEffect(() => {
    fetch('/api/hero').then(r => r.json()).then(d => { if (d.success) setConfig(d.data); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
      if ((await res.json()).success) toast.success('Hero config saved!');
      else toast.error('Failed to save');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'resume') => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(type);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', type === 'profile' ? 'profile' : 'resumes');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setConfig(p => ({ ...p, [type === 'profile' ? 'profileImage' : 'resumeUrl']: data.url }));
        toast.success(`${type === 'profile' ? 'Profile image' : 'Resume'} uploaded!`);
      }
    } catch { toast.error('Upload failed'); }
    setUploading(null);
  };

  const addTagline = () => {
    if (!taglineInput.trim()) return;
    setConfig(p => ({ ...p, taglines: [...p.taglines, taglineInput.trim()] }));
    setTaglineInput('');
  };

  const removeTagline = (i: number) => setConfig(p => ({ ...p, taglines: p.taglines.filter((_, idx) => idx !== i) }));

  const addSocialLink = () => setConfig(p => ({ ...p, socialLinks: [...p.socialLinks, { platform: '', url: '', icon: '' }] }));
  const removeSocialLink = (i: number) => setConfig(p => ({ ...p, socialLinks: p.socialLinks.filter((_, idx) => idx !== i) }));
  const updateSocialLink = (i: number, key: string, value: string) => setConfig(p => ({ ...p, socialLinks: p.socialLinks.map((l, idx) => idx === i ? { ...l, [key]: value } : l) }));

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-text">Hero Configuration</h1>
          <p className="text-text-muted text-sm mt-1">Manage your portfolio hero section</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:opacity-90 glow-primary disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="space-y-5">
        {/* Basic Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-sora font-semibold text-text">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-text-muted text-xs mb-1.5 block">Full Name</label>
              <input value={config.name} onChange={(e) => setConfig(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none focus:border-primary/60 text-sm" />
            </div>
            <div>
              <label className="text-text-muted text-xs mb-1.5 block">Designation</label>
              <input value={config.designation} onChange={(e) => setConfig(p => ({ ...p, designation: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="text-text-muted text-xs mb-1.5 block">Bio / Introduction</label>
            <textarea value={config.bio} onChange={(e) => setConfig(p => ({ ...p, bio: e.target.value }))} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm resize-none" />
          </div>
          <div>
            <label className="text-text-muted text-xs mb-1.5 block">CTA Button Text</label>
            <input value={config.ctaText} onChange={(e) => setConfig(p => ({ ...p, ctaText: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
          </div>
        </motion.div>

        {/* Typing Taglines */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-sora font-semibold text-text">Typing Taglines</h2>
          <div className="flex flex-wrap gap-2">
            {config.taglines.map((t, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-border">
                <span className="text-text text-sm">{t}</span>
                <button onClick={() => removeTagline(i)} className="text-text-muted hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={taglineInput} onChange={(e) => setTaglineInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTagline()} placeholder="Add tagline and press Enter" className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
            <button onClick={addTagline} className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20"><Plus className="w-4 h-4" /></button>
          </div>
        </motion.div>

        {/* Media Uploads */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl border border-border p-6 space-y-4">
          <h2 className="font-sora font-semibold text-text">Media & Files</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-text-muted text-xs mb-1.5 block">Profile Image</label>
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl glass border border-border text-text-muted text-sm cursor-pointer hover:border-primary/40 transition-colors">
                {uploading === 'profile' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {config.profileImage ? 'Change Image' : 'Upload Image'}
                <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'profile')} className="hidden" />
              </label>
              {config.profileImage && <p className="text-text-muted text-xs mt-1">✓ Image set</p>}
            </div>
            <div>
              <label className="text-text-muted text-xs mb-1.5 block">Resume (PDF)</label>
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl glass border border-border text-text-muted text-sm cursor-pointer hover:border-primary/40 transition-colors">
                {uploading === 'resume' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {config.resumeUrl ? 'Replace Resume' : 'Upload Resume'}
                <input type="file" accept=".pdf" onChange={(e) => handleUpload(e, 'resume')} className="hidden" />
              </label>
              {config.resumeUrl && <p className="text-text-muted text-xs mt-1">✓ Resume uploaded</p>}
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-sora font-semibold text-text">Social Links</h2>
            <button onClick={addSocialLink} className="flex items-center gap-1.5 text-primary text-sm hover:opacity-80"><Plus className="w-4 h-4" /> Add Link</button>
          </div>
          <div className="space-y-3">
            {config.socialLinks.map((link, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 items-center">
                <input value={link.platform} onChange={(e) => updateSocialLink(i, 'platform', e.target.value)} placeholder="Platform" className="px-3 py-2 rounded-xl bg-background border border-border text-text focus:outline-none text-xs" />
                <input value={link.url} onChange={(e) => updateSocialLink(i, 'url', e.target.value)} placeholder="URL" className="px-3 py-2 rounded-xl bg-background border border-border text-text focus:outline-none text-xs" />
                <div className="flex gap-2">
                  <input value={link.icon} onChange={(e) => updateSocialLink(i, 'icon', e.target.value)} placeholder="Icon key" className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-text focus:outline-none text-xs" />
                  <button onClick={() => removeSocialLink(i)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            {config.socialLinks.length === 0 && <p className="text-text-muted text-sm">No social links yet. Click &ldquo;Add Link&rdquo; to add one.</p>}
          </div>
          <p className="text-text-muted text-xs">Icon keys: github, linkedin, twitter, instagram, email</p>
        </motion.div>
      </div>
    </div>
  );
}
