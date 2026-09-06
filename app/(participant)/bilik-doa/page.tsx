'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBilikDoa } from '@/actions/participant';
import { encryptBilikDoa } from '@/lib/crypto';
import { saveOfflineBilikDoa } from '@/lib/bilik-doa-db';

export default function BilikDoaPage() {
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    const content = text.trim() || '[Hanya duduk diam]';
    try {
      // 1. Save via Server Action (Server-side AES-256-GCM encryption before DB storage)
      await saveBilikDoa(null, content);
      
      // 2. Also save to local encrypted IndexedDB for offline reading
      try {
        const encryptedLocal = await encryptBilikDoa(content);
        await saveOfflineBilikDoa(crypto.randomUUID(), encryptedLocal, new Date().toISOString());
      } catch {
        // Fallthrough gently
      }

      router.push('/bilik-doa/amen');
    } catch {
      // Graceful error fallback preserves peace
      router.push('/bilik-doa/amen');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-6 animate-in fade-in duration-sacred h-[calc(100vh-80px)]" data-space="sacred">
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-serif text-[color:var(--color-sacred)] mb-6 mt-8">
          Apa yang ingin kamu bawa ke hadapan Tuhan hari ini?
        </h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tuliskan di sini..."
          className="flex-1 w-full bg-transparent resize-none focus:outline-none text-[color:var(--color-text-primary)] font-serif text-lg leading-relaxed placeholder:text-[color:var(--color-text-muted)]"
          autoFocus
        />
      </div>
      <div className="pt-6 flex flex-col gap-3 pb-8">
         <button
           onClick={handleSave}
           disabled={isSaving}
           className="w-full py-4 px-4 bg-[color:var(--color-sacred)] text-[color:var(--color-base)] rounded-xl font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
         >
           {text.trim() ? 'Simpan' : 'Hanya duduk diam'}
         </button>
         <button
           onClick={() => router.push('/home')}
           className="w-full py-3 px-4 text-[color:var(--color-text-secondary)] rounded-xl font-medium transition-colors hover:bg-[color:var(--color-surface-raised)]"
         >
           Kembali
         </button>
      </div>
    </div>
  );
}
