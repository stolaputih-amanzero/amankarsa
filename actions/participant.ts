'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { encryptServer, decryptServer } from '@/lib/server-crypto';
import { randomBytes, createHash } from 'crypto';

// Master Key strictly stored in Environment Variables (server-side only)
const MASTER_KEY = process.env.BILIK_DOA_ENCRYPTION_KEY ||
                   process.env.NEXT_PUBLIC_BILIK_DOA_MASTER_KEY ||
                   '0123456789abcdef0123456789abcdef';

// ==========================================
// 1. BILIK DOA (THE SACRED VAULT)
// ==========================================
export async function saveBilikDoa(pulseInteractionId: string | null, plaintext: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Sesi belum terhubung. Silakan melangkah kembali.');

  // Encrypt in server memory before touching DB
  const encryptedPayload = encryptServer(plaintext, MASTER_KEY);

  const { error } = await supabase.from('bilik_doa').insert({
    participant_id: user.id,
    pulse_interaction_id: pulseInteractionId,
    encrypted_payload: encryptedPayload
  });

  if (error) throw new Error('Ruang doa belum dapat dimeteraikan saat ini.');
  revalidatePath('/bilik-doa');
}

export async function getBilikDoaArchive() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('bilik_doa')
    .select('id, encrypted_payload, created_at')
    .eq('participant_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) throw new Error('Belum dapat memuat arsip saat ini.');

  // Decrypt in server memory, send only plaintext to client via RSC
  return data.map(item => ({
    id: item.id,
    created_at: item.created_at,
    plaintext: decryptServer(item.encrypted_payload, MASTER_KEY)
  }));
}

// ==========================================
// 2. THE PULSE & SAKU (GRACEFUL INTERACTION)
// ==========================================
export async function respondToPulse(pulseId: string, state: 'acted' | 'rested' | 'paused') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Constitutional Guard: Saku max 3 benih (state = 'paused')
  if (state === 'paused') {
    const { count } = await supabase
      .from('pulse_interaction')
      .select('*', { count: 'exact', head: true })
      .eq('participant_id', user.id)
      .eq('state', 'paused');
      
    if ((count || 0) >= 3) {
      throw new Error('Saku penuh. Maksimal 3 benih yang boleh disimpan.');
    }
  }

  const { error } = await supabase.from('pulse_interaction').insert({
    pulse_id: pulseId,
    participant_id: user.id,
    state: state,
    interacted_at: new Date().toISOString()
  });

  if (error) throw new Error('Belum dapat merekam respons saat ini.');
  revalidatePath('/home');
  revalidatePath('/saku');
}

export async function relakanBenih(interactionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Mengubah status menjadi 'rested' (menjadi humus yang menyuburkan tanah)
  const { error } = await supabase
    .from('pulse_interaction')
    .update({ state: 'rested' })
    .eq('id', interactionId)
    .eq('participant_id', user.id);

  if (error) throw new Error('Belum dapat merelakan benih saat ini.');
  revalidatePath('/saku');
  revalidatePath('/home');
  revalidatePath('/pohon');
}

// ==========================================
// 3. POHON KARSA (VISUAL STORYTELLER)
// ==========================================
export async function syncPohonKarsa() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { count: actedCount } = await supabase
    .from('pulse_interaction').select('*', { count: 'exact', head: true })
    .eq('participant_id', user.id).in('state', ['acted', 'paused']);

  const { count: restedCount } = await supabase
    .from('pulse_interaction').select('*', { count: 'exact', head: true })
    .eq('participant_id', user.id).eq('state', 'rested');

  // Determine season organically (No guilt, no withered state)
  let season: 'sprouting' | 'growing' | 'resting' | 'bearing_fruit' = 'sprouting';
  if ((restedCount || 0) > (actedCount || 0)) season = 'resting';
  else if ((actedCount || 0) > 10) season = 'bearing_fruit';
  else if ((actedCount || 0) > 3) season = 'growing';

  const { error } = await supabase.from('pohon_karsa_state').upsert({
    participant_id: user.id,
    current_season_state: season,
    cumulative_actions: actedCount || 0
  });

  if (error) throw new Error('Belum dapat memperbarui pohon saat ini.');
  revalidatePath('/pohon');
  return season;
}

// ==========================================
// 4. GRACEFUL RETURN (TITIP KUNCI)
// ==========================================
export async function titipKunci(authChannel: 'email' | 'whatsapp' | 'copy') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const token = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');

  const { error } = await supabase.from('recovery_key').insert({
    participant_id: user.id,
    token_hash: tokenHash,
    channel: authChannel,
    expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString() // 45 hari
  });

  if (error) throw new Error('Belum dapat menitipkan kunci saat ini.');
  
  return { magicLink: `/k/${token}` };
}

// ==========================================
// 5. JOURNEY MEMBERSHIP (PINTU MASUK)
// ==========================================
export async function getJourneyDetails(journeyId: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('journey')
      .select('id, theme, duration_days, status')
      .eq('id', journeyId)
      .maybeSingle();

    return data || null;
  } catch (err) {
    console.error('getJourneyDetails error:', err);
    return null;
  }
}

export async function getParticipantActiveJourney() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Cek perjalanan aktif milik peserta terdaftar
    if (user) {
      const { data: userJourneyState } = await supabase
        .from('participant_journey_state')
        .select(`
          id,
          journey_id,
          state,
          updated_at,
          journey:journey_id (id, theme, duration_days, status)
        `)
        .eq('participant_id', user.id)
        .eq('state', 'active')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (userJourneyState && userJourneyState.journey) {
        const j = Array.isArray(userJourneyState.journey) ? userJourneyState.journey[0] : userJourneyState.journey;
        // Ambil pulse untuk journey ini
        const { data: pulses } = await supabase
          .from('the_pulse')
          .select('id, day_index, prompt_text, action_type')
          .eq('journey_id', j.id)
          .order('day_index', { ascending: true });

        return {
          journey: j,
          pulses: pulses || [],
          currentDayIndex: 0
        };
      }
    }

    // 2. Fallback jika belum terikat spesifik: ambil anchor journey aktif terbaru (misal: Sahabat Kaum Papa)
    const { data: latestActive } = await supabase
      .from('journey')
      .select('id, theme, duration_days, status')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestActive) {
      const { data: pulses } = await supabase
        .from('the_pulse')
        .select('id, day_index, prompt_text, action_type')
        .eq('journey_id', latestActive.id)
        .order('day_index', { ascending: true });

      return {
        journey: latestActive,
        pulses: pulses || [],
        currentDayIndex: 0
      };
    }

    return null;
  } catch (err) {
    console.error('getParticipantActiveJourney error:', err);
    return null;
  }
}

export async function joinJourney(journeyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: existing } = await supabase
    .from('participant_journey_state')
    .select('id')
    .eq('participant_id', user.id)
    .eq('journey_id', journeyId)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase.from('participant_journey_state').insert({
      participant_id: user.id,
      journey_id: journeyId,
      state: 'active'
    });
    if (error) throw new Error('Belum dapat bergabung dalam perjalanan saat ini.');
  }

  revalidatePath('/home');
  return { success: true };
}

