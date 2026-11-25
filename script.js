/**
 * Configuration
 * Paste your deployed Google Apps Script Web App URL below.
 * When left empty, the form runs in preview mode so you can test validation
 * and show the thank-you flow to the client right away.
 */
const CONFIG = {
  googleSheetWebhookUrl: "",
};

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

function populateStates() {
  const select = document.getElementById("state");
  if (!select) return;
  const fragment = document.createDocumentFragment();
  for (const stateName of NIGERIAN_STATES) {
    const option = document.createElement("option");
    option.value = stateName;
    option.textContent = stateName;
    fragment.appendChild(option);
  }
  select.appendChild(fragment);
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 14;
}

function setFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const errEl = document.getElementById(inputId + "Error");
  if (input) {
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }
  if (errEl) {
    errEl.textContent = message || "";
  }
}

function initRegistrationForm() {
  const form = document.getElementById("registrationForm");
  const submitBtn = document.getElementById("submitBtn");
  const errorBanner = document.getElementById("formErrorBanner");
  const thankYouView = document.getElementById("thankYouView");
  const thankYouMessage = document.getElementById("thankYouMessage");
  const resetFormBtn = document.getElementById("resetFormBtn");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBanner.hidden = true;
    errorBanner.textContent = "";

    const fullName = form.fullName.value.trim();
    const phone = form.phone.value.trim();
    const state = form.state.value.trim();
    const nextOfKinName = form.nextOfKinName.value.trim();
    const nextOfKinPhone = form.nextOfKinPhone.value.trim();

    let hasError = false;

    if (fullName.length < 3) {
      setFieldError("fullName", "Enter your full name.");
      hasError = true;
    } else {
      setFieldError("fullName", "");
    }

    if (!isValidPhone(phone)) {
      setFieldError("phone", "Enter a valid phone number.");
      hasError = true;
    } else {
      setFieldError("phone", "");
    }

    if (!state) {
      setFieldError("state", "Select your state.");
      hasError = true;
    } else {
      setFieldError("state", "");
    }

    if (nextOfKinPhone && !isValidPhone(nextOfKinPhone)) {
      setFieldError("nextOfKinPhone", "Enter a valid phone number or leave blank.");
      hasError = true;
    } else {
      setFieldError("nextOfKinPhone", "");
    }

    if (hasError) return;

    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    try {
      const payload = new FormData();
      payload.append("fullName", fullName);
      payload.append("phone", phone);
      payload.append("state", state);
      payload.append("nextOfKinName", nextOfKinName);
      payload.append("nextOfKinPhone", nextOfKinPhone);

      if (CONFIG.googleSheetWebhookUrl) {
        await fetch(CONFIG.googleSheetWebhookUrl, {
          method: "POST",
          mode: "no-cors",
          body: payload,
        });
      } else {
        // Preview mode when no Apps Script URL is set yet.
        await new Promise((resolve) => setTimeout(resolve, 450));
      }

      const firstName = fullName.split(/\s+/)[0];
      thankYouMessage.textContent =
        "Thank you, " +
        firstName +
        ". Your registration for " +
        state +
        " State has been received. Corps officers will review the register and contact you through your phone number.";

      form.hidden = true;
      thankYouView.hidden = false;
      form.reset();
    } catch (_err) {
      errorBanner.textContent =
        "Could not submit right now. Check your internet connection and try again.";
      errorBanner.hidden = false;
    } finally {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;
    }
  });

  if (resetFormBtn) {
    resetFormBtn.addEventListener("click", () => {
      thankYouView.hidden = true;
      form.hidden = false;
      form.fullName.focus();
    });
  }
}

function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initLightbox() {
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  if (!lightbox || items.length === 0) return;

  let currentIndex = 0;

  function showImage(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const img = item.querySelector("img");
    const title = item.querySelector("figcaption strong")?.textContent || "";
    const desc = item.querySelector("figcaption span")?.textContent || "";
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = title ? title + " - " + desc : desc;
  }

  function open(index) {
    showImage(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => open(index));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(index);
      }
    });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
  nextBtn.addEventListener("click", () => showImage(currentIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateStates();
  initRegistrationForm();
  initMobileNav();
  initLightbox();
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
