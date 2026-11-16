/* ============================================================================
 *  app.js — движок лендинга.
 *  Читает site-config.js и строит страницу. ТРОГАТЬ НЕ НУЖНО.
 * ==========================================================================*/

(function () {
  "use strict";

  if (typeof SITE === "undefined") {
    document.body.innerHTML =
      '<p style="padding:40px;font:16px sans-serif;color:#fff;background:#111">' +
      "Не найден site-config.js — он должен лежать рядом с index.html</p>";
    return;
  }

  /* ---------- утилиты ---------------------------------------------------- */

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const escapeHtml = (str) =>
    String(str ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  // переносы строк в тексте -> <br>
  const nl2br = (str) => escapeHtml(str).replace(/\n/g, "<br>");

  /* ---------- линейные иконки (SVG, без эмодзи) ---------- */

  const ICONS = {
  "paw": "<circle cx=\"11\" cy=\"4\" r=\"2\"/><circle cx=\"18\" cy=\"8\" r=\"2\"/><circle cx=\"20\" cy=\"16\" r=\"2\"/><path d=\"M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z\"/>",
  "dog": "<path d=\"M11.25 16.25h1.5L12 17z\"/><path d=\"M16 14v.5\"/><path d=\"M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309\"/><path d=\"M8 14v.5\"/><path d=\"M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5\"/>",
  "cat": "<path d=\"M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z\"/><path d=\"M8 14v.5\"/><path d=\"M16 14v.5\"/><path d=\"M11.25 16.25h1.5L12 17l-.75-.75Z\"/>",
  "rabbit": "<path d=\"M13 16a3 3 0 0 1 2.24 5\"/><path d=\"M18 12h.01\"/><path d=\"M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3\"/><path d=\"M20 8.54V4a2 2 0 1 0-4 0v3\"/><path d=\"M7.612 12.524a3 3 0 1 0-1.6 4.3\"/>",
  "bird": "<path d=\"M16 7h.01\"/><path d=\"M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20\"/><path d=\"m20 7 2 .5-2 .5\"/><path d=\"M10 18v3\"/><path d=\"M14 17.75V21\"/><path d=\"M7 18a6 6 0 0 0 3.84-10.61\"/>",
  "home": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>",
  "camera": "<path d=\"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z\"/><circle cx=\"12\" cy=\"13\" r=\"3\"/>",
  "truck": "<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\"/><path d=\"M15 18H9\"/><path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\"/><circle cx=\"17\" cy=\"18\" r=\"2\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/>",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2\"/><path d=\"M12 20v2\"/><path d=\"m4.93 4.93 1.41 1.41\"/><path d=\"m17.66 17.66 1.41 1.41\"/><path d=\"M2 12h2\"/><path d=\"M20 12h2\"/><path d=\"m6.34 17.66-1.41 1.41\"/><path d=\"m19.07 4.93-1.41 1.41\"/>",
  "heart": "<path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\"/>",
  "send": "<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\"/><path d=\"m21.854 2.147-10.94 10.939\"/>",
  "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"/><path d=\"M2 12h20\"/>",
  "pin": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/>",
  "fish": "<path d=\"M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z\"/><path d=\"M18 12v.5\"/><path d=\"M16 17.93a9.77 9.77 0 0 1 0-11.86\"/><path d=\"M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33\"/><path d=\"M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4\"/><path d=\"m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98\"/>",
  "phone": "<path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\"/>",
  "mail": "<path d=\"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7\"/><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/>",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/>",
  "star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"/>",
  "telegram": "<path d=\"M21.5 3.5 2.8 10.6c-.9.34-.87 1.62.04 1.9l4.6 1.42 1.75 5.2c.27.8 1.3.97 1.82.3l2.44-3.1 4.7 3.44c.7.5 1.68.13 1.87-.72l2.6-14.5c.2-1.06-.86-1.9-1.87-1.54Z\"/><path d=\"m9.2 13.9 8.6-6.2-6.5 7.3\"/>"
};

  const icon = (name, size) =>
    ICONS[name]
      ? '<svg class="ico" width="' + (size || 24) + '" height="' + (size || 24) +
        '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"' +
        ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>'
      : '';

  // значение из конфига: имя иконки -> SVG, старый эмодзи -> как есть
  const glyph = (v, size) => {
    if (!v) return '';
    if (typeof v === 'object') {
      if (v.icon && ICONS[v.icon]) return icon(v.icon, size);
      return glyph(v.emoji, size);
    }
    const key = String(v).trim();
    return ICONS[key] ? icon(key, size) : escapeHtml(key);
  };

  /* ---------- 1. ЦВЕТА / ПЕРЕМЕННЫЕ -------------------------------------- */

  function applyTheme() {
    const palette = (typeof PALETTES !== "undefined" && PALETTES[SITE.palette]) || {};
    const c = Object.assign({}, palette, SITE.colorsOverride || {});
    const mode = (typeof EASY !== "undefined" && EASY.mode) || "dark";
    const a = SITE.animations || {};
    const f = SITE.fonts || {};
    const sh = SITE.shape || {};

    const root = document.documentElement;
    const set = (k, v) => root.style.setProperty(k, v);

    Object.keys(c).forEach((k) => {
      const cssName =
        { bg: "--bg", surface: "--surface", surfaceAlt: "--surface-alt",
          text: "--text", muted: "--muted", border: "--border",
          primary: "--primary", primaryDark: "--primary-dark", accent: "--accent",
          gradientFrom: "--gradient-from", gradientTo: "--gradient-to" }[k] || "--" + k;
      set(cssName, c[k]);
    });

    set("--radius", (sh.radius ?? 18) + "px");
    set("--btn-radius", (sh.buttonRadius ?? 999) + "px");
    set("--anim-duration", (a.duration ?? 700) + "ms");
    set("--anim-dist", (a.distance ?? 40) + "px");
    set("--base-size", f.baseSize ?? 17);
    set("--font-heading", `"${f.heading || "sans-serif"}"`);
    set("--font-body", `"${f.body || "sans-serif"}"`);
    set("--smooth", a.smoothScroll === false ? "auto" : "smooth");

    document.documentElement.dataset.mode = mode;
    if (mode === "light") document.documentElement.style.colorScheme = "light";

    if (!a.enabled) document.body.classList.add("no-anim");
    if (a.smoothScroll === false) document.documentElement.classList.add("no-smooth");

    // шрифты Google
    if (f.google && f.heading) {
      const families = [f.heading, f.body].filter(Boolean).map(
        (name) => "family=" + name.trim().replace(/ /g, "+") + ":wght@400;600;700;800"
      );
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?" + families.join("&") + "&display=swap";
      document.head.appendChild(link);
    }
  }

  /* ---------- 2. МЕТА И ОФОРМЛЕНИЕ --------------------------------------- */

  function applyMeta() {
    const m = SITE.meta || {};
    document.title = m.title || SITE.brand?.name || "Сайт";

    const desc = document.createElement("meta");
    desc.name = "description";
    desc.content = m.description || "";
    document.head.appendChild(desc);

    const viewport = document.createElement("meta");
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1";
    document.head.appendChild(viewport);

    // иконка вкладки из эмодзи
    if (m.emoji) {
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
        `<text y=".9em" font-size="90">${m.emoji}</text></svg>`;
      const ico = document.createElement("link");
      ico.rel = "icon";
      ico.href = "data:image/svg+xml," + encodeURIComponent(svg);
      document.head.appendChild(ico);
    }
  }

  /* ---------- 3. АНИМАЦИИ ПРОКРУТКИ ------------------------------------- */

  let observer = null;

  function revealEngine() {
    const a = SITE.animations || {};
    if (!a.enabled || !("IntersectionObserver" in window)) {
      $$(".reveal").forEach((el) => el.classList.add("is-in"));
      return;
    }

    observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-in");
          obs.unobserve(el);

          // после появления снимаем анимационные стили, чтобы они не мешали
          // наклону карточки за курсором и другим интерактивным эффектам
          const delay = parseFloat(el.style.getPropertyValue("--anim-delay")) || 0;
          const dur = SITE.animations?.duration ?? 700;
          window.setTimeout(() => {
            el.classList.remove("reveal", "is-in");
            el.style.removeProperty("--anim-delay");
            el.style.removeProperty("transform");
          }, delay + dur + 60);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    $$(".reveal").forEach((el) => observer.observe(el));
  }

  // помечает элемент как анимируемый со сдвигом по времени
  const reveal = (el, index = 0, animOverride) => {
    if (!el) return el;
    el.classList.add("reveal");
    el.dataset.anim = animOverride || (SITE.animations?.style ?? "up");
    const stagger = SITE.animations?.stagger ?? 90;
    el.style.setProperty("--anim-delay", (index % 8) * stagger + "ms");
    return el;
  };

  /* ---------- 4. СБОРКА БЛОКОВ ------------------------------------------ */

  const starRow = (n) => {
    const full = Math.max(0, Math.min(5, n));
    let out = "";
    for (let i = 0; i < 5; i++) out += '<span class="star' + (i < full ? " is-on" : "") + '">' + icon("star", 15) + "</span>";
    return out;
  };

  const visual = (image, emoji) =>
    image
      ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">`
      : `<span class="visual__glyph" aria-hidden="true">${glyph(emoji)}</span>`;

  function buildHeader() {
    const b = SITE.brand || {};
    const nav = (SITE.nav || [])
      .map((n) => `<a href="${escapeHtml(n.href)}">${escapeHtml(n.text)}</a>`)
      .join("");

    const header = `
      <div class="container header__inner">
        <a class="logo" href="#top">
          <span class="logo__mark">${glyph(b.logoEmoji, 21)}</span>
          <span>
            <span class="logo__name">${escapeHtml(b.name || "")}</span>
            <span class="logo__slogan">${escapeHtml(b.slogan || "")}</span>
          </span>
        </a>
        <nav class="nav" id="nav">${nav}</nav>
        <a class="btn btn--primary btn--sm header__cta" href="${escapeHtml(SITE.booking?.telegram || "#booking")}" target="_blank" rel="noopener">
          ${icon("telegram", 17)} ${escapeHtml(SITE.booking?.buttonText || "Записаться")}
        </a>
        <button class="burger" id="burger" aria-label="Меню">
          <span></span><span></span><span></span>
        </button>
      </div>`;

    const headerEl = $("#header");
    headerEl.innerHTML = header;
    headerEl.className = "header";
  }

  function buildHero() {
    const h = SITE.hero || {};
    const hero = $("#hero");
    if (!hero) return;

    const isImage = (typeof EASY !== "undefined" && EASY.heroStyle === "image") && h.cardImage;

    hero.innerHTML = `
      <div class="hero__bg" data-parallax="0.5">
        <span class="blob blob--1"></span>
        <span class="blob blob--2"></span>
        <span class="blob blob--3"></span>
      </div>
      <div class="container hero__grid">
        <div class="hero__text">
          <div class="badge"><span class="badge__dot"></span>${escapeHtml(h.badge || "")}</div>
          <h1 class="hero__title">${nl2br(h.title || "")}</h1>
          <p class="hero__subtitle">${escapeHtml(h.subtitle || "")}</p>
          <div class="hero__actions">
            <a class="btn btn--primary" href="${escapeHtml(h.primaryButton?.href || "#booking")}">${escapeHtml(h.primaryButton?.text || "")}</a>
            <a class="btn btn--ghost" href="${escapeHtml(h.secondaryButton?.href || "#services")}">${escapeHtml(h.secondaryButton?.text || "")}</a>
          </div>
        </div>
        <div class="hero__card" data-tilt>
          <div class="float-tag">${escapeHtml(SITE.contacts?.hours?.[0]?.time || "Открыто")}</div>
          <div class="hero__visual">${visual(isImage ? h.cardImage : "", h.cardEmoji)}</div>
          <h3>${escapeHtml(h.cardTitle || "")}</h3>
          <p>${escapeHtml(h.cardNote || "")}</p>
          <div class="chip-row">
            <span class="chip chip--free">10:00</span>
            <span class="chip chip--free">13:00</span>
            <span class="chip">16:00</span>
            <span class="chip">19:00</span>
          </div>
        </div>
      </div>`;
  }

  function buildStats() {
    const box = $("#stats");
    if (!box) return;
    if (typeof EASY !== "undefined" && EASY.showStats === false) { box.remove(); return; }

    box.className = "section";
    box.innerHTML = `
      <div class="container">
        <div class="stats">
          ${(SITE.stats || [])
            .map(
              (s, i) => `
            <div class="stat" data-reveal-index="${i}">
              <div class="stat__value" data-count="${s.value}" data-suffix="${escapeHtml(s.suffix || "")}" data-decimals="${s.decimals || 0}">0</div>
              <div class="stat__label">${escapeHtml(s.label || "")}</div>
            </div>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function buildAbout() {
    const a = SITE.about || {};
    const box = $("#about");
    if (!box) return;

    box.className = "section section--alt";
    box.innerHTML = `
      <div class="container">
        <div class="section-head section-head--center">
          <div class="eyebrow">О нас</div>
          <h2 class="h2">${escapeHtml(a.title || "")}</h2>
          <p class="lead">${escapeHtml(a.subtitle || "")}</p>
        </div>
        <div class="grid grid--4">
          ${(a.features || [])
            .map(
              (f, i) => `
            <article class="card" data-reveal-index="${i}">
              <div class="card__icon">${glyph(f.icon || f.emoji, 22)}</div>
              <h3>${escapeHtml(f.title)}</h3>
              <p>${escapeHtml(f.text)}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function buildServices() {
    const s = SITE.services || {};
    const box = $("#services");
    if (!box) return;

    box.className = "section";
    box.innerHTML = `
      <div class="container">
        <div class="section-head">
          <div class="eyebrow">Прайс</div>
          <h2 class="h2">${escapeHtml(s.title || "")}</h2>
          <p class="lead">${escapeHtml(s.subtitle || "")}</p>
        </div>
        <div class="grid grid--3">
          ${(s.items || [])
            .map(
              (it, i) => `
            <article class="card service" data-reveal-index="${i}">
              ${it.badge ? `<span class="card__tag">${escapeHtml(it.badge)}</span>` : ""}
              <div class="service__top">
                <div class="card__icon">${glyph(it.icon || it.emoji, 22)}</div>
                <div class="service__price">
                  <b>${escapeHtml(it.price || "")}</b>
                  <span class="service__time">${escapeHtml(it.time || "")}</span>
                </div>
              </div>
              <h3>${escapeHtml(it.name)}</h3>
              <p>${escapeHtml(it.text || "")}</p>
            </article>`
            )
            .join("")}
        </div>
        ${s.note ? `<p class="lead" style="margin-top:28px;text-align:center">${escapeHtml(s.note)}</p>` : ""}
      </div>`;
  }

  function buildMasters() {
    const m = SITE.masters || {};
    const box = $("#masters");
    if (!box) return;
    if (!m.items || !m.items.length) { box.remove(); return; }

    box.className = "section section--alt";
    box.innerHTML = `
      <div class="container">
        <div class="section-head section-head--center">
          <div class="eyebrow">Команда</div>
          <h2 class="h2">${escapeHtml(m.title || "")}</h2>
          <p class="lead">${escapeHtml(m.subtitle || "")}</p>
        </div>
        <div class="grid grid--3">
          ${m.items
            .map(
              (p, i) => `
            <article class="card master" data-reveal-index="${i}">
              <div class="master__avatar">${visual(p.image, p.emoji)}</div>
              <h3>${escapeHtml(p.name)}</h3>
              <div class="master__role">${escapeHtml(p.role || "")}</div>
              <p>${escapeHtml(p.text || "")}</p>
            </article>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function buildGallery() {
    const g = SITE.gallery || {};
    const box = $("#gallery");
    if (!box) return;
    if (typeof EASY !== "undefined" && EASY.showGallery === false) { box.remove(); return; }

    box.className = "section";
    box.innerHTML = `
      <div class="container">
        <div class="section-head section-head--center">
          <div class="eyebrow">Портфолио</div>
          <h2 class="h2">${escapeHtml(g.title || "")}</h2>
          <p class="lead">${escapeHtml(g.subtitle || "")}</p>
        </div>
        <div class="grid grid--3">
          ${(g.items || [])
            .map(
              (it, i) => `
            <figure class="gallery__item" data-reveal-index="${i}">
              ${visual(it.image, it.emoji)}
              <figcaption class="gallery__caption">${escapeHtml(it.caption || "")}</figcaption>
            </figure>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function buildTestimonials() {
    const t = SITE.testimonials || {};
    const box = $("#reviews");
    if (!box) return;
    if (typeof EASY !== "undefined" && EASY.showTestimonials === false) { box.remove(); return; }

    box.className = "section section--alt";
    box.innerHTML = `
      <div class="container">
        <div class="section-head section-head--center">
          <div class="eyebrow">Отзывы</div>
          <h2 class="h2">${escapeHtml(t.title || "")}</h2>
          <p class="lead">${escapeHtml(t.subtitle || "")}</p>
        </div>
        <div class="grid grid--3">
          ${(t.items || [])
            .map(
              (r, i) => `
            <article class="card" data-reveal-index="${i}">
              <div class="review__stars">${starRow(r.stars || 5)}</div>
              <p class="review__text">${escapeHtml(r.text)}</p>
              <div class="review__author">
                <div class="review__ava">${escapeHtml((r.name || "?").charAt(0))}</div>
                <div class="review__name">${escapeHtml(r.name)}</div>
              </div>
            </article>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function buildContacts() {
    const c = SITE.contacts || {};
    const box = $("#contacts");
    if (!box) return;

    const map = c.map || {};
    let mapHtml = "";
    if (map.enabled) {
      let src = map.customEmbed;
      if (!src) {
        const d = 0.006 * Math.pow(2, 16 - (map.zoom || 16)) * 3;
        const bbox = [map.lon - d, map.lat - d / 2, map.lon + d, map.lat + d / 2].join(",");
        src =
          `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}` +
          `&layer=mapnik&marker=${map.lat},${map.lon}`;
      }
      mapHtml = `
        <div class="map-wrap">
          <iframe src="${escapeHtml(src)}" height="${map.height || 420}" loading="lazy"
                  title="Карта" referrerpolicy="no-referrer"></iframe>
          <div class="map-pill">${icon("pin", 16)} ${escapeHtml(map.title || c.addressShort || "")}</div>
        </div>`;
    } else {
      mapHtml = `
        <div class="map-wrap" style="min-height:${map.height || 420}px;display:grid;place-items:center;font-size:56px">${icon("pin", 52)}</div>`;
    }

    box.className = "section";
    box.innerHTML = `
      <div class="container">
        <div class="section-head">
          <div class="eyebrow">Контакты</div>
          <h2 class="h2">${escapeHtml(c.title || "")}</h2>
          <p class="lead">${escapeHtml(c.subtitle || "")}</p>
        </div>
        <div class="contacts__grid">
          <div>
            <div class="info-list">
              <div class="info">
                <div class="info__icon">${icon("pin", 19)}</div>
                <div>
                  <div class="info__label">Адрес</div>
                  <div class="info__value">${escapeHtml(c.address || "")}</div>
                </div>
              </div>
              <div class="info">
                <div class="info__icon">${icon("phone", 19)}</div>
                <div>
                  <div class="info__label">Телефон</div>
                  <div class="info__value"><a href="tel:${escapeHtml(c.phoneLink || "")}">${escapeHtml(c.phone || "")}</a></div>
                </div>
              </div>
              <div class="info">
                <div class="info__icon">${icon("mail", 19)}</div>
                <div>
                  <div class="info__label">Почта</div>
                  <div class="info__value"><a href="mailto:${escapeHtml(c.email || "")}">${escapeHtml(c.email || "")}</a></div>
                </div>
              </div>
              <div class="info">
                <div class="info__icon">${icon("clock", 19)}</div>
                <div>
                  <div class="info__label">Часы работы</div>
                  <div class="hours">
                    ${(c.hours || [])
                      .map((h) => `<div class="hours__row"><span>${escapeHtml(h.days)}</span><span>${escapeHtml(h.time)}</span></div>`)
                      .join("")}
                  </div>
                </div>
              </div>
            </div>
            <div class="footer__socials">
              ${(c.socials || [])
                .map((s) => `<a href="${escapeHtml(s.link)}" target="_blank" rel="noopener">${glyph(s.icon || s.emoji, 16)} ${escapeHtml(s.text)}</a>`)
                .join("")}
            </div>
          </div>
          ${mapHtml}
        </div>
      </div>`;
  }

  function buildBooking() {
    const b = SITE.booking || {};
    const box = $("#booking");
    if (!box) return;

    box.className = "section";
    box.innerHTML = `
      <div class="container">
        <div class="cta">
          <h2>${escapeHtml(b.title || "")}</h2>
          <p>${escapeHtml(b.subtitle || "")}</p>
          <div class="cta__action">
            <a class="btn btn--primary" href="${escapeHtml(b.telegram || "#")}" target="_blank" rel="noopener">
              ${icon("telegram", 19)} ${escapeHtml(b.buttonText || "Записаться")}
            </a>
          </div>
          ${b.note ? `<p class="cta__note">${escapeHtml(b.note)}</p>` : ""}
        </div>
      </div>`;
  }

  function buildTgFab() {
    const b = SITE.booking || {};
    if (!b.telegram) return;
    const a = document.createElement("a");
    a.className = "tg-fab";
    a.href = b.telegram;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Записаться в Telegram");
    a.innerHTML = icon("telegram", 24);
    document.body.appendChild(a);
  }

  function buildFooter() {
    const f = SITE.footer || {};
    const c = SITE.contacts || {};
    const box = $("#footer");
    if (!box) return;

    box.className = "footer";
    box.innerHTML = `
      <div class="container footer__inner">
        <div>
          <div>${escapeHtml(f.text || "")}</div>
          ${f.note ? `<div style="opacity:.7;font-size:.84rem;margin-top:4px">${escapeHtml(f.note)}</div>` : ""}
        </div>
        <div class="footer__socials">
          <a href="tel:${escapeHtml(c.phoneLink || "")}">${escapeHtml(c.phone || "")}</a>
          <a href="#top">Наверх ↑</a>
        </div>
      </div>`;
  }

  /* ---------- 5. ПОВЕДЕНИЕ ---------------------------------------------- */

  function initHeader() {
    const header = $("#header");
    const nav = $("#nav");
    const burger = $("#burger");
    const progress = $("#progress");

    burger?.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      document.body.classList.toggle("no-scroll", open);
    });

    nav?.addEventListener("click", (e) => {
      if (e.target.tagName !== "A") return;
      nav.classList.remove("is-open");
      burger?.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    });

    const toTop = document.createElement("button");
    toTop.className = "to-top";
    toTop.setAttribute("aria-label", "Наверх");
    toTop.textContent = "↑";
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(toTop);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        header.classList.toggle("is-stuck", y > 40);
        toTop.classList.toggle("is-visible", y > 600);

        if (progress && SITE.animations?.scrollProgress !== false) {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
        }

        if (SITE.animations?.parallax) {
          const k = SITE.animations.parallaxStrength ?? 0.15;
          $$("[data-parallax]").forEach((el) => {
            const s = parseFloat(el.dataset.parallax) || 1;
            el.style.transform = `translate3d(0, ${y * k * s}px, 0)`;
          });
        }

        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // подсветка активного пункта меню
  function initNavSpy() {
    const links = $$("#nav a");
    if (!links.length || !("IntersectionObserver" in window)) return;
    const sections = links
      .map((a) => ({ a, el: document.querySelector(a.getAttribute("href")) }))
      .filter((x) => x.el);
    if (!sections.length) return;

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((l) => l.classList.remove("is-active"));
          const hit = sections.find((s) => s.el === e.target);
          if (hit) hit.a.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s.el));
  }

  // оживающие цифры
  function initCounters() {
    if (!SITE.animations?.counters) return;
    const nums = $$("[data-count]");
    if (!nums.length) return;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const run = (el) => {
      const target = parseFloat(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || "";
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const dur = 1400;
      const t0 = performance.now();

      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const v = target * easeOut(p);
        el.textContent = v.toFixed(decimals).replace(".", ",") + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }

    const io = new IntersectionObserver(
      (entries, obs) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        run(e.target);
        obs.unobserve(e.target);
      }),
      { threshold: 0.4 }
    );
    nums.forEach((n) => io.observe(n));
  }

  // лёгкий наклон карточки за курсором
  function initTilt() {
    if (typeof window.matchMedia !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ---------- 6. ЗАПУСК -------------------------------------------------- */

  function boot() {
    applyMeta();
    applyTheme();

    buildHeader();
    buildHero();
    buildStats();
    buildAbout();
    buildServices();
    buildMasters();
    buildGallery();
    buildTestimonials();
    buildContacts();
    buildBooking();
    buildFooter();
    buildTgFab();

    // размечаем анимируемые элементы
    $$("section, .section").forEach((sec) => {
      $$(".section-head", sec).forEach((el) => reveal(el, 0));
      const head = $(".section-head", sec);
      const title = head?.querySelector(".h2");
      const eyebrow = head?.querySelector(".eyebrow");

      if (eyebrow) { eyebrow.classList.add("reveal"); eyebrow.dataset.anim = "up"; eyebrow.style.setProperty("--anim-delay", "0ms"); }
      if (title)   { title.classList.add("reveal");   title.dataset.anim = "up";   title.style.setProperty("--anim-delay", "90ms"); }
      const lead = head?.querySelector(".lead");
      if (lead)    { lead.classList.add("reveal");    lead.dataset.anim = "up";    lead.style.setProperty("--anim-delay", "180ms"); }
    });

    $$("[data-reveal-index]").forEach((el) => reveal(el, parseInt(el.dataset.revealIndex, 10) || 0));

    $$(".hero__text > *").forEach((el, i) => reveal(el, i));
    reveal($(".hero__card"), 3, "zoom");
    $$(".info").forEach((el, i) => reveal(el, i, "left"));
    reveal($(".map-wrap"), 1, "zoom");
    reveal($(".cta"), 0, "zoom");
    $$(".footer").forEach((el) => reveal(el, 0));

    revealEngine();
    initHeader();
    initNavSpy();
    initCounters();
    initTilt();

    document.body.classList.add("is-ready");
    document.documentElement.classList.add("loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
