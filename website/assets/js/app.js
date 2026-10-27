/* =====================================================
   SCRIPT.JS - PERSONAL PORTFOLIO
   -----------------------------------------------------
   This file makes your website INTERACTIVE
   (menu, dark mode, animations, form checking...).

   Good news: you do NOT need to change anything in this
   file to get a working website. The only optional
   setting is in Section 0 (FORM SETTINGS).

   TABLE OF CONTENTS
   0.  Form settings  <-- optional
   1.  Small helper functions
   2.  Dark / light mode
   3.  Mobile hamburger menu
   4.  Active navigation link
   5.  Header shadow + back-to-top button
   6.  Scroll animations
   7.  Skill bars
   8.  Contact form validation
   9.  Footer year
   10. Image placeholders (if an image is missing)
===================================================== */


/* =====================================================
   0. FORM SETTINGS  (OPTIONAL)
   -----------------------------------------------------
   By default, when someone sends the contact form, their
   email app opens with the message already written, addressed
   to the email you put in index.html.

   Want messages sent directly to your inbox instead?
   1. Create a free form at https://formspree.io
   2. Copy your form address (it looks like "https://formspree.io/f/abcdwxyz")
   3. Paste it between the quotes below.
===================================================== */
const FORM_ENDPOINT = "";   // CHANGE YOUR FORM ADDRESS HERE (or leave it empty)


/* =====================================================
   1. SMALL HELPER FUNCTIONS
===================================================== */
const $  = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tells the CSS that JavaScript is working (so scroll animations can run safely)
root.classList.add("js");


/* =====================================================
   2. DARK / LIGHT MODE
   Remembers the visitor's choice. The first time, it
   follows their device setting (light or dark).
===================================================== */
const themeToggle = $(".theme-toggle");
const THEME_KEY = "portfolio-theme";

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;   // Some browsers block saving; that is fine
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    /* ignore */
  }
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}

const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(getSavedTheme() || (systemPrefersDark ? "dark" : "light"));

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
  });
}


/* =====================================================
   3. MOBILE HAMBURGER MENU
   Also handles smooth scrolling: the scrolling itself is
   done by CSS ("scroll-behavior: smooth" in style.css);
   here we close the menu after a link is tapped.
===================================================== */
const navToggle = $(".nav-toggle");
const navList = $("#nav-list");

function isMenuOpen() {
  return navToggle.getAttribute("aria-expanded") === "true";
}

function setMenu(open) {
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  navList.classList.toggle("is-open", open);
}

if (navToggle && navList) {
  // Open / close when the hamburger button is pressed
  navToggle.addEventListener("click", () => setMenu(!isMenuOpen()));

  // Close the menu after choosing a link
  navList.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  // Close with the Escape key (and return focus to the button)
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenu(false);
      navToggle.focus();
    }
  });

  // Close when clicking anywhere outside the header
  document.addEventListener("click", (event) => {
    if (isMenuOpen() && !event.target.closest(".site-header")) setMenu(false);
  });

  // Close automatically when the window becomes wide (e.g. rotating a tablet)
  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
}


/* =====================================================
   4. ACTIVE NAVIGATION LINK
   Highlights the menu link of the section you are reading.
===================================================== */
const navLinks = $$(".nav__link");
const pageSections = $$("main section[id]");

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === "#" + id;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window && pageSections.length) {
  // A section counts as "current" when it crosses a thin line near the middle of the screen
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  pageSections.forEach((section) => sectionObserver.observe(section));
}


/* =====================================================
   5. HEADER SHADOW + BACK-TO-TOP BUTTON
===================================================== */
const header = $(".site-header");
const backToTop = $(".back-to-top");
let scrollTicking = false;

function handleScroll() {
  const scrolled = window.scrollY;

  // Adds a thin line under the header once you scroll
  if (header) header.classList.toggle("is-scrolled", scrolled > 10);

  // Shows the back-to-top button after scrolling down a bit
  if (backToTop) backToTop.classList.toggle("is-visible", scrolled > 500);

  // When you reach the very bottom, make sure the last section is highlighted
  const reachedBottom = window.innerHeight + scrolled >= document.body.scrollHeight - 4;
  if (reachedBottom && pageSections.length) {
    setActiveLink(pageSections[pageSections.length - 1].id);
  }

  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    // requestAnimationFrame keeps scrolling smooth and fast
    if (!scrollTicking) {
      window.requestAnimationFrame(handleScroll);
      scrollTicking = true;
    }
  },
  { passive: true }
);
handleScroll();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    // Move keyboard focus back to the top of the page as well
    const brand = $(".brand");
    if (brand) brand.focus({ preventScroll: true });
  });
}


/* =====================================================
   6. SCROLL ANIMATIONS
   Elements with class="reveal" fade in when they come into view.
===================================================== */
const revealItems = $$(".reveal");

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);   // animate only once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  // Old browser or "reduce motion" setting: just show everything
  revealItems.forEach((item) => item.classList.add("is-visible"));
}


/* =====================================================
   7. SKILL BARS
   Reads data-level="90" from each skill in index.html,
   writes the percentage text, and fills the bar when it
   scrolls into view.
===================================================== */
const skills = $$(".skill");

skills.forEach((skill) => {
  // Keep the number between 0 and 100, even if a typo slips in
  const level = Math.max(0, Math.min(100, parseInt(skill.dataset.level, 10) || 0));
  const name = $(".skill__name", skill).textContent.trim();

  skill.style.setProperty("--level", level + "%");
  $(".skill__percent", skill).textContent = level + "%";

  // Lets screen readers announce the bar as "HTML, 90"
  const track = $(".skill__track", skill);
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-label", name);
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", "100");
  track.setAttribute("aria-valuenow", String(level));
});

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skills.forEach((skill) => skillObserver.observe(skill));
} else {
  skills.forEach((skill) => skill.classList.add("is-visible"));
}


/* =====================================================
   8. CONTACT FORM VALIDATION
   Checks the name, email and message before sending.
   Error messages appear under each field.
===================================================== */
const form = $("#contact-form");

if (form) {
  const statusBox = $("#form-status");
  const submitButton = $("button[type='submit']", form);
  const submitLabel = submitButton.textContent;

  // The rules for each field. Change the messages if you like.
  const fields = {
    name: {
      input: $("#name"),
      check: (value) =>
        value.trim().length >= 2 ? "" : "Please enter your name (at least 2 characters).",
    },
    email: {
      input: $("#email"),
      check: (value) => {
        if (value.trim() === "") return "Please enter your email address.";
        const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
        return looksLikeEmail ? "" : "That email does not look right. Try something like name@example.com.";
      },
    },
    message: {
      input: $("#message"),
      check: (value) =>
        value.trim().length >= 10 ? "" : "Please write a message (at least 10 characters).",
    },
  };

  // Checks one field, shows or clears its error, returns true if it is OK
  function validateField(key) {
    const { input, check } = fields[key];
    const errorText = check(input.value);
    $("#" + key + "-error").textContent = errorText;
    input.setAttribute("aria-invalid", errorText ? "true" : "false");
    return errorText === "";
  }

  function showStatus(message, type) {
    statusBox.textContent = message;
    statusBox.className = "form__status" + (type ? " is-" + type : "");
  }

  Object.keys(fields).forEach((key) => {
    const { input } = fields[key];
    // Check when the visitor leaves the field
    input.addEventListener("blur", () => validateField(key));
    // Once a field shows an error, re-check while typing so it clears as soon as it is fixed
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") validateField(key);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showStatus("", "");

    // Check every field; remember the first one with a problem
    let firstInvalid = null;
    Object.keys(fields).forEach((key) => {
      if (!validateField(key) && !firstInvalid) firstInvalid = fields[key].input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      showStatus("Please fix the highlighted fields and try again.", "error");
      return;
    }

    const name = fields.name.input.value.trim();
    const email = fields.email.input.value.trim();
    const message = fields.message.input.value.trim();

    if (FORM_ENDPOINT) {
      // OPTION A: send the message through your form service (see Section 0)
      try {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
        const response = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        if (!response.ok) throw new Error("Request failed");
        form.reset();
        showStatus("Thank you! Your message has been sent.", "success");
      } catch (error) {
        showStatus("Sorry, your message could not be sent. Please try again or email me directly.", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = submitLabel;
      }
    } else {
      // OPTION B (default): open the visitor's email app with the message ready to send.
      // The address comes from the email link in the Contact section of index.html.
      const emailLink = $("[data-contact-email]");
      const myEmail = emailLink
        ? emailLink.getAttribute("href").replace(/^mailto:/i, "").split("?")[0]
        : "";
      const subject = "Message from " + name + " (portfolio website)";
      const body = message + "\n\n" + name + "\n" + email;

      window.location.href =
        "mailto:" + myEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      showStatus("Your email app should open with your message ready to send. If it does not, please email me directly at " + myEmail + ".", "success");
    }
  });
}


/* =====================================================
   9. FOOTER YEAR
   Keeps the copyright year up to date automatically.
===================================================== */
const yearSpan = $("#year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();


/* =====================================================
   10. IMAGE PLACEHOLDERS
   If an image cannot be found (wrong file name or folder),
   show a friendly grey box that tells you which file to add
   instead of a broken-image icon. Remove this section once
   all your images are in place if you like - the site
   works fine either way.
===================================================== */
function showPlaceholder(img) {
  if (img.dataset.placeholder) return;    // only once per image
  img.dataset.placeholder = "true";

  const wanted = img.getAttribute("src") || "image";
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">' +
    '<rect width="800" height="600" fill="#DCE5E9"/>' +
    '<text x="400" y="290" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#3D4B57">Add your image here</text>' +
    '<text x="400" y="335" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#3D4B57">' +
    wanted.replace(/[<>&"]/g, "") +
    "</text></svg>";

  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

$$("img").forEach((img) => {
  img.addEventListener("error", () => showPlaceholder(img));
  // The image may have failed before this script started running
  if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) showPlaceholder(img);
});
