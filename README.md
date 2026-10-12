# portfolio-site

Личный портфолио-сайт: статическая одностраничная сборка (HTML/CSS/JS) со
scroll-анимациями на GSAP ScrollTrigger, собирающая все проекты в одном месте.

## Стек

Чистый HTML/CSS/JS, без сборщика. Шрифты Space Grotesk + Inter (Google Fonts),
анимации — GSAP + ScrollTrigger (CDN).

## Запуск локально

```bash
python3 -m http.server 4173
```

Открыть http://localhost:4173

## Публикация

Сайт отдаётся как статика — подходит для GitHub Pages (Settings → Pages →
Deploy from branch → main → /root).
