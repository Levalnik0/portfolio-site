gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  gsap.set(".reveal", { opacity: 1, y: 0 });
} else {
  // Hero entrance — plays immediately on load
  gsap.to(".hero .reveal", {
    opacity: 1,
    y: 0,
    duration: 0.9,
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
    filterButtons.forEach((b) => b.classList.remove("filter--active"));
    btn.classList.add("filter--active");

    const filter = btn.dataset.filter;
    cards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("card--hidden", !matches);
    });
  });
});

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
