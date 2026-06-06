'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Cpu, Briefcase, FolderOpen, Trophy, Award,
  GraduationCap, MessageSquare, FileText, User, LogOut, Menu, X,
  ChevronRight, Code2, Home
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
  { href: '/admin/hero', icon: <User className="w-4 h-4" />, label: 'Hero Config' },
  { href: '/admin/skills', icon: <Cpu className="w-4 h-4" />, label: 'Skills' },
  { href: '/admin/experience', icon: <Briefcase className="w-4 h-4" />, label: 'Experience' },
  { href: '/admin/projects', icon: <FolderOpen className="w-4 h-4" />, label: 'Projects' },
  { href: '/admin/achievements', icon: <Trophy className="w-4 h-4" />, label: 'Achievements' },
  { href: '/admin/certificates', icon: <Award className="w-4 h-4" />, label: 'Certificates' },
  { href: '/admin/education', icon: <GraduationCap className="w-4 h-4" />, label: 'Education' },
  { href: '/admin/resume', icon: <FileText className="w-4 h-4" />, label: 'Resume' },
  { href: '/admin/messages', icon: <MessageSquare className="w-4 h-4" />, label: 'Messages' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-sora font-bold text-text text-sm">Admin Portal</p>
            <p className="text-text-muted text-xs">Portfolio CMS</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-primary text-white glow-primary'
                  : 'text-text-muted hover:text-text hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={`p-3 border-t border-border space-y-1 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-muted hover:text-text hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">View Portfolio</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col h-screen glass-strong border-r border-border sticky top-0 overflow-hidden"
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-4 right-3 z-10 w-6 h-6 rounded-lg glass border border-border flex items-center justify-center text-text-muted hover:text-text transition-colors"
        >
          <ChevronRight className={`w-3 h-3 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
        <SidebarContent />
      </motion.aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl glass border border-border flex items-center justify-center text-text"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 glass-strong border-r border-border z-50 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg glass border border-border flex items-center justify-center text-text-muted"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
