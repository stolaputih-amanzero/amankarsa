# 05. AMANKARSA TECHNICAL ARCHITECTURE
### *Level 5: Infrastructure, Security, & Deployment Strategy*

**Status:** Final / Locked
**Governance:** Tunduk pada `01_AMANKARSA_CONSTITUTION` (Level 0)
**Product Foundation:** Turunan dari `04_AMANKARSA_MVP_PRD` (Level 4)

---

## I. PENDAHULUAN
Dokumen ini mendefinisikan infrastruktur teknis yang menopang Amankarsa. Arsitektur ini tidak hanya dirancang untuk *scalability* dan *performance*, tetapi juga untuk **mempertahankan integritas teologis dan filosofis** produk. Setiap keputusan teknis—mulai dari manajemen sesi, enkripsi, hingga CI/CD—adalah terjemahan langsung dari *Grace UX Principles* dan *Constitutional Boundaries*.

---

## 5.1 ARSITEKTUR TOKEN ANONIM & PEMATANGAN IDENTITAS
Menyelesaikan masalah "pembunuh diam-diam" PWA (*in-app browser cache clearing*) dengan filosofi "Jangkar Persetujuan", bukan "Jejak Tersembunyi".

### Sistem Tiga Token
| Token | Fungsi | Masa Hidup | Penyimpanan |
|---|---|---|---|
| **Join Token** (di QR) | Mengode konteks Journey, membuat `Participant` | Sekali pakai / singkat | Parameter URL |
| **Recovery Token** (Kunci) | Menetapkan ulang sesi dari peramban apa pun | Panjang (45-60 hari), *revocable* | Hash di server (DB) |
| **Session Token** (JWT) | Autentikasi API & klaim RLS | Singkat (7 hari, *refreshable*) | HTTP-only cookie + localStorage |

### Alur "Titip Kunci" (Identity Maturation)
1. **Stage 0 (Anonim):** Scan QR $\rightarrow$ `Join Token` membuat `Participant` & `Session Token`.
2. **Stage 1 (Jangkar):** Di detik ke-60, pengguna diundang menitipkan kunci (Email/WA). Server membuat `Recovery Token`, menyimpan *hash*-nya, dan mengirimkan *Magic Link* ke pengguna.
3. **Graceful Return:** Pengguna klik Magic Link dari peramban apa pun $\rightarrow$ Server validasi *hash* $\rightarrow$ Cetak `Session Token` baru $\rightarrow$ Pohon Karsa & Bilik Doa utuh tanpa *login wall*.

---

## 5.2 TECH STACK & HIGH-LEVEL ARCHITECTURE
Stack dipilih untuk memaksimalkan *Row-Level Security* native dan *Server-Side Rendering* untuk performa PWA.

*   **Frontend (The Graceful Interface):** Next.js (App Router) + React + Tailwind CSS + Framer Motion.
*   **Backend & BaaS (The Sacred Vault):** Supabase (PostgreSQL 15+). Memanfaatkan *Native RLS*, *Auth*, dan *Edge Functions*.
*   **PWA Engine:** `Serwist` (atau `next-pwa`) untuk *offline-caching* (khususnya untuk membaca arsip Bilik Doa tanpa internet).
*   **Deployment:** Vercel (Frontend) + Supabase Cloud (Backend).

---

## 5.3 SKEMA RLS (ROW-LEVEL SECURITY): "SERVER-ENFORCED GRACE"
Keamanan dieksekusi di level mesin database. Tidak ada *endpoint* atau *role admin* yang bisa menembus batas konstitusional ini.

### 1. The Sacred Vault: `bilik_doa`
```sql
CREATE TABLE bilik_doa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pulse_interaction_id UUID,
    encrypted_payload TEXT NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE bilik_doa ENABLE ROW LEVEL SECURITY;

-- CONSTITUTIONAL GUARD: N03 Private by Default
CREATE POLICY "Bilik Doa is strictly private to owner"
ON bilik_doa FOR ALL
USING (auth.uid() = participant_id)
WITH CHECK (auth.uid() = participant_id);
```

### 2. Ethical Pulse Reading: `tanda_rasa` (Agregasi Etis)
```sql
CREATE TABLE tanda_rasa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES auth.users(id),
    journey_id UUID REFERENCES journey(id),
    tag TEXT CHECK (tag IN ('damai','bersyukur','tergerak','lelah','cemas','sedih','bingung')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tanda_rasa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own Tanda Rasa" ON tanda_rasa FOR ALL
USING (auth.uid() = participant_id) WITH CHECK (auth.uid() = participant_id);

-- FUNGSI AMAN UNTUK INISIATOR (Jendela Gembala)
CREATE OR REPLACE FUNCTION get_pastoral_signals(p_journey_id UUID)
RETURNS TABLE (tag TEXT, count BIGINT, percentage NUMERIC)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE total_responses BIGINT;
BEGIN
    SELECT COUNT(*) INTO total_responses FROM tanda_rasa WHERE journey_id = p_journey_id;
    IF total_responses >= 5 THEN
        RETURN QUERY SELECT tr.tag, COUNT(*) as count, ROUND((COUNT(*)::NUMERIC / total_responses::NUMERIC) * 100, 2)
        FROM tanda_rasa tr WHERE tr.journey_id = p_journey_id GROUP BY tr.tag ORDER BY count DESC;
    ELSE
        RETURN QUERY SELECT 'insufficient_data'::TEXT, 0::BIGINT, 0::NUMERIC;
    END IF;
END; $$;

REVOKE SELECT ON tanda_rasa FROM authenticated;
GRANT EXECUTE ON FUNCTION get_pastoral_signals(UUID) TO authenticated;
```

### 3. Graceful Progress: `participant_journey_state`
```sql
CREATE TABLE participant_journey_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES auth.users(id),
    journey_id UUID REFERENCES journey(id),
    state TEXT NOT NULL,
    continuation_intent TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- CONSTITUTIONAL GUARD: Menolak terminologi kegagalan
    CONSTRAINT chk_grace_states CHECK (state IN ('invited', 'active', 'paused', 'resting', 'completed', 'continuing', 'archived'))
);
```

---

## 5.4 ENCRYPTION AT REST (IMPLEMENTASI MVP)
Sesuai **RLS-01a**, kita menunda *End-to-End Encryption (E2EE)* sisi-klien untuk MVP demi menghindari kompleksitas *device recovery* dan *key management* yang dapat menghukum pengguna yang kehilangan HP. 

Sebagai gantinya, kita menerapkan **Application-Level Encryption** sebelum data menyentuh database.

### Mekanisme Enkripsi (AES-256-GCM)
1. **Kunci Induk (Master Key):** Disimpan sebagai *Environment Variable* yang dienkripsi di Vercel (`BILIK_DOA_ENCRYPTION_KEY`).
2. **Proses Tulis (Write):** Saat pengguna menekan `[Simpan]` di Bilik Doa, Next.js Server Action mengenkripsi *plaintext* menggunakan Node.js native `crypto` (AES-256-GCM) sebelum melakukan `INSERT` ke Supabase.
3. **Proses Baca (Read):** Next.js mengambil `encrypted_payload` dari Supabase, mendekripsinya di memori server, dan mengirimkannya ke klien melalui *Secure HTTP-Only Cookie / Session*.
4. **Database State:** Jika seorang DBA atau peretas mendapatkan akses *dump* mentah dari database Supabase, mereka hanya akan melihat *ciphertext* acak. Mereka tidak bisa membacanya tanpa Master Key yang ada di server Vercel.

### Batasan Konstitusional
*   **No AI Training:** Teks yang didekripsi di memori server **tidak boleh** di-*pipe* ke API LLM (seperti OpenAI) untuk analisis sentimen atau pelatihan model.
*   **No Human Access:** Tidak ada dashboard admin internal (bahkan untuk tim *engineer* Amankarsa) yang memiliki fungsi untuk mendekripsi dan menampilkan isi `bilik_doa`.

---

## 5.5 DEPLOYMENT, CI/CD & PWA STABILITY
Strategi rilis dirancang untuk memastikan bahwa ketika seorang pemuda gereja memindai QR Code di depan ratusan jemaat, aplikasi **tidak boleh gagal memuat (zero-downtime)**.

### 1. PWA Caching Strategy (The Offline Fallback)
Menggunakan *Service Worker* yang dikonfigurasi via `Serwist`:
*   **App Shell (Stale-While-Revalidate):** HTML dasar, CSS (Tailwind), dan font di-*cache* secara agresif. Aplikasi akan *loading* instan (< 100ms) bahkan di sinyal lemah.
*   **The Pulse & API (Network-First):** Konten harian selalu mengambil dari server. Jika *offline*, tampilkan *fallback UI* yang menenangkan: *"Koneksi sedang beristirahat. Tulisanmu aman di perangkat ini dan akan tersinkronisasi saat kamu terhubung kembali."*
*   **Bilik Doa Archive (Cache-First):** Refleksi masa lalu yang sudah tersimpan dienkripsi dan di-*cache* di *IndexedDB* lokal perangkat, memungkinkan pengguna membaca kembali "taman kenangan" mereka saat *offline* (misal: di perjalanan).

### 2. Database Branching & Migration (Supabase CLI)
*   **Tidak ada perubahan skema manual di Production.**
*   Setiap *Pull Request* di GitHub secara otomatis memicu **Supabase Branching** (membuat *clone* database sementara).
*   *Engineer* wajib menulis tes RLS menggunakan `pgTAP` atau *Supabase CLI tests* untuk memastikan kebijakan privasi (seperti `Bilik Doa is strictly private`) tidak bocor sebelum di-*merge* ke `main`.

### 3. Feature Flags untuk Pilot (Safety Net)
Menggunakan *Vercel Edge Config* atau *LaunchDarkly* untuk mengontrol fitur tanpa perlu *redeploy*:
*   Jika ditemukan *bug* kritis pada fitur "Saku" saat pilot berlangsung, tim dapat mematikan fitur tersebut secara *real-time* dari dashboard. UI akan secara elegan menyembunyikan tombol `[Simpan di Saku]` dan kembali ke mode dasar tanpa *crash*.

### 4. Environment Segregation
| Environment | Fungsi | Database |
|---|---|---|
| **Local** | Development harian | Supabase Local (Docker) |
| **Preview** | Testing UI/UX per Pull Request | Supabase Branch (Ephemeral) |
| **Staging** | UAT dengan tim pastoral | Supabase `staging` (Data dummy) |
| **Production** | Pilot Gereja (Live) | Supabase `prod` (Data riil, enkripsi aktif) |

---
*Dokumen ini adalah kontrak teknis final. Dengan selesainya Level 5, seluruh fondasi dari Level 0 (Konstitusi) hingga Level 5 (Infrastruktur) telah terkunci. Tim Engineering kini memiliki mandat yang jelas, aman, dan beretika untuk mulai menulis baris kode pertama Amankarsa.*
