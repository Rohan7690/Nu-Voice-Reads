'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { PenTool, Image as ImageIcon, CheckCircle, ChevronDown, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditStory() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const { token, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/story/edit/${id}`);
    }
  }, [user, authLoading, router, id]);

  if (authLoading || (!user && !authLoading)) {
    return <div className="py-20 text-center opacity-50 animate-pulse">Checking authentication...</div>;
  }

  useEffect(() => {
    const fetchStory = async () => {
      if (!token) return;
      try {
        const res = await fetch(`/api/stories/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (res.ok) {
          setTitle(data.title || '');
          setDescription(data.description || '');
          setContent(data.content || '');
          setCoverImage(data.coverImage || '');
          setIsPremium(data.isPremium || false);
        } else {
          setError(data.error || 'Failed to fetch story');
          toast.error(data.error || 'Failed to fetch story');
        }
      } catch (err) {
        setError('Something went wrong fetching the story.');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchStory();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Premium validation
    if (isPremium && !user?.isPremium) {
      toast.error('Only Premium members can publish Premium stories. Upgrade your account to continue.', { duration: 4000 });
      return;
    }

    setLoading(true);
    setError('');

    const loadingToast = toast.loading('Updating story...');

    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, content, isPremium, coverImage })
      });

      if (res.ok) {
        toast.success('Story updated successfully!', { id: loadingToast });
        router.push('/dashboard');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update story', { id: loadingToast });
        setError(data.error);
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.', { id: loadingToast });
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="py-20 text-center opacity-50 animate-pulse">Loading story data...</div>;

  return (
    <div className="max-w-7xl mx-auto py-2 px-6 animate-fade-in">
      <Link href="/dashboard" className="inline-flex glass p-2.5 rounded-2xl text-[10px] items-center gap-2 mb-6 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-white/80">
        <span className="text-xl">←</span> Back
      </Link>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Edit Story</h1>
          <p className="opacity-50 text-sm font-medium">Refine your masterpiece.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary py-2.5 px-6 rounded-2xl text-sm flex items-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50 font-black"
            >
              {loading ? 'Updating...' : 'Update Story'} <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl mb-8 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-8 glass p-8 rounded-[40px] border-white/5">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Title</label>
              <input
                type="text"
                placeholder="Enter a captivating title..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-30"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div className="text-[10px] text-right opacity-30 font-bold">{title.length}/150</div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Subtitle (optional)</label>
              <input
                type="text"
                placeholder="Add a short subtitle..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:opacity-30"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div className="text-[10px] text-right opacity-30 font-bold">{description.length}/200</div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Cover Image (optional)</label>
              <div className="w-full h-44 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center gap-3 group hover:border-primary/50 transition-all cursor-pointer overflow-hidden relative">
                {coverImage ? (
                  <img src={coverImage} className="absolute inset-0 w-full h-full object-cover brightness-50" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6 opacity-40" />
                    </div>
                    <p className="text-xs opacity-40 font-bold">Click to upload an image</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setCoverImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-[10px] opacity-30 font-bold">Recommended: 1200x630px (16:9). Images are stored directly.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] opacity-40 ml-1">Content</label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[40px] border-white/5 space-y-6">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] opacity-40">Publishing Settings</h3>

            <div
              onClick={() => setIsPremium(!isPremium)}
              className="p-5 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center"
              style={{
                borderColor: isPremium ? '#6366f1' : 'rgba(255,255,255,0.05)',
                background: isPremium ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
              }}
            >
              <div>
                <p className="text-sm font-black mb-0.5">Premium Exclusive</p>
                <p className="text-[10px] opacity-60">Reserved for subscribers only</p>
              </div>
              <div
                className="w-10 h-6 rounded-full relative transition-all"
                style={{ background: isPremium ? '#6366f1' : 'rgba(255,255,255,0.1)' }}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isPremium ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
