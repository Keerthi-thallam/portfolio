/**
 * Hero Section Creative Animations
 * Features:
 * 1. Interactive Constellation Canvas with subtle mouse attraction & glowing lilac threads
 * 2. Kinetic Dynamic Typewriter for role highlights
 * 3. 3D Parallax Tilt with cursor spotlight on Developer Terminal Card
 * 4. Interactive Snippet Copy with animated feedback
 * 5. Smooth Scroll-Down Indicator trigger
 * 6. Full prefers-reduced-motion & IntersectionObserver performance optimizations
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initHeroCanvas();
    initHeroTypewriter();
    initHeroTiltCard();
    initHeroCopyButton();
    initHeroScrollButton();
  });

  /* ========================================================================= */
  /* 1. INTERACTIVE CONSTELLATION CANVAS                                       */
  /* ========================================================================= */
  function initHeroCanvas() {
    const canvas = document.getElementById("hero-canvas");
    const section = document.getElementById("hero");
    if (!canvas || !section) return;

    // Skip canvas animation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let particles = [];
    let animationFrameId = null;
    let isVisible = true;

    // Mouse coordinates relative to hero section
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 140,
      active: false
    };

    function resize() {
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(dpr, dpr);

      createParticles();
    }

    function createParticles() {
      particles = [];
      // Adjust density based on screen width
      const count = width < 768 ? 24 : Math.min(50, Math.floor((width * height) / 22000));

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.8 + 1,
          baseAlpha: Math.random() * 0.4 + 0.25,
          alpha: Math.random() * 0.4 + 0.25,
          pulseSpeed: Math.random() * 0.02 + 0.008,
          pulseVal: Math.random() * Math.PI
        });
      }
    }

    function render() {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Pulse alpha gently
        p.pulseVal += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulseVal) * 0.15;

        // Mouse interaction: soft attraction / nudge
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 0.6;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;

            // Connect mouse to particle with luminous line
            const mouseAlpha = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(220, 149, 255, ${mouseAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw particle dot with soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 149, 255, ${p.alpha})`;
        ctx.shadowColor = "rgba(220, 149, 255, 0.6)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for performance

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distBetween = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxDist = width < 768 ? 85 : 110;

          if (distBetween < maxDist) {
            const lineAlpha = (1 - distBetween / maxDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(220, 149, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    // Mouse listener scoped to hero
    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }, { passive: true });

    section.addEventListener("mouseleave", () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    });

    // Touch support for tablets / touchscreens
    section.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches[0]) {
        const rect = section.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    }, { passive: true });

    section.addEventListener("touchend", () => {
      mouse.active = false;
    });

    // Handle resize
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }, { passive: true });

    // IntersectionObserver to pause rendering when hero is out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        } else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      });
    }, { threshold: 0.05 });

    observer.observe(section);

    // Initial boot
    resize();
    animationFrameId = requestAnimationFrame(render);
  }

  /* ========================================================================= */
  /* 2. KINETIC TYPEWRITER HEADLINE                                            */
  /* ========================================================================= */
  function initHeroTypewriter() {
    const el = document.getElementById("hero-typewriter-text");
    if (!el) return;

    // Respect reduced motion: leave default text
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const phrases = [
      "Front-End Developer",
      "Creative UI Designer",
      "React & Web Specialist",
      "Full-Stack & AIML Builder"
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function tick() {
      const currentPhrase = phrases[phraseIdx];

      if (isDeleting) {
        charIdx--;
        el.textContent = currentPhrase.substring(0, charIdx);
        typingSpeed = 38; // Deleting is swifter
      } else {
        charIdx++;
        el.textContent = currentPhrase.substring(0, charIdx);
        typingSpeed = 75 + Math.random() * 35; // Natural subtle jitter
      }

      if (!isDeleting && charIdx === currentPhrase.length) {
        // Finished typing phrase, hold for a moment
        isDeleting = true;
        typingSpeed = 2000; // Hold for 2s
      } else if (isDeleting && charIdx === 0) {
        // Finished deleting, move to next phrase
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typingSpeed = 450; // Pause before typing new word
      }

      setTimeout(tick, typingSpeed);
    }

    // Slight delay before start so entrance animation completes
    setTimeout(tick, 1000);
  }

  /* ========================================================================= */
  /* 3. 3D PARALLAX TILT & SPOTLIGHT FOR DEVELOPER TERMINAL CARD               */
  /* ========================================================================= */
  function initHeroTiltCard() {
    const card = document.getElementById("hero-code-card");
    const container = document.getElementById("hero-card-container");
    if (!card || !container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let bounds = null;
    let isHovered = false;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let animId = null;

    function updateBounds() {
      bounds = container.getBoundingClientRect();
    }

    function onMouseMove(e) {
      if (!bounds) updateBounds();
      isHovered = true;

      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      // Normalize -1 to 1
      const xPct = (mouseX / bounds.width - 0.5) * 2;
      const yPct = (mouseY / bounds.height - 0.5) * 2;

      // Target rotation angles (max 9 deg)
      targetX = -yPct * 8; // rotateX
      targetY = xPct * 8;  // rotateY

      // Update CSS spotlight variables
      card.style.setProperty("--mouse-x", `${(mouseX / bounds.width) * 100}%`);
      card.style.setProperty("--mouse-y", `${(mouseY / bounds.height) * 100}%`);

      if (!animId) {
        animId = requestAnimationFrame(smoothTiltLoop);
      }
    }

    function smoothTiltLoop() {
      // Spring lerp interpolation
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      card.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (isHovered || Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        animId = requestAnimationFrame(smoothTiltLoop);
      } else {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        animId = null;
      }
    }

    function onMouseLeave() {
      isHovered = false;
      targetX = 0;
      targetY = 0;
    }

    container.addEventListener("mouseenter", updateBounds);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", updateBounds, { passive: true });
    window.addEventListener("resize", updateBounds, { passive: true });
  }

  /* ========================================================================= */
  /* 4. INTERACTIVE CODE SNIPPET COPY BUTTON                                   */
  /* ========================================================================= */
  function initHeroCopyButton() {
    const copyBtn = document.getElementById("hero-copy-btn");
    const copyText = document.getElementById("hero-copy-text");
    const copyIcon = document.getElementById("hero-copy-icon");
    if (!copyBtn) return;

    const snippet = `const engineer: DeveloperProfile = {
  name: "Keerthi",
  role: "Front-End Developer & UI Designer",
  coreStack: ["React", "TypeScript", "TailwindCSS"],
  mission: "Crafting accessible, high-performance web experiences",
  available: true
};`;

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(snippet);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = snippet;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      // Visual feedback
      if (copyText) copyText.textContent = "Copied!";
      if (copyIcon) copyIcon.textContent = "check";
      copyBtn.classList.add("text-primary", "border-primary/60", "bg-primary/10");

      setTimeout(() => {
        if (copyText) copyText.textContent = "Copy";
        if (copyIcon) copyIcon.textContent = "content_copy";
        copyBtn.classList.remove("text-primary", "border-primary/60", "bg-primary/10");
      }, 2200);
    });
  }

  /* ========================================================================= */
  /* 5. SMOOTH SCROLL INDICATOR                                                */
  /* ========================================================================= */
  function initHeroScrollButton() {
    const scrollBtn = document.getElementById("hero-scroll-btn");
    if (!scrollBtn) return;

    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("about");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
})();
