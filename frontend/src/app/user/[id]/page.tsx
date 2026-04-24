'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Book, Crown, Clock } from 'lucide-react';

export default function UserProfile() {
  const { id } = useParams();
  const [stories, setStories] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStories = async () => {
      setLoading(true);
      const res = await fetch(`/api/stories?author=${id}`);
      const data = await res.json();
      if (res.ok) {
        setStories(data.stories);
        if (data.stories.length > 0) {
          setUserName(data.stories[0].author.name);
        }
      }
      setLoading(false);
    };
    if (id) fetchUserStories();
  }, [id]);

  if (loading) return <div className="py-20 text-center opacity-50">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10 animate-fade-in">
      <header className="flex items-center gap-6 p-8 glass rounded-3xl">
        <div className="w-20 h-20 bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl">
          {userName?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{userName || 'Writer Profile'}</h1>
            {stories.length > 0 && stories[0].author.isPremium && (
              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3" /> Premium
              </span>
            )}
          </div>
          <p className="opacity-60 flex items-center gap-2 mt-1">
            <Book className="w-4 h-4" /> {stories.length} stories published
          </p>
        </div>
      </header>

      <div className="space-y-6">
        <h2 className="text-xl font-bold pl-2 border-l-4 border-primary ml-2">Publication History</h2>
        
        {stories.length === 0 ? (
          <div className="text-center py-20 opacity-50 border-2 border-dashed border-border rounded-3xl">
            This user hasn't published any stories yet.
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map(story => (
              <Link href={`/story/${story._id}`} key={story._id} className="block group">
                <article className="glass p-6 rounded-2xl transition-all hover:border-primary/50 hover:bg-white/5 relative overflow-hidden">
                  {story.isPremium && (
                    <Crown className="absolute top-4 right-4 w-5 h-5 text-amber-500" />
                  )}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{story.title}</h3>
                  <p className="text-sm opacity-70 mb-3 line-clamp-2">{story.description}</p>
                  <div className="text-xs opacity-50 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {new Date(story.createdAt).toLocaleDateString()}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
