/**
 * Work Experience Data & Reusable Timeline Component
 * Stored in a separate configuration array for modularity.
 * Contains verified experience details for Keerthi's portfolio.
 */

const EXPERIENCE_DATA = [
  {
    id: "ethara-ai",
    role: "LLM-Post Training Intern",
    company: "Ethara AI",
    initials: "EA",
    duration: "January–May 2026",
    period: "Jan 2026 – May 2026",
    type: "Internship",
    domain: "AI / LLM Post-Training",
    icon: "psychology", // AI/ML subtle icon
    avatarBorder: "border-primary/40",
    avatarText: "text-primary",
    responsibilities: [
      "Evaluated <strong class=\"text-white font-semibold\">500+ prompt-response pairs per week</strong> for instruction following, visual fidelity, and artifact detection across three model versions.",
      "Developed annotation guidelines across four quality dimensions, maintaining <strong class=\"text-white font-semibold\">90% inter-rater consistency</strong> with the team.",
      "Flagged <strong class=\"text-white font-semibold\">200+ edge-case prompt failures</strong> that informed targeted fine-tuning cycles for text-to-image models.",
      "Delivered structured evaluation reports used by model trainers to prioritize post-training improvement tasks."
    ],
    skills: [
      "LLM Evaluation",
      "Prompt Engineering",
      "Data Annotation",
      "Text-to-Image Evaluation",
      "Model Fine-tuning"
    ]
  },
  {
    id: "tsb-technologies",
    role: "AI Intern",
    company: "TSB Technologies",
    initials: "TSB",
    duration: "July–August 2026",
    period: "Jul 2026 – Aug 2026",
    type: "Internship",
    domain: "Computer Vision & Perception",
    icon: "visibility", // Computer vision subtle icon
    avatarBorder: "border-accent-violet/40",
    avatarText: "text-accent",
    responsibilities: [
      "Evaluated image datasets for vehicle detection, classifying vehicle presence or absence and rating image quality against defined standards.",
      "Authored descriptive prompts capturing image content for vision-model training and evaluation datasets.",
      "Ensured data-labeling accuracy and consistency across large image batches."
    ],
    skills: [
      "Artificial Intelligence",
      "Computer Vision",
      "Image Annotation",
      "Dataset Evaluation",
      "Prompt Writing"
    ]
  }
];

/**
 * Reusable Component: Create a single timeline item HTML string
 * @param {Object} exp - Experience item object
 * @param {number} index - Index of the item
 * @param {number} total - Total count of items
 * @returns {string} Semantic HTML component
 */
function createTimelineItem(exp, index, total) {
  const isLast = index === total - 1;

  const responsibilitiesHtml = exp.responsibilities
    .map(
      (resp) => `
        <li class="exp-bullet-item flex items-start gap-3">
          <span class="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5 select-none" aria-hidden="true">check_circle</span>
          <span class="text-text-secondary leading-relaxed">${resp}</span>
        </li>
      `
    )
    .join("");

  const skillsHtml = exp.skills
    .map(
      (skill) => `
        <span class="px-2.5 py-1 bg-tag-bg border border-tag-border rounded-md text-xs font-mono text-accent hover:border-primary/50 transition-colors duration-150 cursor-default">
          ${skill}
        </span>
      `
    )
    .join("");

  return `
    <div class="relative pl-7 sm:pl-10 md:pl-16 ${isLast ? "pb-2" : "pb-12"} group exp-reveal exp-delay-${(index % 2) + 1}">
      <!-- Glowing Timeline Node Marker -->
      <div class="absolute left-0 sm:left-2 md:left-4 -translate-x-1/2 top-1.5 flex flex-col items-center">
        <div class="exp-node-beacon w-8 h-8 rounded-full bg-surface-card border-2 border-primary/60 flex items-center justify-center shadow-md shadow-primary/20" title="${exp.domain}">
          <span class="material-symbols-outlined text-primary text-[16px]">${exp.icon}</span>
        </div>
      </div>

      <!-- Experience Card Container with 3D micro-tilt -->
      <article class="exp-card p-6 sm:p-8">
        
        <!-- Header: Initials Logo, Role, Company & Period -->
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div class="flex items-start gap-4">
            <!-- Company Initials Placeholder Logo -->
            <div class="w-12 h-12 rounded-xl bg-surface border ${exp.avatarBorder} flex items-center justify-center font-mono font-bold text-sm ${exp.avatarText} shadow-sm shrink-0" aria-label="${exp.company} Logo">
              ${exp.initials}
            </div>

            <!-- Role Title & Company / Category -->
            <div>
              <h3 class="font-headline text-lg sm:text-xl font-bold text-white group-hover:text-primary transition-colors">
                ${exp.role}
              </h3>
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <span class="font-medium text-sm sm:text-base text-text-primary">${exp.company}</span>
                <span class="inline-block w-1 h-1 rounded-full bg-card-border"></span>
                <span class="font-mono text-xs text-primary flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">${exp.icon}</span>
                  ${exp.domain}
                </span>
              </div>
            </div>
          </div>

          <!-- Date Badge & Employment Type -->
          <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-card-border/60">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface border border-card-border font-mono text-xs text-accent font-medium">
              <span class="material-symbols-outlined text-[14px] text-primary">calendar_month</span>
              ${exp.duration}
            </span>
            <span class="font-mono text-[11px] text-text-muted tracking-wider uppercase">${exp.type}</span>
          </div>
        </div>

        <!-- Subtle Separator -->
        <div class="h-px w-full bg-card-border/60 mb-5"></div>

        <!-- Responsibilities & Measurable Impact -->
        <div class="space-y-3 mb-6">
          <h4 class="font-mono text-[11px] uppercase tracking-wider text-text-muted font-semibold">
            Key Responsibilities &amp; Impact
          </h4>
          <ul class="space-y-2.5 font-body text-sm sm:text-base text-text-secondary leading-relaxed">
            ${responsibilitiesHtml}
          </ul>
        </div>

        <!-- Relevant Skill Tags -->
        <div class="pt-4 border-t border-card-border/60 flex flex-wrap items-center gap-2">
          <span class="font-mono text-[11px] uppercase tracking-wider text-text-muted mr-1 font-semibold flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-primary">tag</span>
            Skills:
          </span>
          ${skillsHtml}
        </div>

      </article>
    </div>
  `;
}

/**
 * Render all timeline items into a container
 * @param {string} containerId - Element ID where items should be rendered
 */
function renderExperienceTimeline(containerId = "experience-timeline-items") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const total = EXPERIENCE_DATA.length;
  container.innerHTML = EXPERIENCE_DATA.map((exp, idx) =>
    createTimelineItem(exp, idx, total)
  ).join("");
}

// Auto-hydrate on DOM load if container exists
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("experience-timeline-items");
    if (container && container.children.length === 0) {
      renderExperienceTimeline("experience-timeline-items");
    }
  });
}

// Export for module usage if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    EXPERIENCE_DATA,
    createTimelineItem,
    renderExperienceTimeline,
  };
}
