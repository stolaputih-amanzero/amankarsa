# AMANKARSA CANONICAL PRODUCT MODEL
### *Level 2: The Data Ontology & System Architecture Map (v1.1 Addendum)*

---

## I. ARCHITECTURAL PREMISE
Dokumen ini mendefinisikan apa yang secara harfiah hidup di dalam basis data Amankarsa. Model ini dirancang secara defensif untuk mematuhi *Amankarsa Constitution* (Level 0). Segala entitas yang berpotensi menjadi alat ukur spiritualitas, kompetisi, atau *guilt-trip* secara eksplisit ditiadakan.

Pusat gravitasi sistem ini adalah **Journey**, dan denyut nadi utamanya adalah **The Pulse**. Pembaruan v1.1 memasukkan dimensi **Outcome (Beneficiary)** dan **Community (Facilitator/Group)** agar sistem dapat mengukur dampak pelayanan yang merembes keluar, serta menjaga batas aman privasi pendampingan pastoral.

---

## II. THE DOMAIN ENTITIES (Kamus Ontologi Sistem)

### 1. `Journey` (The Canonical Root)
Entitas yang mengikat waktu, konteks, dan komunitas. *Event* fisik hanyalah metadata di dalam *Journey*.
*   **id:** UUID
*   **initiator_id:** Referensi ke organisasi/komunitas pembuat.
*   **blueprint_id:** Referensi ke template (jika mengambil dari pustaka).
*   **theme:** Nama perjalanan (misal: "Sahabat Kaum Papa").
*   **duration_days:** Rentang waktu aktif (misal: 14 hari).
*   **status:** `draft`, `active`, `completed`.
*   **constitutional_guard:** Tidak ada metrik "sukses/gagal" pada entitas ini.

### 2. `Participant` (The Frictionless Identity)
Identitas peserta yang sangat ringan untuk mendukung adopsi *60-detik pertama*.
*   **id:** UUID
*   **display_name:** Nama panggilan (bisa anonim).
*   **auth_channel:** Nomor WhatsApp / Email (sebagai *magic link/OTP receiver*).
*   **joined_at:** Timestamp.
*   **constitutional_guard:** Tidak ada `faith_level`, `badges`, atau `total_score`.

### 3. `The Pulse` (The Atomic Daily Loop)
Unit terkecil interaksi. Menggantikan konsep "Tugas" atau "Kewajiban".
*   **id:** UUID
*   **journey_id:** Referensi ke Journey.
*   **day_index:** Urutan hari (1, 2, ..., n).
*   **prompt_text:** Sapaan atau ajakan (misal: "Kirimkan satu pesan penguatan hari ini.").
*   **action_type:** `contemplation`, `practical_action`, `reflection`.
*   **constitutional_guard:** Tidak ada tenggat waktu (*deadline*) yang memicu status *Failed*.

### 4. `Pulse_Interaction` (Observable Behavior)
Mencatat apa yang *dilakukan* pengguna, bukan mengevaluasi *mengapa* mereka melakukannya.
*   **id:** UUID
*   **pulse_id:** Referensi ke nadi harian.
*   **participant_id:** Referensi ke pengguna.
*   **interacted_at:** Timestamp.
*   **state:** `paused`, `acted`, `rested` (menggantikan *missed/failed*).

### 5. `Bilik Doa / Reflection` (The Encrypted Vault)
Tempat penyimpanan catatan batin. Entitas dengan privasi paling ketat di sistem.
*   **id:** UUID
*   **pulse_interaction_id:** Referensi ke aksi yang memicu refleksi ini.
*   **encrypted_payload:** Teks catatan batin (Dienkripsi di level aplikasi/klien sebelum masuk ke *database*).
*   **is_explicitly_shared:** Boolean (Default: `False`). Jika `True`, *decryption key* dibagikan ke *scope* komunitas.
*   **constitutional_guard:** Entitas ini tidak boleh diakses oleh *query* admin biasa, *database administrator*, atau Inisiator.

### 6. `Pastoral_Signal` (The Aggregated Insight)
Jembatan antara privasi pengguna dan kebutuhan gembala/inisiator untuk melihat *outcome*.
*   **id:** UUID
*   **journey_id:** Referensi ke Journey.
*   **period:** Harian/Mingguan.
*   **participation_rate:** Persentase partisipasi (angka agregat).
*   **dominant_sentiments:** Array of tags (misal: `["Lelah", "Damai", "Berharap"]`). Diekstrak tanpa mengaitkan ke `participant_id`.
*   **constitutional_guard:** *Read-only materialized view*. Tidak bisa di-*drill-down* ke individu.

### 7. `Pohon Karsa` (The Visual Storyteller)
Representasi visual dari perjalanan pengguna, berorientasi pada musim, bukan poin.
*   **participant_id:** Referensi pengguna.
*   **cumulative_actions:** Integer (Hanya digunakan untuk merender *state* visual, tidak ditampilkan sebagai angka ke pengguna).
*   **current_season_state:** `sprouting`, `growing`, `resting`, `bearing_fruit`.
*   **constitutional_guard:** *State* bisa masuk ke `resting`, tetapi tidak akan pernah menjadi `withered` (mati/layu) akibat *streak* yang putus.

### 8. `Beneficiary_Group` (The Impact Target)
Mewakili penerima manfaat dari aksi pelayanan, memindahkan fokus dari absensi kehadiran ke dampak keluar.
*   **id:** UUID
*   **journey_id:** Referensi ke Journey.
*   **service_activity_id:** UUID (opsional).
*   **label:** Nama kelompok (misal: "Panti Jompo Kasih").
*   **category:** Enum (`lansia`, `anak`, `keluarga`, `penyandang_disabilitas`, `komunitas_lokal`, `lingkungan_hidup`, `pekerja_rentan`, `lainnya`).
*   **estimated_count:** Integer (misal: 80).
*   **unit:** Enum (`orang`, `keluarga`, `paket`, `kunjungan`, `jam_pelayanan`, `area_layanan`).
*   **privacy_level:** `aggregate_only`.
*   **constitutional_guard:** Dilarang keras digunakan untuk menilai kualitas iman penerima manfaat atau mencatat konversi rohani sebagai metrik kesuksesan pelayanan.

### 9. `Impact_Record` (The Service Metric)
Mencatat tindakan pelayanan nyata sebagai *outcome* dari *Journey*.
*   **id:** UUID
*   **journey_id:** Referensi ke Journey.
*   **service_activity_name:** Nama kegiatan.
*   **beneficiary_group_id:** Referensi ke Beneficiary_Group.
*   **metric_type:** Enum (`volunteer_hours`, `meals_distributed`, `visits_made`, `packages_distributed`, `families_served`, `environmental_actions`, `other_service_actions`).
*   **quantity:** Integer.
*   **unit:** String.
*   **source:** Enum (`observable`, `self_reported`, `facilitator_reported`, `initiator_reported`).
*   **occurred_at:** Timestamp.
*   **constitutional_guard:** *No faith score*. Hanya mencatat perilaku (*behavior*) dan pelayanan empiris.

### 10. `FacilitatorAssignment` (The Pastoral Role)
Penugasan peran pendamping tanpa menjadikannya entitas yang berkuasa absolut atas privasi peserta.
*   **id:** UUID
*   **participant_id:** Referensi ke Participant yang menjadi fasilitator.
*   **journey_id:** Referensi ke Journey.
*   **group_id:** UUID (opsional).
*   **role:** Enum (`facilitator`, `small_group_leader`, `pastoral_care`, `initiator_delegate`).
*   **scope:** Enum (`individual`, `small_group`, `journey_wide`).
*   **assigned_by:** UUID (Initiator).
*   **assigned_at:** Timestamp.
*   **constitutional_guard:** *Access does not follow authority*. Fasilitator tidak dapat mengakses *Bilik Doa* peserta, kecuali dibagikan secara spesifik oleh peserta tersebut.

### 11. `CommunityGroup` (The Shared Safe Space)
Wadah pengelompokan komunitas agar *scope* privasi dan akses fasilitator jelas dan terbatas.
*   **id:** UUID
*   **journey_id:** Referensi ke Journey.
*   **name:** Nama kelompok (misal: "Komsel Agape 1").
*   **privacy_scope:** Enum (`private_group`, `shared_group`, `journey_wide`).
*   **constitutional_guard:** *No default exposure*. Segala interaksi yang terjadi diproteksi keanggotaan grup.

### 12. `ParticipantJourneyState` (The Graceful Progress)
Melacak status perjalanan seorang peserta tanpa menggunakan terminologi kegagalan atau putus di tengah jalan.
*   **id:** UUID
*   **participant_id:** Referensi ke Participant.
*   **journey_id:** Referensi ke Journey.
*   **state:** Enum (`invited`, `active`, `paused`, `resting`, `completed`, `continuing`, `archived`).
*   **completed_at:** Timestamp.
*   **continuation_intent:** Enum (`none`, `self_guided`, `community_invited`, `next_journey`).
*   **constitutional_guard:** Tidak boleh ada status *failed*, *dropped_out*, *inactive_penalty*, atau *streak_broken*.

### 13. `ContinuationInvitation` (The Bridge to Next Steps)
Menjembatani akhir sebuah Journey menuju praktik kehidupan mandiri atau pelayanan berikutnya.
*   **id:** UUID
*   **participant_id:** Referensi ke Participant.
*   **source_journey_id:** Referensi ke Journey asal.
*   **target_type:** Enum (`next_journey`, `standalone_practice`, `community_group`, `rest_period`).
*   **target_id:** UUID.
*   **invited_at:** Timestamp.
*   **status:** Enum (`unseen`, `seen`, `accepted`, `declined`, `rested`).
*   **constitutional_guard:** *Invitation over obligation*. Menghargai keputusan pengguna tanpa tekanan momentum.

---

## III. THE ANTI-ENTITIES (Daftar Hitam Basis Data)
Untuk memastikan sistem tidak melanggar *Amankarsa Constitution*, entitas/kolom berikut ini **HARAM** direpresentasikan dalam skema *database*:

| Anti-Entity | Alasan Penolakan (Constitutional Reason) |
| :--- | :--- |
| `SpiritualScore` | Melanggar **N01** (No Faith Score). Mengubah rahmat menjadi performa. |
| `StreakCounter` | Melanggar **N02** (No Guilt Mechanics). Memicu tekanan psikologis saat putus. |
| `Leaderboard` | Melanggar **N02**. Kehidupan rohani bukan kompetisi vertikal antar jemaat. |
| `Public_Feed_Default` | Melanggar **N03** (Private by Default). Berbagi harus melalui persetujuan. |
| `Failure_Log` | Melanggar *Right to Rest*. Sistem tidak mencatat kegagalan, hanya jeda/istirahat. |
| `BeneficiaryConversionScore` | Melarang sistem mengukur “hasil rohani/pertobatan” penerima manfaat secara kuantitatif sebagai alat validasi efektivitas program. |
| `FacilitatorSurveillanceLog` | Fasilitator adalah pendamping, bukan pengawas. Fitur pemantauan keaktifan mikro individu (mengintip) dilarang. |
| `InactivityShameList` | Daftar "siapa yang tidak aktif" berpotensi dieksploitasi menjadi *guilt mechanism* dalam komunitas. |
| `JourneyFailureState` | Tidak boleh ada status gagal, D.O, atau diskualifikasi dalam perjalanan formasi iman. |
| `GraduationRanking` | Formasi rohani tidak memiliki ranking kelulusan berjenjang yang bisa diperbandingkan antar individu. |

---

## IV. DATA BOUNDARY & ACCESS MATRIX (v1.1 Expanded)

Matriks ini mengunci siapa yang boleh melihat dan memodifikasi data.

| Entity | Participant | Facilitator | Initiator / Gembala | Platform Admin | System / AI |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Participant Identity** | Full Access | Limited | Limited | Limited | Limited |
| **Pulse Interaction** | Full Access | Aggregate | Aggregate | Aggregate | Aggregate |
| **Bilik Doa (Private)** | Full Access | **NO ACCESS** | **NO ACCESS** | **NO ACCESS** | **NO ACCESS** |
| **Bilik Doa (Shared to Group)** | Full Access | Read-Only (if in group) | No (unless shared wider) | **NO ACCESS** | Read-Only (authorized) |
| **Bilik Doa (Shared to Initiator)**| Full Access | No (unless shared) | Read-Only (if shared) | **NO ACCESS** | Read-Only (authorized) |
| **CommunityGroup Membership** | Own Group | Own Group | Aggregate | Aggregate | Aggregate |
| **Service / Impact Record** | Read | Read | Read/Write | Aggregate | Aggregate |
| **Beneficiary Group** | Read | Read | Read/Write | Aggregate | Aggregate |
| **Continuation Invitation** | Full Access | Aggregate | Aggregate | Aggregate | Aggregate |
| **Pohon Karsa State** | Visual Only | NO ACCESS | NO ACCESS | NO ACCESS | NO ACCESS |
| **Safety Report** | Reporter Only | Assigned Only | Assigned Only | Authorized | No free analysis |

---
*Dokumen ini menjadi landasan mutlak bagi Backend Engineer dalam mendesain Entity-Relationship Diagram (ERD) dan menetapkan Row-Level Security (RLS) di database.*
