/**
 * Portfolio Main Interactive Scripts
 * Handles mobile menu toggle, active section scrollspy, and smooth transitions.
 */

if (typeof window !== "undefined" && typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuIcon = document.getElementById("mobile-menu-icon");

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        const isHidden = mobileMenu.classList.contains("hidden");
        if (isHidden) {
          mobileMenu.classList.remove("hidden");
          if (mobileMenuIcon) mobileMenuIcon.textContent = "close";
          mobileMenuBtn.setAttribute("aria-expanded", "true");
        } else {
          mobileMenu.classList.add("hidden");
          if (mobileMenuIcon) mobileMenuIcon.textContent = "menu";
          mobileMenuBtn.setAttribute("aria-expanded", "false");
        }
      });

      // Close mobile menu when any link is clicked
      const mobileLinks = mobileMenu.querySelectorAll("a");
      mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.add("hidden");
          if (mobileMenuIcon) mobileMenuIcon.textContent = "menu";
          mobileMenuBtn.setAttribute("aria-expanded", "false");
        });
      });
    }

    // Active Navigation on Scroll
    const navLinks = document.querySelectorAll("header nav a[href^='#']");
    const sections = document.querySelectorAll("main section[id]");

    function updateActiveNavLink() {
      const scrollPos = window.scrollY + 120; // Offset for sticky navbar

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${id}`) {
              link.classList.remove("text-text-secondary");
              link.classList.add("text-primary", "border-b-2", "border-primary", "pb-0.5");
            } else {
              link.classList.remove("text-primary", "border-b-2", "border-primary", "pb-0.5");
              link.classList.add("text-text-secondary");
            }
          });
        }
      });
    }

    window.addEventListener("scroll", updateActiveNavLink, { passive: true });
    updateActiveNavLink();

    // =========================================================================
    // One-Click Email Action & Animated Toast Notification System
    // =========================================================================
    function showToast({ title, message, subtext, icon = "check_circle", duration = 3800 }) {
      let container = document.getElementById("toast-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed bottom-6 right-6 z-[9999] pointer-events-none flex flex-col gap-3 max-w-sm sm:max-w-md w-[calc(100%-3rem)] sm:w-auto";
        container.setAttribute("aria-live", "polite");
        container.setAttribute("role", "status");
        document.body.appendChild(container);
      }

      // Remove existing toast if any to prevent clutter
      const existing = container.querySelectorAll(".portfolio-toast");
      existing.forEach((el) => el.remove());

      // Create new toast element
      const toast = document.createElement("div");
      toast.className = "portfolio-toast pointer-events-auto relative overflow-hidden rounded-2xl bg-surface/95 backdrop-blur-xl border border-primary/40 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(220,149,255,0.2)] p-4 sm:p-4.5 transition-all duration-300 transform translate-y-6 opacity-0 flex items-start gap-3.5 select-none";

      toast.innerHTML = `
        <div class="w-10 h-10 rounded-xl bg-canvas border border-primary/50 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(220,149,255,0.35)]">
          <span class="material-symbols-outlined text-[22px] animate-pulse">${icon}</span>
        </div>
        <div class="flex-1 min-w-0 pr-1">
          <div class="font-headline font-bold text-sm sm:text-base text-white tracking-tight leading-snug flex items-center gap-1.5">
            <span>${title}</span>
            <span class="inline-block w-2 h-2 rounded-full bg-primary animate-ping"></span>
          </div>
          ${message ? `<div class="font-mono text-xs text-accent mt-0.5 truncate font-medium">${message}</div>` : ""}
          ${subtext ? `<div class="font-body text-xs text-text-muted mt-1 leading-tight">${subtext}</div>` : ""}
        </div>
        <button type="button" class="toast-close-btn text-text-muted hover:text-white p-1 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-primary ml-1" aria-label="Close notification">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
        <!-- Animated countdown progress bar -->
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-surface-card overflow-hidden">
          <div class="toast-progress-bar h-full bg-gradient-to-r from-primary via-accent to-accent-violet w-full transition-all linear" style="transition-duration: ${duration}ms; transform: scaleX(1); transform-origin: left;"></div>
        </div>
      `;

      container.appendChild(toast);

      // Trigger entrance transition & progress bar
      requestAnimationFrame(() => {
        toast.classList.remove("translate-y-6", "opacity-0");
        toast.classList.add("translate-y-0", "opacity-100");

        const bar = toast.querySelector(".toast-progress-bar");
        if (bar) {
          requestAnimationFrame(() => {
            bar.style.transform = "scaleX(0)";
          });
        }
      });

      let timeoutId = null;

      function dismissToast() {
        if (!toast.parentElement) return;
        toast.classList.remove("translate-y-0", "opacity-100");
        toast.classList.add("translate-y-4", "opacity-0");
        setTimeout(() => {
          if (toast.parentElement) toast.remove();
        }, 300);
      }

      timeoutId = setTimeout(dismissToast, duration);

      const closeBtn = toast.querySelector(".toast-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          clearTimeout(timeoutId);
          dismissToast();
        });
      }
    }

    // Attach to email CTA button
    const emailBtn = document.getElementById("email-cta-button");
    if (emailBtn) {
      emailBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const email = emailBtn.getAttribute("data-email") || "keerthithallam8@gmail.com";
        const mailtoHref = emailBtn.getAttribute("href") || `mailto:${email}`;

        // 1. Copy to clipboard
        let copied = false;
        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(email);
            copied = true;
          } else {
            const textArea = document.createElement("textarea");
            textArea.value = email;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            copied = document.execCommand("copy");
            document.body.removeChild(textArea);
          }
        } catch (err) {
          console.warn("Clipboard copy failed:", err);
        }

        // 2. Micro-feedback on the button badge
        const badgeText = document.getElementById("email-cta-text");
        const badgeIcon = document.getElementById("email-cta-icon");
        if (badgeText && badgeIcon) {
          const originalText = badgeText.textContent;
          const originalIcon = badgeIcon.textContent;

          badgeText.textContent = copied ? "Copied!" : "Opening...";
          badgeIcon.textContent = copied ? "done" : "arrow_outward";
          badgeText.parentElement.classList.add("text-primary", "font-bold");

          setTimeout(() => {
            badgeText.textContent = originalText;
            badgeIcon.textContent = originalIcon;
            badgeText.parentElement.classList.remove("text-primary", "font-bold");
          }, 2400);
        }

        // 3. Show Toast Notification
        showToast({
          title: copied ? "Email Copied to Clipboard!" : "Opening Mail Client...",
          message: email,
          subtext: "Address copied! Opening your default email client...",
          icon: copied ? "content_paste_check" : "outgoing_mail",
          duration: 3800
        });

        // 4. Trigger mailto client after slight delay
        setTimeout(() => {
          window.location.href = mailtoHref;
        }, 400);
      });
    }

    // Support for form submit if viewing template contact form
    const contactForm = document.querySelector(".contact__form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : "Send Message";
        if (submitBtn) {
          submitBtn.textContent = "Sending...";
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          if (submitBtn) submitBtn.textContent = "Sent!";
          showToast({
            title: "Message Sent!",
            message: "Thanks for reaching out!",
            subtext: "I will respond to your message within 24 hours.",
            icon: "send",
            duration: 4000
          });
          contactForm.reset();
          setTimeout(() => {
            if (submitBtn) {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }
          }, 2500);
        }, 700);
      });
    }

    // Expose showToast globally for reuse
    window.showToast = showToast;

    // =========================================================================
    // CareQueue Multi-View & High-Res Lightbox Inspector
    // =========================================================================
    function initCareQueueShowcase() {
      const tabDual = document.getElementById("cq-tab-dual");
      const tabAdmin = document.getElementById("cq-tab-admin");
      const tabPatient = document.getElementById("cq-tab-patient");
      const viewDual = document.getElementById("cq-view-dual");
      const viewSingle = document.getElementById("cq-view-single");
      const singleImg = document.getElementById("cq-single-img");
      const singleTitle = document.getElementById("cq-single-title");
      const singleUrl = document.getElementById("cq-single-url");
      const singleBadge = document.getElementById("cq-single-badge");
      const singleDesc = document.getElementById("cq-single-desc");

      const viewsData = {
        admin: {
          src: "assets/img/carequeue-admin.png",
          alt: "CareQueue Staff Administration Dashboard — Real-Time Queue & Token Calling",
          title: "CareQueue — Staff Administration & Real-Time Queue Command Center",
          url: "http://localhost:3001/admin",
          badge: "Staff Admin · 2 Waiting in Clinic",
          desc: "Live relational operational console showing active token calling (Devon Miller A-102), real-time check-in counters (Total 6, Waiting 2, Avg Wait 14m), and full MySQL appointments schedule table."
        },
        patient: {
          src: "assets/img/carequeue-patient.png",
          alt: "CareQueue Patient Web Portal — Online Appointment Booking & ACID Lock",
          title: "CareQueue — Patient Self-Service Booking & Live Queue Pass Portal",
          url: "http://localhost:3001/patient-portal",
          badge: "Patient Web · MySQL ACID Row Locking",
          desc: "Self-service booking wizard: specialist selector (Dr. Sarah Chen, Dr. Marcus Vance), consultation selection, and transactional row-level locking (SELECT ... FOR UPDATE) preventing duplicate bookings under high concurrency."
        },
        taskflow: {
          src: "assets/img/taskflow-dashboard.png",
          alt: "TaskFlow Sprint Matrix — Real-Time Workflow & Board Management Application",
          title: "TaskFlow — Active Sprint Matrix & Execution Dashboard",
          url: "http://localhost:3000/sprint-matrix",
          badge: "Sprint Matrix · Real-Time Workflow",
          desc: "Full-stack sprint execution board featuring real-time task dispatch, velocity metrics (29% velocity), SLA throughput monitoring, and role-based backlog coordination."
        }
      };

      function setActiveTab(active) {
        [tabDual, tabAdmin, tabPatient].forEach(btn => {
          if (!btn) return;
          btn.classList.remove("bg-primary", "text-canvas", "font-bold", "shadow-[0_0_15px_rgba(220,149,255,0.4)]");
          btn.classList.add("text-text-secondary", "hover:text-white", "hover:bg-surface-card");
        });

        if (active === "dual" && tabDual) {
          tabDual.classList.add("bg-primary", "text-canvas", "font-bold", "shadow-[0_0_15px_rgba(220,149,255,0.4)]");
          tabDual.classList.remove("text-text-secondary", "hover:text-white", "hover:bg-surface-card");
          if (viewDual) viewDual.classList.remove("hidden");
          if (viewSingle) viewSingle.classList.add("hidden");
        } else if (active === "admin" && tabAdmin) {
          tabAdmin.classList.add("bg-primary", "text-canvas", "font-bold", "shadow-[0_0_15px_rgba(220,149,255,0.4)]");
          tabAdmin.classList.remove("text-text-secondary", "hover:text-white", "hover:bg-surface-card");
          loadSingleView("admin");
        } else if (active === "patient" && tabPatient) {
          tabPatient.classList.add("bg-primary", "text-canvas", "font-bold", "shadow-[0_0_15px_rgba(220,149,255,0.4)]");
          tabPatient.classList.remove("text-text-secondary", "hover:text-white", "hover:bg-surface-card");
          loadSingleView("patient");
        }
      }

      function loadSingleView(key) {
        const data = viewsData[key];
        if (!data || !singleImg) return;
        singleImg.src = data.src;
        singleImg.alt = data.alt;
        singleImg.parentElement.setAttribute("data-cq-inspect", key);
        if (singleTitle) singleTitle.textContent = data.title;
        if (singleUrl) singleUrl.textContent = data.url;
        if (singleBadge) singleBadge.textContent = data.badge;
        if (singleDesc) singleDesc.textContent = data.desc;
        if (viewDual) viewDual.classList.add("hidden");
        if (viewSingle) viewSingle.classList.remove("hidden");
      }

      if (tabDual) tabDual.addEventListener("click", () => setActiveTab("dual"));
      if (tabAdmin) tabAdmin.addEventListener("click", () => setActiveTab("admin"));
      if (tabPatient) tabPatient.addEventListener("click", () => setActiveTab("patient"));

      // Lightbox Modal Functionality
      const modal = document.getElementById("cq-lightbox-modal");
      const modalImg = document.getElementById("cq-modal-img");
      const modalTitle = document.getElementById("cq-modal-title");
      const modalUrl = document.getElementById("cq-modal-url");
      const modalDesc = document.getElementById("cq-modal-desc");
      const modalClose = document.getElementById("cq-modal-close");
      const modalPrev = document.getElementById("cq-modal-prev");
      const modalNext = document.getElementById("cq-modal-next");

      const modalKeys = ["admin", "patient", "taskflow"];
      let currentModalKey = "admin";

      function openModal(key) {
        if (!modal || !modalImg) return;
        currentModalKey = viewsData[key] ? key : "admin";
        const data = viewsData[currentModalKey];
        modalImg.src = data.src;
        modalImg.alt = data.alt;
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalUrl) modalUrl.textContent = data.url;
        if (modalDesc) modalDesc.textContent = data.desc;

        modal.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
      }

      function closeModal() {
        if (!modal) return;
        modal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      }

      function toggleModalKey(direction = 1) {
        let idx = modalKeys.indexOf(currentModalKey);
        if (idx === -1) idx = 0;
        idx = (idx + direction + modalKeys.length) % modalKeys.length;
        openModal(modalKeys[idx]);
      }

      // Attach click listeners to all inspect triggers
      document.querySelectorAll("[data-cq-inspect]").forEach(el => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          const target = el.getAttribute("data-cq-inspect");
          openModal(target || "admin");
        });
      });

      if (modalClose) modalClose.addEventListener("click", closeModal);
      if (modalPrev) modalPrev.addEventListener("click", () => toggleModalKey(1));
      if (modalNext) modalNext.addEventListener("click", () => toggleModalKey(1));

      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target === modal || e.target.classList.contains("modal-backdrop")) {
            closeModal();
          }
        });
      }

      document.addEventListener("keydown", (e) => {
        if (modal && !modal.classList.contains("hidden")) {
          if (e.key === "Escape") closeModal();
          if (e.key === "ArrowLeft") toggleModalKey(-1);
          if (e.key === "ArrowRight") toggleModalKey(1);
        }
      });
    }

    initCareQueueShowcase();
  });
}
