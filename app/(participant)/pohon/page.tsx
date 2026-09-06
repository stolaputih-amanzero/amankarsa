'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Heart, Leaf, Moon, Sprout } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase/client';

type SeasonState = 'sprouting' | 'growing' | 'resting' | 'bearing_fruit';

export default function PohonKarsaPage() {
  const [season, setSeason] = useState<SeasonState>('sprouting');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchState() {
      if (!user) return;
      const { data } = await supabase
        .from('pohon_karsa_state')
        .select('current_season_state')
        .eq('participant_id', user.id)
        .single();

      if (data && data.current_season_state) {
        setSeason(data.current_season_state as SeasonState);
      } else {
         // Create the initial state if it doesn't exist
         await supabase.from('pohon_karsa_state').upsert({
           participant_id: user.id,
           current_season_state: 'sprouting'
         });
      }
      setLoading(false);
    }
    fetchState();
  }, [user]);

  const stateContent = {
    sprouting: {
      text: "Satu benih telah ditanam.",
      icon: <Sprout size={48} className="text-[color:var(--color-growth)]" />,
      bg: "bg-[color:var(--color-growth-soft)]",
      innerBg: "bg-[color:var(--color-surface)]",
    },
    growing: {
      text: "Belakangan ini ada hal yang kamu rawat.",
      icon: <Leaf size={48} className="text-[color:var(--color-base)]" />,
      bg: "bg-[color:var(--color-growth-soft)]",
      innerBg: "bg-[color:var(--color-growth)]",
    },
    resting: {
      text: "Pohonmu beristirahat dengan sabar.",
      icon: <Moon size={48} className="text-[color:var(--color-base)]" />,
      bg: "bg-[color:var(--color-surface-raised)]",
      innerBg: "bg-[color:var(--color-rest)]",
    },
    bearing_fruit: {
      text: "Ada buah yang mulai tampak.",
      icon: <Heart size={48} className="text-[color:var(--color-sacred)]" fill="currentColor" />,
      bg: "bg-[color:var(--color-depth-soft)]",
      innerBg: "bg-[color:var(--color-depth)]",
    },
  };

  if (loading) return null;

  const current = stateContent[season];

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md mx-auto relative min-h-[400px] px-6 py-6 animate-in fade-in duration-normal">
      <header className="text-center mb-16">
        <h2 className="text-2xl font-serif text-[color:var(--color-depth)] tracking-tight mb-2">
           Pohon Karsa
        </h2>
        <p className="text-[color:var(--color-text-secondary)] leading-relaxed text-sm">
           Musim perjalananmu, tumbuh dalam damai.
        </p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={season}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center text-center space-y-10 w-full"
          >
            <div className={`w-56 h-56 rounded-full ${current.bg} flex items-center justify-center transition-colors duration-1000`}>
               <div className={`w-36 h-36 rounded-full ${current.innerBg} flex items-center justify-center shadow-sm transition-colors duration-1000`}>
                  {current.icon}
               </div>
            </div>
            <h3 className="text-2xl font-serif text-[color:var(--color-text-primary)]">
              {current.text}
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-auto pt-12 w-full flex flex-col gap-6">
        {/* State selector for viewing 4 organic seasons */}
        <div className="flex justify-center gap-3 opacity-20 hover:opacity-100 transition-opacity">
           <button onClick={() => setSeason('sprouting')} className="w-3 h-3 rounded-full bg-[color:var(--color-border)]" aria-label="Set to sprouting" />
           <button onClick={() => setSeason('growing')} className="w-3 h-3 rounded-full bg-[color:var(--color-growth)]" aria-label="Set to growing" />
           <button onClick={() => setSeason('resting')} className="w-3 h-3 rounded-full bg-[color:var(--color-rest)]" aria-label="Set to resting" />
           <button onClick={() => setSeason('bearing_fruit')} className="w-3 h-3 rounded-full bg-[color:var(--color-depth)]" aria-label="Set to bearing fruit" />
        </div>
        
        <button 
          onClick={() => router.push('/home')} 
          className="w-full py-4 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors font-medium bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl"
        >
           Kembali ke Ruang Hari Ini
        </button>
      </div>
    </div>
  );
}
