'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Achievement { _id: string; title: string; description: string; date: string; certificateLink: string; image: string }

const emptyForm = { title: '', description: '', date: '', certificateLink: '', image: '' };

export default function AchievementsAdminPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    const res = await fetch('/api/achievements');
    const data = await res.json();
    if (data.success) setItems(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (item: Achievement) => { setEditing(item); setForm({ ...item, date: item.date.split('T')[0] }); setShowForm(true); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'achievements');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { setForm(p => ({ ...p, image: data.url })); toast.success('Image uploaded!'); }
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.date) return toast.error('Fill required fields');
    setSaving(true);
    try {
      const url = editing ? `/api/achievements/${editing._id}` : '/api/achievements';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if ((await res.json()).success) { toast.success(editing ? 'Updated!' : 'Added!'); setShowForm(false); fetchItems(); }
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this achievement?')) return;
    setDeleting(id);
    try { await fetch(`/api/achievements/${id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchItems(); }
    catch { toast.error('Failed'); }
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-text">Achievements</h1>
          <p className="text-text-muted text-sm mt-1">{items.length} achievements</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:opacity-90 glow-primary">
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <motion.div key={item._id} layout className="glass rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-text mb-1">{item.title}</h3>
              <p className="text-text-muted text-sm mb-2 line-clamp-2">{item.description}</p>
              <p className="text-text-muted text-xs mb-4">{new Date(item.date).toLocaleDateString()}</p>
              <div className="flex justify-end gap-1">
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id} className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10">
                  {deleting === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
          {items.length === 0 && <div className="col-span-3 text-center py-12 text-text-muted">No achievements yet.</div>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-2xl border border-border w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sora font-bold text-text">{editing ? 'Edit Achievement' : 'Add Achievement'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Title *</label>
                <input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none focus:border-primary/60 text-sm" />
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Certificate Link</label>
                  <input value={form.certificateLink} onChange={(e) => setForm(p => ({ ...p, certificateLink: e.target.value }))} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Image</label>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-border text-text-muted text-sm cursor-pointer hover:border-primary/40">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Choose Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {form.image && <span className="ml-3 text-text-muted text-xs">✓ Uploaded</span>}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl glass border border-border text-text-muted text-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {editing ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
