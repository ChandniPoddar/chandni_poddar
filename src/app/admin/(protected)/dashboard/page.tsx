'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FolderOpen, Cpu, Award, MessageSquare, Users, Plus, Eye, ArrowUpRight } from 'lucide-react';

interface Stats { projects: number; skills: number; certificates: number; messages: number; unreadMessages: number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, skills: 0, certificates: 0, messages: 0, unreadMessages: 0 });
  const [messages, setMessages] = useState<{ _id: string; name: string; email: string; subject: string; isRead: boolean; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes, certsRes, msgsRes] = await Promise.all([
          fetch('/api/projects'), fetch('/api/skills'), fetch('/api/certificates'), fetch('/api/contact'),
        ]);
        const [projects, skills, certs, msgs] = await Promise.all([
          projectsRes.json(), skillsRes.json(), certsRes.json(), msgsRes.json(),
        ]);
        setStats({
          projects: projects.data?.length || 0,
          skills: skills.data?.length || 0,
          certificates: certs.data?.length || 0,
          messages: msgs.data?.length || 0,
          unreadMessages: msgs.data?.filter((m: { isRead: boolean }) => !m.isRead).length || 0,
        });
        setMessages(msgs.data?.slice(0, 5) || []);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: <FolderOpen />, href: '/admin/projects', color: 'text-primary', bg: 'bg-primary/10', action: 'Add Project', actionHref: '/admin/projects' },
    { label: 'Total Skills', value: stats.skills, icon: <Cpu />, href: '/admin/skills', color: 'text-secondary', bg: 'bg-secondary/10', action: 'Add Skill', actionHref: '/admin/skills' },
    { label: 'Certificates', value: stats.certificates, icon: <Award />, href: '/admin/certificates', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10', action: 'Add Certificate', actionHref: '/admin/certificates' },
    { label: 'Messages', value: stats.messages, icon: <MessageSquare />, href: '/admin/messages', color: 'text-accent', bg: 'bg-accent/10', badge: stats.unreadMessages, action: 'View All', actionHref: '/admin/messages' },
  ];

  const quickActions = [
    { label: 'Add Project', href: '/admin/projects', icon: <FolderOpen className="w-4 h-4" /> },
    { label: 'Add Skill', href: '/admin/skills', icon: <Cpu className="w-4 h-4" /> },
    { label: 'Add Certificate', href: '/admin/certificates', icon: <Award className="w-4 h-4" /> },
    { label: 'View Messages', href: '/admin/messages', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Edit Hero', href: '/admin/hero', icon: <Users className="w-4 h-4" /> },
    { label: 'View Portfolio', href: '/', icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-sora font-bold text-2xl sm:text-3xl text-text">Dashboard</h1>
        <p className="text-text-muted mt-1">Welcome back! Here&apos;s an overview of your portfolio.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={card.href} className="glass rounded-2xl border border-border p-5 flex flex-col gap-4 hover:border-primary/40 transition-all group block">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  {card.icon}
                </div>
                {card.badge ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/20 text-accent">
                    {card.badge} new
                  </span>
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                )}
              </div>
              <div>
                <p className="text-text-muted text-sm">{card.label}</p>
                <motion.p
                  className={`font-sora font-bold text-3xl ${card.color}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: loading ? 0 : 1 }}
                >
                  {loading ? '—' : card.value}
                </motion.p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl border border-border p-6"
        >
          <h2 className="font-sora font-semibold text-text mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Quick Actions
          </h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-text-muted hover:text-text transition-all group"
              >
                <span className="text-primary">{action.icon}</span>
                <span className="text-sm font-medium">{action.label}</span>
                <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass rounded-2xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora font-semibold text-text flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Recent Messages
            </h2>
            <Link href="/admin/messages" className="text-primary text-xs hover:underline">View all</Link>
          </div>
          {messages.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm">No messages yet</div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg._id} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${msg.isRead ? 'border-transparent hover:bg-white/5' : 'border-primary/20 bg-primary/5'}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-text font-medium text-sm truncate">{msg.name}</p>
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                    </div>
                    <p className="text-text-muted text-xs truncate">{msg.subject}</p>
                  </div>
                  <p className="text-text-muted text-xs whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
