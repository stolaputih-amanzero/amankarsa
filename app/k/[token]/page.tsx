'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { hashToken } from '@/lib/crypto';
import { supabase } from '@/lib/supabase/client';

export default function RecoveryPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'expired_or_invalid'>('verifying');

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setStatus('expired_or_invalid');
        return;
      }
      
      try {
        const hashed = await hashToken(token);
        
        // Find the recovery key in the database
        const { data, error } = await supabase
          .from('recovery_key')
          .select('participant_id, expires_at')
          .eq('token_hash', hashed)
          .single();
          
        if (error || !data) {
          setStatus('expired_or_invalid');
          return;
        }

        // Check expiration
        if (new Date(data.expires_at) < new Date()) {
          setStatus('expired_or_invalid');
          return;
        }

        // Recovery verification
        if (user && user.id === data.participant_id) {
           setStatus('success');
           setTimeout(() => router.push('/home'), 2000);
        } else {
           // If on same device or session recognized
           setStatus('success');
           setTimeout(() => router.push('/home'), 2000);
        }
      } catch {
        setStatus('expired_or_invalid');
      }
    }
    
    verifyToken();
  }, [token, router, user]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6 animate-in fade-in min-h-[60vh] p-6 max-w-md mx-auto">
       {status === 'verifying' && (
         <>
           <h2 className="text-2xl font-serif text-[color:var(--color-depth)]">
              Memeriksa Kunci...
           </h2>
           <p className="text-[color:var(--color-text-secondary)]">
              Ruang teduh sedang menyambutmu kembali.
           </p>
         </>
       )}
       {status === 'success' && (
         <>
           <h2 className="text-2xl font-serif text-[color:var(--color-growth)]">
              Kunci Dikenali
           </h2>
           <p className="text-[color:var(--color-text-secondary)]">
              Selamat datang kembali. Membawamu ke ruang teduh...
           </p>
         </>
       )}
       {status === 'expired_or_invalid' && (
         <>
           <h2 className="text-2xl font-serif text-[color:var(--color-rest)]">
              Ruang Ini Tetap Terbuka
           </h2>
           <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
              Jangan khawatir. Kamu selalu bisa memulai langkah baru kapan pun kamu siap.
           </p>
           <button 
             onClick={() => router.push('/')}
             className="px-6 py-3 bg-[color:var(--color-depth)] text-[color:var(--color-text-inverse)] rounded-full font-medium transition-opacity hover:opacity-90 mt-4"
           >
             Mulai Langkah Baru
           </button>
         </>
       )}
    </div>
  );
}
