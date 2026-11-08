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

## Revisi 5 poin (7 Nov)
1. Judul hero "CREATE. CONNECT. GROW." sudah rata kiri semua (indent per baris
   dinolkan) dan sisi kanan panggung diisi hero/hero-mockup.jpg. Di bawah
   1100px gambar turun ke bawah judul.
2. Tulisan mepet/terpotong:
   - scroll-margin-top 112px (88px mobile) pada semua section ber-id, supaya
     judul tidak tersembunyi di balik header lengket saat diklik dari menu.
   - Lantai ukuran huruf dinaikkan: semua 8px dan 9px jadi 10px (23 aturan).
     Audit 375-1920px sekarang nol teks di bawah 10px dan nol geser samping.
   - Dekorasi "k." di bagian kontak tadinya #292c25 (sisa palet lama) sehingga
     tampak seperti noda hitam di atas navy; sekarang sky 12%.
3. Tanda kartu yang kaku sudah diganti. Dulu satu panah dan satu bintang padat
   dipakai berulang sebagai cap raksasa; sekarang tiap kartu punya ikon garis
   sendiri dengan ujung membulat:
   - Keunggulan 01 penggeser setelan, 02 bohlam, 03 dua lingkaran bertemu,
     04 tunas. Duduk sebagai lencana 44px di alur kartu, miring sedikit saat
     disorot.
   - Visi mata, Misi bendera; dipasang di kanan atas kartu, disembunyikan di
     bawah 1200px karena kartunya menyempit dan ikon jatuh di belakang teks.
   CATATAN: "emoji logo" saya artikan sebagai tanda hias kartu ini. Kalau yang
   dimaksud logo KIVRA atau hal lain, tinggal bilang.
4. Angka persen sudah hilang dari Intro.tsx; kedua video intro sudah dirender
   ulang (web 72 KB, mobile 65 KB) dan sudah dicek frame per frame.
5. Logo BuihKicks dan GoPreneur masuk ke dinding kolaborasi (kini 5 kotak,
   --total-items ikut jadi 5). Sempat tampil sebesar bintik karena aturan lama
   memberi padding 12% lalu max-height 76px meremas kotak isinya jadi 15px;
   sekarang diatur lewat padding 30%/18% tanpa max-height.

## Sorotan kartu visi & misi (7 Nov)
Kedua kartu berubah jadi navy saat kursor masuk, naik 5px, dan teks kartu misi
dibalik jadi putih (penanda daftar jadi biru laut). Navy dipakai untuk
keduanya: kalau kartu misi diubah jadi biru aksen, warnanya sama persis dengan
kartu visi di sebelahnya dan keduanya melebur jadi satu blok. Dibungkus
@media (hover: hover) and (pointer: fine) supaya di layar sentuh keadaan sorot
tidak nyangkut setelah diketuk, dan geseran 5px mati saat
prefers-reduced-motion. Kontras teks putih di atas navy 10,9:1.

## Judul hero diketik (7 Nov)
"CREATE. CONNECT. GROW." kini muncul huruf demi huruf, 58 ms per huruf (total
sekitar 1,2 detik), dengan kursor biru berkedip yang ikut berjalan lalu hilang
1,8 detik setelah selesai. Dipasang di motion.js sebagai initTypewriter, CSS-nya
di akhir style.css.
- Tiap huruf dibungkus tag kustom <tw-char>, BUKAN <span>, dengan alasan yang
  sama seperti <split-word>: aturan warna aksen menyasar "h1 span"/"h2 span".
- Huruf menempati ruangnya sejak awal (hanya opacity yang berubah), jadi tata
  letak tidak bergeser saat mengetik.
- Aksesibilitas: h1 diberi aria-label "Create. Connect. Grow." yang dirakit
  dari simpul teks saja, jadi label tersembunyi tombol galeri tidak ikut
  terbaca; tiap <tw-char> ditandai aria-hidden supaya tidak dieja satu per satu.
- Tombol galeri hero di dalam baris kedua disembunyikan dan tidak bisa diklik
  sampai ketikan selesai, lalu memudar masuk.
- Mulai setelah video intro ditutup: tes.html mengirim peristiwa
  "kivra:intro-done" di dismissLoadingScreen. Ada jaring pengaman 16 detik
  kalau peristiwa itu tidak pernah datang.
- prefers-reduced-motion: tidak ada pemecahan huruf sama sekali, judul tampil
  utuh seperti semula. Tanpa JavaScript juga tetap utuh karena opacity:0 hanya
  berlaku di bawah html.motion-ready.

## "Cara kerja" sebagai cerita digerakkan scroll (7 Nov)
Garis 2px di atas tiap langkah dipakai ulang jadi bilah kemajuan ala IG/WA
story. Yang mengisinya posisi scroll, bukan pewaktu: bagiannya dipaku (sticky)
selama 226svh dan tiap langkah mendapat satu potong perjalanan itu, jadi
pelanggan tidak bisa melewati prosesnya tanpa melihatnya.
- Lebar bilah dibaca dari --fill yang diisi skrip tanpa transisi, supaya
  menempel pada gerakan roda dan ikut mundur saat digulir balik.
- Faktor (jumlah langkah + 0,5): keempat bilah penuh pada 89% perjalanan, jadi
  ada jeda membaca langkah terakhir sebelum pakunya lepas.
- Celah antar bilah tidak perlu dibuat baru: ::after lama (penyambung 26px
  berwarna --line) digambar di atas bilah, jadi segmennya otomatis terpisah.
- Isi tiap langkah masuk dari bawah saat bilahnya mulai jalan — nomor, judul,
  lalu kalimatnya, beruntun 70 ms. Langkah pertama sudah terbuka sejak bagian
  ini terlihat supaya tidak sempat terlihat kolom kosong.
- Memaku hanya dipakai kalau seluruh isi bagian muat dalam satu layar
  (section.offsetHeight + 40 <= innerHeight). Di layar sempit tingginya ~1195px
  sedangkan layar 844px, jadi di sana jatuh ke mode .is-flow: tiap langkah
  muncul sendiri saat masuk layar, dan bilahnya diberi transisi 760 ms karena
  --fill melompat 0 ke 1.
- Teks tidak pernah diredupkan, hanya belum masuk lalu tetap penuh. Meredupkan
  langkah yang tidak aktif akan membuat --muted di atas putih gagal kontras.
- Semua kelas penyembunyi bergantung pada .is-story yang dipasang skrip, jadi
  tanpa JavaScript atau saat prefers-reduced-motion bagian ini tampil utuh dan
  tidak dipaku.

## Optimalisasi Android & iOS (7 Nov malam)
Diaudit dengan emulasi perangkat Playwright: iPhone SE/13/14 Pro Max, Pixel 7,
Galaxy S5/S9+/Tab S4, pada tes.html, order.html, dan portfolio.html.

1. SOROT YANG NYANGKUT DI LAYAR SENTUH. 51 aturan :hover tidak berpenjaga; di
   ponsel keadaan sorot menempel setelah diketuk sampai pengguna mengetuk
   tempat lain. 39 aturan dibungkus @media (hover: hover) and (pointer: fine),
   3 di antaranya dipecah dulu karena daftar selektornya mencampur :hover
   dengan :focus-visible — kalau ikut dibungkus, fokus papan ketik akan mati.
   Skripnya ada di ~/kivra-tools/hovergate.py (pemindai kedalaman kurung, bukan
   regex). Diverifikasi dengan membandingkan computed style seluruh elemen
   sebelum dan sesudah pada 3 halaman x 3 lebar: hanya beda derau animasi.
   Uji perilaku: ketuk .why-card di Pixel 7 tidak lagi meninggalkan warna
   sorot, sementara hover di desktop tetap bekerja.
2. -webkit-text-size-adjust: 100% pada html. Tanpa ini Safari iOS membesarkan
   teks sendiri saat layar diputar ke lanskap. Mencubit untuk memperbesar
   tetap bisa.
3. .showcase-pin memakai height: 100vh. Di Safari iOS 100vh adalah viewport
   TERBESAR (bilah alamat tersembunyi), jadi isinya tertutup bilah alamat saat
   bilah itu muncul. Diganti 100svh, yang selalu yang terkecil. Satu-satunya
   100vh yang tersisa di berkas; 20 tempat lain sudah pakai svh.
4. Tombol galeri di judul hero hanya 104x36, di bawah batas ketuk 44px.
   Ukurannya tidak dinaikkan karena duduk sebaris dengan judul dan akan
   mendorong tinggi barisnya; wilayah ketuknya diperlebar lewat ::after
   44x44 pada @media (pointer: coarse).
5. UKURAN HURUF. Di ponsel ada 54 elemen di bawah 12px, termasuk tautan footer
   dan keterangan gambar di 10px. Sekarang: kalimat pengantar 13px, tautan
   kontak 15px, tautan footer 13px, label mikro minimum 11px. Tiga label
   (.service-item > span:first-child, .service-benefits > span, .contact
   .eyebrow) harus disebut dengan bentuk selektor yang sama persis karena
   aturan lamanya lebih spesifik. Batas media 900px, bukan 700px, supaya
   Galaxy Tab (712px) dan iPad potret (834px) ikut.
6. MOCKUP HERO MENINDIH BARIS KAKI. .hero-v2-pin dikunci height 100svh dengan
   overflow hidden dan baris kaki diposisikan absolut di dasarnya, sedangkan
   mockup ikut alur normal. Di iPhone SE tumpang tindihnya 75px, Galaxy S9+
   47px, iPhone 13 21px. Padding atas panggung dipangkas dari 17vh ke 8vh
   (sebelumnya menyisakan 199px kosong di atas judul), dan mockup hanya
   ditampilkan kalau layarnya cukup tinggi: @media (max-width: 760px) and
   (min-height: 730px), dibatasi 22svh. Di bawah itu disembunyikan. Diukur
   ulang di enam ponsel: tumpang tindih nol di semuanya.

BELUM DIUJI DI SAFARI SUNGGUHAN. WebKit tidak bisa dipasang di lingkungan ini
(unduhan browser dan registry npm diblokir), jadi emulasi iPhone berjalan di
mesin Chromium. Yang khas iOS di atas (100vh, text-size-adjust, sorot nyangkut,
sasaran ketuk) ditemukan lewat pembacaan kode, bukan uji Safari. Perlu dicoba
sekali di iPhone sungguhan.

Hasil akhir audit: nol geser samping, nol teks di bawah 11px, nol input di
bawah 16px (iOS tidak akan memperbesar sendiri saat formulir disentuh), nol
error JavaScript. Bobot halaman 0,90 / 0,68 / 0,17 MB.

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
