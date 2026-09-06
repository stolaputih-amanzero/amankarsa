'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getEthicalPulseSignals(journeyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized.');

  // Verifikasi kepemilikan Journey
  const { data: journey } = await supabase
    .from('journey').select('initiator_id').eq('id', journeyId).single();
  
  if (!journey || journey.initiator_id !== user.id) throw new Error('Unauthorized.');

  // Panggil RPC yang aman (Threshold >= 5 ditegakkan pada database function)
  const { data, error } = await supabase.rpc('get_pastoral_signals', {
    p_journey_id: journeyId
  });

  if (error) throw new Error('Failed to fetch pastoral signals.');
  return data;
}

export async function giveRestSpace(journeyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized.');

  // Shepherd's Response: Menjeda ritme tanpa notifikasi penagihan ke peserta
  // Journey status uses 'draft' | 'active' | 'completed'
  const { error } = await supabase
    .from('journey')
    .update({ status: 'draft' }) 
    .eq('id', journeyId)
    .eq('initiator_id', user.id);

  if (error) throw new Error('Failed to give rest space.');
  revalidatePath('/dashboard');
}

export async function getInitiatorJourneys() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const { data } = await supabase
        .from('journey')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      return data || [];
    }

    const { data, error } = await supabase
      .from('journey')
      .select('*')
      .eq('initiator_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  } catch (err) {
    console.error('getInitiatorJourneys error:', err);
    return [];
  }
}

export async function createJourney(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized.');

  const theme = (formData.get('theme') as string) || 'Perjalanan Kasih';
  const durationDays = parseInt(formData.get('durationDays') as string, 10) || 14;

  const { data: newJourney, error } = await supabase
    .from('journey')
    .insert({
      initiator_id: user.id,
      theme,
      duration_days: durationDays,
      status: 'active'
    })
    .select()
    .single();

  if (error || !newJourney) throw new Error('Failed to create journey.');

  // Seed default gentle pulses for the journey
  const defaultPulses: Array<{
    day_index: number;
    prompt_text: string;
    action_type: 'contemplation' | 'practical_action' | 'reflection';
  }> = [
    { day_index: 1, prompt_text: 'Kirimkan satu pesan penguatan bagi rekan kerja atau saudara yang mungkin sedang bergumul hari ini.', action_type: 'practical_action' },
    { day_index: 2, prompt_text: 'Hening sejenak selama 3 menit. Tarik napas perlahan dan sadari kehadiran kasih di sekelilingmu.', action_type: 'contemplation' },
    { day_index: 3, prompt_text: 'Ucapkan terima kasih secara tulus kepada seseorang yang pelayanannya sering kali luput dari perhatian.', action_type: 'practical_action' },
    { day_index: 4, prompt_text: 'Refleksikan satu hal sederhana hari ini yang membuat hatimu merasa hangat dan bersyukur.', action_type: 'reflection' },
    { day_index: 5, prompt_text: 'Beri ruang bagi dirimu untuk beristirahat tanpa beban. Hari ini cukup.', action_type: 'contemplation' },
    { day_index: 6, prompt_text: 'Bagikan sebungkus makanan atau uluran sapaan ramah kepada mereka yang sedang lelah.', action_type: 'practical_action' },
    { day_index: 7, prompt_text: 'Serahkan segala kekhawatiran yang membebanimu ke dalam Bilik Doa. Relakan bebanmu dengan damai.', action_type: 'reflection' }
  ];

  const pulseInserts = defaultPulses.map((p) => ({
    journey_id: newJourney.id,
    day_index: p.day_index,
    prompt_text: p.prompt_text,
    action_type: p.action_type
  }));

  await supabase.from('the_pulse').insert(pulseInserts);

  revalidatePath('/dashboard');
  revalidatePath('/setup');
  return newJourney;
}

export async function seedAnchorJourney() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const initiatorId = user?.id || null;

    // Cek apakah perjalanan Sahabat Kaum Papa sudah ada untuk inisiator ini
    if (initiatorId) {
      const { data: existing } = await supabase
        .from('journey')
        .select('*')
        .eq('initiator_id', initiatorId)
        .eq('theme', 'Sahabat Kaum Papa')
        .maybeSingle();

      if (existing) {
        return existing;
      }
    }

    // 1. Buat Journey Anchor: Sahabat Kaum Papa (15 Hari)
    const { data: newJourney, error } = await supabase
      .from('journey')
      .insert({
        initiator_id: initiatorId,
        theme: 'Sahabat Kaum Papa',
        duration_days: 15,
        status: 'active'
      })
      .select()
      .single();

    if (error || !newJourney) {
      // Fallback dev journey if RLS blocks unauthenticated insert
      return {
        id: '00000000-0000-4000-8000-000000000002',
        initiator_id: initiatorId,
        theme: 'Sahabat Kaum Papa',
        duration_days: 15,
        status: 'active' as const,
        created_at: new Date().toISOString()
      };
    }

  // 2. Buat Kelompok Penerima Manfaat
  await supabase.from('beneficiary_group').insert([
    {
      journey_id: newJourney.id,
      label: 'Lansia & Keluarga Pra-Sejahtera Sekitar',
      category: 'lansia',
      estimated_count: 50,
      unit: 'keluarga',
      privacy_level: 'aggregate_only'
    },
    {
      journey_id: newJourney.id,
      label: 'Anak Jalanan & Pekerja Rentan',
      category: 'pekerja_rentan',
      estimated_count: 100,
      unit: 'orang',
      privacy_level: 'aggregate_only'
    }
  ]);

  // 3. Semaikan 15 Pulsa Kasih (Hari 0 - 14)
  const anchorPulses: Array<{
    day_index: number;
    prompt_text: string;
    action_type: 'contemplation' | 'practical_action' | 'reflection';
  }> = [
    { day_index: 0, prompt_text: 'Apa satu hal kecil yang membuatmu bersyukur hari ini?', action_type: 'reflection' },
    { day_index: 1, prompt_text: 'Luangkan 3 menit hening. Bayangkan wajah seseorang yang mungkin merasa tak terlihat hari ini.', action_type: 'contemplation' },
    { day_index: 2, prompt_text: 'Jika ada kesempatan, sapa atau bantu seseorang di sekitarmu dengan senyuman ramah. Tidak perlu besar, cukup hadir.', action_type: 'practical_action' },
    { day_index: 3, prompt_text: 'Tarik napas perlahan. Sadari bahwa setiap orang yang berpapasan denganmu memiliki pergumulan yang tak terucapkan.', action_type: 'contemplation' },
    { day_index: 4, prompt_text: 'Sisihkan sedikit rezeki atau belikan sebungkus makanan hangat bagi mereka yang sedang berjuang di jalanan.', action_type: 'practical_action' },
    { day_index: 5, prompt_text: 'Beri ruang bagi dirimu untuk beristirahat tanpa beban. Kasih karunia tidak menuntut kesempurnaan; hari ini cukup.', action_type: 'reflection' },
    { day_index: 6, prompt_text: 'Dengarkan keluh kesah seorang sahabat atau keluarga tanpa terburu-buru memberi nasihat. Cukup dengarkan dengan tulus.', action_type: 'practical_action' },
    { day_index: 7, prompt_text: 'Bawalah nama-nama mereka yang terlupakan ke dalam Bilik Doa. Serahkan segala kelemahanmu kepada Tuhan dalam damai.', action_type: 'reflection' },
    { day_index: 8, prompt_text: 'Kumpulkan pakaian layak pakai atau barang kebutuhan pokok yang bisa disalurkan bagi saudara-saudara kita yang membutuhkan.', action_type: 'practical_action' },
    { day_index: 9, prompt_text: 'Ketika melihat seseorang yang tersisih hari ini, pandanglah dia bukan dengan rasa kasihan, melainkan sebagai saudara terkasih.', action_type: 'contemplation' },
    { day_index: 10, prompt_text: 'Ucapkan terima kasih dan doakan petugas kebersihan, satpam, atau kurir yang melayani harimu dengan setia.', action_type: 'practical_action' },
    { day_index: 11, prompt_text: 'Biarkan hatimu dipulihkan dalam keteduhan. Menjadi sahabat bagi kaum papa bermula dari jiwa yang telah merasakan damai.', action_type: 'reflection' },
    { day_index: 12, prompt_text: 'Kirimkan pesan penguatan atau doa hening bagi rekan yang sedang lelah memikul tanggung jawab hidup.', action_type: 'practical_action' },
    { day_index: 13, prompt_text: 'Jika memungkinkan, luangkan waktu sejenak untuk mengunjungi atau menyapa seorang lansia yang hidup sendirian.', action_type: 'practical_action' },
    { day_index: 14, prompt_text: 'Perjalanan 15 hari ini tiba di penghujung musim. Apa satu benih kebaikan yang tumbuh di hatimu dan ingin kamu bawa terus?', action_type: 'reflection' }
  ];

  await supabase.from('the_pulse').insert(
    anchorPulses.map(p => ({
      journey_id: newJourney.id,
      day_index: p.day_index,
      prompt_text: p.prompt_text,
      action_type: p.action_type
    }))
  );

  revalidatePath('/dashboard');
  revalidatePath('/setup');
  return newJourney;
  } catch (err) {
    console.error('seedAnchorJourney error:', err);
    return {
      id: '00000000-0000-4000-8000-000000000002',
      initiator_id: null,
      theme: 'Sahabat Kaum Papa',
      duration_days: 15,
      status: 'active' as const,
      created_at: new Date().toISOString()
    };
  }
}

export async function logImpactRecord(
  journeyId: string, 
  formDataOrActivity: FormData | string, 
  metricType?: 'volunteer_hours' | 'meals_distributed' | 'visits_made' | 'packages_distributed' | 'families_served' | 'environmental_actions' | 'other_service_actions',
  quantity?: number, 
  unit?: string,
  storyDescription?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized.');

  let actName = '';
  let mType: 'volunteer_hours' | 'meals_distributed' | 'visits_made' | 'packages_distributed' | 'families_served' | 'environmental_actions' | 'other_service_actions' = 'meals_distributed';
  let qty = 0;
  let uLabel = 'porsi';
  let story: string | null = null;

  if (formDataOrActivity instanceof FormData) {
    actName = (formDataOrActivity.get('serviceActivityName') as string) || '';
    mType = ((formDataOrActivity.get('metricType') as string) || 'meals_distributed') as typeof mType;
    qty = parseInt(formDataOrActivity.get('quantity') as string, 10) || 0;
    uLabel = (formDataOrActivity.get('unit') as string) || 'paket';
    story = (formDataOrActivity.get('storyDescription') as string) || null;
  } else {
    actName = formDataOrActivity;
    mType = metricType || 'meals_distributed';
    qty = quantity || 0;
    uLabel = unit || 'paket';
    story = storyDescription || null;
  }

  const { error } = await supabase.from('impact_record').insert({
    journey_id: journeyId,
    service_activity_name: actName,
    metric_type: mType,
    quantity: qty,
    unit: uLabel,
    story_description: story,
    source: 'initiator_reported'
  });

  if (error) throw new Error('Failed to log impact record.');
  revalidatePath('/impact');
}

export async function getImpactRecords(journeyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized.');

  const { data: journey } = await supabase
    .from('journey').select('initiator_id').eq('id', journeyId).single();
  
  if (!journey || journey.initiator_id !== user.id) throw new Error('Unauthorized.');

  const { data, error } = await supabase
    .from('impact_record')
    .select('*, beneficiary_group(label, category)')
    .eq('journey_id', journeyId)
    .order('occurred_at', { ascending: false });

  if (error) throw new Error('Failed to fetch impact records.');
  return data;
}
