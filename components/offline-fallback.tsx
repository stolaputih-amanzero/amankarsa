export default function OfflineFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[color:var(--color-base)] animate-in fade-in duration-slow">
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[color:var(--color-rest)]/10 flex items-center justify-center">
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[color:var(--color-rest)]">
             <path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>
           </svg>
        </div>
        <h2 className="font-serif text-2xl text-[color:var(--color-depth)]">
          Koneksi sedang beristirahat.
        </h2>
        <p className="text-[color:var(--color-text-secondary)] leading-relaxed font-serif">
          Jangan khawatir. Ruang teduh ini tetap aman dan menemanimu. Kamu boleh kembali saat terhubung lagi.
        </p>
      </div>
    </div>
  );
}
