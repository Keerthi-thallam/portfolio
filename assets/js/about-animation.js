/**
 * Section 2: About Section Creative Animations
 * Features:
 * 1. IntersectionObserver scroll-triggered staggered reveals
 * 2. Animated smooth numeric counters (2+ Years, 12+ Projects, 100% Code Quality)
 * 3. 3D Micro-tilt & dynamic spotlight on Domain Cards
 * 4. Interactive Domain Card tag reveals on hover
 * 5. Full prefers-reduced-motion compatibility
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initAboutScrollReveal();
    initAboutCounters();
    initAboutDomainCards();
  });

  /* ========================================================================= */
  /* 1. SCROLL REVEAL OBSERVER                                                 */
  /* ========================================================================= */
  function initAboutScrollReveal() {
    const aboutSection = document.getElementById("about");
    if (!aboutSection) return;

    const revealElements = aboutSection.querySelectorAll(".about-reveal");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealElements.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElements.forEach((el) => el.classList.add("in-view"));
            // Trigger counter once in view
            startCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(aboutSection);
  }

  /* ========================================================================= */
  /* 2. NUMERIC COUNT-UP ANIMATION                                             */
  /* ========================================================================= */
  let countersStarted = false;

  function initAboutCounters() {
    // If reduced motion, show values immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const counters = document.querySelectorAll(".about-counter-val");
      counters.forEach((c) => {
        const target = c.getAttribute("data-target");
        if (target) c.textContent = target;
      });
      countersStarted = true;
    }
  }

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;

    const counters = document.querySelectorAll(".about-counter-val");
    const duration = 1600; // ms

    counters.forEach((c) => {
      const targetStr = c.getAttribute("data-target") || "0";
      const targetNum = parseInt(targetStr, 10);
      const suffix = c.getAttribute("data-suffix") || "";
      const prefix = c.getAttribute("data-prefix") || "";
      let startTimestamp = null;

      function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Ease out quad
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * targetNum);

        c.textContent = `${prefix}${current < 10 && targetNum >= 10 ? current : (targetNum < 10 ? '0' + current : current)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          c.textContent = `${prefix}${targetNum < 10 ? '0' + targetNum : targetNum}${suffix}`;
        }
      }

      requestAnimationFrame(step);
    });
  }

  /* ========================================================================= */
  /* 3. DOMAIN CARDS 3D MICRO-TILT & SPOTLIGHT                                 */
  /* ========================================================================= */
  function initAboutDomainCards() {
    const cards = document.querySelectorAll(".about-domain-card");
    if (!cards.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Spotlights
        card.style.setProperty("--about-mouse-x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--about-mouse-y", `${(y / rect.top) * 100}%`);

        // Micro-tilt
        const xPct = (x / rect.width - 0.5) * 2;
        const yPct = (y / rect.height - 0.5) * 2;
        card.style.transform = `perspective(600px) rotateX(${-yPct * 6}deg) rotateY(${xPct * 6}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }
})();
