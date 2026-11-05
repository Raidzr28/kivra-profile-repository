# KIVRA Digital — status pekerjaan

Terakhir diperbarui: 2026-11-05 (revisi 6 poin)

## Sudah selesai
- Rebrand KREOVA -> KIVRA Digital di tes.html, portfolio.html, order.html, style.css.
- Logo: Logo-kivra.png (transparan, sudah terpangkas).
  Logo-kivra-transparent.png kini duplikat identik dan boleh dihapus.
- Warna aksen: biru #323afd (diambil dari logo), menggantikan oranye #f47721.
- Layanan: KINI 2 (Website Development, UI/UX Design). Endorsement & KOL dihapus
  pada 2026-11-05 saat pivot ke fokus web.
- Slider Karya: 23 -> 10 -> KINI 5 slide (video hero + 4 layar Shana Studio). Busur Kolaborasi: 11 -> 4 item, tinggi scroll
  proporsional lewat calc(100svh + (var(--total-items) - 1) * 20svh).
- Form hire (order.html) berbasis objek; logika di order.js.
- Loading screen bermerek KIVRA: "loading screen/kivra-intro-web.mp4" dan
  "kivra-intro-mobile.mp4".
- Elemen motion (motion.js): transisi antar halaman, judul masuk per kata,
  parallax, kursor kustom + tombol magnetik, pemutar pita loop.
- Pita tipografi "loading screen/kivra-band.mp4" sebelum bagian kontak.
- Komposisi Remotion: src/Intro.tsx dan src/WordLoop.tsx, terdaftar di Root.tsx.
- Audit kompatibilitas Safari: jalur fallback diuji (tanpa View Transitions
  navigasi tetap jalan dengan fade; tanpa color-mix kursor tetap berwarna;
  di pointer sentuh kursor kustom tidak dipasang). Atribut muted/playsinline
  lengkap di semua video.
- Pembersihan file: placeholder/brand-logos, placeholder/pin-portfolio,
  placeholder/portfolio dan 3 video loading lama DIHAPUS (~10 MB).
  placeholder/hero/ SENGAJA DIPERTAHANKAN karena masih dipakai galeri hero.

## Pivot web-only (2026-11-05)
Dihapus dari situs:
- tes.html: kartu layanan Endorsement & KOL, seluruh section #talent (7 foto),
  link nav "Talent", kata fokus "TALENT KREATIF" di hero, 5 slide non-web di
  slider Karya, dan ~51 baris JavaScript mati milik talent-stack.
- portfolio.html: segmen #social-media, #creative-content, #talent-kol beserta
  link nav dan jump link-nya. Tersisa satu segmen: #web-uiux (6 kartu).
- order.html: opsi "Endorsement & KOL" dan 3 field khususnya.

BELUM disesuaikan (perlu keputusan pemilik):
- Visi & misi masih berbunyi "membuka ruang bagi talenta muda" (3 tempat di
  tes.html baris ~216, 222, 234). Ini pernyataan visi perusahaan, bukan layanan,
  jadi sengaja tidak diubah sepihak.
- Section Kolaborasi masih menampilkan BuihKicks, BCS Sentul, dan Alin Nur
  Jannah — klien social media/talent, bukan klien web.

## Revisi 6 poin (2026-11-05 siang)
1. Fokus website — sudah, lihat bagian pivot di atas.
2. Beranda mengikuti pola referensi (gosocial, resolusiweb, kitaweb):
   ditambah 4 bagian baru — Jenis website + yang didapat, Cara kerja
   (Discover/Plan/Create/Deliver), Biaya (tanpa angka, mengarah ke konsultasi),
   dan Pertanyaan umum (6 soal). Penomoran bagian dirapikan jadi 01-10.
   Video hero diganti galeri 5 bingkai: 3 panel SVG buatan sendiri di folder
   hero/ (wireframe -> struktur -> warna merek) lalu 2 tangkapan nyata Shana
   Studio (beranda dan halaman pemesanan). Rangkaiannya menceritakan cara kerja
   agensi dan berakhir pada karya sungguhan, bukan antarmuka abstrak.
   hero-04-jadi.svg masih ada di folder tapi TIDAK dipakai — kalau mau kembali
   memakai panel abstrak sebagai penutup, tinggal disisipkan lagi.
   Jeda pergantian bingkai dirapatkan 3600ms -> 2600ms karena bingkainya
   bertambah, supaya putaran penuh muat dalam waktu pengunjung di area hero.
   object-fit galeri hero diubah cover -> contain supaya komposisi tidak
   terpotong di layar jangkung.
3. Tombol WhatsApp mengambang di 3 halaman. NOMOR BELUM DIISI: cari
   NOMOR_ADMIN di tes.html, portfolio.html, order.html.
4. Screenshot Shana versi laptop: SELESAI. Kelima slide kini lanskap desktop.
   - slide 02 shana-desktop-01-beranda.jpg 1600x789, bingkai .is-wide 2:1
     (dari screenshot retina milik pengguna, dipotong otomatis)
   - slide 03-05 shana-desktop-02..04 masing-masing 800x500 rasio 1.60,
     pas dengan bingkai showcase bawaan 16/10 (diambil lewat browser pane,
     resolusinya terbatas 800x500 — lebih lembut dari yang pertama).
   Enam kartu Shana di portfolio.html MASIH memakai tangkapan HP potret.
5. Palet: --accent #373ffd, --sky #60c1e5, --ink #1b365d, --paper #ffffff.
   26 abu kehijauan sisa desain lama diganti netral bernuansa navy.
   Uji kontras: #60c1e5 di atas putih hanya 2,05 (jangan untuk teks);
   #373ffd di atas navy hanya 1,90, jadi 9 aturan di bidang gelap dialihkan
   ke --sky.
6. Font League Spartan via Google Fonts di 3 halaman. Karena tidak condensed
   seperti Arial Narrow, batas bawah ukuran judul kontak diturunkan dan ruang
   descender pembungkus kata dinaikkan 0.12em -> 0.24em.

## Optimisasi mobile (2026-11-05 siang)
Diaudit di 390px dan 360px, lalu diperbaiki:
- Zoom otomatis iOS: 17 kolom isian di order.html di bawah 16px. Safari iOS
  memperbesar halaman saat kolom di bawah 16px disentuh dan tidak
  mengembalikannya. Semua isian dinaikkan ke 16px.
- Sasaran sentuh: dari 9 jadi 1 di beranda, 0 di portfolio. Tombol menu
  sebelumnya hanya 25x25 padahal itu navigasi utama mobile; kini 44x44 lewat
  padding, tampilannya tidak berubah. Sisa satu: .hero-chip 104x36, tombol
  kecil di dalam judul hero — memperbesarnya akan menggeser baris judul.
- Teks terlalu kecil: dari 58 temuan jadi 0 di bawah 10px. Kalimat yang harus
  dibaca (deskripsi layanan, benefit, FAQ) dulu 8-9px, kini 12px. Label
  bertracking dibiarkan 11px.
- Tombol WhatsApp menutupi kolom "Estimasi budget" di order.html. Disembunyikan
  di halaman itu lewat body.order-page, karena halamannya sudah punya panel
  kontak admin sendiri.
- Logo: 1013x315 PNG 70 KB padahal tampil maksimal 170px. Dikecilkan ke 480px
  (masih 2x untuk retina) jadi 20 KB. Versi penuh tetap ada di
  remotion-intro/public/ untuk render video.
- Bug yang ketahuan saat audit: thumbnail slider pertama masih menunjuk
  shana-01-paket.jpg dan keempat aria-label-nya tidak sinkron dengan slide.
  Sudah diselaraskan.
Beban halaman mobile: beranda 0.69 MB, portfolio 0.67 MB, order 0.15 MB.
Hero.mp4 6 MB TIDAK ikut terunduh karena preload=metadata.
Luberan horizontal yang terdeteksi audit semuanya sudah terpotong induknya;
scrollWidth tetap sama dengan lebar layar, jadi tidak ada geser samping.

## Belum selesai
0. Nomor WhatsApp admin belum diisi (placeholder NOMOR_ADMIN di 3 halaman).
0b. Kartu Shana di portfolio.html masih tangkapan HP. Kalau mau seragam
    dengan beranda, ganti ke shana-desktop-*.jpg.
0d. Tiga tangkapan desktop (slide 03-05) hanya 800x500 karena panel browser
    membatasi resolusi. Kalau ingin setajam slide 02, tangkap sendiri di Mac
    dengan Cmd+Shift+4 lalu spasi, lalu kirim — saya potong dan pasang.
0c. Isi FAQ dan daftar "sudah termasuk" masih draf: cek sendiri soal domain
    atas nama klien, satu sesi pelatihan, dan masa dukungan sebelum tayang.
1. Masih ada file tak terpakai yang sengaja tidak dihapus (~5,9 MB):
   - foto portofolio/Hero/hero social media/ (6 file, 5,2 MB) — foto klien asli
   - foto portofolio/web porto/*.jpeg asli WhatsApp (8 file, 676 KB)
     Salah satunya memuat email pribadi; sudah ada salinan bernama rapi.
2. Pengujian di Safari sungguhan (bukan simulasi) belum dilakukan.
3. graphify-out/graph.html masih menyebut Kreova (laporan analisis, bukan situs).

## Cara render ulang video (di Mac, bukan di sesi Claude)
    cd ~/Desktop/tes/remotion-intro
    npx remotion render IntroDesktop "../loading screen/kivra-intro-web.mp4"
    npx remotion render IntroMobile  "../loading screen/kivra-intro-mobile.mp4"
    npx remotion render WordLoop     "../loading screen/kivra-band.mp4"

## Catatan teknis
- Pembungkus kata memakai tag kustom <split-word> dan <split-word-inner>,
  BUKAN <span>. Disengaja: banyak aturan CSS menyasar "h2 span" untuk warna
  aksen, dan span pembungkus akan ikut terkena sehingga seluruh judul berubah
  warna. Jangan ganti kembali ke span.
- Semua efek motion mati saat prefers-reduced-motion: reduce.
- Backup bertanda waktu ada di berkas *.bak-* di folder ini.
