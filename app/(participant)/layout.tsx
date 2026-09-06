'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Bilik Doa and Pohon use distraction-free sacred / immersive atmosphere
  const isSacredSpace = pathname.startsWith('/bilik-doa') || pathname === '/pohon';

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 max-w-md mx-auto relative transition-colors duration-normal ease-gentle">
      {!isSacredSpace && (
        <header className="flex justify-between items-center mb-8 mt-4 pt-4">
          <Link href="/home" className="text-xl font-serif text-[color:var(--color-depth)] tracking-tight">
            Amankarsa
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors duration-normal ease-gentle"
            aria-label="Ubah tema"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>
      )}
      <main className="flex-1 flex flex-col w-full h-full">
        {children}
      </main>
    </div>
  );
}
