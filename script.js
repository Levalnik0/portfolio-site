gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const preloader = document.getElementById("preloader");
const skipPreloader = sessionStorage.getItem("ls_visited");

if (prefersReducedMotion) {
  gsap.set(".reveal", { opacity: 1, y: 0 });
  gsap.set(".hero__title .word", { y: 0 });
  if (preloader) preloader.style.display = "none";
} else {
  // ---- Preloader + hero entrance, chained in one timeline ----
  const master = gsap.timeline();

  if (preloader && !skipPreloader) {
    master
      .to(".preloader__logo", { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" })
      .to(".preloader__bar-fill", { scaleX: 1, duration: 0.3, ease: "power2.out" }, "-=0.05")
      .to({}, { duration: 0.15 })
      .to(preloader, {
        yPercent: -100,
        duration: 0.55,
        ease: "power4.inOut",
        onComplete: () => {
          preloader.style.display = "none";
          sessionStorage.setItem("ls_visited", "1");
        },
      });
  } else if (preloader) {
    preloader.style.display = "none";
  }

  const heroStart = preloader && !skipPreloader ? "-=0.35" : 0;

  master.to(".hero__title .word", { y: 0, duration: 0.8, ease: "power3.out", stagger: 0.04 }, heroStart);
  master.to(".hero .reveal", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12 }, "-=0.5");

  // Everything below the hero reveals on scroll
  document.querySelectorAll("section:not(.hero)").forEach((section) => {
    const items = section.querySelectorAll(".reveal");
    if (!items.length) return;

    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  // Project cards: fade-up + scale
  gsap.utils.toArray(".card").forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 32, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  // Hero → Intro scrub: hero gently recedes as you scroll past it
  gsap.to(".hero", {
    scale: 0.97,
    opacity: 0.85,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Subtle hero glow parallax on scroll
  gsap.to(".hero__glow", {
    y: 120,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Stats: numbers count up, "AI" reveals letter by letter
  document.querySelectorAll(".stats__number").forEach((el) => {
    const raw = el.textContent.trim();
    const numeric = parseInt(raw, 10);

    if (!Number.isNaN(numeric) && /^\d+$/.test(raw)) {
      const pad = raw.length;
      const counter = { val: 0 };
      el.textContent = "0".repeat(pad);
      gsap.to(counter, {
        val: numeric,
        duration: 1.3,
        ease: "power2.out",
        snap: { val: 1 },
        onUpdate: () => {
          el.textContent = String(Math.round(counter.val)).padStart(pad, "0");
        },
        scrollTrigger: { trigger: ".stats", start: "top 80%", once: true },
      });
    } else {
      const letters = raw.split("");
      el.textContent = "";
      letters.forEach((ch) => {
        const span = document.createElement("span");
        span.textContent = ch;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(10px)";
        el.appendChild(span);
      });
      gsap.to(el.querySelectorAll("span"), {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".stats", start: "top 80%", once: true },
      });
    }
  });

  // Skills: tags spring in, group by group
  document.querySelectorAll(".skills__group").forEach((group) => {
    const tags = group.querySelectorAll(".skills__list li");
    gsap.fromTo(
      tags,
      { opacity: 0, scale: 0.5, y: 10 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.03,
        scrollTrigger: { trigger: group, start: "top 85%", toggleActions: "play none none none" },
      }
    );
  });

  // Education: timeline grows as you read
  gsap.to(".education__line", {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".education__list",
      start: "top 70%",
      end: "bottom 60%",
      scrub: 0.5,
    },
  });
}

// Project filter tabs
const filterButtons = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => {
      b.classList.remove("filter--active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("filter--active");
    btn.setAttribute("aria-pressed", "true");

    const filter = btn.dataset.filter;
    cards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("card--hidden", !matches);
    });
  });
});

// Custom cursor (desktop pointer only)
const cursor = document.querySelector(".cursor");
const isCoarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

if (cursor && !isCoarsePointer) {
  window.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("cursor--hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("cursor--hover"));
  });
}

// Scroll progress bar in nav
const navProgress = document.querySelector(".nav__progress");
if (navProgress) {
  window.addEventListener("scroll", () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    navProgress.style.width = progress + "%";
  });
}

// Smooth-scroll for in-page nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
