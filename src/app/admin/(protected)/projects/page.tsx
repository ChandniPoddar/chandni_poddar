'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, X, Check, ExternalLink, Star } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface Project {
  _id: string; title: string; shortDescription: string; description: string;
  image: string; githubUrl: string; liveUrl: string; category: string;
  technologies: string[]; featured: boolean; status: string; slug: string;
}

const CATEGORIES = ['Web Development', 'Mobile Applications', 'AI/ML', 'IoT', 'Full Stack', 'Academic Projects'];
const STATUSES = ['completed', 'in-progress', 'archived'];

const emptyForm = { title: '', shortDescription: '', description: '', image: '', githubUrl: '', liveUrl: '', category: 'Web Development', technologies: '' as string | string[], featured: false, status: 'completed', slug: '' };

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (data.success) setProjects(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({ ...project, technologies: project.technologies.join(', ') });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'projects');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { setForm(p => ({ ...p, image: data.url })); toast.success('Image uploaded!'); }
      else toast.error(data.message || 'Upload failed');
    } catch (e: any) { toast.error(e.message || 'Upload failed'); }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    setSaving(true);
    const techArray = typeof form.technologies === 'string'
      ? form.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : form.technologies;
    const payload = { ...form, technologies: techArray };
    try {
      const url = editing ? `/api/projects/${editing._id}` : '/api/projects';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { toast.success(editing ? 'Project updated!' : 'Project added!'); setShowForm(false); fetchProjects(); }
      else toast.error(data.message);
    } catch { toast.error('Failed to save project'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) { toast.success('Deleted'); fetchProjects(); }
    } catch { toast.error('Failed to delete'); }
    setDeleting(null);
  };

  const toggleFeatured = async (project: Project) => {
    await fetch(`/api/projects/${project._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ featured: !project.featured }) });
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-text">Projects</h1>
          <p className="text-text-muted text-sm mt-1">{projects.length} projects total</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:opacity-90 glow-primary">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <motion.div key={project._id} layout className="glass rounded-2xl border border-border overflow-hidden group">
              <div className="relative h-36 overflow-hidden">
                {project.image ? (
                  <Image src={project.image} alt={project.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-primary/20 flex items-center justify-center">
                    <span className="font-sora font-bold text-text/40 text-3xl">{project.title.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background-card to-transparent" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => toggleFeatured(project)} className={`p-1.5 rounded-lg glass ${project.featured ? 'text-yellow-400' : 'text-text-muted'} hover:scale-110 transition-all`}>
                    <Star className="w-3.5 h-3.5" fill={project.featured ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-text mb-1 truncate">{project.title}</h3>
                <p className="text-text-muted text-xs mb-2 line-clamp-2">{project.shortDescription}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">{project.category}</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs ${project.status === 'completed' ? 'bg-green-500/10 text-green-400' : project.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-border text-text-muted'}`}>{project.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text">🐙</a>}
                  {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text"><ExternalLink className="w-4 h-4" /></a>}
                  <div className="ml-auto flex gap-1">
                    <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(project._id)} disabled={deleting === project._id} className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
                      {deleting === project._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && <div className="col-span-3 text-center py-12 text-text-muted">No projects yet. Add your first project!</div>}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong rounded-2xl border border-border w-full max-w-2xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-sora font-bold text-text">{editing ? 'Edit Project' : 'Add Project'}</h2>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Title *</label>
                  <input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none focus:border-primary/60 text-sm" />
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Category *</label>
                  <select value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Short Description *</label>
                <input value={form.shortDescription} onChange={(e) => setForm(p => ({ ...p, shortDescription: e.target.value }))} maxLength={200} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Full Description</label>
                <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm resize-none" />
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Technologies (comma-separated)</label>
                <input value={form.technologies as string} onChange={(e) => setForm(p => ({ ...p, technologies: e.target.value }))} placeholder="React, Node.js, MongoDB" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">GitHub URL</label>
                  <input value={form.githubUrl} onChange={(e) => setForm(p => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/..." className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Live URL</label>
                  <input value={form.liveUrl} onChange={(e) => setForm(p => ({ ...p, liveUrl: e.target.value }))} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Status</label>
                  <select value={form.status} onChange={(e) => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-text focus:outline-none text-sm">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm(p => ({ ...p, featured: e.target.checked }))} className="sr-only peer" />
                    <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primary transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                  </label>
                  <span className="text-text-muted text-sm">Featured</span>
                </div>
              </div>
              <div>
                <label className="text-text-muted text-xs mb-1.5 block">Project Image</label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2.5 rounded-xl glass border border-border text-text-muted text-sm cursor-pointer hover:border-primary/40 transition-colors">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Choose Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {form.image && <span className="text-text-muted text-xs">✓ Image uploaded</span>}
                </div>
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
