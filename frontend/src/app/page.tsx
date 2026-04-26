'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, PenTool, BookOpen, Sparkles, LockKeyhole } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';


export default function Home() {
  const [stories, setStories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const data = await api.stories.getAll(page, 2);
        setStories(data.stories);
        setTotal(data.total);
      } catch (err) {
        console.error('Failed to fetch stories:', err);
      }
      setLoading(false);
    };
    fetchStories();
  }, [page]);

  return (
    <div className="space-y-12 md:space-y-20 animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[360px] md:h-[520px] rounded-[28px] md:rounded-[48px] overflow-hidden flex items-center p-6 md:p-20">
        <div className="absolute inset-0 bg-[#020617] group">
          <img
            src="/hero.png"
            alt="Hero"
            className="absolute top-0 right-0 h-full w-auto object-contain brightness-75 transition-transform duration-[5s] group-hover:scale-105"
          />
          {/* Fade transition for the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20 shadow-lg shadow-amber-500/5">
            <Crown className="w-3.5 h-3.5" /> Premium Experience
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1] text-white relative">
              Discover stories <br />
              that <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-purple-400">resonate.</span>
                <svg className="absolute -bottom-3 left-0 w-full h-3 text-primary/40 -z-10" viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 15 Q50 5 100 15 T200 15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
              <Sparkles className="absolute -top-6 -right-8 w-8 h-8 text-purple-400 opacity-50 animate-pulse" />
            </h1>
            <p className="text-xl opacity-60 leading-relaxed max-w-lg font-medium">
              Immerse yourself in essays, fiction, and deep dives from writers across the globe.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link href="#latest" className="btn-primary py-4 px-10 rounded-[20px] flex items-center gap-2.5 shadow-2xl shadow-primary/30 text-base font-black transition-all hover:scale-105 active:scale-95">
              <BookOpen className="w-5 h-5" /> Start Reading
            </Link>
            <Link href="/story/new" className="glass py-4 px-10 rounded-[20px] font-bold flex items-center gap-2.5 hover:bg-white/10 transition-all text-white/90">
              <PenTool className="w-5 h-5" /> Write a Story
            </Link>
          </div>
        </div>
      </section>

      {/* Main Feed */}
      <div id="latest" className="max-w-6xl mx-auto space-y-12 pb-16 scroll-mt-28">
        <div className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
              <span className="w-1 h-9 bg-primary rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></span>
              Latest Stories
            </h2>
          </div>
          <Link href="/explore" className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
            View all <span className="text-xl leading-none">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[1, 2].map(i => (
              <div key={i} className="glass p-8 rounded-[40px] animate-pulse h-56" />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="glass p-24 text-center rounded-[48px] border-white/5">
            <BookOpen className="w-16 h-16 mx-auto mb-6 opacity-10" />
            <h3 className="text-2xl font-black opacity-30">No stories found yet</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map(story => (
              <article key={story._id} className="group bg-[#0a0f1d] border border-white/5 p-4 md:p-6 rounded-[24px] transition-all hover:border-white/10 flex flex-col md:flex-row gap-6 relative">
                {/* Image */}
                <div className="w-full md:w-[280px] h-48 rounded-2xl overflow-hidden shrink-0 relative bg-gradient-to-br from-primary/20 via-purple-900/20 to-slate-800">
                  {story.coverImage && story.coverImage !== '' ? (
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900/80 via-purple-800/60 to-slate-800 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 opacity-20 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <Link href={`/story/${story._id}`}>
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors cursor-pointer leading-tight text-white">{story.title}</h3>
                      </Link>

                      {/* Badge */}
                      {story.isPremium ? (
                        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500 text-amber-500 text-[10px] font-black uppercase tracking-widest bg-amber-500/10">
                          <Crown className="w-3 h-3" /> PREMIUM
                        </div>
                      ) : (
                        <div className="shrink-0 px-3 py-1.5 rounded-full border border-green-500 text-green-500 text-[10px] font-black uppercase tracking-widest bg-green-500/10">
                          FREE
                        </div>
                      )}
                    </div>

                    <p className="text-foreground/50 line-clamp-2 leading-relaxed text-sm max-w-2xl">{story.description}</p>

                    {/* Author Info */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center font-black text-xs text-white shadow-lg">
                        {story.author.name[0]?.toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">By {story.author.name}</span>
                        <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest mt-0.5">
                          {new Date(story.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} • {story.readingTime} MIN READ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Right Action */}
                  <div className="absolute bottom-6 right-6 flex items-center justify-end">
                    {story.isPremium && !user?.isPremium ? (
                      <Link href={`/story/${story._id}`} className="btn-primary py-2 px-5 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-primary/20">
                        <LockKeyhole className="w-3.5 h-3.5" /> Unlock
                      </Link>
                    ) : (
                      <Link href={`/story/${story._id}`} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                        <span className="text-sm font-bold">Read Now</span>
                        <span className="text-lg leading-none">→</span>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Improved Benefits Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10">
          {[
            { title: 'Quality Content', desc: 'Curated stories that matter', icon: <PenTool className="w-6 h-6 text-primary" /> },
            { title: 'Global Writers', desc: 'Voices from the world', icon: <BookOpen className="w-6 h-6 text-purple-400" /> },
            { title: 'Premium Access', desc: 'Unlock exclusive content', icon: <Crown className="w-6 h-6 text-amber-500" /> },

          ].map((item, i) => (
            <div key={i} className="flex items-center gap-5 glass p-6 rounded-[32px] border-white/5 bg-white/[0.01]">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 shadow-inner">
                {item.icon}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-white mb-0.5">{item.title}</h4>
                <p className="text-[10px] opacity-40 uppercase font-bold tracking-wider leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
