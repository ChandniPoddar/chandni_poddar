'use client';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Mail, Phone, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        toast.success('Message sent successfully! I\'ll get back to you soon.');
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSent(false), 5000);
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'chandni@example.com', href: 'mailto:chandni@example.com' },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+91 XXXXX XXXXX', href: 'tel:+91XXXXXXXXXX' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'India', href: '#' },
  ];

  return (
    <section id="contact" ref={ref} className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Get In Touch</span>
          <h2 className="font-sora font-bold text-3xl sm:text-4xl text-text mt-2">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <div className="mt-4 w-16 h-1 bg-gradient-primary rounded-full mx-auto" />
          <p className="text-text-muted mt-4 max-w-xl mx-auto">
            Have a project in mind? Want to collaborate? Or just want to say hi? My inbox is always open!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h3 className="font-sora font-bold text-xl text-text mb-3">Start a conversation</h3>
              <p className="text-text-muted leading-relaxed">
                Whether you&apos;re looking for a full-stack developer for your next project, want to explore collaboration opportunities, or simply want to connect — I&apos;d love to hear from you!
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex items-center gap-4 glass rounded-xl p-4 border border-border hover:border-primary/40 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-text-muted text-xs">{info.label}</p>
                    <p className="text-text font-medium text-sm">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Availability note */}
            <div className="glass rounded-xl p-4 border border-accent-green/30 bg-accent-green/5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <span className="text-accent-green font-semibold text-sm">Available for Work</span>
              </div>
              <p className="text-text-muted text-xs">Currently open to full-time, part-time, and freelance opportunities.</p>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass-strong rounded-3xl p-8 border border-border">
              {sent ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-accent-green/10 flex items-center justify-center">
                    <CheckCircle className="w-9 h-9 text-accent-green" />
                  </div>
                  <h3 className="font-sora font-bold text-text text-xl">Message Sent!</h3>
                  <p className="text-text-muted text-center text-sm">Thank you for reaching out. I&apos;ll get back to you as soon as possible.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-text-muted text-xs mb-1.5 block">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text placeholder-text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-text-muted text-xs mb-1.5 block">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text placeholder-text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-text-muted text-xs mb-1.5 block">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's it about?"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text placeholder-text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-text-muted text-xs mb-1.5 block">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell me about your project or just say hi..."
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text placeholder-text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-primary text-white font-semibold hover:opacity-90 transition-all glow-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
