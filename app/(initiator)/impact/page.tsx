import { createClient } from '@/lib/supabase/server';
import { logImpactRecord, getImpactRecords } from '@/actions/initiator';

export const dynamic = 'force-dynamic';

export default async function ImpactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: journeys } = await supabase
    .from('journey')
    .select('id, theme')
    .eq('initiator_id', user?.id || '')
    .eq('status', 'active');

  const activeJourney = journeys?.[0];
  let impactRecords: any[] = [];
  
  if (activeJourney) {
    try {
      impactRecords = (await getImpactRecords(activeJourney.id)) || [];
    } catch {
      impactRecords = [];
    }
  }

  const logImpactAction = logImpactRecord.bind(null, activeJourney?.id || '');

  return (
    <div className="space-y-10 animate-in fade-in duration-slow">
      <section className="space-y-2">
        <h1 className="font-serif text-3xl text-[color:var(--color-depth)] tracking-tight">
          Buah Kasih Nyata
        </h1>
        <p className="text-[color:var(--color-text-secondary)] leading-relaxed">
          Mencatat rembesan kasih komunitas ke dunia luar. Bukan sebagai metrik kompetisi, melainkan sebagai cerita pelayanan yang hidup.
        </p>
      </section>

      {activeJourney ? (
        <>
          <form action={logImpactAction} className="p-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm space-y-6 max-w-2xl">
            <h2 className="font-serif text-xl text-[color:var(--color-depth)]">
              Catat Aksi Pelayanan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="activity" className="block text-sm font-medium text-[color:var(--color-depth)]">
                  Nama Kegiatan
                </label>
                <input 
                  type="text" 
                  id="activity" 
                  name="serviceActivityName" 
                  required 
                  placeholder="Misal: Berbagi Makanan Lansia"
                  className="w-full p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] focus:outline-none focus:border-[color:var(--color-depth)] text-[color:var(--color-text-primary)]" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="metric" className="block text-sm font-medium text-[color:var(--color-depth)]">
                  Jenis Dampak
                </label>
                <select 
                  id="metric" 
                  name="metricType" 
                  required 
                  className="w-full p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] focus:outline-none focus:border-[color:var(--color-depth)] text-[color:var(--color-text-primary)]"
                >
                  <option value="meals_distributed">Porsi Makanan Dibagikan</option>
                  <option value="visits_made">Kunjungan Dilakukan</option>
                  <option value="volunteer_hours">Jam Pelayanan</option>
                  <option value="packages_distributed">Paket Dibagikan</option>
                  <option value="families_served">Keluarga Dilayani</option>
                  <option value="environmental_actions">Aksi Peduli Lingkungan</option>
                  <option value="other_service_actions">Aksi Kasih Lainnya</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="qty" className="block text-sm font-medium text-[color:var(--color-depth)]">
                  Jumlah
                </label>
                <input 
                  type="number" 
                  id="qty" 
                  name="quantity" 
                  required 
                  min="0" 
                  defaultValue={10}
                  className="w-full p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] focus:outline-none focus:border-[color:var(--color-depth)] text-[color:var(--color-text-primary)]" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="unit" className="block text-sm font-medium text-[color:var(--color-depth)]">
                  Satuan
                </label>
                <input 
                  type="text" 
                  id="unit" 
                  name="unit" 
                  required 
                  placeholder="Misal: porsi, keluarga, jam" 
                  className="w-full p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] focus:outline-none focus:border-[color:var(--color-depth)] text-[color:var(--color-text-primary)]" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="story" className="block text-sm font-medium text-[color:var(--color-depth)]">
                Cerita Singkat (Opsional)
              </label>
              <textarea 
                id="story" 
                name="storyDescription" 
                rows={3} 
                placeholder="Catatan kehangatan atau senyuman yang ditemui di lapangan..."
                className="w-full p-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] focus:outline-none focus:border-[color:var(--color-depth)] text-[color:var(--color-text-primary)]" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 px-6 rounded-xl bg-[color:var(--color-growth)] text-[color:var(--color-text-inverse)] font-medium transition-opacity duration-normal ease-gentle hover:opacity-90"
            >
              Simpan Buah Kasih
            </button>
          </form>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-[color:var(--color-depth)]">
              Jejak Pelayanan
            </h2>
            {impactRecords.length > 0 ? (
              <div className="space-y-4">
                {impactRecords.map((record: any) => (
                  <div key={record.id} className="p-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-[color:var(--color-depth)] text-lg">
                        {record.service_activity_name}
                      </h3>
                      <span className="text-sm text-[color:var(--color-text-muted)]">
                        {new Date(record.occurred_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className="text-[color:var(--color-growth)] font-medium mb-2">
                      {record.quantity} {record.unit}
                    </p>
                    {record.story_description && (
                      <p className="text-[color:var(--color-text-secondary)] italic text-sm leading-relaxed font-serif">
                        "{record.story_description}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-center">
                <p className="text-[color:var(--color-text-secondary)] italic font-serif">
                  Belum ada catatan buah kasih. Setiap langkah kecil sangat berarti.
                </p>
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="p-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-center">
          <p className="text-[color:var(--color-text-secondary)] italic font-serif">
            Anda perlu mengaktifkan sebuah perjalanan terlebih dahulu untuk mencatat buah kasih.
          </p>
        </div>
      )}
    </div>
  );
}
