/* ============================================================
   MULTIPLE REMOTES — SOFT UI PORTFOLIO
   Tema (kun/tun), animatsiyalar, soatlar, forma, yordamchilar
   ============================================================ */
(function () {
  "use strict";

  const root = document.documentElement;
  const metaTheme = document.getElementById("metaTheme");

  /* ---------- 1. TEMA (KUN / TUN) ---------- */
  const THEME_KEY = "mr-theme";
  const THEME_COLORS = { light: "#E4F0FB", dark: "#0D1A33" };

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* no-op */ }
    if (metaTheme) metaTheme.setAttribute("content", THEME_COLORS[theme] || THEME_COLORS.light);
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) { /* no-op */ }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : (prefersDark ? "dark" : "light"));

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }

  /* ---------- 2. HEADER: scroll effekti ---------- */
  const header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- 3. MOBILE NAV ---------- */
  const burger = document.getElementById("navBurger");
  const mainNav = document.getElementById("mainNav");

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger && mainNav) {
    burger.addEventListener("click", function () {
      const open = document.body.classList.toggle("nav-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("click", function (e) {
      if (!document.body.classList.contains("nav-open")) return;
      if (!mainNav.contains(e.target) && !burger.contains(e.target)) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- 4. ACTIVE NAV LINK (scroll-spy) ---------- */
  const navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (sec) { spy.observe(sec); });
  }

  /* ---------- 5. REVEAL (scroll animatsiyasi) ---------- */
  const revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 6. STAT COUNTERS ---------- */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute("data-count") || "0");
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals).replace(".", ",") + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals).replace(".", ",") + suffix;
    }
    requestAnimationFrame(tick);
  }

  const statNums = Array.prototype.slice.call(document.querySelectorAll(".stat-num"));
  if ("IntersectionObserver" in window) {
    const statObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statNums.forEach(function (el) { statObs.observe(el); });
  } else {
    statNums.forEach(animateCounter);
  }

  /* ---------- 7. VAQT MINTAQALARI SOATLARI ---------- */
  const tzEls = Array.prototype.slice.call(document.querySelectorAll("[data-tz]"));

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function updateClocks() {
    const now = new Date();
    tzEls.forEach(function (el) {
      const zone = el.getAttribute("data-tz");
      try {
        const parts = new Intl.DateTimeFormat("en-GB", {
          timeZone: zone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }).formatToParts(now);
        let h = "00", m = "00", s = "00";
        parts.forEach(function (pt) {
          if (pt.type === "hour") h = pt.value;
          if (pt.type === "minute") m = pt.value;
          if (pt.type === "second") s = pt.value;
        });
        if (h === "24") h = "00";
        el.textContent = h + ":" + m + ":" + s;
      } catch (e) {
        el.textContent = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
      }
    });
  }

  if (tzEls.length) {
    updateClocks();
    setInterval(updateClocks, 1000);
  }

  /* ---------- 8. TOAST ---------- */
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 4600);
  }

  /* ---------- 9. CONTACT FORMA ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = (form.querySelector("#cName").value || "").trim();
      const email = (form.querySelector("#cEmail").value || "").trim();
      const msg = (form.querySelector("#cMsg").value || "").trim();

      if (!name) {
        showToast("Iltimos, ismingizni kiriting.");
        form.querySelector("#cName").focus();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        showToast("Iltimos, to'g'ri email manzilini kiriting.");
        form.querySelector("#cEmail").focus();
        return;
      }
      if (msg.length < 10) {
        showToast("Loyiha haqida kamida bir-ikki gap yozib qoldiring.");
        form.querySelector("#cMsg").focus();
        return;
      }

      showToast("Rahmat, " + name + "! So'rovingiz qabul qilindi — 24 soat ichida javob beramiz.");
      form.reset();
    });
  }

  /* ---------- 10. YIL AVTOMAT ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
