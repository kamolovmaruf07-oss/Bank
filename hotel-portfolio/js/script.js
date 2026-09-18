/* ============================================================
   OLTIN BULOQ HOTEL — SOFT UI
   Tema (kun/tun), animatsiyalar, forma, yordamchilar
   ============================================================ */
(function () {
  "use strict";

  const root = document.documentElement;
  const metaTheme = document.getElementById("metaTheme");

  /* ---------- 1. TEMA (KUN / TUN) ---------- */
  const THEME_KEY = "ob-theme";
  const THEME_COLORS = { light: "#FBF1D9", dark: "#171208" };

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

  /* ---------- 2. HEADER: scroll efekti ---------- */
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
      el.textContent = value.toFixed(decimals).replace(".", ",") + (p === 1 ? suffix : (decimals ? "" : ""));
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

  /* ---------- 7. TOAST ---------- */
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 4200);
  }

  /* ---------- 8. XONA TANLASH (kartadan formaga) ---------- */
  const roomSelect = document.getElementById("bRoom");
  const bookingSection = document.getElementById("band");

  document.querySelectorAll(".room-select").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const room = btn.getAttribute("data-room");
      if (roomSelect) roomSelect.value = room;
      if (bookingSection) bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      const nameMap = { standart: "Standart xona", deluks: "Delüks xona", president: "President suiti" };
      showToast("Xona tanlandi: " + (nameMap[room] || room) + ". So'rovingizni rasmiylashtiring!");
      setTimeout(function () {
        const nameInput = document.getElementById("bName");
        if (nameInput) nameInput.focus({ preventScroll: true });
      }, 700);
    });
  });

  /* ---------- 9. SANALAR (min = bugun) ---------- */
  const inDate = document.getElementById("bIn");
  const outDate = document.getElementById("bOut");
  if (inDate && outDate) {
    const today = new Date();
    const iso = function (d) {
      return d.toISOString().split("T")[0];
    };
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    inDate.min = iso(today);
    outDate.min = iso(tomorrow);
    inDate.addEventListener("change", function () {
      if (!inDate.value) return;
      const next = new Date(inDate.value);
      next.setDate(next.getDate() + 1);
      outDate.min = iso(next);
      if (outDate.value && outDate.value <= inDate.value) outDate.value = iso(next);
    });
  }

  /* ---------- 10. BOOKING FORMA ---------- */
  const form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = (form.querySelector("#bName").value || "").trim();
      const phone = (form.querySelector("#bPhone").value || "").trim();

      if (!name) {
        showToast("Iltimos, ismingizni kiriting.");
        form.querySelector("#bName").focus();
        return;
      }
      if (phone.replace(/\D/g, "").length < 9) {
        showToast("Iltimos, to'g'ri telefon raqamini kiriting.");
        form.querySelector("#bPhone").focus();
        return;
      }
      if (!inDate.value || !outDate.value || outDate.value <= inDate.value) {
        showToast("Iltimos, kirish va chiqish sanalarini to'g'ri tanlang.");
        return;
      }

      showToast("Rahmat, " + name + "! So'rovingiz qabul qilindi — operatorimiz 15 daqiqa ichida bog'lanadi.");
      form.reset();
      const todayIso = new Date().toISOString().split("T")[0];
      inDate.min = todayIso;
      const tmr = new Date();
      tmr.setDate(new Date().getDate() + 1);
      outDate.min = tmr.toISOString().split("T")[0];
    });
  }

  /* ---------- 11. YIL AVTOMAT ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
