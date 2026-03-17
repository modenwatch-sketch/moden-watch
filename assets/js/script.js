const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");
const faqItems = document.querySelectorAll(".faq-item");
const estimateForm = document.querySelector("#estimateForm");
const feedback = document.querySelector(".form-feedback");

function syncHeaderState() {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
}

if (menuToggle && siteHeader) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    siteHeader.classList.toggle("menu-open", !expanded);
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      siteHeader.classList.remove("menu-open");
    });
  });
}

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

faqItems.forEach((item) => {
  const button = item.querySelector("button");
  const answer = item.querySelector(".faq-answer");

  if (button && answer) {
    answer.setAttribute("aria-hidden", String(!item.classList.contains("active")));
  }

  button?.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((faqItem) => {
      faqItem.classList.remove("active");
      faqItem.querySelector("button")?.setAttribute("aria-expanded", "false");
      faqItem.querySelector(".faq-answer")?.setAttribute("aria-hidden", "true");
    });

    if (!isActive) {
      item.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      answer?.setAttribute("aria-hidden", "false");
    }
  });
});

if (estimateForm && feedback) {
  estimateForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!estimateForm.checkValidity()) {
      estimateForm.reportValidity();
      return;
    }

    feedback.textContent = "문의가 접수된 것으로 표시하는 더미 응답입니다.";
    estimateForm.reset();
  });
}

/* ── Reveal: IntersectionObserver (WOW.js 대체) ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add("visible"), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => {
  const siblings = el.parentElement.querySelectorAll(".reveal");
  const idx = Array.from(siblings).indexOf(el);
  el.dataset.delay = idx * 100;
  revealObserver.observe(el);
});

/* ── Count-up (jquery.count-to 순수 JS 대체) ── */
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString("ko-KR") + suffix;
  }, step);
}

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll(".count-up").forEach((el) => countObserver.observe(el));
