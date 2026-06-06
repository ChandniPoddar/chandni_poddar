'use client';
import Link from 'next/link';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: <span className="w-4 h-4">🐙</span>, href: 'https://github.com/', label: 'GitHub' },
  { icon: <span className="w-4 h-4">in</span>, href: 'https://linkedin.com/', label: 'LinkedIn' },
  { icon: <span className="w-4 h-4">🐦</span>, href: 'https://twitter.com/', label: 'Twitter' },
  { icon: <span className="w-4 h-4">📸</span>, href: 'https://instagram.com/', label: 'Instagram' },
  { icon: <span className="w-4 h-4">✉️</span>, href: 'mailto:chandni@example.com', label: 'Email' },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-background-card/50 border-t border-border">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="w-5 h-5 text-white font-mono text-sm">&lt;/&gt;</span>
              </div>
              <span className="font-sora font-bold text-lg gradient-text">Chandni.dev</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Full Stack Developer passionate about crafting elegant digital experiences. Building the future, one commit at a time.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-9 h-9 rounded-lg glass border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 transition-all"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sora font-semibold text-text mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-text-muted text-sm hover:text-primary transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sora font-semibold text-text">Let&apos;s Build Together</h4>
            <p className="text-text-muted text-sm">Have a project in mind? Let&apos;s turn your ideas into reality.</p>
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold text-center hover:opacity-90 transition-opacity glow-primary w-fit"
            >
              Get in Touch
            </a>
            <Link
              href="/admin/login"
              className="text-xs text-text-subtle hover:text-text-muted transition-colors"
            >
              Admin Panel →
            </Link>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs flex items-center gap-1">
            Made with <span className="w-3 h-3 text-red-500">❤</span> by{' '}
            <span className="gradient-text font-semibold">Chandni Poddar</span> · {new Date().getFullYear()}
          </p>
            <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-xl glass border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 transition-all"
            aria-label="Scroll to top"
          >
            <span className="w-4 h-4">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
