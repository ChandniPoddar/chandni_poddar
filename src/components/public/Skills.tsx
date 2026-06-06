'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search } from 'lucide-react';

interface Skill {
  _id: string;
  name: string;
  category: string;
  color: string;
  icon: string;
}

const CATEGORIES = ['All', 'Programming Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'AI & Cloud', 'Mobile'];

const categoryColors: Record<string, string> = {
  'Programming Languages': '#3b82f6',
  'Frontend': '#06b6d4',
  'Backend': '#10b981',
  'Database': '#f59e0b',
  'Tools': '#8b5cf6',
  'AI & Cloud': '#ec4899',
  'Mobile': '#f97316',
};

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCategory, setActiveCategory] = useState('Programming Languages');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/skills')
      .then((r) => r.json())
      .then((d) => { if (d.success) setSkills(d.data); });
  }, []);

  const filtered = skills.filter((s) => {
    const matchCat = activeCategory === 'All' || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = filtered.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" ref={ref} className="section-padding bg-background-card/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">My Arsenal</span>
          <h2 className="font-sora font-bold text-3xl sm:text-4xl text-text mt-2">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <div className="mt-4 w-16 h-1 bg-gradient-primary rounded-full mx-auto" />
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-border text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors text-sm"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-gradient-primary text-white glow-primary scale-105'
                  : 'glass border border-border text-text-muted hover:text-text hover:border-primary/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills by Category */}
        {activeCategory === 'All' ? (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, catSkills], catIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * catIdx }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[category] || '#2563EB' }}
                  />
                  <h3 className="font-sora font-semibold text-text-muted text-sm uppercase tracking-wider">
                    {category}
                  </h3>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {catSkills.map((skill, i) => (
                    <SkillBadge key={skill._id} skill={skill} delay={i * 0.05} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {filtered.map((skill, i) => (
              <SkillBadge key={skill._id} skill={skill} delay={i * 0.05} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">No skills found matching your search.</div>
        )}
      </div>
    </section>
  );
}

function SkillBadge({ skill, delay }: { skill: Skill; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.08, y: -4 }}
      className="group relative"
    >
      <div
        className="px-4 py-2.5 rounded-xl glass border transition-all duration-300 cursor-default"
        style={{
          borderColor: `${skill.color}30`,
          boxShadow: `0 0 0 0 ${skill.color}`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${skill.color}40`;
          (e.currentTarget as HTMLElement).style.borderColor = `${skill.color}80`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLElement).style.borderColor = `${skill.color}30`;
        }}
      >
        <span className="font-medium text-sm text-text">{skill.name}</span>
      </div>
    </motion.div>
  );
}
