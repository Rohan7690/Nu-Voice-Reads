'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const loadingToast = toast.loading('Logging in...');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || 'Login failed', { id: loadingToast });
      setError(data.error || 'Login failed');
    } else {
      toast.success('Logged in successfully!', { id: loadingToast });
      login(data.accessToken, data.user);
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect') || '/';
      window.location.href = redirectUrl;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-full max-w-md glass p-8 rounded-2xl animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        {error && <div className="text-red-400 mb-4 text-center text-sm bg-red-400/10 py-2 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn-primary w-full mt-4">Log In</button>
        </form>
        <p className="mt-6 text-center text-sm opacity-70">
          Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
