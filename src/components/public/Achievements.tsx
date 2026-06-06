'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Trophy, Calendar, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Achievement {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  certificateLink: string;
}

export default function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    fetch('/api/achievements')
      .then((r) => r.json())
      .then((d) => { if (d.success) setAchievements(d.data); });
  }, []);

  const samples: Achievement[] = achievements.length > 0 ? achievements : [
    { _id: '1', title: 'Hackathon Winner', description: 'First place in university-level hackathon for building an AI-powered solution.', image: '', date: '2024-03-15', certificateLink: '' },
    { _id: '2', title: 'Best Project Award', description: 'Recognized for outstanding final year project in the department.', image: '', date: '2024-05-20', certificateLink: '' },
    { _id: '3', title: 'Open Source Contributor', description: 'Contributed to popular open source projects with 100+ stars on GitHub.', image: '', date: '2023-11-10', certificateLink: '' },
  ];

  return (
    <section id="achievements" ref={ref} className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Recognition</span>
          <h2 className="font-sora font-bold text-3xl sm:text-4xl text-text mt-2">
            Achievements & <span className="gradient-text">Awards</span>
          </h2>
          <div className="mt-4 w-16 h-1 bg-gradient-primary rounded-full mx-auto" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {samples.map((achievement, i) => (
            <motion.div
              key={achievement._id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, rotateX: 3, rotateY: 3 }}
              className="glass rounded-2xl border border-border hover:border-primary/40 overflow-hidden group transition-all duration-300"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              {/* Top accent */}
              <div className="h-1 bg-gradient-primary" />

              {/* Image or Icon */}
              <div className="relative h-36 overflow-hidden">
                {achievement.image ? (
                  <Image src={achievement.image} alt={achievement.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-primary/10 flex items-center justify-center">
                    <motion.div
                      whileHover={{ rotate: 20, scale: 1.2 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Trophy className="w-16 h-16 text-primary/60" />
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-sora font-bold text-text text-lg mb-2 group-hover:gradient-text transition-all">
                  {achievement.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-4">{achievement.description}</p>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-text-muted text-xs">
                    <Calendar className="w-3 h-3" />
                    {formatDate(achievement.date)}
                  </span>
                  {achievement.certificateLink && (
                    <a
                      href={achievement.certificateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary text-xs hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> Certificate
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
