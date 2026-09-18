# NovaBank — Soft UI Bank Portfolio 🏦

Zamonaviy **Soft UI (Neumorphism)** dizayndagi bank portfolio sayti.
Och ko'k 🔵 va to'q ko'k 🌑 ranglar asosida, **tun / kun** rejimi bilan.

## ✨ Xususiyatlari

- 🌗 **Tun / Kun rejimi** — quyosh/oy tugmasi, tanlov `localStorage`da saqlanadi, OS sozlamasiga ham moslashadi
- 🧊 **Soft UI / Neumorphism** — ko'tarilgan (`soft`) va bosilgan (`soft-inset`) yuzalar, yumshoq soyalar
- 🎨 **Rang palitrasi** — och ko'k (#5aa9ff) va to'q ko'k (#12325e)
- 🖼️ **AI-yaratilgan rasmlar** — `assets/` ichida 5 ta bank mavzusidagi 3D illüstratsiya
- 💳 **Interaktiv JS bank karta** — hover/tap qilganda aylanadi (flip)
- 📊 **Animatsiyali hisoblagichlar**, progress-barlar, scroll-reveal, tilt-effekt
- 📱 **To'liq responsive** — mobil menyu (burger), planşet/desktop
- ♿ `prefers-reduced-motion` qo'llab-quvvatlash

## 📂 Struktura

```
├── index.html          # Bosh sahifa (barcha bo'limlar)
├── css/style.css       # Soft UI dizayn tizimi (CSS variables, 2 tema)
├── js/main.js          # Tema, animatsiyalar, forma, menyu
└── assets/             # AI bilan yaratilgan rasmlar
    ├── hero-bank.png
    ├── cards.png
    ├── mobile-app.png
    ├── vault.png
    └── analytics.png
```

## 🚀 Ishga tushirish

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Yoki `index.html`ni brauzerda to'g'ridan-to'g'ri oching.

## 🧭 Bo'limlar

Bosh sahifa (Hero) → Xizmatlar → Kartalar → Mobil ilova → Xavfsizlik → Analitika → Portfolio → Mijozlar fikri → Aloqa
