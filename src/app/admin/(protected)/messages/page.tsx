'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Trash2, Loader2, CheckCircle, Circle, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Message { _id: string; name: string; email: string; subject: string; message: string; isRead: boolean; createdAt: string }

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMessages = async () => {
    const res = await fetch('/api/contact');
    const data = await res.json();
    if (data.success) setMessages(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleView = async (msg: Message) => {
    setSelected(msg);
    if (!msg.isRead) {
      await fetch(`/api/contact/${msg._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isRead: true }) });
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) { toast.success('Message deleted'); fetchMessages(); if (selected?._id === id) setSelected(null); }
    } catch { toast.error('Failed to delete'); }
    setDeleting(null);
  };

  const unread = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sora font-bold text-2xl text-text flex items-center gap-3">
          Messages
          {unread > 0 && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">{unread} unread</span>}
        </h1>
        <p className="text-text-muted text-sm mt-1">{messages.length} total messages</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5">
          {/* Message List */}
          <div className="lg:col-span-2 space-y-2">
            {messages.length === 0 && <div className="text-center py-12 text-text-muted">No messages yet</div>}
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                layout
                onClick={() => handleView(msg)}
                className={`glass rounded-xl border p-4 cursor-pointer transition-all ${selected?._id === msg._id ? 'border-primary/60 bg-primary/5' : msg.isRead ? 'border-border hover:border-border/80' : 'border-primary/30 bg-primary/5'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-text font-medium text-sm truncate">{msg.name}</p>
                      {!msg.isRead && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className="text-text-muted text-xs truncate font-medium">{msg.subject}</p>
                    <p className="text-text-muted text-xs truncate mt-0.5">{msg.message}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }} disabled={deleting === msg._id} className="p-1 text-text-muted hover:text-red-400 transition-colors flex-shrink-0">
                    {deleting === msg._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-border p-6 h-full">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                      {selected.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-sora font-semibold text-text">{selected.name}</p>
                      <a href={`mailto:${selected.email}`} className="text-primary text-sm hover:underline">{selected.email}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted text-xs">
                    {selected.isRead ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Circle className="w-4 h-4" />}
                    {selected.isRead ? 'Read' : 'Unread'}
                  </div>
                </div>
                <div className="glass rounded-xl p-4 border border-border mb-4">
                  <p className="text-text-muted text-xs mb-1">Subject</p>
                  <p className="font-semibold text-text">{selected.subject}</p>
                </div>
                <div className="glass rounded-xl p-4 border border-border mb-4">
                  <p className="text-text-muted text-xs mb-2">Message</p>
                  <p className="text-text leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-text-muted text-xs">{new Date(selected.createdAt).toLocaleString()}</p>
                  <div className="flex gap-3">
                    <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-medium hover:opacity-90">
                      <Mail className="w-4 h-4" /> Reply
                    </a>
                    <button onClick={() => handleDelete(selected._id)} className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass rounded-2xl border border-border h-72 flex flex-col items-center justify-center gap-3 text-text-muted">
                <Eye className="w-8 h-8 opacity-40" />
                <p className="text-sm">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
