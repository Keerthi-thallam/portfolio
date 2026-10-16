/**
 * Section 4: Work Experience Creative Animations
 * Features:
 * 1. Animated glowing timeline spine with dynamic scroll progress
 * 2. Staggered timeline card & pulsing milestone node reveals
 * 3. 3D perspective micro-tilt & dynamic spotlight on experience cards
 * 4. Interactive impact bullet hover illumination
 * 5. Full prefers-reduced-motion compatibility
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initExperienceScrollReveal();
    initExperienceTimelineSpine();
    initExperienceCardTilt();
  });

  /* ========================================================================= */
  /* 1. SCROLL REVEAL OBSERVER FOR TIMELINE ITEMS                              */
  /* ========================================================================= */
  function initExperienceScrollReveal() {
    const section = document.getElementById("experience");
    if (!section) return;

    const revealElements = section.querySelectorAll(".exp-reveal");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealElements.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  /* ========================================================================= */
  /* 2. DYNAMIC TIMELINE SPINE SCROLL PROGRESS & BEAM                          */
  /* ========================================================================= */
  function initExperienceTimelineSpine() {
    const timelineContainer = document.getElementById("experience-timeline-container");
    const spineFill = document.getElementById("experience-spine-fill");
    if (!timelineContainer || !spineFill) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spineFill.style.height = "100%";
      return;
    }

    function updateSpine() {
      const rect = timelineContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start filling when top of timeline is at 60% of viewport
      const startY = windowHeight * 0.65;
      const totalHeight = rect.height;

      if (rect.top <= startY) {
        const scrolled = startY - rect.top;
        const pct = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100));
        spineFill.style.height = `${pct}%`;
      } else {
        spineFill.style.height = "0%";
      }
    }

    window.addEventListener("scroll", updateSpine, { passive: true });
    window.addEventListener("resize", updateSpine, { passive: true });
    updateSpine();
  }

  /* ========================================================================= */
  /* 3. 3D MICRO-TILT & SPOTLIGHT ON EXPERIENCE CARDS                          */
  /* ========================================================================= */
  function initExperienceCardTilt() {
    const cards = document.querySelectorAll(".exp-card");
    if (!cards.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spotlights
        card.style.setProperty("--exp-mouse-x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--exp-mouse-y", `${(y / rect.height) * 100}%`);

        // Micro-tilt
        const xPct = (x / rect.width - 0.5) * 2;
        const yPct = (y / rect.height - 0.5) * 2;
        card.style.transform = `perspective(800px) rotateX(${-yPct * 4}deg) rotateY(${xPct * 4}deg) translateY(-3px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }
})();
