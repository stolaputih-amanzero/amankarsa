# AMANKARSA
### *Spesifikasi Sistem, Desain Pengalaman, & Kerangka Kerja Eksekusi*
**(System, Experience & Execution Framework - Dokumen Pelengkap Dokumen Master)**

---

## 1. PENDAHULUAN & RELASI DOKUMEN

Dokumen ini adalah pendamping operasional dan teknis dari **Dokumen 1 (`AMANKARSA_Blueprint.md`)**. 

* **Tujuan Utama Dokumen Ini:** Menerjemahkan nilai filosofis kasih karunia (*grace-based*), pertumbuhan organik (*growing*), dan ruang aman (*safe space*) ke dalam arsitektur sistem, aturan bisnis (*business rules*), interaksi UI/UX, dan model keberlanjutan yang siap dieksekusi oleh tim rekayasa perangkat lunak (*engineers*), desainer produk, serta fasilitator komunitas Kristen.
* **Prinsip Panduan:** Setiap keputusan teknis yang diambil dalam dokumen ini tunduk pada prinsip *“Keharusan yang Membebaskan, Tanpa Menghakimi”*.

---

## 2. ARSITEKTUR "MICRO-HABITS IMAN" & NON-GUILT GAMIFICATION

Tantangan utama sistem pembiasaan konvensional (*habit tracker*) adalah penggunaan *streak count* (rantai hari beruntun) yang memicu kecemasan dan rasa bersalah (*guilt*) ketika terputus. Dalam iman Kristen, hubungan dengan Tuhan didasarkan pada kasih karunia, bukan hukum pembuktian diri.

### 2.1 Format & Tipologi Micro-habits Harian
Setiap *Journey* pasca-event memiliki rentang waktu 7–30 hari dengan porsi latihan rohani harian yang terukur:
* **Batas Waktu:** Dirancang tuntas dalam **2 hingga 5 menit** per hari.
* **Tiga Kategori Pembiasaan:**
  1. **Tipe Kontemplatif (Keheningan / Firman):**
     * Membaca 1–2 ayat kunci dan merenungkannya sejenak.
     * Contoh: *"Hening 2 menit, syukuri satu anugerah Tuhan hari ini yang sering luput disadari."*
  2. **Tipe Aksi Kasih Nyata (Praktis):**
     * Satu tindakan sederhana yang diarahkan ke lingkungan sekitar.
     * Contoh: *"Kirimkan 1 pesan penguatan bagi rekan kerja/saudara yang sedang bergumul."* / *"Kurangi penggunaan 1 botol plastik hari ini sebagai rasa syukur atas bumi ciptaan Tuhan."*
  3. **Tipe Evaluasi Batin (Reflektif):**
     * Menjawab 1 pertanyaan pemantik hati yang tidak intimidatif.

### 2.2 Mekanisme Gamifikasi Metaforis: "Pohon Karsa"
Amankarsa meniadakan penghitungan angka kegagalan dan menggantinya dengan metafora pertumbuhan tanaman (Yohanes 15:5):
* **Penyiraman Kumulatif (Cumulative Nurturing):**
  * Setiap aksi yang diselesaikan menyumbangkan "tetesan air" atau "sinar matahari" bagi visual Pohon Karsa pengguna.
  * Pertumbuhan dihitung berdasarkan total akumulasi kebaikan, **bukan** keteraturan tanpa jeda.
* **Absen Tanpa Hukuman (*Zero Penalty on Inactivity*):**
  * Jika pengguna tidak membuka aplikasi selama beberapa hari, **pohon tidak akan mati, layu, atau kembali ke bibit awal**.
  * Visual pohon masuk ke status *Tidur Tenang (Resting State)* dengan tanah yang tetap terjaga.
  * Teks saat kembali: *"Pohon ini sabar menunggumu. Mari lanjutkan perjalanan dengan damai."*
* **Fase Buah Nyata (Fruit Bearing):**
  * Setelah mencapai akumulasi tertentu, pohon akan "berbuah" (ditandai dengan lencana refleksi berupa buah roh: Kasih, Sukacita, Damai Sejahtera, Kesabaran, dst.). Buah ini merepresentasikan pertumbuhan karakter, bukan peringkat kompetisi.

### 2.3 Aturan Saluran Notifikasi (Graceful Prompts)
* **Frekuensi:** Maksimal 1 pengingat lembut per hari (dapat diatur jam pengirimannya oleh pengguna).
* **Tone of Voice:**
  * ❌ *Dilarang:* "Anda belum menyelesaikan tantangan hari ini!", "Streak Anda terancam putus!"
  * ✔️ *Diwajibkan:* "Ada ruang teduh yang menantimu jika engkau lelah hari ini.", "Bila ada waktu luang sejenak, mari mengucap syukur bersama."
* Notifikasi otomatis nonaktif sementara jika pengguna tidak merespons selama 3 hari berturut-turut, untuk menghindari rasa terteror (*digital spiritual fatigue*).

---

## 3. PROTOKOL PRIVASI & ETIKA DATA: "BILIK DOA DIGITAL"

Jurnal refleksi memuat dinamika pergumulan iman, dosa, rasa syukur, dan isi hati yang sangat intim. Tanpa jaminan kerahasiaan penuh, pengguna akan cenderung menuliskan hal-hal normatif demi reputasi sosial.

### 3.1 Skema Akses Tiga Lapis (Three-Tier Privacy Model)

```
[ Input Refleksi Pengguna ]
           │
           ├────────────────────────┬────────────────────────┐
           ▼                        ▼                        ▼
      [ LEVEL 1 ]              [ LEVEL 2 ]              [ LEVEL 3 ]
  Bilik Doa Pribadi        Komunitas / Kelompok      Dasbor Inisiator
(100% Terenkripsi & Privat)  (Eksplisit Dibagikan)   (Agregat & Anonimitas)
```

| Tingkat Akses | Sifat Data | Pihak yang Dapat Melihat | Ketentuan Teknis |
| :--- | :--- | :--- | :--- |
| **Level 1: Bilik Doa Pribadi** | Sangat Rahasia (Private) | **Hanya Pengguna & Tuhan** | Enkripsi pada tingkat basis data (*End-to-End Encryption*). Bahkan gembala, fasilitator, dan tim teknis Amankarsa tidak memiliki hak akses untuk membaca isi jurnal. |
| **Level 2: Kesaksian Kasih** | Terbuka Terbatas (Community Sharing) | **Anggota Kelompok Kecil / Komsel** | Pengguna secara sadar menekan tombol *"Bagikan Cuplikan sebagai Penguatan"*. Hanya teks yang dipilih secara spesifik yang muncul di linimasa komunitas. |
| **Level 3: Wawasan Dampak** | Agregat Tanpa Identitas (Aggregated Insight) | **Inisiator & Pemimpin Komunitas** | Data diproses secara kolektif tanpa nama (*de-identified*). Inisiator hanya membaca ringkasan sentimen dan persentase dinamika umum. |

### 3.2 Contoh Tampilan Data di Dasbor Pemimpin/Inisiator
Inisiator program **tidak pernah** melihat daftar: *"Si A menulis: Saya sedang bertengkar dengan istri."*
Melainkan membaca ringkasan agregat:
* *Tema pergumulan yang mendominasi minggu ini: 45% Kelelahan Kerja & Manajemen Waktu, 30% Relasi Keluarga.*
* *Tingkat kedamaian batin pasca-aksi: 82% peserta merasakan damai sejahtera setelah melayani lansia di panti.*
* *Total aksi kasih nyata terlaksana: 240 jam pelayanan akumulatif.*

---

## 4. SISTEM ADOPSI INISIATOR GEREJA & KOMUNITAS ("ZERO ADMIN")

Salah satu penyebab kegagalan aplikasi pelayanan adalah tingginya beban administratif yang dibebankan kepada staf gereja atau aktivis pemuda. Amankarsa dibangun dengan arsitektur peredam friksi (*frictionless onboarding*).

### 4.1 Cetak Biru Perjalanan Siap Pakai (Plug & Play Journey Blueprints)
Gereja lokal tidak perlu menyusun modul pemuridan aksi dari kertas kosong. Amankarsa menyediakan modul terkurasi yang selaras dengan kalender gerejawi maupun tema pelayanan umum:
1. **Journey Sahabat Kaum Papa (Diakonia):** 1 Sesi Pembekalan + 1 Hari Aksi Sosial + 14 Hari Micro-habits Peduli Sekitar.
2. **Journey Penatalayanan Ciptaan (Eco-Discipleship):** Refleksi Kejadian 2:15 + Aksi Bersih Lingkungan + 21 Hari Diet Plastik & Konservasi Energi.
3. **Journey Pemulihan Relasi Kasih:** Pembekalan Pengampunan + 7 Hari Tindakan Mengasihi Keluarga Tanpa Syarat.

### 4.2 Alur Registrasi Tanpa Hambatan (Frictionless Onboarding)
* **Ketiadaan Paksaan Download di Awal:**
  * Di hari H acara fisik/seminar gereja, peserta **tidak diwajibkan** langsung mengunduh aplikasi berukuran besar.
  * Panitia cukup menampilkan **QR Code tunggal**.
  * Pemindaian QR mengarah ke *Web-App responsif (Progressive Web App)*: Peserta cukup memasukkan nama panggilan dan nomor WhatsApp untuk mencatat presensi dan menerima tautan renungan hari pertama.
* **Integrasi Lembut WhatsApp / Jalur Komunikasi:**
  * Tautan hari pertama dikirim melalui jalur pesan instan yang sudah biasa digunakan jemaat. Pengunduhan aplikasi native ditawarkan kemudian secara organik saat jemaat merasa memerlukan rumah jurnal yang lebih rapi.

---

## 5. TAKSONOMI METRIK DAMPAK: OUTPUT VS. OUTCOME

Amankarsa mengubah cara gereja dan komunitas mengevaluasi keberhasilan sebuah pelayanan, dari sekadar statistik panggung menjadi buah kehidupan.

```
                    METRIK TRADISIONAL (Output)
              "Berapa orang yang datang ke ruangan?"
                                │
                                ▼ [DITRANSFORMASI OLEH AMANKARSA]
                                │
                      METRIK BUAH (Outcome)
           "Berapa banyak kasih yang merembes ke jalanan?"
```

| Parameter Evaluasi | Metrik Tradisional Gerejawi (Output) | Metrik Transformasi Amankarsa (Outcome) |
| :--- | :--- | :--- |
| **Kehadiran** | Jumlah jemaat yang duduk di kursi saat seminar. | Persentase jemaat yang melanjutkan keterlibatan hingga hari ke-14 dan ke-30. |
| **Kepuasan** | Formulir rating bintang pembicara / konsumsi acara. | Perubahan indeks kedamaian batin dan sensitivitas sosial peserta. |
| **Pencapaian Finansial** | Jumlah kolekte/anggaran yang dihabiskan untuk dekorasi. | Jumlah dampak nyata yang tersalurkan kepada penerima manfaat di lapangan. |
| **Dampak Jangka Panjang** | Foto dokumentasi di media sosial setelah acara bubar. | Jumlah tindakan kasih harian yang terintegrasi menjadi gaya hidup permanen. |

---

## 6. MODEL PENATALAYANAN FINANSIAL & KEBERLANJUTAN (KINGDOM STEWARDSHIP)

Untuk menjamin independensi, etika data, dan keberlangsungan jangka panjang tanpa commercial pressure yang merusak nilai spiritual, Amankarsa beroperasi di bawah prinsip penatalayanan Kristen (*Faith-Driven Social Enterprise / Non-Profit Hybrid*).

### 6.1 Struktur Akses & Model Pendanaan
1. **Tier Dasar (Akses Kerajaan Allah - 100% Gratis & Terbuka):**
   * Gratis bagi seluruh pengguna pribadi/jemaat tanpa batas waktu.
   * Akses gratis bagi gereja-gereja kecil, persekutuan kampus, atau perintisan jemaat untuk menggunakan template standar dan melacak hingga 100 peserta aktif per event.
2. **Tier Kemitraan Sinode / Yayasan (Enterprise & Institutional Partnership):**
   * Disediakan bagi gereja berkapasitas besar, lembaga sinode wilayah, atau yayasan sosial yang membutuhkan:
     * Kustomisasi modul perjalanan dengan kurikulum doktrinal internal gereja.
     * Analitik tingkat lanjut multi-cabang/multi-wilayah.
     * Integrasi API ke sistem database keanggotaan gereja yang sudah ada.
   * Dibiayai melalui kontribusi operasional tahunan atau skema kemitraan pelayanan.
3. **Dana Perwalian Pelayanan (Faith-Driven Philanthropy & Grant):**
   * Menerima hibah dari pebisnis dan investor berlandaskan iman (*Kingdom business leaders*) yang memiliki kerinduan melihat pemuridan generasi muda bertransformasi secara digital dan relevan.
4. **Prinsip Etika Finansial:**
   * **Nol Iklan Komersial:** Platform tidak akan pernah memuat iklan produk komersial yang mengganggu ketenangan batin pengguna.
   * **Data Adalah Kudus:** Data perilaku dan refleksi jemaat tidak akan pernah diperjualbelikan kepada pihak ketiga untuk tujuan periklanan apa pun.

---

## 7. MATRIKS TANGGUNG JAWAB PENGEMBANGAN (RACI INITIAL)

| Komponen Sistem | Product / Vision Keeper | Tech / Engineering | Community & Content (Pastoral) |
| :--- | :---: | :---: | :---: |
| **Penetapan Nada Bahasa (*Copywriting*)** | Akuntabel (A) | Pendukung (C) | Pelaksana (R) |
| **Arsitektur Enkripsi Bilik Doa** | Peninjau (C) | Pelaksana & Akuntabel (R/A) | Terinformasi (I) |
| **Kurikulum Template Karsa Awal** | Konsultan (C) | Terinformasi (I) | Pelaksana & Akuntabel (R/A) |
| **Algoritma Pohon Karsa Non-Guilt** | Pelaksana (R) | Pelaksana & Akuntabel (R/A) | Konsultan (C) |
| **Dasbor Analitik Inisiator** | Pelaksana (R) | Pelaksana & Akuntabel (R/A) | Peninjau (C) |

---
*Dokumen ini menjadi acuan baku bagi perancangan Product Requirement Document (PRD), perancangan antarmuka Figma, arsitektur basis data, serta keselarasan pastoral Amankarsa.*
