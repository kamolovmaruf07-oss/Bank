/* MAZA — interactions */
(function () {
  "use strict";

  const root = document.documentElement;
  const metaTheme = document.getElementById("metaTheme");
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "maza-theme";
  const colors = { light: "#f7efd9", dark: "#21110b" };

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (metaTheme) metaTheme.setAttribute("content", colors[theme]);
    if (themeToggle) {
      const dark = theme === "dark";
      themeToggle.setAttribute("aria-label", dark ? "Kun rejimini yoqish" : "Tun rejimini yoqish");
      themeToggle.setAttribute("title", dark ? "Kun rejimiga o'tish" : "Tun rejimiga o'tish");
    }
    try { localStorage.setItem(THEME_KEY, theme); } catch (error) { /* storage unavailable */ }
  }

  let storedTheme = null;
  try { storedTheme = localStorage.getItem(THEME_KEY); } catch (error) { /* storage unavailable */ }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(storedTheme === "light" || storedTheme === "dark" ? storedTheme : (prefersDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", function () {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  // Mobile navigation
  const burger = document.getElementById("navBurger");
  const nav = document.getElementById("mainNav");
  function closeNav() {
    document.body.classList.remove("nav-open");
    burger?.setAttribute("aria-expanded", "false");
  }
  burger?.addEventListener("click", function () {
    const open = document.body.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", closeNav); });
  document.addEventListener("click", function (event) {
    if (document.body.classList.contains("nav-open") && !nav?.contains(event.target) && !burger?.contains(event.target)) closeNav();
  });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeNav(); });

  // Header elevation and active navigation
  const header = document.getElementById("siteHeader");
  function updateHeader() { header?.classList.toggle("scrolled", window.scrollY > 20); }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => spy.observe(section));
  }

  // Reveal on scroll
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // Menu category tabs
  const menuTabs = document.querySelectorAll(".menu-tab");
  const menuCards = document.querySelectorAll(".menu-card");
  menuTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const filter = tab.dataset.filter;
      menuTabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      menuCards.forEach(function (card) {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  // Toast helper
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");
  const toastClose = document.getElementById("toastClose");
  let toastTimer;
  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4600);
  }
  toastClose?.addEventListener("click", () => toast.classList.remove("show"));

  // Small add buttons confirm the selected dish and point guests toward booking.
  document.querySelectorAll(".menu-add").forEach(function (button) {
    button.addEventListener("click", function () {
      showToast(button.dataset.dish + " tanlandi. Stolni band qiling — sizni kutamiz!");
      document.getElementById("rezervatsiya")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // Reservation form
  const form = document.getElementById("reservationForm");
  const visitDate = document.getElementById("visitDate");
  if (visitDate) {
    const today = new Date();
    const isoDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    visitDate.min = isoDate;
  }
  form?.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("guestName")?.value.trim();
    const phone = document.getElementById("guestPhone")?.value.trim();
    if (!name || !phone || phone.replace(/\D/g, "").length < 9) {
      showToast("Iltimos, ism va to'g'ri telefon raqamingizni kiriting.");
      if (!name) document.getElementById("guestName")?.focus();
      else document.getElementById("guestPhone")?.focus();
      return;
    }
    showToast("Rahmat, " + name + "! So'rovingiz qabul qilindi. Tez orada bog'lanamiz.");
    form.reset();
    if (visitDate) {
      const today = new Date();
      visitDate.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    }
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
