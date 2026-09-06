-- 0003_seed_sahabat_kaum_papa.sql
-- AMANKARSA PILOT SEED: "Sahabat Kaum Papa" (15 Hari)
-- Status: Constitutional Compliant (Grace UX, Voice Tokens, No Conversion Metrics)

DO $$
DECLARE
    v_initiator_id UUID;
    v_journey_id UUID;
BEGIN
    -- Ambil salah satu user terdaftar sebagai initiator demo, atau gunakan NULL jika dijalankan sebelum ada user
    SELECT id INTO v_initiator_id FROM auth.users ORDER BY created_at ASC LIMIT 1;

    -- 1. Buat Anchor Journey: Sahabat Kaum Papa
    INSERT INTO journey (id, initiator_id, theme, duration_days, status)
    VALUES (
        gen_random_uuid(),
        v_initiator_id,
        'Sahabat Kaum Papa',
        15,
        'active'
    )
    RETURNING id INTO v_journey_id;

    -- 2. Daftarkan Kelompok Penerima Manfaat (Beneficiary Group)
    INSERT INTO beneficiary_group (journey_id, label, category, estimated_count, unit, privacy_level)
    VALUES 
        (v_journey_id, 'Lansia & Keluarga Pra-Sejahtera Sekitar', 'lansia', 50, 'keluarga', 'aggregate_only'),
        (v_journey_id, 'Anak Jalanan & Pekerja Rentan', 'pekerja_rentan', 100, 'orang', 'aggregate_only');

    -- 3. Sembilan Belas Pulsa Kasih (15 Hari: Hari 0 sampai Hari 14)
    -- Mematuhi Microcopy / Voice Tokens Level 3.8.7 (Tanpa 'tugas', 'wajib', 'harus', 'selesaikan')
    INSERT INTO the_pulse (journey_id, day_index, prompt_text, action_type)
    VALUES
        (v_journey_id, 0, 'Apa satu hal kecil yang membuatmu bersyukur hari ini?', 'reflection'),
        (v_journey_id, 1, 'Luangkan 3 menit hening. Bayangkan wajah seseorang yang mungkin merasa tak terlihat hari ini.', 'contemplation'),
        (v_journey_id, 2, 'Jika ada kesempatan, sapa atau bantu seseorang di sekitarmu dengan senyuman ramah. Tidak perlu besar, cukup hadir.', 'practical_action'),
        (v_journey_id, 3, 'Tarik napas perlahan. Sadari bahwa setiap orang yang berpapasan denganmu memiliki pergumulan yang tak terucapkan.', 'contemplation'),
        (v_journey_id, 4, 'Sisihkan sedikit rezeki atau belikan sebungkus makanan hangat bagi mereka yang sedang berjuang di jalanan.', 'practical_action'),
        (v_journey_id, 5, 'Beri ruang bagi dirimu untuk beristirahat tanpa beban. Kasih karunia tidak menuntut kesempurnaan; hari ini cukup.', 'reflection'),
        (v_journey_id, 6, 'Dengarkan keluh kesah seorang sahabat atau keluarga tanpa terburu-buru memberi nasihat. Cukup dengarkan dengan tulus.', 'practical_action'),
        (v_journey_id, 7, 'Bawalah nama-nama mereka yang terlupakan ke dalam Bilik Doa. Serahkan segala kelemahanmu kepada Tuhan dalam damai.', 'reflection'),
        (v_journey_id, 8, 'Kumpulkan pakaian layak pakai atau barang kebutuhan pokok yang bisa disalurkan bagi saudara-saudara kita yang membutuhkan.', 'practical_action'),
        (v_journey_id, 9, 'Ketika melihat seseorang yang tersisih hari ini, pandanglah dia bukan dengan rasa kasihan, melainkan sebagai saudara terkasih.', 'contemplation'),
        (v_journey_id, 10, 'Ucapkan terima kasih dan doakan petugas kebersihan, satpam, atau kurir yang melayani harimu dengan setia.', 'practical_action'),
        (v_journey_id, 11, 'Biarkan hatimu dipulihkan dalam keteduhan. Menjadi sahabat bagi kaum papa bermula dari jiwa yang telah merasakan damai.', 'reflection'),
        (v_journey_id, 12, 'Kirimkan pesan penguatan atau doa hening bagi rekan yang sedang lelah memikul tanggung jawab hidup.', 'practical_action'),
        (v_journey_id, 13, 'Jika memungkinkan, luangkan waktu sejenak untuk mengunjungi atau menyapa seorang lansia yang hidup sendirian.', 'practical_action'),
        (v_journey_id, 14, 'Perjalanan 15 hari ini tiba di penghujung musim. Apa satu benih kebaikan yang tumbuh di hatimu dan ingin kamu bawa terus?', 'reflection');

    RAISE NOTICE 'Anchor Journey Sahabat Kaum Papa berhasil disemaikan dengan ID: %', v_journey_id;
END $$;
