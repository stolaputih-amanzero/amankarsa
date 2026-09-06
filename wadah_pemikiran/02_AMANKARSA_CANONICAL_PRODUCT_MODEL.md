# AMANKARSA CANONICAL PRODUCT MODEL
### *Level 2: The Data Ontology & System Architecture Map*

---

## I. ARCHITECTURAL PREMISE
Dokumen ini mendefinisikan apa yang secara harfiah hidup di dalam basis data Amankarsa. Model ini dirancang secara defensif untuk mematuhi *Amankarsa Constitution* (Level 0). Segala entitas yang berpotensi menjadi alat ukur spiritualitas, kompetisi, atau *guilt-trip* secara eksplisit ditiadakan.

Pusat gravitasi sistem ini adalah **Journey**, dan denyut nadi utamanya adalah **The Pulse**.

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

---

## IV. DATA BOUNDARY & ACCESS MATRIX

Matriks ini mengunci siapa yang boleh melihat dan memodifikasi data.

| Entity | Participant | Initiator / Gembala | Platform Admin | System / AI |
| :--- | :--- | :--- | :--- | :--- |
| **Participant Identity** | Full Access | Limit (Nama Panggilan) | Limit (Troubleshooting) | Limit |
| **Pulse Interaction** | Full Access | Aggregate Only | Aggregate Only | Aggregate Only |
| **Bilik Doa (Private)** | Full Access | **NO ACCESS** | **NO ACCESS** | **NO ACCESS** |
| **Bilik Doa (Shared)** | Full Access | Read-Only | **NO ACCESS** | Read-Only |
| **Pastoral Signal** | NO ACCESS | Read-Only | Aggregate Only | Read/Write |
| **Pohon Karsa State** | Visual Only | NO ACCESS | NO ACCESS | NO ACCESS |

---
*Dokumen ini menjadi landasan mutlak bagi Backend Engineer dalam mendesain Entity-Relationship Diagram (ERD) dan menetapkan Row-Level Security (RLS) di database.*
