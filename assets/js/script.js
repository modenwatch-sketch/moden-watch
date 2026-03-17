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
  const submitButton = estimateForm.querySelector(".submit-button");

  estimateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!estimateForm.checkValidity()) {
      estimateForm.reportValidity();
      return;
    }

    const formData = new FormData(estimateForm);
    const originalButtonText = submitButton?.textContent;

    feedback.textContent = "문의 전송 중입니다. 잠시만 기다려 주세요.";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "전송 중...";
    }

    try {
      const response = await fetch(estimateForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      const result = await response.json();

      if (response.ok && result.success) {
        feedback.textContent = "문의가 정상적으로 접수되었습니다. 확인 후 빠르게 연락드리겠습니다.";
        estimateForm.reset();
      } else {
        feedback.textContent =
          result.message || "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      }
    } catch (error) {
      feedback.textContent = "문의 전송에 실패했습니다. 전화 또는 카카오톡으로 문의해 주세요.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText || "문의 보내기";
      }
    }
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
