/**
 * Section 3: Technical Skills Creative Animations
 * Features:
 * 1. Scroll-triggered progressive stagger reveal
 * 2. 3D Micro-tilt & dynamic cursor radial spotlight on Skill Category Cards
 * 3. Magnetic Hover & Glowing Shimmer on Tech Pills
 * 4. Full prefers-reduced-motion compatibility
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initSkillsScrollReveal();
    initSkillsTilt();
  });

  /* ========================================================================= */
  /* 1. SCROLL REVEAL OBSERVER                                                 */
  /* ========================================================================= */
  function initSkillsScrollReveal() {
    const section = document.getElementById("skills");
    if (!section) return;

    const revealElements = section.querySelectorAll(".skills-reveal");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealElements.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElements.forEach((el) => el.classList.add("in-view"));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(section);
  }

  /* ========================================================================= */
  /* 2. 3D MICRO-TILT & DYNAMIC SPOTLIGHT                                      */
  /* ========================================================================= */
  function initSkillsTilt() {
    const cards = document.querySelectorAll(".skills-card");
    if (!cards.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spotlights
        card.style.setProperty("--skills-mouse-x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--skills-mouse-y", `${(y / rect.height) * 100}%`);

        // Micro-tilt
        const xPct = (x / rect.width - 0.5) * 2;
        const yPct = (y / rect.height - 0.5) * 2;
        card.style.transform = `perspective(700px) rotateX(${-yPct * 5}deg) rotateY(${xPct * 5}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }
})();
