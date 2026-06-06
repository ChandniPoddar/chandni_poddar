'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink, X, ChevronRight } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  githubUrl: string;
  liveUrl: string;
  category: string;
  technologies: string[];
  featured: boolean;
  status: string;
}

const FILTERS = ['All', 'Web Development', 'Mobile Applications', 'AI/ML', 'Full Stack', 'IoT', 'Academic Projects'];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => { if (d.success) setProjects(d.data); });
  }, []);

  const filtered = projects.filter((p) => {
    const matchFilter = activeFilter === 'All' || p.category === activeFilter;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const featured = filtered.filter((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured);

  return (
    <section id="projects" ref={ref} className="section-padding bg-background-card/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Portfolio</span>
          <h2 className="font-sora font-bold text-3xl sm:text-4xl text-text mt-2">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="mt-4 w-16 h-1 bg-gradient-primary rounded-full mx-auto" />
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto mb-6"
        >
          <input
            type="text"
            placeholder="Search by name, tech, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass border border-border text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors text-sm"
          />
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-gradient-primary text-white glow-primary'
                  : 'glass border border-border text-text-muted hover:text-text hover:border-primary/40'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted">No projects found. Add them from the admin dashboard.</div>
        ) : (
          <>
            {/* Featured Bento Grid */}
            {featured.length > 0 && (
              <div className={`grid gap-6 mb-8 ${featured.length === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                {featured.slice(0, 2).map((project, i) => (
                  <ProjectCard key={project._id} project={project} featured delay={i * 0.1} onSelect={setSelected} />
                ))}
              </div>
            )}

            {/* Regular Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regular.map((project, i) => (
                <ProjectCard key={project._id} project={project} delay={i * 0.08} onSelect={setSelected} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ project, featured, delay = 0, onSelect }: { project: Project; featured?: boolean; delay?: number; onSelect: (p: Project) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.01 }}
      className={`group glass rounded-2xl border border-border hover:border-primary/40 overflow-hidden cursor-pointer transition-all duration-300 ${featured ? 'min-h-72' : ''}`}
      onClick={() => onSelect(project)}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? 'h-52' : 'h-44'}`}>
        {project.image ? (
          <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
            <span className="font-sora font-bold text-white text-3xl">{project.title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background-card/80 to-transparent" />
        {project.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/90 text-white">
            Featured
          </span>
        )}
        <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium glass border border-border text-text-muted">
          {project.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-sora font-bold text-text text-lg mb-2 group-hover:gradient-text transition-all">{project.title}</h3>
        <p className="text-text-muted text-sm leading-relaxed mb-4 line-clamp-2">{project.shortDescription}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-border text-text-muted text-xs">+{project.technologies.length - 4}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
            View Details <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors" onClick={(e) => e.stopPropagation()}>
                <span className="w-4 h-4">🐙</span>
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors" onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="glass-strong rounded-3xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-64 rounded-t-3xl overflow-hidden">
          {project.image ? (
            <Image src={project.image} alt={project.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
              <span className="font-sora font-bold text-white text-5xl">{project.title.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background-card to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full glass border border-border flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="font-sora font-bold text-2xl text-text">{project.title}</h2>
              <span className="text-sm text-text-muted">{project.category}</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium glass border border-border text-text-muted whitespace-nowrap">
              {project.status}
            </span>
          </div>

          <p className="text-text-muted leading-relaxed mb-6">{project.description || project.shortDescription}</p>

          <div className="mb-6">
            <h4 className="font-semibold text-text mb-3 text-sm uppercase tracking-wider">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm border border-primary/20">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-xl glass border border-border text-center text-sm font-semibold text-text hover:border-primary/40 transition-colors flex items-center justify-center gap-2">
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-xl bg-gradient-primary text-white text-center text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
