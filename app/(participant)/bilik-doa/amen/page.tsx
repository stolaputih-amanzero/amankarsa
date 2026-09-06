'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AmenStatePage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically transition back to home after 3.5 seconds, preserving the peace
    const timer = setTimeout(() => {
      router.push('/home');
    }, 3500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6 animate-in fade-in duration-sacred min-h-[60vh]" data-space="sacred">
       <h2 className="text-3xl font-serif text-[color:var(--color-sacred)] italic tracking-wide">
          Sudah tersimpan dalam damai. Amin.
       </h2>
    </div>
  );
}
