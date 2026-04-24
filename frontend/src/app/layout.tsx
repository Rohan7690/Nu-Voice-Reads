import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

import { Toaster } from 'react-hot-toast';
import * as ReactDOM from 'react-dom';

// Polyfill findDOMNode for React 19 compatibility
if (typeof window !== 'undefined') {
  (ReactDOM as any).findDOMNode = (instance: any) => {
    if (instance instanceof HTMLElement) return instance;
    if (instance && typeof instance === 'object' && 'current' in instance) return instance.current;
    return null;
  };
}

export const metadata: Metadata = {
  title: "NuVoice Reads",
  description: "A modern platform for reading and creating stories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-2 animate-fade-in relative">
            {/* Background elements for premium aesthetic */}
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-[400px] bg-gradient-to-b from-primary/10 to-transparent -z-10 pointer-events-none rounded-full blur-[100px]" />
            {children}
          </main>
        </AuthProvider>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#020617',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
          }
        }} />
      </body>
    </html>
  );
}
