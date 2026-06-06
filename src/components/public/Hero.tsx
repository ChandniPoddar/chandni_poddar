'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Mail, Download, ArrowDown, ExternalLink } from 'lucide-react';

interface HeroData {
  name: string;
  designation: string;
  taglines: string[];
  bio: string;
  profileImage: string;
  resumeUrl: string;
  socialLinks: { platform: string; url: string; icon: string }[];
}

const iconMap: Record<string, React.ReactNode> = {
  github: <span className="w-5 h-5">🐙</span>,
  linkedin: <span className="w-5 h-5">in</span>,
  twitter: <span className="w-5 h-5">🐦</span>,
  instagram: <span className="w-5 h-5">📸</span>,
  email: <Mail className="w-5 h-5" />,
};

function TypingText({ texts }: { texts: string[] }) {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!texts.length) return;
    const current = texts[index % texts.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setDisplayed(current.slice(0, charIndex + 1));
          setCharIndex((c) => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 1500);
        }
      } else {
        if (charIndex > 0) {
          setDisplayed(current.slice(0, charIndex - 1));
          setCharIndex((c) => c - 1);
        } else {
          setDeleting(false);
          setIndex((i) => (i + 1) % texts.length);
        }
      }
    }, deleting ? 50 : 80);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, index, texts]);

  return (
    <span className="gradient-text">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

export default function Hero() {
  const [hero, setHero] = useState<HeroData>({
    name: 'Chandni Poddar',
    designation: 'Full Stack Developer',
    taglines: ['Full Stack Developer', 'Flutter Developer', 'AI/ML Enthusiast', 'Open Source Contributor'],
    bio: 'Passionate about building elegant, scalable web and mobile applications.',
    profileImage: '',
    resumeUrl: '',
    socialLinks: [],
  });

  useEffect(() => {
    fetch('/api/hero')
      .then((r) => r.json())
      .then((d) => { if (d.success) setHero(d.data); })
      .catch(() => {});
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <ParticleBackground />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />

      <div className="container-custom relative z-10 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-text-muted border border-border">
                <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                Available for opportunities
              </span>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-text-muted text-lg font-medium mb-2">Hi, I&apos;m 👋</p>
              <h1 className="font-sora font-bold text-4xl sm:text-5xl lg:text-6xl text-text leading-tight">
                {hero.name}
              </h1>
            </motion.div>

            <motion.h2 variants={itemVariants} className="font-sora font-semibold text-2xl sm:text-3xl min-h-[2.5rem]">
              <TypingText texts={hero.taglines} />
            </motion.h2>

            <motion.p variants={itemVariants} className="text-text-muted text-lg leading-relaxed max-w-lg">
              {hero.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <a href="#contact" className="px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold hover:opacity-90 transition-all hover:scale-105 glow-primary flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                {hero.ctaText || "Let's Work Together"}
              </a>
              {hero.resumeUrl && (
                <a
                  href={hero.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl glass border border-border text-text font-semibold hover:border-primary/50 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Resume
                </a>
              )}
            </motion.div>

            {/* Social Links */}
            {hero.socialLinks.length > 0 && (
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                {hero.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl glass border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/50 transition-all hover:scale-110"
                  >
                    {iconMap[link.icon.toLowerCase()] || <ExternalLink className="w-4 h-4" />}
                  </a>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right — Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-primary blur-2xl opacity-30 scale-110 animate-pulse-glow" />
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden gradient-border animate-float shadow-2xl">
                {hero.profileImage ? (
                  <Image
                    src={hero.profileImage}
                    alt={hero.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                    <span className="font-sora font-bold text-white text-6xl">
                      {hero.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              {/* Floating tech badges */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 3, ease: [0.42, 0, 0.58, 1] }}
                className="absolute -top-4 -right-4 glass px-3 py-2 rounded-xl text-xs font-semibold text-primary border border-primary/30"
              >
                Next.js 15
              </motion.div>
              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: [0.42, 0, 0.58, 1] }}
                className="absolute -bottom-4 -left-4 glass px-3 py-2 rounded-xl text-xs font-semibold text-secondary border border-secondary/30"
              >
                Flutter Dev
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-text-muted text-xs">Scroll down</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown className="w-4 h-4 text-text-muted" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
