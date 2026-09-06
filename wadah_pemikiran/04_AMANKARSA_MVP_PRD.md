# 04. AMANKARSA MVP PRD
### *Level 4: Product Requirements Document — Pilot "Sahabat Kaum Papa"*

**Status:** Final / Locked
**Governance:** Tunduk pada `01_AMANKARSA_CONSTITUTION` (Level 0) dan `03_AMANKARSA_EXPERIENCE_ARCHITECTURE` (Level 3)
**Data Foundation:** Turunan dari `02_AMANKARSA_CANONICAL_PRODUCT_MODEL` v1.1 (Level 2)

---

## 1. MVP BOUNDARY STATEMENT

### 1.1 Apa yang Kita Bangun (In Scope)

Sebuah **pilot** berbasis **satu Journey** ("Sahabat Kaum Papa") yang memvalidasi *core loop* penuh:
`Discover → Join → Experience → Act → Reflect → Continue`

**Sisi Peserta**
- Masuk via QR $\rightarrow$ Alur 60 Detik
- Ruang Hari Ini (*The Pulse*): satu kartu/hari, tiga tipe (Hening / Karsa / Doa)
- Saku (maks. 3 benih) + opsi `[Relakan]`
- Bilik Doa: **menulis + menyimpan privat saja** (Level 1)
- Pohon Karsa: 4 state visual
- Tanda Rasa: tag sentimen sukarela *di luar* Bilik Doa

**Sisi Inisiator** *(peran tunggal, tanpa Fasilitator)*
- Pilih template $\rightarrow$ kustomisasi minimal $\rightarrow$ aktifkan
- Hasilkan QR Code
- Jendela Gembala (read-only): Ethical Pulse Reading, Impact Radiance, dan satu Shepherd's Response (`[Beri ruang rehat]`)

### 1.2 Apa yang TIDAK Kita Bangun (Deferred)

| Fitur | Alasan Penundaan |
|---|---|
| Alur berbagi Bilik Doa (4 langkah + long-press) | Validasi *trust privat* dulu sebelum uji berbagi |
| Peran Fasilitator (terpisah dari Inisiator) | Sederhanakan ke satu peran pemimpin; hindari kompleksitas RLS |
| CommunityGroup / kelompok kecil | Butuh struktur keanggotaan; tunda hingga pilot terbukti |
| ContinuationInvitation otomatis | MVP hanya menangkap *continuation_intent*, belum delivery otomatis |
| Integrasi WhatsApp lanjutan (beyond magic-link) | Magic-link QR sudah cukup untuk pilot |

### 1.3 Catatan Rekonsiliasi Scope (vs. Level 2 v1.1)

Entitas `FacilitatorAssignment`, `CommunityGroup`, dan `ContinuationInvitation` **tidak dibuat tabel/fiturnya di MVP**, tetapi skema dirancang agar tidak menutup kemungkinan menambahkannya nanti tanpa migrasi destruktif.

### 1.4 Tiga Hipotesis Pilot

| # | Hipotesis | Pertanyaan Validasi |
|---|---|---|
| H1 | **Grace Loop** | Apakah ritme berbasis undangan membuat orang kembali *tanpa merasa bersalah*, termasuk setelah absen? |
| H2 | **Sacred Trust** | Apakah orang merasa cukup aman untuk jujur menulis untuk dirinya sendiri di Bilik Doa? |
| H3 | **Outcome Story** | Apakah inisiator bisa melihat "kasih yang merembes" tanpa menjadi pengawas? |

---

## 2. THE ANCHOR JOURNEY: "Sahabat Kaum Papa"

**Tema:** Diakonia — Kepedulian Kasih bagi Sesama yang Terpinggirkan
**Durasi:** 15 hari (Day 0–14)
**Struktur Fase:** Invitation $\rightarrow$ Formation $\rightarrow$ Action $\rightarrow$ Micro-habits $\rightarrow$ Reflection/Continuation

### Peta Hari per Hari (Ilustratif)

| Hari | Fase | Tipe Pulse | Bentuk Pengalaman |
|---|---|---|---|
| 0 | Invitation | Reflection | QR scan $\rightarrow$ onboarding $\rightarrow$ Pulse pertama (syukur) |
| 1 | Formation | Contemplation | Pembekalan: melihat sesama dengan mata Kristus |
| 2 | Service Action | Practical Action | Aksi sosial fisik (diakonia) + refleksi pasca-aksi |
| 3–13 | Micro-habits | Campuran | Latihan harian "Peduli Sekitar" (bisa di-*pocket* / di-relakan) |
| 14 | Reflection | Reflection | Refleksi penutup + tangkap *continuation_intent* |

---

## 3. CORE LOOP MAPPING

| Core Loop Step | Layar Peserta | Entitas Level 2 |
|---|---|---|
| Discover | (Offline: QR di acara) | — |
| Join | Onboarding 60 detik | `Participant`, `ParticipantJourneyState` |
| Experience | Ruang Hari Ini | `ThePulse`, `Pulse_Interaction` |
| Act | Pulse response + Saku | `Pulse_Interaction`, `Impact_Record` |
| Reflect | Bilik Doa + Tanda Rasa | `BilikDoa`, `TandaRasa`, `Pastoral_Signal` |
| Continue | Journey-End + Pohon Karsa | `ParticipantJourneyState`, `PohonKarsaState` |

---

## 4. SCREEN INVENTORY

### 4.1 Layar Peserta
*   **P-01 Landing:** Sapaan pembuka, baca konteks QR.
*   **P-02 Name:** "Mau dipanggil siapa?".
*   **P-03 Context:** Konfirmasi Journey + komunitas.
*   **P-04 Home:** Kartu *Ruang Hari Ini* (Pulse).
*   **P-05 Pulse-Response:** Merespons kartu (acted/rested/pocket).
*   **P-06 Bilik Doa-Write:** Menulis refleksi privat.
*   **P-07 Bilik Doa-Amen:** Penutupan "Amen State".
*   **P-08 Bilik Doa-Archive:** Taman kenangan pribadi.
*   **P-09 Saku:** Maks. 3 benih + Relakan.
*   **P-10 Pohon Karsa:** Visual 4 state, privat.
*   **P-11 Kunci / Identity:** Titip kunci (WA/email magic link).
*   **P-12 Journey-End:** Refleksi penutup + continuation intent.

### 4.2 Layar Inisiator
*   **I-01 Initiator-Login:** Masuk sebagai pemimpin komunitas.
*   **I-02 s/d I-04 Setup:** Pilih template $\rightarrow$ kustomisasi minimal $\rightarrow$ hasilkan QR.
*   **I-05 s/d I-09 Dasbor:** Jendela Gembala (Ethical Pulse, Impact Radiance, Input Impact Record, Shepherd's Response).

---

## 5. NAVIGATION MODEL & USER FLOWS

**Prinsip Peserta:** Navigasi minimal. Tidak ada *bottom-tab-bar* padat. Semua berpusat dari `[Home: Ruang Hari Ini]`. Akses ke Bilik Doa/Pohon/Saku dilakukan melalui sentuhan ringan dari Home.

**Flow Kunci - The Graceful Return:**
Buka app setelah absen $\rightarrow$ Sapaan *present-focused* ("Senang melihatmu lagi") $\rightarrow$ **TIDAK ADA** daftar hari terlewat $\rightarrow$ Langsung ke Home (Pulse hari ini).

---

## 6. DATA SCHEMA (MVP ERD)

### Definisi Field (Subset MVP)

*   **`JourneyTemplate`, `Journey`, `Participant`, `ParticipantJourneyState`, `ThePulse`, `Pulse_Interaction`, `TandaRasa`, `Pastoral_Signal`, `Beneficiary_Group`, `Impact_Record`, `PohonKarsaState`** $\rightarrow$ *Seluruhnya mengikuti Level 2 v1.1 tanpa entitas Anti-Guilt (dilarang ada skor).*

*   **`BilikDoa`**
    *   `id`, `participant_id`, `pulse_interaction_id`, `encrypted_payload`, `created_at`
    *   **Catatan MVP (Penting):** Field `encrypted_payload` ini menyimpan data yang dienkripsi *at-rest* (terkelola di sisi server), **bukan** hasil enkripsi sisi-klien (E2EE). Keamanan akses dijamin penuh oleh RLS, bukan oleh kriptografi klien. Implementasi E2EE adalah roadmap pasca-MVP (Lihat RLS-01a).

---

## 7. PERMISSIONS & RLS

### Aturan RLS Kunci (Server-Enforced Grace)

1.  **RLS-01 (Bilik Doa):** Row `BilikDoa` hanya dapat dibaca oleh `participant_id` pemilik. Tidak ada role lain (termasuk Inisiator) yang memiliki `SELECT` pada `encrypted_payload`.
2.  **RLS-01a (Batas Enkripsi MVP):** Privasi dikunci melalui *Private by Default + Strict Server Authorization (RLS) + Encryption at Rest + No Human Access*. Enkripsi E2EE ditunda pasca-MVP agar tidak menambah kompleksitas *device recovery*. Keamanan bersandar pada RLS.
3.  **RLS-02 (Tanda Rasa agregat):** Query yang mengembalikan `TandaRasa` per-individu dilarang. Hanya view agregat `Pastoral_Signal` (dengan filter `count >= 5`) yang diizinkan untuk Initiator.
4.  **RLS-04 (Anti-inactivity):** Tidak ada fungsi/prosedur yang menghasilkan daftar "peserta tidak aktif". Ini bukan dibatasi — ia **tidak ada**.

---

## 8. API SURFACE (Minimal)

### Endpoint yang DILARANG:
*   Endpoint yang mengembalikan daftar peserta tidak aktif.
*   Endpoint yang mengembalikan isi `BilikDoa` selain milik *requester*.
*   Endpoint yang mengembalikan skor/level spiritual.

*(Detail rute API selengkapnya mengikuti arsitektur PWA standar CRUD untuk entitas yang diizinkan).*

---

## 9. ACCEPTANCE CRITERIA & CONSTITUTIONAL CHECK

Semua fitur MVP dinyatakan **Lulus Constitutional Check** (Tidak memicu *Guilt*, Tidak mengukur Iman, Tidak melanggar Privasi).

**Kriteria Terima Kunci:**
*   **F1 - Onboarding:** Peserta dapat masuk tanpa *login wall* di awal (Identity Maturation di akhir).
*   **F2 - The Pulse:** Semua opsi respons (termasuk `rested`) sah dan tidak pernah memicu tenggat waktu (deadline) / gagal.
*   **F3 - Bilik Doa:** Setelah simpan refleksi, muncul "Amen State" (tanpa metrik atau dorongan melanjutkan).
*   **F4 - Jendela Gembala:** Dasbor Inisiator gagal memuat sentimen jika responden < 5.

---

## 10. PILOT SUCCESS METRICS & RISKS

*   **North Star (Validasi):** *Meaningful Continuation* — % peserta yang melakukan $\ge$ 1 tindakan lanjutan pasca-Journey.
*   **Risiko Teknis MVP:** Kehilangan sesi karena PWA dibuka via *in-app browser* (IG/WhatsApp). **Mitigasi:** Mekanisme "titip kunci" (Magic Link) yang dirancang di Arsitektur Token Anonim (Level 5).
