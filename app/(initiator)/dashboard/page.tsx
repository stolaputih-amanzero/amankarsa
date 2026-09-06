import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getEthicalPulseSignals, giveRestSpace } from '@/actions/initiator';

interface PastoralSignal {
  tag: string;
  count: number;
  percentage: number;
}

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: journeys } = await supabase
    .from('journey')
    .select('id, theme, status')
    .eq('initiator_id', user?.id || '')
    .eq('status', 'active');

  const activeJourney = journeys?.[0];
  let pastoralSignals: PastoralSignal[] = [];
  let hasInsufficientData = false;

  if (activeJourney) {
    try {
      const signals = await getEthicalPulseSignals(activeJourney.id);
      if (signals && signals.length > 0 && signals[0].tag === 'insufficient_data') {
        hasInsufficientData = true;
      } else {
        pastoralSignals = (signals as PastoralSignal[]) || [];
      }
    } catch {
      hasInsufficientData = true;
    }
  }

  const giveRestAction = giveRestSpace.bind(null, activeJourney?.id || '');

  return (
    <div className="space-y-10 animate-in fade-in duration-slow">
      <section className="space-y-2">
        <h1 className="font-serif text-3xl text-[color:var(--color-depth)] tracking-tight">
          Ikhtisar Musim
        </h1>
        <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
          Melihat perjalanan komunitas Anda secara kolektif, tanpa mengintip ruang privat individu.
        </p>
      </section>

      {activeJourney ? (
        <>
          {/* Ethical Pulse Reading */}
          <section className="p-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-[color:var(--color-depth)]">
                Tanda Rasa Komunitas
              </h2>
              <span className="text-xs bg-[color:var(--color-surface-raised)] text-[color:var(--color-text-muted)] px-3 py-1 rounded-full">
                Agregat Etis (Min. 5 Responden)
              </span>
            </div>
            
            {hasInsufficientData ? (
              <div className="p-6 rounded-xl bg-[color:var(--color-surface-raised)] border border-[color:var(--color-border-soft)]">
                <p className="text-[color:var(--color-text-secondary)] italic leading-relaxed font-serif">
                  Beberapa sahabatmu memilih berbagi minggu ini. Jumlahnya belum cukup untuk ditampilkan sebagai pola, tetapi setiap suara tetap berharga dan didengar dalam keheningan.
                </p>
              </div>
            ) : pastoralSignals.length > 0 ? (
              <div className="space-y-3">
                {pastoralSignals.map((signal) => (
                  <div 
                    key={signal.tag} 
                    className="flex items-center justify-between p-4 rounded-xl bg-[color:var(--color-base)] border border-[color:var(--color-border-soft)]"
                  >
                    <span className="text-[color:var(--color-depth)] font-medium capitalize">
                      {signal.tag}
                    </span>
                    <span className="text-[color:var(--color-text-secondary)] text-sm">
                      {signal.percentage}% ({signal.count} sahabat)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[color:var(--color-text-secondary)] italic">
                Belum ada tanda rasa yang dibagikan.
              </p>
            )}
          </section>

          {/* Shepherd's Response */}
          <section className="p-8 rounded-2xl border border-[color:var(--color-sacred)]/30 bg-[color:var(--color-sacred-soft)] space-y-4" data-space="sacred">
            <h2 className="font-serif text-xl text-[color:var(--color-sacred)]">
              Respons Gembala
            </h2>
            <p className="text-[color:var(--color-text-secondary)] leading-relaxed text-sm">
              Jika komunitas sedang lelah, Anda dapat memberikan ruang rehat. Ini akan menjeda ritme perjalanan tanpa memberi notifikasi penagihan kepada siapa pun.
            </p>
            <form action={giveRestAction}>
              <button 
                type="submit" 
                className="w-full md:w-auto py-3 px-6 rounded-xl bg-[color:var(--color-sacred)] text-[color:var(--color-base)] font-medium transition-opacity duration-normal ease-gentle hover:opacity-90"
              >
                Beri Ruang Rehat
              </button>
            </form>
          </section>
        </>
      ) : (
        <div className="p-12 rounded-2xl border border-dashed border-[color:var(--color-border)] text-center space-y-4">
          <p className="text-[color:var(--color-text-secondary)]">
            Belum ada perjalanan yang aktif saat ini.
          </p>
          <Link 
            href="/setup" 
            className="inline-block py-3 px-6 rounded-full bg-[color:var(--color-growth)] text-[color:var(--color-text-inverse)] font-medium transition-opacity duration-normal ease-gentle hover:opacity-90"
          >
            Siapkan Perjalanan Baru
          </Link>
        </div>
      )}
    </div>
  );
}
