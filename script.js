gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  gsap.set(".reveal", { opacity: 1, y: 0 });
  gsap.set(".hero__title .word", { y: 0 });
} else {
  // Hero title — word-by-word reveal
  gsap.to(".hero__title .word", {
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.04,
  });

  // Hero entrance — plays immediately on load
  gsap.to(".hero .reveal", {
    opacity: 1,
    y: 0,
    duration: 0.9,
    delay: 0.3,
    ease: "power3.out",
    stagger: 0.12,
  });

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

  // Project cards: slight extra stagger + scale pop
  gsap.utils.toArray(".card").forEach((card, i) => {
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
