'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Certificate { _id: string; title: string; issuer: string; issueDate: string; credentialUrl: string; image: string }

const emptyForm = { title: '', issuer: '', issueDate: '', credentialUrl: '', image: '' };

export default function CertificatesAdminPage() {
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    const res = await fetch('/api/certificates');
    const data = await res.json();
    if (data.success) setItems(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (item: Certificate) => { setEditing(item); setForm({ ...item, issueDate: item.issueDate.split('T')[0] }); setShowForm(true); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'certificates');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { setForm(p => ({ ...p, image: data.url })); toast.success('Image uploaded!'); }
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.issuer || !form.issueDate) return toast.error('Fill required fields');
    setSaving(true);
    try {
      const url = editing ? `/api/certificates/${editing._id}` : '/api/certificates';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if ((await res.json()).success) { toast.success(editing ? 'Updated!' : 'Added!'); setShowForm(false); fetchItems(); }
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    setDeleting(id);
    try { await fetch(`/api/certificates/${id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchItems(); }
    catch { toast.error('Failed'); }
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-text">Certificates</h1>
          <p className="text-text-muted text-sm mt-1">{items.length} certificates</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:opacity-90 glow-primary">
          <Plus className="w-4 h-4" /> Add Certificate
        </button>
      </div>

      {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <motion.div key={item._id} layout className="glass rounded-2xl border border-border p-5">
              <p className="text-primary text-xs font-semibold mb-1">{item.issuer}</p>
              <h3 className="font-semibold text-text mb-1 line-clamp-2">{item.title}</h3>
              <p className="text-text-muted text-xs mb-4">{new Date(item.issueDate).toLocaleDateString()}</p>
              <div className="flex justify-end gap-1">
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id} className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10">
                  {deleting === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
          {items.length === 0 && <div className="col-span-3 text-center py-12 text-text-muted">No certificates yet.</div>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-2xl border border-border w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sora font-bold text-text">{editing ? 'Edit Certificate' : 'Add Certificate'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Title *</label>
                <input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none focus:border-primary/60 text-sm" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Issuer *</label>
                  <input value={form.issuer} onChange={(e) => setForm(p => ({ ...p, issuer: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Issue Date *</label>
                  <input type="date" value={form.issueDate} onChange={(e) => setForm(p => ({ ...p, issueDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Credential URL</label>
                <input value={form.credentialUrl} onChange={(e) => setForm(p => ({ ...p, credentialUrl: e.target.value }))} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Certificate Image</label>
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
