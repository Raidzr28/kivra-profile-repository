# KIVRA Digital — status pekerjaan

Terakhir diperbarui: 2026-11-05 (pivot web-only)

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
