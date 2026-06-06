'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResumeAdminPage() {
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hero').then(r => r.json()).then(d => {
      if (d.success) setResumeUrl(d.data.resumeUrl || '');
      setLoading(false);
    });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.name.endsWith('.pdf')) return toast.error('Please upload a PDF file');
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file); fd.append('folder', 'resumes');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        // Save URL to hero config
        await fetch('/api/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeUrl: data.url }) });
        setResumeUrl(data.url);
        toast.success('Resume uploaded and saved!');
      } else toast.error(data.message || 'Upload failed');
    } catch (e: any) { toast.error(e.message || 'Upload failed'); }
    setUploading(false);
  };

  const handleRemove = async () => {
    if (!confirm('Remove the current resume?')) return;
    await fetch('/api/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeUrl: '' }) });
    setResumeUrl('');
    toast.success('Resume removed');
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-sora font-bold text-2xl text-text">Resume Manager</h1>
        <p className="text-text-muted text-sm mt-1">Upload and manage your resume PDF</p>
      </div>

      {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div> : (
        <div className="space-y-5">
          {/* Current Resume */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-border p-6">
            <h2 className="font-sora font-semibold text-text mb-4">Current Resume</h2>
            {resumeUrl ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><FileText className="w-5 h-5 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-text font-medium text-sm">Resume.pdf</p>
                  <p className="text-text-muted text-xs truncate">{resumeUrl}</p>
                </div>
                <div className="flex gap-2">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"><ExternalLink className="w-4 h-4" /></a>
                  <button onClick={handleRemove} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No resume uploaded yet</p>
              </div>
            )}
          </motion.div>

          {/* Upload */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl border border-border p-6">
            <h2 className="font-sora font-semibold text-text mb-4">{resumeUrl ? 'Replace Resume' : 'Upload Resume'}</h2>
            <label className="flex flex-col items-center gap-4 p-8 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                {uploading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
              </div>
              <div className="text-center">
                <p className="text-text font-medium">{uploading ? 'Uploading...' : 'Click to upload PDF'}</p>
                <p className="text-text-muted text-sm mt-1">PDF files only, max 10MB</p>
              </div>
              <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
          </motion.div>
        </div>
      )}
    </div>
  );
}
