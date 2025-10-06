// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    /* ========== Typed Text Effect ========== */
    const typedElement = document.querySelector(".element");
    if (typedElement) {
      const strings = Array.from(document.querySelectorAll(".sub-element")).map(
        (el) => el.textContent.trim()
      );
  
      let i = 0, j = 0, current = "", isDeleting = false;
  
      function type() {
        const fullText = strings[i];
        current = isDeleting
          ? fullText.substring(0, j--)
          : fullText.substring(0, j++);
  
        typedElement.textContent = current;
  
        let speed = isDeleting ? 40 : 80;
        if (!isDeleting && current === fullText) {
          speed = 1500;
          isDeleting = true;
        } else if (isDeleting && current === "") {
          isDeleting = false;
          i = (i + 1) % strings.length;
          speed = 500;
        }
        setTimeout(type, speed);
      }
  
      type();
    }
  
    /* ========== Sticky Navbar ========== */
    const navbar = document.querySelector("nav");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    });
  
    /* ========== Smooth Scroll ========== */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: target.offsetTop - 60,
            behavior: "smooth",
          });
        }
      });
    });
  
    /* ========== Preloader Fade-Out ========== */
    window.addEventListener("load", () => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => (preloader.style.display = "none"), 500);
      }
    });
  
    /* ========== Mobile Menu Toggle ========== */
    const mobileMenu = document.querySelector(".mobile-menu");
    const navLinks = document.getElementById("navLinks");
    if (mobileMenu) {
      mobileMenu.addEventListener("click", () => {
        navLinks.classList.toggle("active");
      });
    }
  });
  