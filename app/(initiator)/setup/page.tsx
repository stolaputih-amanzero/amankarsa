import { getInitiatorJourneys } from '@/actions/initiator';
import JourneyQRManager from './journey-qr-manager';

export const dynamic = 'force-dynamic';

export default async function SetupPage() {
  let journeys: Awaited<ReturnType<typeof getInitiatorJourneys>> = [];
  try {
    journeys = await getInitiatorJourneys();
  } catch (err) {
    console.error('SetupPage getInitiatorJourneys error:', err);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-slow max-w-2xl mx-auto">
      <section className="space-y-2">
        <h1 className="font-serif text-3xl text-[color:var(--color-depth)] tracking-tight">
          Pintu Masuk Komunitas
        </h1>
        <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
          Bagikan kartu QR atau tautan ini kepada jemaat. Siapa pun dapat melangkah masuk secara hening dan mandiri.
        </p>
      </section>

      <JourneyQRManager initialJourneys={journeys || []} />
    </div>
  );
}
