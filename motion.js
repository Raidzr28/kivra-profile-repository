/* Elemen motion pendukung KIVRA Digital.
   Ditulis vanilla tanpa dependensi, mengikuti gaya nav.js dan skrip inline
   yang sudah ada: IntersectionObserver untuk pemicu, requestAnimationFrame
   untuk hal yang mengikuti scroll, dan semuanya mati total kalau pengguna
   meminta gerakan dikurangi.

   Empat bagian:
     1. Transisi antar halaman (View Transitions API, dengan fallback)
     2. Judul yang masuk per kata
     3. Parallax pada gambar
     4. Kursor kustom dan tombol magnetik
*/
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const onScreen = (el, cb, opts) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          cb(e.target);
          io.unobserve(e.target);
        }
      });
    }, opts || { rootMargin: "0px 0px -12% 0px", threshold: 0.1 });
    io.observe(el);
    return io;
  };

  /* ------------------------------------------------------------------ 1
     Transisi antar halaman.

     Browser yang mendukung View Transitions mendapat cross-fade bawaan;
     sisanya mendapat fade manual. Link eksternal, unduhan, anchor dan klik
     dengan modifier dibiarkan apa adanya agar perilaku browser tidak hilang. */
  const initPageTransition = () => {
    if (reduced.matches) return;
    const root = document.documentElement;
    root.classList.add("page-enter");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("page-enter")),
    );

    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;

      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      // anchor di halaman yang sama tetap memakai scroll halus bawaan
      if (url.pathname === location.pathname && url.hash) return;

      event.preventDefault();
      const go = () => (location.href = url.href);

      if (document.startViewTransition) {
        // dokumen akan diganti browser; snapshot lama tetap terlihat saat fade
        root.classList.add("page-leave");
        document.startViewTransition(() => new Promise(() => go()));
        return;
      }
      root.classList.add("page-leave");
      setTimeout(go, 260);
    });

    // kembali dari bfcache: pastikan halaman tidak tertinggal dalam keadaan pudar
    window.addEventListener("pageshow", (e) => {
      if (e.persisted) root.classList.remove("page-leave");
    });
  };

  /* ------------------------------------------------------------------ 2
     Judul masuk per kata.

     Judul dipecah jadi <span> per kata, masing-masing dengan jeda bertingkat.
     Teks asli disimpan di aria-label supaya pembaca layar tetap membacanya
     sebagai satu kalimat utuh, bukan deretan potongan. */
  const splitHeading = (el) => {
    if (el.dataset.splitDone) return;
    const full = el.textContent.replace(/\s+/g, " ").trim();
    if (!full) return;

    let index = 0;
    // Judul sering memuat <span> berwarna aksen. Rekursi ini mempertahankan
    // elemen pembungkusnya dan hanya memecah simpul teks, supaya penataan
    // warna dan struktur aslinya tidak hilang.
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          if (!text.trim()) return;
          const frag = document.createDocumentFragment();
          const parts = text.split(/(\s+)/);
          parts.forEach((part) => {
            if (!part) return;
            if (!part.trim()) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            const outer = document.createElement("split-word");
            const inner = document.createElement("split-word-inner");
            inner.style.setProperty("--word-index", String(index++));
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.tagName === "BR") return;
          walk(child);
        }
      });
    };
    walk(el);
    if (!index) return;

    el.dataset.splitDone = "true";
    // potongan kata dibaca sebagai satu kalimat utuh oleh pembaca layar
    el.setAttribute("aria-label", full);
    el.querySelectorAll("split-word").forEach((w) => w.setAttribute("aria-hidden", "true"));
    onScreen(el, (t) => t.classList.add("is-split-in"));
  };

  const initSplitText = () => {
    if (reduced.matches) return;
    document.querySelectorAll("[data-split]").forEach(splitHeading);
  };

  /* ------------------------------------------------------------------ 3
     Parallax.

     Hanya elemen yang sedang terlihat yang ikut dihitung, dan pembaruan
     posisi dikunci ke satu frame lewat rAF, supaya handler scroll tidak
     menumpuk pekerjaan layout. */
  const initParallax = () => {
    if (reduced.matches) return;
    const items = [...document.querySelectorAll("[data-parallax]")];
    if (!items.length) return;

    const live = new Set();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => (e.isIntersecting ? live.add(e.target) : live.delete(e.target))),
      { rootMargin: "20% 0px" },
    );
    items.forEach((el) => io.observe(el));

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      live.forEach((el) => {
        const depth = parseFloat(el.dataset.parallax) || 0.12;
        const rect = el.getBoundingClientRect();
        // -1 di atas layar, 0 di tengah, 1 di bawah layar
        const pos = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        el.style.setProperty("--parallax-y", `${(pos * depth * 100).toFixed(2)}px`);
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  };

  /* ------------------------------------------------------------------ 4
     Kursor kustom dan tombol magnetik.

     Hanya untuk perangkat dengan pointer presisi; di layar sentuh seluruh
     bagian ini tidak pernah dipasang. Kursor asli tidak disembunyikan di
     luar area karya, supaya tidak ada yang kehilangan penunjuknya. */
  const initCursor = () => {
    if (reduced.matches || !finePointer.matches) return;

    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    dot.innerHTML = '<span class="cursor-dot-label"></span>';
    document.body.appendChild(dot);

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf = 0;

    const loop = () => {
      // lerp: kursor menyusul pointer, memberi bobot pada gerakannya
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = Math.abs(x - cx) > 0.1 || Math.abs(y - cy) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    document.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        dot.classList.add("is-live");
        kick();
      },
      { passive: true },
    );
    document.addEventListener("pointerleave", () => dot.classList.remove("is-live"));

    // area yang memunculkan label pada kursor
    document.querySelectorAll("[data-cursor]").forEach((zone) => {
      zone.addEventListener("pointerenter", () => {
        dot.classList.add("is-zoom");
        dot.querySelector(".cursor-dot-label").textContent = zone.dataset.cursor || "";
      });
      zone.addEventListener("pointerleave", () => {
        dot.classList.remove("is-zoom");
        dot.querySelector(".cursor-dot-label").textContent = "";
      });
    });

    // tombol magnetik: bergeser sedikit ke arah pointer, kembali saat lepas
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.setProperty("--magnet-x", `${dx.toFixed(1)}px`);
        el.style.setProperty("--magnet-y", `${dy.toFixed(1)}px`);
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--magnet-x", "0px");
        el.style.setProperty("--magnet-y", "0px");
      });
    });
  };

  /* ------------------------------------------------------------------ 5
     Klip pita bermotion.

     Hanya diputar saat benar-benar terlihat, supaya tidak ada dekoder video
     berjalan di latar sepanjang halaman; dan tidak pernah diputar kalau
     pengguna meminta gerakan dikurangi. */
  const initLoopVideos = () => {
    const clips = [...document.querySelectorAll("[data-motion-loop]")];
    if (!clips.length) return;
    if (reduced.matches) {
      clips.forEach((v) => {
        v.removeAttribute("loop");
        v.pause();
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target;
          if (e.isIntersecting) {
            if (v.preload === "none") v.preload = "auto";
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }),
      { rootMargin: "100px 0px" },
    );
    clips.forEach((v) => io.observe(v));
  };

  /* ------------------------------------------------------------------ 6
     Tombol mengambang WhatsApp.

     Disembunyikan sampai pengunjung melewati tinggi satu layar, supaya tampilan
     pertama tetap bersih. Nomor dibaca dari atribut data-wa pada elemen itu
     sendiri, jadi menggantinya cukup di HTML tanpa menyentuh berkas ini. */
  const initWhatsApp = () => {
    const btn = document.querySelector(".wa-float");
    if (!btn) return;

    const show = () => btn.classList.toggle("is-ready", window.scrollY > window.innerHeight * 0.6);
    show();
    window.addEventListener("scroll", show, { passive: true });
  };

  /* ------------------------------------------------------------------ 7
     Judul hero diketik.

     "CREATE. CONNECT. GROW." muncul huruf demi huruf dengan kursor berkedip.
     Tiap huruf dibungkus tag kustom <tw-char> (bukan <span>) karena banyak
     aturan CSS di berkas ini menyasar "h1 span" dan "h2 span"; span pembungkus
     akan ikut terkena. Teks utuh tetap ada di DOM dan dipasang sebagai
     aria-label pada h1, sedangkan tiap <tw-char> ditandai aria-hidden supaya
     pembaca layar tidak mengejanya satu per satu. Tombol galeri di dalam baris
     kedua tidak disentuh, hanya disembunyikan sampai pengetikan selesai.

     Mulai setelah video intro ditutup, karena judulnya tertutup layar
     pembuka. Kalau peristiwa itu tidak pernah datang (video gagal, atau
     pengguna menutup tab lalu kembali), ada jaring pengaman 16 detik. */
  const initTypewriter = () => {
    const headline = document.querySelector(".hero-headline");
    if (!headline) return;
    const lines = Array.prototype.slice.call(headline.querySelectorAll(".hl-line"));
    if (!lines.length) return;

    // hanya simpul teks: label tersembunyi pada tombol galeri tidak ikut
    const lineText = (line) =>
      Array.prototype.slice
        .call(line.childNodes)
        .filter((node) => node.nodeType === 3)
        .map((node) => node.textContent)
        .join("")
        .replace(/\s+/g, " ")
        .trim();
    headline.setAttribute("aria-label", lines.map(lineText).filter(Boolean).join(" "));

    if (reduced.matches) return;

    const cells = [];
    lines.forEach((line) => {
      line.removeAttribute("data-reveal");
      line.classList.add("is-revealed");
      Array.prototype.slice.call(line.childNodes).forEach((node) => {
        if (node.nodeType === 3) {
          const frag = document.createDocumentFragment();
          Array.from(node.textContent).forEach((character) => {
            const cell = document.createElement("tw-char");
            cell.setAttribute("aria-hidden", "true");
            cell.textContent = character;
            frag.appendChild(cell);
            cells.push(cell);
          });
          line.replaceChild(frag, node);
        } else if (node.nodeType === 1) {
          node.classList.add("tw-late");
        }
      });
    });

    if (!cells.length) return;

    const caret = document.createElement("tw-caret");
    caret.setAttribute("aria-hidden", "true");
    cells[0].before(caret);
    headline.classList.add("is-typing");

    const STEP = 58;
    let index = 0;
    let previous = 0;
    let started = false;

    const tick = (now) => {
      if (!previous) previous = now;
      if (now - previous >= STEP) {
        previous = now;
        const cell = cells[index];
        cell.classList.add("is-typed");
        cell.after(caret);
        index += 1;
      }
      if (index < cells.length) {
        requestAnimationFrame(tick);
        return;
      }
      headline.classList.remove("is-typing");
      headline.classList.add("is-typed");
      window.setTimeout(() => caret.remove(), 1800);
    };

    const begin = () => {
      if (started) return;
      started = true;
      requestAnimationFrame(tick);
    };

    const loadingScreen = document.querySelector("#loading-screen");
    if (loadingScreen && !loadingScreen.hidden) {
      document.addEventListener("kivra:intro-done", () => window.setTimeout(begin, 240), {
        once: true,
      });
      window.setTimeout(begin, 16000);
    } else {
      window.setTimeout(begin, 240);
    }
  };

  const start = () => {
    initPageTransition();
    initSplitText();
    initParallax();
    initCursor();
    initLoopVideos();
    initWhatsApp();
    initTypewriter();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
