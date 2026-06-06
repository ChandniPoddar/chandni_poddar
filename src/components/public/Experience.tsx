'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { formatDateRange } from '@/lib/utils';

interface Experience {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  technologies: string[];
  logo: string;
}

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    fetch('/api/experience')
      .then((r) => r.json())
      .then((d) => { if (d.success) setExperiences(d.data); });
  }, []);

  const sampleData: Experience[] = experiences.length > 0 ? experiences : [
    {
      _id: '1',
      company: 'Tech Company',
      role: 'Software Developer Intern',
      startDate: '2024-01-01',
      endDate: null,
      current: true,
      description: 'Built and maintained scalable full-stack web applications using Next.js and Node.js. Collaborated with cross-functional teams to deliver features on time.',
      technologies: ['Next.js', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
      logo: '',
    },
  ];

  return (
    <section id="experience" ref={ref} className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Work History</span>
          <h2 className="font-sora font-bold text-3xl sm:text-4xl text-text mt-2">
            My <span className="gradient-text">Experience</span>
          </h2>
          <div className="mt-4 w-16 h-1 bg-gradient-primary rounded-full mx-auto" />
        </motion.div>

        {sampleData.length === 0 ? (
          <div className="text-center py-12 text-text-muted">No experience entries yet. Add them from the admin dashboard.</div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
              className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-primary origin-top hidden sm:block"
            />

            <div className="space-y-8">
              {sampleData.map((exp, i) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, x: -40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                  className="relative sm:pl-20"
                >
                  {/* Timeline dot */}
                  <div className="hidden sm:flex absolute left-5 top-6 w-6 h-6 rounded-full bg-background border-2 border-primary items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>

                  <div className="glass rounded-2xl p-6 border border-border hover:border-primary/40 transition-all duration-300 group">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-sora font-bold text-text text-lg">{exp.role}</h3>
                          <p className="text-primary font-semibold text-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {exp.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {exp.current && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-green/10 text-accent-green border border-accent-green/30">
                            Current
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-text-muted text-xs whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                        </span>
                      </div>
                    </div>

                    <p className="text-text-muted text-sm leading-relaxed mb-4">{exp.description}</p>

                    {exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span key={tech} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
