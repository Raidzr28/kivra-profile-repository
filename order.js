/* Form hire berbasis objek. Langkah 01 memilih "objek" proyek; langkah 02 hanya
   menampilkan field milik objek itu, sehingga pengunjung tidak melihat
   pertanyaan yang tidak relevan dengan proyeknya. Field yang tersembunyi juga
   di-disable agar tidak ikut terkirim dan mengotori email masuk. */
(() => {
  const form = document.getElementById("order-form");
  if (!form) return;

  const detail = document.getElementById("step-detail");
  const echo = form.querySelector(".order-object-echo");
  const summaryList = document.getElementById("order-summary-list");
  const scoped = Array.from(form.querySelectorAll("[data-for]"));
  const radios = Array.from(form.querySelectorAll('input[name="project_type"]'));

  const labelOf = (field) => {
    const span = field.querySelector("span");
    return span ? span.textContent.replace("*", "").trim() : "";
  };

  const applyObject = (key) => {
    scoped.forEach((field) => {
      const on = field.dataset.for === key;
      field.hidden = !on;
      field.querySelectorAll("input, select, textarea").forEach((el) => {
        el.disabled = !on;
        if (!on) el.selectedIndex = 0;
      });
    });
    detail.classList.toggle("is-locked", !key);
  };

  const renderSummary = () => {
    const picked = radios.find((r) => r.checked);
    const rows = [];
    if (picked) {
      rows.push(["Jenis proyek", picked.value.replace("&amp;", "&")]);
      form.querySelectorAll(".order-field:not([hidden])").forEach((field) => {
        const el = field.querySelector("select");
        if (el && !el.disabled && el.value) rows.push([labelOf(field), el.value]);
      });
    }
    if (!rows.length) {
      summaryList.innerHTML =
        '<div class="order-summary-empty"><span>Belum ada pilihan. Mulai dari langkah 01.</span></div>';
      return;
    }
    summaryList.innerHTML = rows
      .map(
        ([k, v]) =>
          `<div class="order-summary-row"><dt>${k}</dt><dd>${v}</dd></div>`
      )
      .join("");
  };

  radios.forEach((radio) =>
    radio.addEventListener("change", () => {
      applyObject(radio.dataset.object);
      if (echo) echo.textContent = radio.value.replace("&amp;", "&").toLowerCase();
      renderSummary();
      detail.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );

  form.addEventListener("change", (event) => {
    if (event.target.matches("select")) renderSummary();
  });

  // kondisi awal: belum ada objek terpilih, jadi semua field khusus disembunyikan
  applyObject(null);
  renderSummary();
})();
