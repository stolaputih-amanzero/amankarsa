import { createJourney } from '@/actions/initiator';

export default function SetupPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-slow">
      <section className="space-y-2">
        <h1 className="font-serif text-3xl text-[color:var(--color-depth)] tracking-tight">
          Buat Perjalanan Kasih
        </h1>
        <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
          Siapkan ruang teduh baru untuk komunitas Anda berjalan bersama.
        </p>
      </section>

      <form action={createJourney} className="p-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm space-y-6 max-w-xl">
        <div className="space-y-2">
          <label htmlFor="theme" className="block text-sm font-medium text-[color:var(--color-depth)]">
            Tema Perjalanan
          </label>
          <input 
            type="text" 
            id="theme" 
            name="theme" 
            required 
            placeholder="Misal: Sahabat Kaum Papa" 
            className="w-full p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] focus:outline-none focus:border-[color:var(--color-depth)] text-[color:var(--color-text-primary)] transition-colors" 
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="duration" className="block text-sm font-medium text-[color:var(--color-depth)]">
            Durasi (Hari)
          </label>
          <input 
            type="number" 
            id="duration" 
            name="durationDays" 
            required 
            min="1" 
            max="365" 
            defaultValue={14} 
            className="w-full p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] focus:outline-none focus:border-[color:var(--color-depth)] text-[color:var(--color-text-primary)] transition-colors" 
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-4 px-6 rounded-xl bg-[color:var(--color-depth)] text-[color:var(--color-text-inverse)] font-medium transition-opacity duration-normal ease-gentle hover:opacity-90"
        >
          Wujudkan Perjalanan
        </button>
      </form>
    </div>
  );
}
