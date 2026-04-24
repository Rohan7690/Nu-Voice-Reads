'use client';
import { useAuth } from '@/lib/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Crown, User, BookOpen, Clock, PenTool } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

function DashboardContent() {
  const { user, loading, token } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setSuccess(true);
      toast.success('Payment Successful! You are now a Premium Member.', { duration: 5000 });
      setTimeout(() => {
        router.replace('/dashboard');
      }, 5000);
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchMyStories = async () => {
      if (user) {
        setStoriesLoading(true);
        try {
          const res = await fetch(`/api/stories?author=${user.id}`);
          const data = await res.json();
          if (res.ok) setStories(data.stories);
        } catch (err) {
          console.error(err);
        } finally {
          setStoriesLoading(false);
        }
      }
    };
    if (user) fetchMyStories();
  }, [user]);

  if (loading) return <div className="py-20 text-center opacity-50">Loading Dashboard...</div>;

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 pb-10 space-y-6 animate-fade-in">
      <Link href="/" className="inline-flex glass p-2.5 rounded-2xl text-[10px] items-center gap-2 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-white/80">
        <span className="text-xl">←</span> Back
      </Link>
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-white">Workspace</h1>
        <p className="opacity-50 text-sm font-medium">Manage and track your published works.</p>
      </div>

      {success && (
        <div className="glass p-8 rounded-[32px] bg-green-500/10 border-green-500/20 flex items-center gap-5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500/5 blur-3xl rounded-full scale-150"></div>
          <CheckCircle className="text-green-500 w-10 h-10 relative z-10" />
          <div className="relative z-10">
            <h3 className="text-xl font-black text-green-400">Payment Successful!</h3>
            <p className="opacity-60 text-sm font-bold uppercase tracking-widest mt-1">You are now a Premium Member</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl text-center relative overflow-hidden">
            <div className="w-20 h-20 bg-gradient-to-tr from-primary to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white">
              {user.name[0]}
            </div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="opacity-60 mb-6">{user.email}</p>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${user.isPremium ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-gray-500/20 text-gray-500 border border-gray-500/30'}`}>
              {user.isPremium ? <><Crown className="w-4 h-4" /> Premium Writer</> : <><User className="w-4 h-4" /> Free Reader</>}
            </div>

            {!user.isPremium && (
              <Link href="/pricing" className="block mt-6 text-primary hover:underline font-medium">
                Upgrade to Premium
              </Link>
            )}
          </div>

          <div className="glass p-6 rounded-2xl space-y-4">
            <h3 className="font-bold flex items-center gap-2 underline underline-offset-4 decoration-primary">Stats</h3>
            <div className="flex justify-between items-center opacity-80">
              <span>Member since</span>
              <span>2026</span>
            </div>
          </div>
        </div>

        {/* Quick Actions / Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center pl-2 border-l-4 border-primary">
            <h2 className="text-2xl font-bold">Your Activity</h2>
            <Link href="/story/new" className="btn-primary py-2 px-4 text-sm">Create New Story</Link>
          </div>

          <div className="space-y-4">
            {storiesLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="glass h-24 rounded-2xl animate-pulse" />)}
              </div>
            ) : stories.length === 0 ? (
              <div className="glass rounded-3xl p-10 text-center space-y-4 opacity-70">
                <BookOpen className="w-12 h-12 mx-auto opacity-30" />
                <h3 className="text-xl font-medium">No stories published yet</h3>
                <p>Start your writer's journey by publishing your first piece today.</p>
                <Link href="/story/new" className="inline-block text-primary hover:underline">Get started</Link>
              </div>
            ) : (
              stories.map(story => (
                <div key={story._id} className="block group">
                  <div className="glass p-5 rounded-3xl flex justify-between items-center border-white/[0.03]">
                    <Link href={`/story/${story._id}`} className="flex-1 space-y-1 hover:border-primary/50 transition-all cursor-pointer">
                      <h4 className="font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                        {story.title}
                        {story.isPremium && <Crown className="w-3 h-3 text-amber-500" />}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] opacity-40 uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(story.createdAt).toLocaleDateString()}</span>
                        <span>Published</span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-4">
                      <Link href={`/story/edit/${story._id}`} className="text-primary/60 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest">
                        Edit
                      </Link>
                      <Link href={`/story/${story._id}`} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-widest">
                        View Story →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="py-20 text-center opacity-50">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
