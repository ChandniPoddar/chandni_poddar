'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

const codingProfiles = [
  {
    name: 'GitHub',
    handle: 'chandnipoddar',
    url: 'https://github.com/chandnipoddar',
    color: '#181717',
    gradient: 'from-[#181717] to-[#333]',
    description: 'Open source contributions & personal projects',
  },
  {
    name: 'LeetCode',
    handle: 'chandnipoddar',
    url: 'https://leetcode.com/chandnipoddar',
    color: '#FFA116',
    gradient: 'from-[#FFA116] to-[#b8860b]',
    description: 'DSA practice & competitive programming',
  },
  {
    name: 'HackerRank',
    handle: 'chandnipoddar',
    url: 'https://hackerrank.com/chandnipoddar',
    color: '#00EA64',
    gradient: 'from-[#00EA64] to-[#008000]',
    description: 'Problem solving & certifications',
  },
  {
    name: 'CodeChef',
    handle: 'chandnipoddar',
    url: 'https://codechef.com/users/chandnipoddar',
    color: '#5B4638',
    gradient: 'from-[#5B4638] to-[#8B6914]',
    description: 'Competitive programming contests',
  },
  {
    name: 'LinkedIn',
    handle: 'chandni-poddar',
    url: 'https://linkedin.com/in/chandni-poddar',
    color: '#0A66C2',
    gradient: 'from-[#0A66C2] to-[#004182]',
    description: 'Professional network & endorsements',
  },
];

export default function CodingProfiles() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="coding-profiles" ref={ref} className="section-padding bg-background-card/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Online Presence</span>
          <h2 className="font-sora font-bold text-3xl sm:text-4xl text-text mt-2">
            Coding <span className="gradient-text">Profiles</span>
          </h2>
          <div className="mt-4 w-16 h-1 bg-gradient-primary rounded-full mx-auto" />
        </motion.div>

        {/* GitHub Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-border p-6 mb-12"
        >
          <h3 className="font-sora font-semibold text-text mb-6 text-center">GitHub Statistics</h3>
          <div className="grid sm:grid-cols-3 gap-4 justify-items-center">
            <Image
              src="https://github-readme-stats.vercel.app/api?username=chandnipoddar&show_icons=true&theme=transparent&title_color=2563EB&icon_color=7C3AED&text_color=9CA3AF&border_color=1F2937&hide_border=false"
              alt="GitHub Stats"
              width={400}
              height={165}
              className="rounded-xl w-full max-w-sm"
            />
            <Image
              src="https://github-readme-streak-stats.herokuapp.com/?user=chandnipoddar&theme=transparent&ring=2563EB&fire=7C3AED&currStreakLabel=F9FAFB&sideLabels=9CA3AF&border=1F2937"
              alt="GitHub Streak"
              width={400}
              height={165}
              className="rounded-xl w-full max-w-sm"
            />
            <Image
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=chandnipoddar&layout=compact&theme=transparent&title_color=2563EB&text_color=9CA3AF&border_color=1F2937"
              alt="Top Languages"
              width={400}
              height={165}
              className="rounded-xl w-full max-w-sm"
            />
          </div>
        </motion.div>

        {/* Profile Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {codingProfiles.map((profile, i) => (
            <motion.a
              key={profile.name}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glass rounded-2xl border border-border hover:border-white/20 overflow-hidden group transition-all duration-300"
            >
              <div className={`h-1.5 bg-gradient-to-r ${profile.gradient}`} />
              <div className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${profile.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <span className="text-white font-bold text-lg">{profile.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sora font-bold text-text">{profile.name}</p>
                  <p className="text-text-muted text-xs">@{profile.handle}</p>
                  <p className="text-text-muted text-xs mt-1 line-clamp-1">{profile.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
