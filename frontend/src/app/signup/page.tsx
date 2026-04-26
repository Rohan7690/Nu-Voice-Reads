'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';


import { toast } from 'react-hot-toast';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const loadingToast = toast.loading('Creating account...');

    try {
      await api.auth.signup({ name, email, password });
      toast.success('Account created successfully!', { id: loadingToast });
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || 'Signup failed', { id: loadingToast });
      setError(err.message || 'Signup failed');
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-4 text-green-400">Account Created!</h2>
        <p className="opacity-80 mb-6">You can now login with your credentials.</p>
        <Link href="/login" className="btn-primary">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-full max-w-md glass p-8 rounded-2xl animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
        {error && <div className="text-red-400 mb-4 text-center text-sm bg-red-400/10 py-2 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Name</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full"
              placeholder="John Doe"
            />
          </div>
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
          <button type="submit" className="btn-primary w-full mt-4">Sign Up</button>
        </form>
        <p className="mt-6 text-center text-sm opacity-70">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
