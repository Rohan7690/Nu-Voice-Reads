'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { Crown, LockKeyhole, Clock, BookOpen } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

export default function StoryView() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [story, setStory] = useState<any>(null);
  const [authorStories, setAuthorStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/story/${id}`);
    }
  }, [user, authLoading, router, id]);

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const headers: any = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/stories/${id}`, { headers });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Story not found');
        setStory(data);

        // Fetch more by author
        if (data.author?._id) {
          const authorRes = await fetch(`/api/stories?author=${data.author._id}&limit=4`);
          const authorData = await authorRes.json();
          setAuthorStories((authorData.stories || []).filter((s: any) => s._id !== id));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStoryData();
  }, [id, token]);

  if (authLoading || (!user && !authLoading)) return <div className="py-20 text-center opacity-50 animate-pulse">Checking authentication...</div>;
  if (loading) return <div className="py-20 text-center opacity-50 animate-pulse">Initializing reading mode...</div>;
  if (error) return <div className="py-20 text-center text-red-400">{error}</div>;
  if (!story) return null;

  return (
    <div className="animate-fade-in pb-20">
      <style>{`
        .story-body { overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; }
        .story-body ul { list-style-type: disc !important; padding-left: 2rem !important; margin: 1rem 0 !important; }
        .story-body ol { list-style-type: decimal !important; padding-left: 2rem !important; margin: 1rem 0 !important; }
        .story-body li { display: list-item !important; margin-bottom: 0.4rem !important; color: #f8fafc; }
        .story-body ul > li::marker { color: #f8fafc !important; }
        .story-body ol > li::marker { color: #f8fafc !important; }
        .story-body ul > li::before { display: none !important; }
        .story-body ol > li::before { display: none !important; }
        .story-body h1, .story-body h2, .story-body h3 { font-weight: bold; margin: 1.2rem 0 0.6rem; }
        .story-body h1 { font-size: 2rem; }
        .story-body h2 { font-size: 1.5rem; }
        .story-body h3 { font-size: 1.25rem; }
        .story-body blockquote { border-left: 4px solid #6366f1; padding-left: 1rem; margin: 1rem 0; opacity: 0.8; }
        .story-body pre { background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0; font-family: monospace; overflow-x: auto; max-width: 100%; white-space: pre-wrap; }
        .story-body p { margin-bottom: 1rem; }
        .story-body img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
        .story-body a { color: #818cf8; text-decoration: underline; }
        .story-body strong { font-weight: bold; }
        .story-body em { font-style: italic; }
        .story-body u { text-decoration: underline; }
        .story-body s { text-decoration: line-through; }
      `}</style>
      {/* Cinematic Header */}
      <header className="relative w-full h-[300px] md:h-[500px] mb-8 md:mb-12 rounded-[28px] md:rounded-[48px] overflow-hidden group shadow-2xl">
        {story.coverImage && story.coverImage !== '' ? (
          <img
            src={story.coverImage}
            className="absolute inset-0 w-full h-full object-cover brightness-50"
            alt=""
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-slate-900 flex items-center justify-center">
            <BookOpen className="w-16 h-16 md:w-24 md:h-24 opacity-10 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent"></div>

        {/* Back Button overlaid at top of cover */}
        <div className="absolute top-4 left-4 md:top-6 md:left-10 z-10">
          <Link href="/" className="inline-flex glass p-2 md:p-2.5 rounded-xl md:rounded-2xl text-[10px] items-center gap-2 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-white/80">
            <span className="text-lg md:text-xl">←</span> Back
          </Link>
        </div>

        <div className="absolute bottom-6 md:bottom-12 left-4 md:left-10 right-4 md:right-10 z-10">
          <div>
            {story.isPremium && (
              <div className="inline-flex items-center gap-1.5 bg-amber-500 text-black text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-wider mb-3 md:mb-5 shadow-xl">
                <Crown className="w-3.5 h-3.5" /> Premium Story
              </div>
            )}
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight text-white mb-2 md:mb-4 leading-tight">{story.title}</h1>
            <p className="text-base md:text-2xl opacity-80 italic max-w-2xl text-white/90 mb-4 md:mb-8 leading-relaxed line-clamp-2 hidden sm:block">{story.description}</p>

            <div className="flex items-center gap-3 md:gap-5">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center font-black text-lg md:text-xl text-white shadow-2xl">
                {story.author?.name?.[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-sm md:text-lg text-white underline underline-offset-4 decoration-primary">{story.author?.name}</span>
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-[8px] text-white">✓</span>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-white/40 font-medium">{new Date(story.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {story.readingTime} min read</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8 md:gap-16">
        {/* Main Content Area */}
        <div className="flex-1">
          <article>
            <div
              className={`story-body ${story.locked ? 'relative pointer-events-none select-none h-96 overflow-hidden' : ''}`}
              style={{ fontSize: '1.125rem', lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: story.content }}
            />

            {story.locked && (
              <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-3xl pointer-events-auto flex flex-col items-center justify-center p-4">
                <div className="bg-[#0f172a] p-12 rounded-[48px] text-center max-w-sm shadow-[0_0_150px_rgba(0,0,0,0.9)] border border-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/15 blur-[100px]"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-amber-500/20 p-6 rounded-full mb-8 ring-2 ring-amber-500/30">
                      <LockKeyhole className="w-16 h-16 text-amber-500" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 text-white">Unlock Full Story</h3>
                    <p className="opacity-60 mb-8 leading-relaxed">This masterpiece is reserved for our Premium members. Subscribe now to continue reading.</p>
                    <Link href="/pricing" className="btn-primary w-full py-4 rounded-3xl shadow-2xl shadow-primary/40 text-lg font-black hover:scale-[1.03] transition-transform">
                      Subscribe to Read
                    </Link>
                    <p className="mt-5 text-[10px] font-black uppercase tracking-widest text-foreground/30">$5 or included with Premium</p>
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Dynamic Sidebar */}
        <aside className="w-full lg:w-80 space-y-12 shrink-0">
          {/* More by Author Library */}
          <div className="space-y-6">
            <div className="flex justify-between items-end px-2">
              <h4 className="text-sm font-black uppercase tracking-widest opacity-40">More by {story.author?.name}</h4>
              <Link href={`/user/${story.author?._id}`} className="text-[10px] font-black text-primary uppercase underline underline-offset-8">View all</Link>
            </div>
            <div className="space-y-4">
              {authorStories.length > 0 ? authorStories.map((s: any) => (
                <Link href={`/story/${s._id}`} key={s._id} className="block group">
                  <div className="glass p-4 rounded-[28px] flex gap-4 items-center hover:bg-white/5 transition-all border-transparent hover:border-white/10">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-primary/30 via-purple-800/30 to-slate-800 flex items-center justify-center">
                      {s.coverImage && s.coverImage !== '' ? (
                        <img
                          src={s.coverImage}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          alt=""
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <BookOpen className="w-5 h-5 opacity-20 text-white" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h5 className="text-sm font-bold truncate group-hover:text-primary transition-colors leading-tight mb-1">{s.title}</h5>
                      <p className="text-[10px] opacity-30 uppercase font-bold tracking-tighter">{new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {s.readingTime} min read</p>
                    </div>
                  </div>
                </Link>
              )) : (
                <p className="text-xs opacity-30 text-center py-6 border-2 border-dashed border-white/5 rounded-3xl">No other stories found yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
