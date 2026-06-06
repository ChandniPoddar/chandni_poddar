'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Award, Calendar, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  image: string;
}

export default function Certificates() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/certificates')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCertificates(d.data); });
  }, []);

  const samples: Certificate[] = certificates.length > 0 ? certificates : [
    { _id: '1', title: 'AWS Certified Developer', issuer: 'Amazon Web Services', issueDate: '2024-01-15', credentialUrl: '', image: '' },
    { _id: '2', title: 'Google Cloud Associate', issuer: 'Google Cloud', issueDate: '2024-03-20', credentialUrl: '', image: '' },
    { _id: '3', title: 'Meta React Developer', issuer: 'Meta', issueDate: '2023-09-10', credentialUrl: '', image: '' },
    { _id: '4', title: 'Machine Learning Specialization', issuer: 'DeepLearning.AI', issueDate: '2023-07-05', credentialUrl: '', image: '' },
    { _id: '5', title: 'Flutter & Dart Development', issuer: 'Udemy', issueDate: '2023-05-12', credentialUrl: '', image: '' },
  ];

  const scroll = (dir: 'left' | 'right') => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
    }
  };

  return (
    <section id="certificates" ref={ref} className="section-padding bg-background-card/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Credentials</span>
          <h2 className="font-sora font-bold text-3xl sm:text-4xl text-text mt-2">
            Licenses & <span className="gradient-text">Certifications</span>
          </h2>
          <div className="mt-4 w-16 h-1 bg-gradient-primary rounded-full mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          {/* Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
          >
            {samples.map((cert, i) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass rounded-2xl border border-border hover:border-primary/40 overflow-hidden min-w-[300px] max-w-[300px] snap-start group transition-all duration-300"
              >
                {/* Image / Placeholder */}
                <div className="relative h-40 overflow-hidden">
                  {cert.image ? (
                    <Image src={cert.image} alt={cert.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-primary/10 flex items-center justify-center">
                      <Award className="w-14 h-14 text-primary/60" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background-card/60 to-transparent" />
                </div>

                <div className="p-5">
                  <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-1">{cert.issuer}</p>
                  <h3 className="font-sora font-bold text-text text-base mb-3 line-clamp-2">{cert.title}</h3>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-text-muted text-xs">
                      <Calendar className="w-3 h-3" />
                      {formatDate(cert.issueDate)}
                    </span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary text-xs font-medium hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> Verify
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-xl glass border border-border flex items-center justify-center text-text-muted hover:text-text hover:border-primary/40 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-xl glass border border-border flex items-center justify-center text-text-muted hover:text-text hover:border-primary/40 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
