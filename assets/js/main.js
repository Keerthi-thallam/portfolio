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
  });
}
