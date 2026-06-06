'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

interface Education {
  _id: string;
  institute: string;
  degree: string;
  field: string;
  cgpa: string;
  percentage: string;
  startYear: string;
  endYear: string;
  description: string;
}

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [education, setEducation] = useState<Education[]>([]);

  useEffect(() => {
    fetch('/api/education')
      .then((r) => r.json())
      .then((d) => { if (d.success) setEducation(d.data); });
  }, []);

  const samples: Education[] = education.length > 0 ? education : [
    { _id: '1', institute: 'XYZ University', degree: 'Bachelor of Technology', field: 'Computer Science Engineering', cgpa: '8.5', percentage: '', startYear: '2021', endYear: '2025', description: 'Specialization in AI/ML and Full Stack Development. Active member of the coding club.' },
    { _id: '2', institute: 'ABC Higher Secondary School', degree: 'Higher Secondary Certificate (12th)', field: 'Science — PCM', cgpa: '', percentage: '92%', startYear: '2019', endYear: '2021', description: '' },
    { _id: '3', institute: 'DEF School', degree: 'Secondary School Certificate (10th)', field: '', cgpa: '', percentage: '95%', startYear: '2017', endYear: '2019', description: '' },
  ];

  return (
    <section id="education" ref={ref} className="section-padding bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Academic Journey</span>
          <h2 className="font-sora font-bold text-3xl sm:text-4xl text-text mt-2">
            My <span className="gradient-text">Education</span>
          </h2>
          <div className="mt-4 w-16 h-1 bg-gradient-primary rounded-full mx-auto" />
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
            className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-primary origin-top hidden sm:block"
          />

          <div className="space-y-8">
            {samples.map((edu, i) => (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="relative sm:pl-16"
              >
                <div className="hidden sm:flex absolute left-3 top-6 w-6 h-6 rounded-full bg-background border-2 border-secondary items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                </div>

                <div className="glass rounded-2xl p-6 border border-border hover:border-secondary/40 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                        <h3 className="font-sora font-bold text-text text-lg">{edu.degree}</h3>
                        <span className="text-text-muted text-xs whitespace-nowrap">
                          {edu.startYear} — {edu.endYear}
                        </span>
                      </div>
                      <p className="text-secondary font-semibold text-sm mb-1">{edu.institute}</p>
                      {edu.field && <p className="text-text-muted text-sm mb-3">{edu.field}</p>}

                      {(edu.cgpa || edu.percentage) && (
                        <div className="flex gap-3 mb-3">
                          {edu.cgpa && (
                            <span className="px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary text-xs border border-secondary/20">
                              CGPA: {edu.cgpa}
                            </span>
                          )}
                          {edu.percentage && (
                            <span className="px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary text-xs border border-secondary/20">
                              {edu.percentage}
                            </span>
                          )}
                        </div>
                      )}

                      {edu.description && (
                        <p className="text-text-muted text-sm leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
