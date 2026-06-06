'use client';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { GraduationCap, Target, User, Sparkles } from 'lucide-react';

const stats = [
  { label: 'Projects Built', value: '15+' },
  { label: 'Technologies', value: '20+' },
  { label: 'Certifications', value: '10+' },
  { label: 'GitHub Repos', value: '30+' },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    fetch('/api/hero')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data.resumeUrl) setResumeUrl(d.data.resumeUrl);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="about" ref={ref} className="section-padding bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Who I Am</span>
          <h2 className="font-sora font-bold text-3xl sm:text-4xl text-text mt-2">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="mt-4 w-16 h-1 bg-gradient-primary rounded-full mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image + Stats */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col gap-8"
          >
            {/* Avatar card / Resume */}
            <div className="relative">
              <div className="w-full max-w-sm mx-auto aspect-square rounded-3xl overflow-hidden gradient-border glow-primary bg-background-card">
                {resumeUrl ? (
                  <div className="w-full h-full relative">
                    {/* Convert Cloudinary PDF URL to JPG to show first page as an image */}
                    <img
                      src={resumeUrl.replace(/\.pdf$/i, '.jpg')}
                      alt="Resume"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                    <User className="w-32 h-32 text-white/60" />
                  </div>
                )}
              </div>
              {/* Floating card */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-6 -right-6 glass p-4 rounded-2xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Currently</p>
                    <p className="text-sm font-semibold text-text">Open to Work</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="glass rounded-2xl p-4 border border-border text-center hover:border-primary/40 transition-colors"
                >
                  <p className="font-sora font-bold text-2xl gradient-text">{stat.value}</p>
                  <p className="text-text-muted text-xs mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h3 className="font-sora font-bold text-2xl text-text mb-4">
                Building digital experiences that matter
              </h3>
              <p className="text-text-muted leading-relaxed">
                I&apos;m <span className="text-text font-semibold">Chandni Poddar</span>, a passionate Full Stack Developer
                with a love for crafting elegant, performant web and mobile applications. I blend technical expertise
                with creative problem-solving to deliver solutions that make a real impact.
              </p>
            </div>

            <p className="text-text-muted leading-relaxed">
              With hands-on experience in modern technologies like <span className="text-primary">Next.js</span>,{' '}
              <span className="text-secondary">Flutter</span>, and <span className="text-accent">AI/ML</span>, I
              build products that are not just functional but delightful to use. I&apos;m constantly learning and
              pushing the boundaries of what&apos;s possible.
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              {[
                { icon: <Target className="w-5 h-5" />, title: 'Career Objective', desc: 'Full Stack & AI/ML Engineer at a product-first company' },
                { icon: <GraduationCap className="w-5 h-5" />, title: 'Education', desc: 'B.Tech in Computer Science Engineering' },
              ].map((item) => (
                <div key={item.title} className="glass rounded-xl p-4 border border-border hover:border-primary/40 transition-colors">
                  <div className="text-primary mb-2">{item.icon}</div>
                  <p className="font-semibold text-text text-sm mb-1">{item.title}</p>
                  <p className="text-text-muted text-xs">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-2">
              <a href="#contact" className="px-5 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                Get in Touch
              </a>
              <a href="#projects" className="px-5 py-2.5 rounded-xl glass border border-border text-text text-sm font-semibold hover:border-primary/40 transition-colors">
                View Projects
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
