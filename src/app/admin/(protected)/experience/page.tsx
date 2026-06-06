'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, Check, Briefcase, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateRange } from '@/lib/utils';

interface Experience { _id: string; company: string; role: string; startDate: string; endDate: string | null; current: boolean; description: string; technologies: string[]; logo: string; order: number }

const emptyForm = { company: '', role: '', startDate: '', endDate: '', current: false, description: '', technologies: '' as string | string[], order: 0 };

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchExperiences = async () => {
    const res = await fetch('/api/experience');
    const data = await res.json();
    if (data.success) setExperiences(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchExperiences(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (exp: Experience) => { setEditing(exp); setForm({ ...exp, endDate: exp.endDate ? exp.endDate.split('T')[0] : '', startDate: exp.startDate.split('T')[0], technologies: exp.technologies.join(', ') }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.company || !form.role || !form.startDate || !form.description) return toast.error('Fill all required fields');
    setSaving(true);
    const techArray = typeof form.technologies === 'string' ? form.technologies.split(',').map(t => t.trim()).filter(Boolean) : form.technologies;
    const payload = { ...form, technologies: techArray, endDate: form.current ? null : form.endDate || null };
    try {
      const url = editing ? `/api/experience/${editing._id}` : '/api/experience';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { toast.success(editing ? 'Updated!' : 'Added!'); setShowForm(false); fetchExperiences(); }
      else toast.error(data.message);
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    setDeleting(id);
    try { await fetch(`/api/experience/${id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchExperiences(); }
    catch { toast.error('Failed to delete'); }
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-text">Experience</h1>
          <p className="text-text-muted text-sm mt-1">{experiences.length} experience entries</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:opacity-90 glow-primary">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <motion.div key={exp._id} layout className="glass rounded-2xl border border-border p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0"><Briefcase className="w-6 h-6 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-text">{exp.role}</h3>
                    <p className="text-primary text-sm">{exp.company}</p>
                  </div>
                  {exp.current && <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/30 flex-shrink-0">Current</span>}
                </div>
                <p className="text-text-muted text-xs flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                <p className="text-text-muted text-sm mt-2 line-clamp-2">{exp.description}</p>
                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">{exp.technologies.slice(0, 5).map(t => <span key={t} className="px-2 py-0.5 rounded-md bg-border text-text-muted text-xs">{t}</span>)}</div>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => openEdit(exp)} className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(exp._id)} disabled={deleting === exp._id} className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
                  {deleting === exp._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
          {experiences.length === 0 && <div className="text-center py-12 text-text-muted">No experience entries yet.</div>}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-2xl border border-border w-full max-w-xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sora font-bold text-text">{editing ? 'Edit Experience' : 'Add Experience'}</h2>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Company *</label>
                  <input value={form.company} onChange={(e) => setForm(p => ({ ...p, company: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none focus:border-primary/60 text-sm" />
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Role *</label>
                  <input value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none focus:border-primary/60 text-sm" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Start Date *</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm(p => ({ ...p, startDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">End Date</label>
                  <input type="date" value={form.endDate as string} onChange={(e) => setForm(p => ({ ...p, endDate: e.target.value }))} disabled={form.current} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm disabled:opacity-40" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.current} onChange={(e) => setForm(p => ({ ...p, current: e.target.checked }))} className="sr-only peer" />
                  <div className="w-9 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </label>
                <span className="text-text-muted text-sm">Currently working here</span>
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm resize-none" />
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Technologies (comma-separated)</label>
                <input value={form.technologies as string} onChange={(e) => setForm(p => ({ ...p, technologies: e.target.value }))} placeholder="Next.js, TypeScript, MongoDB" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
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
