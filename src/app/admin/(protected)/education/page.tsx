'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, Check, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface Education { _id: string; institute: string; degree: string; field: string; cgpa: string; percentage: string; startYear: string; endYear: string; description: string }

const emptyForm = { institute: '', degree: '', field: '', cgpa: '', percentage: '', startYear: '', endYear: '', description: '' };

export default function EducationAdminPage() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchItems = async () => {
    const res = await fetch('/api/education');
    const data = await res.json();
    if (data.success) setItems(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (item: Education) => { setEditing(item); setForm({ ...item }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.institute || !form.degree || !form.startYear || !form.endYear) return toast.error('Fill required fields');
    setSaving(true);
    try {
      const url = editing ? `/api/education/${editing._id}` : '/api/education';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if ((await res.json()).success) { toast.success(editing ? 'Updated!' : 'Added!'); setShowForm(false); fetchItems(); }
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this education entry?')) return;
    setDeleting(id);
    try { await fetch(`/api/education/${id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchItems(); }
    catch { toast.error('Failed'); }
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-text">Education</h1>
          <p className="text-text-muted text-sm mt-1">{items.length} education entries</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:opacity-90 glow-primary">
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
        <div className="space-y-4">
          {items.map(item => (
            <motion.div key={item._id} layout className="glass rounded-2xl border border-border p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0"><GraduationCap className="w-6 h-6 text-secondary" /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-text">{item.degree}</h3>
                <p className="text-secondary text-sm">{item.institute}</p>
                {item.field && <p className="text-text-muted text-sm">{item.field}</p>}
                <div className="flex gap-3 mt-2">
                  <span className="text-text-muted text-xs">{item.startYear} — {item.endYear}</span>
                  {item.cgpa && <span className="text-text-muted text-xs">CGPA: {item.cgpa}</span>}
                  {item.percentage && <span className="text-text-muted text-xs">{item.percentage}</span>}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item._id)} disabled={deleting === item._id} className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10">
                  {deleting === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
          {items.length === 0 && <div className="text-center py-12 text-text-muted">No education entries yet.</div>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-2xl border border-border w-full max-w-xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sora font-bold text-text">{editing ? 'Edit Education' : 'Add Education'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Institution *</label>
                <input value={form.institute} onChange={(e) => setForm(p => ({ ...p, institute: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none focus:border-primary/60 text-sm" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Degree *</label>
                  <input value={form.degree} onChange={(e) => setForm(p => ({ ...p, degree: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Field of Study</label>
                  <input value={form.field} onChange={(e) => setForm(p => ({ ...p, field: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Start Year *</label>
                  <input value={form.startYear} onChange={(e) => setForm(p => ({ ...p, startYear: e.target.value }))} placeholder="2021" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">End Year *</label>
                  <input value={form.endYear} onChange={(e) => setForm(p => ({ ...p, endYear: e.target.value }))} placeholder="2025" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">CGPA</label>
                  <input value={form.cgpa} onChange={(e) => setForm(p => ({ ...p, cgpa: e.target.value }))} placeholder="8.5" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Percentage</label>
                  <input value={form.percentage} onChange={(e) => setForm(p => ({ ...p, percentage: e.target.value }))} placeholder="85%" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm resize-none" />
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
