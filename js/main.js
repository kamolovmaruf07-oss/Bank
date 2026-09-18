/* ============================================================
   NovaBank — Soft UI interactions
   ============================================================ */
"use strict";

/* ---------- 1. Theme (Tun / Kun) ---------- */
const htmlEl = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const THEME_KEY = "novabank-theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  htmlEl.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

setTheme(getPreferredTheme());

themeToggle.addEventListener("click", () => {
  const next = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(next);
});

// Follow OS changes only if user hasn't chosen manually
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!localStorage.getItem(THEME_KEY)) setTheme(e.matches ? "dark" : "light");
});

/* ---------- 2. Preloader ---------- */
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("preloader").classList.add("hide"), 450);
});

/* ---------- 3. Header shadow on scroll ---------- */
const header = document.getElementById("header");
const totop = document.getElementById("totop");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
  totop.classList.toggle("show", window.scrollY > 600);
}, { passive: true });

totop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- 4. Mobile menu ---------- */
const burger = document.getElementById("burger");
const navMenu = document.getElementById("navMenu");

burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  navMenu.classList.toggle("open");
});

navMenu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    burger.classList.remove("open");
    navMenu.classList.remove("open");
  })
);

/* ---------- 5. Scroll reveal + bars + counters (single observer) ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");

      el.querySelectorAll(".bar__fill").forEach((bar) => {
        bar.style.width = bar.dataset.width;
      });

      el.querySelectorAll(".counter").forEach(runCounter);
      if (el.classList.contains("counter")) runCounter(el);

      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// counters not inside .reveal containers (hero stats, band)
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll(".counter").forEach(runCounter);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);
document.querySelectorAll(".hero__stats, .band").forEach((el) => counterObserver.observe(el));

function runCounter(el) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Bars may live inside .reveal — but also as standalone
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll(".bar__fill").forEach((bar) => {
        bar.style.width = bar.dataset.width;
      });
      barObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);
document.querySelectorAll(".bars").forEach((el) => barObserver.observe(el));

/* ---------- 6. Tilt effect on image frames ---------- */
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".tilt").forEach((card) => {
    const MAX = 7; // deg
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -MAX;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * MAX;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)";
    });
  });
}

/* ---------- 7. Bank card — tap flip (mobile) ---------- */
const bankcard = document.getElementById("bankcard");
if (bankcard) {
  bankcard.addEventListener("click", () => bankcard.classList.toggle("flipped"));
}

/* ---------- 8. Active nav link highlighting ---------- */
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav__link")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

/* ---------- 9. Contact form ---------- */
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();

  if (!name || !phone) {
    formNote.style.color = "#e11d48";
    formNote.textContent = "⚠️ Iltimos, ism va telefon raqamini kiriting.";
    return;
  }

  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.textContent = "Yuborilmoqda…";

  setTimeout(() => {
    formNote.style.color = "";
    formNote.textContent = `✅ Rahmat, ${name}! Mutaxassisimiz tez orada qo'ng'iroq qiladi.`;
    btn.disabled = false;
    btn.textContent = "Yuborish 🚀";
    form.reset();
  }, 900);
});

/* ---------- 10. Smooth anchors offset (fixed header) ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});
