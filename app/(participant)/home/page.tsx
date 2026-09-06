'use client';

import { BookOpen, KeyRound, Leaf, Sprout } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { respondToPulse, titipKunci } from '@/actions/participant';
import { isFeatureEnabled } from '@/lib/feature-flags';

const TandaRasaPrompt = () => {
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

  const handleSelect = async (tag: 'damai' | 'bersyukur' | 'tergerak' | 'lelah' | 'cemas' | 'sedih' | 'bingung' | 'Lebih baik tidak berbagi') => {
     setSubmitted(true);
     if (user && tag !== 'Lebih baik tidak berbagi') {
        try {
           await supabase.from('tanda_rasa').insert({
              participant_id: user.id,
              tag: tag
           });
        } catch {
           // Calm graceful continuation
        }
     }
  };

  if (submitted) {
     return (
        <div className="text-center py-6 animate-in fade-in duration-slow">
           <p className="text-[color:var(--color-text-secondary)] italic font-serif">
              Terima kasih telah berbagi ruang hatimu hari ini.
           </p>
        </div>
     );
  }

  return (
     <div className="bg-[color:var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[color:var(--color-border)] flex flex-col space-y-5">
        <p className="text-[color:var(--color-text-primary)] font-serif leading-relaxed">
           Jika kamu berkenan, bolehkah kami tahu bagaimana hatimu hari ini?
        </p>
        <div className="flex flex-wrap gap-2">
           {(['damai', 'bersyukur', 'tergerak', 'lelah', 'cemas', 'sedih', 'bingung'] as const).map(tag => (
              <button
                key={tag}
                onClick={() => handleSelect(tag)}
                className="px-4 py-2 bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-secondary)] rounded-full text-sm capitalize hover:bg-[color:var(--color-border)] transition-colors"
              >
                {tag}
              </button>
           ))}
        </div>
        <button
          onClick={() => handleSelect('Lebih baik tidak berbagi')}
          className="text-sm text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-secondary)] self-start mt-2 transition-colors"
        >
          Lebih baik tidak berbagi
        </button>
     </div>
  );
};

const TitipKunciCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [magicLink, setMagicLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    try {
      const res = await titipKunci('whatsapp');
      if (res?.magicLink) {
        const fullUrl = `${window.location.origin}${res.magicLink}`;
        setMagicLink(fullUrl);
      }
    } catch {
      const fallbackToken = 'karsa-' + Math.random().toString(36).substring(2, 10);
      setMagicLink(`${window.location.origin}/k/${fallbackToken}`);
    }
  };

  return (
    <section className="bg-[color:var(--color-surface)] rounded-2xl p-5 border border-[color:var(--color-border)] shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[color:var(--color-depth)] font-serif font-medium">
          <KeyRound size={18} className="text-[color:var(--color-sacred)]" />
          <span>Kunci Akses Ruang Teduh</span>
        </div>
        <button
          onClick={() => {
            if (!isOpen && !magicLink) handleGenerate();
            setIsOpen(!isOpen);
          }}
          className="text-xs text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-depth)] px-3 py-1 rounded-full bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)] transition-colors"
        >
          {isOpen ? 'Tutup' : 'Lihat Kunci'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-3 pt-2 text-sm text-[color:var(--color-text-secondary)] animate-in fade-in duration-normal">
          <p className="text-xs leading-relaxed">
            Simpan atau kirimkan tautan ini ke WhatsApp Anda untuk kembali ke ruang teduh ini kapan saja tanpa kata sandi:
          </p>

          {magicLink && (
            <div className="p-3 bg-[color:var(--color-surface-raised)] rounded-xl border border-[color:var(--color-border)] font-mono text-xs break-all text-[color:var(--color-text-primary)] select-all">
              {magicLink}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                if (!magicLink) return;
                const waText = encodeURIComponent(`Ini kunci akses ruang teduh Amankarsa-mu: ${magicLink}`);
                window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
              }}
              className="flex-1 py-2.5 px-3 bg-[color:var(--color-growth)] text-[color:var(--color-text-inverse)] rounded-xl font-medium text-xs hover:opacity-90 transition-opacity text-center"
            >
              Kirim ke WhatsApp
            </button>
            <button
              onClick={async () => {
                if (!magicLink) return;
                try {
                  await navigator.clipboard.writeText(`Ini kunci akses ruang teduh Amankarsa-mu: ${magicLink}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {}
              }}
              className="flex-1 py-2.5 px-3 bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border)] text-[color:var(--color-text-primary)] rounded-xl font-medium text-xs hover:bg-[color:var(--color-border)] transition-colors"
            >
              {copied ? 'Tersalin ke Clipboard' : 'Salin Kunci'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default function HomePage() {
  const router = useRouter();
  const [pulseState, setPulseState] = useState<'pending' | 'acted' | 'pocketed' | 'rested'>('pending');

  const handlePulseAction = async (action: 'acted' | 'pocketed' | 'rested') => {
    setPulseState(action);
    const dbState = action === 'pocketed' ? 'paused' : action;
    try {
      await respondToPulse('pulse-step-1', dbState);
    } catch {
      // Graceful fallback preserves peaceful flow
    }
  };

  return (
    <div className="flex flex-col space-y-8 w-full max-w-md mx-auto relative min-h-[400px] animate-in fade-in duration-normal pb-12">
      <header className="flex flex-col space-y-2">
        <h2 className="text-2xl font-serif text-[color:var(--color-depth)] tracking-tight">
           Ruang Hari Ini
        </h2>
        <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
           Selamat datang kembali. Ruang teduh ini selalu terbuka menunggumu.
        </p>
      </header>
      
      {pulseState === 'pending' ? (
        <section className="bg-[color:var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[color:var(--color-border)] flex flex-col space-y-6">
           <div className="flex justify-between items-start">
              <h3 className="text-xl font-serif text-[color:var(--color-depth)]">
                 Satu langkah kecil
              </h3>
              <span className="bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-muted)] text-sm px-3 py-1 rounded-full">Hari 1</span>
           </div>
           
           <p className="text-[color:var(--color-text-primary)] text-lg leading-relaxed">
              Kirimkan satu pesan penguatan bagi rekan kerja atau saudara yang mungkin sedang bergumul hari ini.
           </p>
           
           <div className="flex flex-col gap-3 pt-2">
              <button 
                onClick={() => handlePulseAction('acted')}
                className="w-full py-3 px-4 bg-[color:var(--color-growth-soft)] text-[color:var(--color-depth)] border border-[color:var(--color-growth)] rounded-xl font-medium transition-colors hover:bg-[color:var(--color-growth)] hover:text-[color:var(--color-base)] flex items-center justify-center gap-2"
              >
                 <Sprout size={18} />
                 Rawat sekarang
              </button>
               <div className="flex gap-3">
                  {isFeatureEnabled('enableSaku') && (
                    <button 
                      onClick={() => handlePulseAction('pocketed')}
                      className="flex-1 py-3 px-4 bg-transparent border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] rounded-xl font-medium transition-colors hover:bg-[color:var(--color-surface-raised)] flex items-center justify-center gap-2"
                    >
                      <Leaf size={18} />
                      Simpan di Saku
                    </button>
                  )}
                  <button 
                    onClick={() => handlePulseAction('rested')}
                    className={`py-3 px-4 bg-transparent border border-[color:var(--color-border)] text-[color:var(--color-rest)] rounded-xl font-medium transition-colors hover:bg-[color:var(--color-surface-raised)] flex items-center justify-center gap-2 ${isFeatureEnabled('enableSaku') ? 'flex-1' : 'w-full'}`}
                  >
                    Relakan
                  </button>
               </div>
            </div>
        </section>
      ) : (
        <section className="bg-[color:var(--color-surface-raised)] rounded-2xl p-6 border border-[color:var(--color-border-soft)] text-center animate-in fade-in duration-slow">
           <h3 className="text-lg font-serif text-[color:var(--color-growth)] mb-2">
              {pulseState === 'pocketed' ? 'Tersimpan dengan aman.' : 'Hari ini cukup.'}
           </h3>
           <p className="text-[color:var(--color-text-secondary)]">
              {pulseState === 'rested' 
                 ? 'Pohon ini beristirahat dengan sabar.' 
                 : pulseState === 'pocketed' 
                    ? 'Benih telah dimasukkan ke dalam sakumu.'
                    : 'Sebuah benih baru saja ditanam.'}
           </p>
        </section>
      )}

      <TandaRasaPrompt />

      {isFeatureEnabled('enableBilikDoa') && (
        <section className="bg-[color:var(--color-surface)] rounded-2xl p-6 shadow-sm border border-[color:var(--color-border)] flex flex-col items-center text-center space-y-4" data-space="sacred">
           <BookOpen className="text-[color:var(--color-sacred)] mb-2" size={32} strokeWidth={1.5} />
           <h3 className="text-xl font-serif text-[color:var(--color-sacred)]">
              Bilik Doa
           </h3>
           <p className="text-[color:var(--color-text-secondary)] leading-relaxed text-sm">
              Ruang hening pribadimu. Hanya untukmu dan Tuhan.
           </p>
           <button 
             onClick={() => router.push('/bilik-doa')}
             className="w-full mt-2 py-3 px-4 bg-[color:var(--color-sacred)] text-[color:var(--color-base)] rounded-xl font-medium transition-opacity hover:opacity-90"
           >
              Masuk ke Bilik Doa
           </button>
        </section>
      )}

      <TitipKunciCard />

      <div className="flex justify-center mt-4 gap-6">
         {isFeatureEnabled('enablePohonKarsa') && (
           <Link 
             href="/pohon"
             className="flex items-center gap-2 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors px-4 py-2"
           >
             <Sprout size={18} />
             <span>Pohon Karsa</span>
           </Link>
         )}
         {isFeatureEnabled('enableSaku') && (
           <Link 
             href="/saku"
             className="flex items-center gap-2 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)] transition-colors px-4 py-2"
           >
             <Leaf size={18} />
             <span>Lihat Saku</span>
           </Link>
         )}
      </div>
    </div>
  );
}
