'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Crown, Search, SlidersHorizontal, LayoutGrid, BookOpen, FileText, Feather, Monitor, Heart, Briefcase, MoreHorizontal, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function Explore() {
  const [stories, setStories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const { user } = useAuth();
  const limit = 4; // To show pagination in the screenshot, fewer items per page might be better, let's use 4 or 5. Let's use 5.

  const categories = [
    { name: 'All', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  ];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        let url = `/api/stories?page=${page}&limit=${limit}&sort=${sort}`;
        if (debouncedSearch) {
          url += `&search=${encodeURIComponent(debouncedSearch)}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (res.ok) {
          setStories(data.stories);
          setTotal(data.total);
        }
      } catch (err) {
        console.error('Failed to fetch stories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [page, sort, debouncedSearch]);

  const totalPages = Math.ceil(total / limit);

  // Pagination helper to generate the array of pages (e.g. 1 2 3 ... 8)
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in py-12 relative">
      {/* Decorative Globe / Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[300px] opacity-40 pointer-events-none">
        <div className="absolute top-10 right-20 w-[400px] h-[400px] border border-primary/20 rounded-full border-dashed animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-20 right-32 w-[300px] h-[300px] border border-primary/40 rounded-full border-dotted animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute top-32 right-44 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[80px]" />
        <Feather className="absolute top-16 right-[450px] w-12 h-12 text-primary/60 -rotate-12 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
      </div>

      {/* Header */}
      <div className="space-y-4 pt-10">
        <h1 className="text-5xl md:text-[64px] font-black tracking-tight text-white flex items-start gap-4">
          Explore
          <Sparkles className="w-8 h-8 text-primary/80 mt-2" />
        </h1>
        <p className="text-xl text-foreground/60 font-medium tracking-wide">
          Discover stories across the globe.
        </p>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 pt-4">
        <div className="flex-1 flex items-center bg-[#0a0f1d] border border-white/5 rounded-2xl shadow-inner focus-within:ring-2 focus-within:ring-primary/50 transition-all">
          <div className="pl-5 pr-3 shrink-0 flex items-center justify-center">
            <Search className="w-5 h-5 opacity-40 text-white" />
          </div>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full !border-none !bg-transparent py-4 pr-4 font-medium text-white placeholder:opacity-30 !shadow-none !ring-0 focus:!shadow-none focus:!ring-0"
          />
        </div>
        <div className="relative shrink-0 w-full md:w-56">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full bg-[#0a0f1d] border border-white/5 rounded-2xl py-4 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-white shadow-inner flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 opacity-40 text-white" />
              <span>{sort === 'latest' ? 'Latest First' : 'Oldest First'}</span>
            </div>
            <div className={`text-white/40 text-xs transition-transform ${isSortOpen ? 'rotate-180' : ''}`}>▼</div>
          </button>

          {isSortOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in flex flex-col">
              <button
                onClick={() => {
                  setSort('latest');
                  setPage(1);
                  setIsSortOpen(false);
                }}
                className={`py-3 px-5 text-left font-bold transition-all hover:bg-white/5 ${sort === 'latest' ? 'text-primary' : 'text-white/70'}`}
              >
                Latest First
              </button>
              <div className="h-px bg-white/5 mx-2" />
              <button
                onClick={() => {
                  setSort('oldest');
                  setPage(1);
                  setIsSortOpen(false);
                }}
                className={`py-3 px-5 text-left font-bold transition-all hover:bg-white/5 ${sort === 'oldest' ? 'text-primary' : 'text-white/70'}`}
              >
                Oldest First
              </button>
            </div>
          )}
        </div>
      </div>

      {/* <div className="flex flex-wrap items-center gap-3 pb-4">
        {categories.map((cat, idx) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${isActive
                ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'bg-white/5 border-white/5 text-foreground/60 hover:bg-white/10 hover:text-white'
                }`}
            >
              {cat.icon} {cat.name !== 'More' && cat.name}
            </button>
          );
        })}
      </div> */}

      {/* Feed */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-[24px] p-6 animate-pulse h-48" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="bg-white/5 p-20 text-center rounded-[32px] border border-white/5">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-20 text-white" />
          <h3 className="text-xl font-black opacity-40 text-white">No stories found</h3>
          <p className="opacity-30 mt-2 text-sm">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {stories.map(story => (
            <article key={story._id} className="group bg-[#0a0f1d] border border-white/5 p-4 md:p-6 rounded-[24px] transition-all hover:border-white/10 flex flex-col md:flex-row gap-6 relative">
              {/* Image */}
              <div className="w-full md:w-[280px] h-48 rounded-2xl overflow-hidden shrink-0 relative bg-gradient-to-br from-indigo-900/80 via-purple-800/60 to-slate-800 flex items-center justify-center">
                {story.coverImage && story.coverImage !== '' ? (
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <BookOpen className="w-12 h-12 opacity-20 text-white" />
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
                        {new Date(story.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} • 5 MIN READ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Right Read Now Action */}
                <div className="absolute bottom-6 right-6 flex items-center justify-end">
                  <Link href={`/story/${story._id}`} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                    <span className="text-sm font-bold">Read Now</span>
                    <span className="text-lg leading-none">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {getPageNumbers().map((num, i) => (
            num === '...' ? (
              <div key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-white/30 text-sm font-bold">...</div>
            ) : (
              <button
                key={`page-${num}`}
                onClick={() => setPage(num as number)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all border ${page === num
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {num}
              </button>
            )
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
