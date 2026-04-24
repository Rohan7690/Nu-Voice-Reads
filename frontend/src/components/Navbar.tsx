'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { BookOpen, LogOut, PenTool, Crown, Compass, X, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <div className="relative">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-transform group-hover:rotate-6 group-hover:scale-105">
                N
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-amber-500 rounded-full border-2 border-[#020617] flex items-center justify-center">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg md:text-xl font-black tracking-tighter text-white">NuVoice</span>
              <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-[0.25em] mt-0.5">Reads</span>
            </div>
          </Link>

          {/* Centered Navigation — desktop only */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-bold transition-all hover:text-white ${isActive ? 'text-white' : 'text-foreground/40'}`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full blur-[1px]"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/story/new" className="hidden lg:flex items-center gap-2 glass py-2 px-5 rounded-2xl text-xs font-bold hover:bg-white/10 transition-all border-white/5">
                      <PenTool className="w-4 h-4 text-primary" /> Write
                    </Link>
                    {!user.isPremium && (
                      <Link href="/pricing" className="hidden lg:flex items-center gap-2 bg-amber-500/10 text-amber-500 py-2 px-5 rounded-2xl text-xs font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                        <Crown className="w-4 h-4" /> Premium
                      </Link>
                    )}

                    <div className="h-6 w-px bg-white/5 mx-1 hidden md:block"></div>

                    <Link href="/dashboard" className="flex items-center gap-2 group">
                      <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center font-black text-white shadow-lg group-hover:scale-105 transition-transform text-sm">
                        {user.name[0]?.toUpperCase()}
                      </div>
                      <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
                        <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{user.name}</span>
                        {user.isPremium && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Premium</span>
                        )}
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to log out?')) {
                          logout();
                        }
                      }}
                      className="text-foreground/20 hover:text-red-400 transition-colors hidden md:block"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-bold text-foreground/40 hover:text-white transition-all hidden sm:block">
                      Log in
                    </Link>
                    <Link href="/signup" className="btn-primary py-2 px-4 md:py-2.5 md:px-6 rounded-2xl text-sm font-black shadow-lg shadow-primary/20">
                      Sign up
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl glass hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#020617]/95 backdrop-blur-xl border-t border-white/5 px-4 py-6 space-y-4 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-base font-bold py-2 px-3 rounded-xl transition-all ${pathname === link.href ? 'text-white bg-white/5' : 'text-foreground/50 hover:text-white hover:bg-white/5'}`}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <>
              <Link href="/story/new" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 px-3 rounded-xl text-base font-bold text-foreground/50 hover:text-white hover:bg-white/5 transition-all">
                <PenTool className="w-4 h-4 text-primary" /> Write a Story
              </Link>
              {!user.isPremium && (
                <Link href="/pricing" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 px-3 rounded-xl text-base font-bold text-amber-500 hover:bg-amber-500/10 transition-all">
                  <Crown className="w-4 h-4" /> Upgrade to Premium
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  if (window.confirm('Log out?')) logout();
                }}
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-base font-bold text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
