'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { generateSecureToken, hashToken } from '@/lib/crypto';
import { supabase } from '@/lib/supabase/client';

type Step = 'landing' | 'name' | 'context' | 'first_pulse' | 'titip_kunci' | 'seed';

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const { user, signInAnonymously } = useAuth();
  const [step, setStep] = useState<Step>('landing');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = (next: Step) => setStep(next);

  const handleStart = async () => {
    setIsSubmitting(true);
    try {
      if (!user) {
        await signInAnonymously();
      }
    } catch {
      // Graceful local continuation
    } finally {
      setIsSubmitting(false);
      nextStep('name');
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      if (user) {
        await supabase
          .from('participant')
          .upsert({ id: user.id, display_name: name.trim() });
      }
    } catch {
      // Graceful local continuation
    } finally {
      setIsSubmitting(false);
      nextStep('context');
    }
  };

  const handlePulseResponse = async () => {
    nextStep('titip_kunci');
  };

  const handleTitipKunci = async (method: 'email' | 'whatsapp' | 'skip', inputValue?: string) => {
    setIsSubmitting(true);
    try {
      if (method === 'email' && inputValue && user) {
        // Link identity via Magic Link - retains the same auth.users.id
        await supabase.auth.updateUser({ email: inputValue });
      } else if (method === 'whatsapp' && user) {
        // Generate a recovery token for WhatsApp/Copy
        const token = generateSecureToken();
        const hashed = await hashToken(token);
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 45); // Expires in 45 days
        
        await supabase.from('recovery_key').insert({
          participant_id: user.id,
          token_hash: hashed,
          channel: 'whatsapp',
          expires_at: expiresAt.toISOString(),
        });
        
        const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const recoveryLink = `${appUrl}/k/${token}`;
        try {
          await navigator.clipboard.writeText(`Ini kunci akses ruang teduh Amankarsa-mu: ${recoveryLink}`);
        } catch {
          // Graceful fallback if clipboard access is denied
        }
      }
    } catch {
      // Graceful local continuation
    } finally {
      setIsSubmitting(false);
      nextStep('seed');
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full px-6 relative min-h-[400px]">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <h1 className="text-3xl font-serif text-[color:var(--color-depth)] tracking-tight">
              Selamat datang di ruang teduh.
            </h1>
            <button
              onClick={handleStart}
              disabled={isSubmitting}
              className="px-6 py-3 bg-[color:var(--color-depth)] text-[color:var(--color-text-inverse)] rounded-full font-medium transition-opacity duration-fast ease-gentle hover:opacity-90 disabled:opacity-50"
            >
              Mulai melangkah
            </button>
          </motion.div>
        )}

        {step === 'name' && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col space-y-6 w-full"
          >
            <h2 className="text-2xl font-serif text-[color:var(--color-depth)]">
              Mau dipanggil siapa?
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama panggilanmu"
              className="w-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-[color:var(--color-depth)] transition-colors"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleSaveName}
                disabled={!name.trim() || isSubmitting}
                className="flex-1 py-3 bg-[color:var(--color-depth)] text-[color:var(--color-text-inverse)] rounded-lg font-medium transition-opacity disabled:opacity-50"
              >
                Lanjut
              </button>
              <button
                onClick={() => nextStep('context')}
                className="py-3 px-6 text-[color:var(--color-text-secondary)] font-medium hover:bg-[color:var(--color-surface-raised)] rounded-lg transition-colors"
              >
                Lewati
              </button>
            </div>
          </motion.div>
        )}

        {step === 'context' && (
          <motion.div
            key="context"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col space-y-8 text-center"
          >
            <h2 className="text-2xl font-serif text-[color:var(--color-depth)] leading-relaxed">
              Kamu bergabung dalam perjalanan kecil ini bersama komunitasmu.
            </h2>
            <button
              onClick={() => nextStep('first_pulse')}
              className="px-6 py-3 bg-[color:var(--color-depth)] text-[color:var(--color-text-inverse)] rounded-full font-medium transition-opacity hover:opacity-90 mx-auto"
            >
              Mulai berjalan
            </button>
          </motion.div>
        )}

        {step === 'first_pulse' && (
          <motion.div
            key="first_pulse"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col space-y-6 w-full"
          >
            <h2 className="text-2xl font-serif text-[color:var(--color-depth)]">
              Apa satu hal kecil yang kamu syukuri hari ini?
            </h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handlePulseResponse()}
                className="w-full text-left px-5 py-4 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl text-[color:var(--color-text-primary)] font-medium hover:border-[color:var(--color-growth)] transition-colors shadow-sm"
              >
                Saya bersyukur hari ini
              </button>
              <button
                onClick={() => handlePulseResponse()}
                className="w-full text-left px-5 py-4 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl text-[color:var(--color-text-primary)] font-medium hover:border-[color:var(--color-rest)] transition-colors shadow-sm"
              >
                Saya masih lelah, tapi saya di sini
              </button>
              <button
                onClick={() => handlePulseResponse()}
                className="w-full text-left px-5 py-4 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl text-[color:var(--color-text-primary)] font-medium hover:border-[color:var(--color-depth)] transition-colors shadow-sm"
              >
                Tulis satu kalimat...
              </button>
            </div>
          </motion.div>
        )}

        {step === 'titip_kunci' && (
          <motion.div
            key="titip_kunci"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col space-y-6 w-full"
            data-space="sacred"
          >
            <div className="bg-[color:var(--color-surface)] p-6 rounded-2xl border border-[color:var(--color-border)]">
              <h2 className="text-xl font-serif text-[color:var(--color-sacred)] mb-3">
                Titip Kunci
              </h2>
              <p className="text-[color:var(--color-text-secondary)] leading-relaxed mb-6">
                Catatanmu tersimpan di Bilik Doa-mu. Agar kamu bisa kembali besok tanpa kehilangan kuncinya, ke mana kami bisa menitipkannya?
              </p>
              
              {isSubmitting && (
                <div className="text-center text-[color:var(--color-text-muted)] py-4">
                   Memproses...
                </div>
              )}
              
              {!isSubmitting && (
                <div className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Masukkan alamat email..."
                    className="w-full bg-transparent border border-[color:var(--color-border)] rounded-lg px-4 py-3 focus:outline-none focus:border-[color:var(--color-sacred)] text-[color:var(--color-text-primary)] transition-colors mb-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitipKunci('email', e.currentTarget.value);
                    }}
                    onBlur={(e) => {
                      if (e.target.value) handleTitipKunci('email', e.target.value);
                    }}
                  />
                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-[color:var(--color-border-soft)]"></div>
                    <span className="text-sm text-[color:var(--color-text-muted)]">Atau</span>
                    <div className="flex-1 h-px bg-[color:var(--color-border-soft)]"></div>
                  </div>
                  <button
                    onClick={() => handleTitipKunci('whatsapp')}
                    className="w-full py-3 px-4 bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-primary)] border border-[color:var(--color-border)] rounded-lg font-medium transition-colors hover:bg-[color:var(--color-border)]"
                  >
                    Salin Kunci Akses (WhatsApp)
                  </button>
                  <button
                    onClick={() => handleTitipKunci('skip')}
                    className="w-full py-3 px-4 text-[color:var(--color-text-muted)] font-medium transition-colors hover:text-[color:var(--color-text-secondary)] mt-2"
                  >
                    Nanti saja
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 'seed' && (
          <motion.div
            key="seed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-[color:var(--color-growth-soft)] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[color:var(--color-growth)]" />
            </div>
            <h2 className="text-2xl font-serif text-[color:var(--color-growth)]">
              Satu benih telah ditanam.
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
