
// main.js - futuristic, lightweight, no deps
(function () {
    "use strict";
  
    /* ---------- DOM helpers ---------- */
    const $ = (s, root = document) => root.querySelector(s);
    const $$ = (s, root = document) => Array.from((root || document).querySelectorAll(s));
  
    /* ---------- Page loader ---------- */
    window.addEventListener("load", () => {
      const loader = document.getElementById("page-loader");
      if (loader) {
        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";
        setTimeout(() => loader.remove(), 600);
      }
      const yr = new Date().getFullYear();
      const el = document.getElementById("year");
      if (el) el.textContent = yr;
  
      if (window.PARTICLE_API && typeof window.PARTICLE_API.resize === "function") {
        window.PARTICLE_API.resize();
      }
    });
  
    /* ---------- Mobile menu toggle ---------- */
    const mobileToggle = $(".mobile-toggle");
    const navLinks = $("#navLinks");
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener("click", () => {
        const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
        mobileToggle.setAttribute("aria-expanded", String(!expanded));
        navLinks.classList.toggle("open");
        mobileToggle.classList.toggle("open");
      });
    }
    $$(".nav-links a").forEach(a => a.addEventListener("click", () => {
      if (navLinks) navLinks.classList.remove("open");
      if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "false");
    }));
  
    /* ---------- Smooth anchor scrolling ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 28);
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });
  
    /* ---------- Typed headline ---------- */
    (function typed() {
      const el = $(".typed");
      if (!el) return;
      const phrases = [
        "On-demand QA teams.",
        "Automation & CI integration.",
        "Performance testing & load analysis.",
        "Device labs — mobile & desktop."
      ];
      let pi = 0, si = 0, deleting = false;
      const tick = () => {
        const full = phrases[pi];
        si = deleting ? si - 1 : si + 1;
        el.textContent = full.slice(0, si);
        if (!deleting && si === full.length) {
          deleting = true;
          setTimeout(tick, 1100);
        } else if (deleting && si === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, 400);
        } else {
          setTimeout(tick, deleting ? 40 : 70);
        }
      };
      tick();
    })();
  
    /* ---------- Reveal on scroll (fade-up) ---------- */
    (function revealOnScroll() {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      }, { root: null, threshold: 0.12 });
  
      document.querySelectorAll(".fade-up, .about-card, .service-card, .card-glass").forEach(el => {
        el.classList.add("fade-up");
        obs.observe(el);
      });
    })();
  
    /* ---------- Carousel (testimonials) ---------- */
    (function carousel() {
      const slides = $$(".carousel .slide");
      if (!slides.length) return;
      let idx = 0;
      const show = (n) => {
        slides.forEach((s, i) => s.classList.toggle("active", i === n));
      };
      show(0);
      setInterval(() => {
        idx = (idx + 1) % slides.length;
        show(idx);
      }, 4800);
    })();
  
    /* ---------- Contact form (mailto) ---------- */
    (function forms() {
      const contactForm = $("#contactForm");
      if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const name = encodeURIComponent($("#contactName").value || "");
          const email = encodeURIComponent($("#contactEmail").value || "");
          const msg = encodeURIComponent($("#contactMessage").value || "");
          const subject = encodeURIComponent("Contact from website");
          const body = `Hi, I am ${name}.\n\n${msg}\n\nContact: ${email}\n\n`;
          window.location.href = `mailto:info@expertsqa.com?subject=${subject}&body=${body}`;
        });
      }
    })();
  
    /* ---------- Scroll to top ---------- */
    const scrollBtn = $("#scrollTop");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 360) scrollBtn.classList.add("show"); else scrollBtn.classList.remove("show");
      const navWrap = document.querySelector(".nav-wrap");
      if (navWrap) {
        if (window.scrollY > 24) navWrap.classList.add("scrolled"); else navWrap.classList.remove("scrolled");
      }
    });
    if (scrollBtn) scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  
    /* ---------- Counters ---------- */
    (function counters() {
      const counters = $$(".metric .num");
      if (!counters.length) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-target") || el.textContent || "0", 10);
            animateNumber(el, target, 1100);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(c => obs.observe(c));
    })();
  
    function animateNumber(el, to, duration) {
      const start = performance.now();
      const from = parseInt(el.textContent.replace(/\D/g, '')) || 0;
      const diff = to - from;
      if (diff <= 0) { el.textContent = to; return; }
      function step(ts) {
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(from + diff * eased);
        el.textContent = val;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  
    /* ---------- Subtle tilt for interactive cards ---------- */
    (function tilt() {
      const elements = $$("[data-tilt]");
      if (!elements.length) return;
      elements.forEach(el => {
        el.addEventListener("pointermove", (e) => {
          const rect = el.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const rx = (py - 0.5) * 8; // rotateX
          const ry = (px - 0.5) * -12; // rotateY
          el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
        });
        el.addEventListener("pointerleave", () => {
          el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
        });
      });
    })();
  
    /* ---------- Particle background (canvas) ---------- */
    (function particles() {
      const canvas = document.getElementById("bg-canvas");
      if (!canvas) { window.PARTICLE_API = {}; return; }
      const ctx = canvas.getContext("2d");
      let w = 0, h = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
      let particles = [];
      const PARTICLE_COUNT = Math.max(40, Math.round((window.innerWidth * window.innerHeight) / 120000));
  
      function resize() {
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        canvas.style.width = w + "px"; canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
  
      function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 0.8 + Math.random() * 3.2,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.35,
            hue: 160 + Math.random() * 80,
            alpha: 0.05 + Math.random() * 0.16
          });
        }
      }
  
      function draw() {
        ctx.clearRect(0, 0, w, h);
        for (let p of particles) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -30) p.x = w + 30;
          if (p.x > w + 30) p.x = -30;
          if (p.y < -30) p.y = h + 30;
          if (p.y > h + 30) p.y = -30;
  
          // glow
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
          g.addColorStop(0, `hsla(${p.hue},85%,55%,${p.alpha})`);
          g.addColorStop(0.4, `hsla(${p.hue},80%,45%,${p.alpha * 0.3})`);
          g.addColorStop(1, `hsla(${p.hue},80%,40%,0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
  
        // connecting faint lines
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(0,255,213,${0.01 * (1 - dist / 120)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
  
        requestAnimationFrame(draw);
      }
  
      window.PARTICLE_API = { resize: () => { resize(); createParticles(); } };
  
      function start() { resize(); createParticles(); draw(); }
      start();
      window.addEventListener("resize", debounce(() => { resize(); createParticles(); }, 180));
    })();
  
    /* ---------- Utility: debounce ---------- */
    function debounce(fn, wait) {
      let t;
      return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
    }
  
    /* ---------- Accessibility: close mobile menu on outside click ---------- */
    document.addEventListener("click", (e) => {
      if (!navLinks || !mobileToggle) return;
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });
  
    /* ---------- Add fade-up to main sections ---------- */
    ["#home", "#about", "#services", "#team", "#tech", "#testimonials", "#contact"].forEach(id => {
      const el = document.querySelector(id);
      if (el) el.classList.add("fade-up");
    });
  


    /* ---------- Team Carousel ---------- */
(function teamCarousel() {
    const track = document.querySelector(".carousel-track");
    const cards = document.querySelectorAll(".team-card");
    const btnLeft = document.querySelector(".carousel-btn.left");
    const btnRight = document.querySelector(".carousel-btn.right");
    if (!track || !cards.length) return;
  
    let index = 0;
    const visible = 3;
    const total = cards.length;
    let interval;
  
    function update() {
      const offset = -index * (cards[0].offsetWidth + 20);
      track.style.transform = `translateX(${offset}px)`;
    }
  
    function next() {
      index = (index + 1) % total;
      update();
    }
  
    function prev() {
      index = (index - 1 + total) % total;
      update();
    }
  
    btnRight.addEventListener("click", next);
    btnLeft.addEventListener("click", prev);
  
    function startAuto() {
      interval = setInterval(next, 5000);
    }
    function stopAuto() {
      clearInterval(interval);
    }
  
    track.addEventListener("mouseenter", stopAuto);
    track.addEventListener("mouseleave", startAuto);
  
    startAuto();
  })();
  
  })();
  