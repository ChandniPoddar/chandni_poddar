'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Skill { _id: string; name: string; category: string; color: string; order: number }

const CATEGORIES = ['Programming Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'AI & Cloud', 'Mobile'];

const emptyForm = { name: '', category: 'Frontend', color: '#2563EB', order: 0 };

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSkills = async () => {
    const res = await fetch('/api/skills');
    const data = await res.json();
    if (data.success) setSkills(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (skill: Skill) => { setEditing(skill); setForm({ name: skill.name, category: skill.category, color: skill.color, order: skill.order }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      const url = editing ? `/api/skills/${editing._id}` : '/api/skills';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        toast.success(editing ? 'Skill updated!' : 'Skill added!');
        setShowForm(false);
        fetchSkills();
      } else toast.error(data.message);
    } catch { toast.error('Failed to save skill'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { toast.success('Skill deleted'); fetchSkills(); }
      else toast.error(data.message);
    } catch { toast.error('Failed to delete'); }
    setDeleting(null);
  };

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-text">Skills</h1>
          <p className="text-text-muted text-sm mt-1">{skills.length} skills across {Object.keys(grouped).length} categories</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity glow-primary">
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category} className="glass rounded-2xl border border-border p-5">
              <h3 className="font-sora font-semibold text-text mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {catSkills.map((skill) => (
                  <motion.div
                    key={skill._id}
                    layout
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-border group"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: skill.color }} />
                    <span className="text-text text-sm font-medium">{skill.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                      <button onClick={() => openEdit(skill)} className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-primary transition-colors">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(skill._id)} disabled={deleting === skill._id} className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-red-400 transition-colors">
                        {deleting === skill._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          {skills.length === 0 && <div className="text-center py-12 text-text-muted">No skills yet. Add your first skill!</div>}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-2xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sora font-bold text-text">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Skill Name *</label>
                <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. React" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none focus:border-primary/60 text-sm" />
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Category *</label>
                <select value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none focus:border-primary/60 text-sm">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.color} onChange={(e) => setForm(p => ({ ...p, color: e.target.value }))} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                    <span className="text-text-muted text-xs">{form.color}</span>
                  </div>
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm(p => ({ ...p, order: parseInt(e.target.value) }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl glass border border-border text-text-muted text-sm hover:text-text transition-colors">Cancel</button>
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
