'use client';

import { Sprout } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { relakanBenih } from '@/actions/participant';

export default function SakuPage() {
  const router = useRouter();
  // Using local seed records in MVP with Server Action connection
  const [seeds, setSeeds] = useState([
     { id: 'seed-1', text: "Kirimkan satu pesan penguatan bagi rekan kerja atau saudara.", state: 'paused' },
     { id: 'seed-2', text: "Berikan senyum dan sapaan tulus pada seseorang yang jarang disapa.", state: 'paused' }
  ]);
  const [animatingOut, setAnimatingOut] = useState<string | null>(null);

  const handleAction = async (id: string, type: 'rawat' | 'relakan') => {
     setAnimatingOut(id);
     if (type === 'relakan') {
       try {
         await relakanBenih(id);
       } catch {
         // Graceful fallback
       }
     }
     setTimeout(() => {
        setSeeds(seeds.filter(s => s.id !== id));
        setAnimatingOut(null);
     }, 500);
  };

  return (
    <div className="flex flex-col space-y-8 w-full max-w-md mx-auto relative min-h-[400px] animate-in fade-in duration-normal p-6">
      <header className="flex flex-col space-y-2 mt-4">
        <h2 className="text-2xl font-serif text-[color:var(--color-depth)] tracking-tight">
           Saku
        </h2>
        <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
           Beberapa benih sudah lama di sakumu. Kamu boleh merawat satu, atau merelakan yang belum sempat.
        </p>
      </header>

      <div className="flex flex-col gap-4">
         {seeds.length === 0 ? (
            <div className="text-center py-12 text-[color:var(--color-text-muted)] font-serif italic animate-in fade-in duration-slow">
               Sakumu kosong. Ruang ini beristirahat.
            </div>
         ) : (
            seeds.map(seed => (
               <div 
                 key={seed.id} 
                 className={`bg-[color:var(--color-surface)] rounded-2xl p-5 shadow-sm border border-[color:var(--color-border)] flex flex-col space-y-4 transition-all duration-500 ease-gentle ${animatingOut === seed.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
               >
                  <p className="text-[color:var(--color-text-primary)] leading-relaxed">
                     {seed.text}
                  </p>
                  <div className="flex gap-3">
                     <button 
                       onClick={() => handleAction(seed.id, 'rawat')} 
                       className="flex-1 py-3 bg-[color:var(--color-growth-soft)] text-[color:var(--color-depth)] border border-[color:var(--color-growth)] rounded-xl font-medium transition-colors hover:bg-[color:var(--color-growth)] hover:text-[color:var(--color-base)] flex items-center justify-center gap-2 text-sm"
                     >
                        <Sprout size={16} />
                        Rawat
                     </button>
                     <button 
                       onClick={() => handleAction(seed.id, 'relakan')} 
                       className="flex-1 py-3 bg-transparent border border-[color:var(--color-border)] text-[color:var(--color-rest)] rounded-xl font-medium transition-colors hover:bg-[color:var(--color-surface-raised)] flex items-center justify-center gap-2 text-sm"
                     >
                        Relakan
                     </button>
                  </div>
               </div>
            ))
         )}
      </div>

      <button 
        onClick={() => router.push('/home')} 
        className="mt-8 py-3 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors"
      >
         Kembali ke Ruang Hari Ini
      </button>
    </div>
  );
}
