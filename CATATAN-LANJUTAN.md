# KIVRA Digital — status pekerjaan

Terakhir diperbarui: 2026-11-05

## Sudah selesai
- Rebrand KREOVA -> KIVRA Digital di tes.html, portfolio.html, order.html, style.css.
- Logo: Logo-kivra.png (transparan, sudah terpangkas).
  Logo-kivra-transparent.png kini duplikat identik dan boleh dihapus.
- Warna aksen: biru #323afd (diambil dari logo), menggantikan oranye #f47721.
- Layanan dipangkas jadi 3: Website Development, UI/UX Design, Endorsement & KOL.
- Slider Karya: 23 -> 10 slide. Busur Kolaborasi: 11 -> 4 item, tinggi scroll
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

## Belum selesai
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
