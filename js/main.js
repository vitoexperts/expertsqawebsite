
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
      if (scrollBtn) {
        if (window.scrollY > 360) scrollBtn.classList.add("show"); else scrollBtn.classList.remove("show");
      }
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
  
    /* ---------- Generic Service Modals ---------- */
    (function serviceModals() {
      const modal = document.getElementById("service-detail-modal");
      const body  = document.getElementById("svc-modal-body");
      const closeBtn = modal && modal.querySelector(".svc-modal-close");
      if (!modal || !body) return;

      const data = {
        functional: {
          tag: "CORE SERVICE", glow: false,
          title: "Functional Testing",
          lead: "Real engineers testing real scenarios — every click, every flow, every edge case your users might encounter.",
          features: [
            { title: "Requirements Analysis", desc: "We review specs, user stories, and acceptance criteria to design comprehensive test cases before a single line runs." },
            { title: "Manual Exploratory Testing", desc: "Experienced engineers explore the app as real users, uncovering usability issues and edge cases that scripted tests miss." },
            { title: "Automation-Assisted Execution", desc: "Repetitive regression flows are automated so engineers can focus on complex, high-value scenarios." },
            { title: "Defect Reporting & Tracking", desc: "Clear, reproducible bug reports with screenshots, logs, and step-by-step reproduction details integrated into your tracker." },
            { title: "Test Coverage Reporting", desc: "Detailed coverage metrics mapped to requirements and acceptance criteria so nothing ships untested." }
          ],
          benefits: [
            { icon: "fa-bug", text: "Early defect detection before production" },
            { icon: "fa-check-circle", text: "Full requirements traceability" },
            { icon: "fa-rocket", text: "Faster, confident release cycles" },
            { icon: "fa-users", text: "Works alongside existing QA or dev teams" },
            { icon: "fa-file-alt", text: "Structured defect & coverage reports" },
            { icon: "fa-shield-alt", text: "Reduced production incidents" }
          ]
        },
        automation: {
          tag: "AUTOMATION", glow: false,
          title: "Test Automation",
          lead: "Pipeline-ready test suites built with the right framework for your stack — delivering fast feedback on every commit.",
          features: [
            { title: "Framework Selection & Setup", desc: "We assess your stack and select the best fit: Playwright, Cypress, Appium, or Robot Framework — configured and ready to run." },
            { title: "Scalable Test Suite Development", desc: "Maintainable suites built with page object models, reusable components, and clear naming conventions your team can own." },
            { title: "CI/CD Pipeline Integration", desc: "Tests plug into GitHub Actions, GitLab CI, Jenkins, or any pipeline — running automatically on every push or pull request." },
            { title: "Parallel & Cross-Browser Execution", desc: "Tests run simultaneously across Chrome, Firefox, Safari, and Edge — cutting overall execution time dramatically." },
            { title: "Self-Healing Selectors", desc: "Smart selector strategies reduce maintenance overhead when UI elements change, keeping the suite green." },
            { title: "Reporting & Alerting", desc: "Allure and HTML reports published to your dashboard, with Slack or email alerts on failures for immediate visibility." }
          ],
          benefits: [
            { icon: "fa-bolt", text: "Up to 10x faster regression cycles" },
            { icon: "fa-code-branch", text: "Runs on every PR automatically" },
            { icon: "fa-desktop", text: "Cross-browser & cross-device coverage" },
            { icon: "fa-chart-line", text: "Lower long-term QA cost" },
            { icon: "fa-bell", text: "Instant failure notifications" },
            { icon: "fa-plug", text: "Integrates with any CI/CD pipeline" }
          ]
        },
        mobile: {
          tag: "MOBILE", glow: false,
          title: "Mobile App Testing",
          lead: "iOS and Android testing on 64+ real devices — native, hybrid, and cross-platform apps under real-world conditions.",
          features: [
            { title: "Real Device Lab — 64+ Devices", desc: "We test on physical iOS and Android devices across multiple OS versions, screen sizes, and manufacturers — not just simulators." },
            { title: "Native & Hybrid App Support", desc: "Full coverage for native Swift/Kotlin apps and hybrid frameworks including React Native, Flutter, and Ionic." },
            { title: "Appium Automation", desc: "Automated mobile regression and smoke suites built with Appium, integrated into your CI/CD pipeline." },
            { title: "Performance & Battery Testing", desc: "CPU usage, memory consumption, battery drain, and network behaviour profiled under realistic load conditions." },
            { title: "Gesture & Sensor Testing", desc: "Touch gestures, swipes, pinch-zoom, camera, GPS, biometrics, and device sensor interactions validated on real hardware." },
            { title: "App Store Readiness", desc: "Pre-submission checks aligned with Apple App Store and Google Play guidelines to reduce rejection risk." }
          ],
          benefits: [
            { icon: "fa-mobile-alt", text: "64+ real iOS & Android devices" },
            { icon: "fa-layer-group", text: "Native, hybrid, cross-platform coverage" },
            { icon: "fa-cogs", text: "Automated regression with Appium" },
            { icon: "fa-tachometer-alt", text: "Performance & battery profiling" },
            { icon: "fa-wifi", text: "Real network condition simulation" },
            { icon: "fa-store", text: "App Store pre-submission validation" }
          ]
        },
        api: {
          tag: "API", glow: false,
          title: "API Testing",
          lead: "Comprehensive validation of REST, GraphQL, and SOAP APIs — from payload correctness to security and performance.",
          features: [
            { title: "REST & GraphQL Validation", desc: "Endpoint testing covering request/response schemas, status codes, headers, pagination, and error handling across all API surfaces." },
            { title: "Contract Testing", desc: "Consumer-driven contracts ensure API providers and consumers stay in sync as services evolve independently." },
            { title: "Authentication & Security Checks", desc: "OAuth2, JWT, API key validation, injection attack prevention, and rate limiting verified across all protected endpoints." },
            { title: "API Load & Stress Testing", desc: "High-concurrency performance testing with JMeter and k6 to validate throughput, latency, and error rates under load." },
            { title: "Automated Regression with Newman", desc: "Postman collections executed automatically via Newman as part of every CI/CD pipeline run." },
            { title: "Mock & Stub Integration", desc: "Testing services in isolation using mocks and stubs to eliminate dependencies on unavailable third-party systems." }
          ],
          benefits: [
            { icon: "fa-check-double", text: "Full endpoint & schema coverage" },
            { icon: "fa-file-contract", text: "Contract-driven API validation" },
            { icon: "fa-lock", text: "Security & auth vulnerability detection" },
            { icon: "fa-chart-bar", text: "Performance benchmarking under load" },
            { icon: "fa-code-branch", text: "CI/CD integration via Newman" },
            { icon: "fa-cubes", text: "Isolated service testing with mocks" }
          ]
        },
        performance: {
          tag: "PERFORMANCE", glow: false,
          title: "Performance Testing",
          lead: "Stress, load, and scalability testing that gives you confidence your application holds up when it matters most.",
          features: [
            { title: "Load Testing", desc: "Simulating expected peak traffic volumes to validate system behaviour, response times, and throughput under normal high-load conditions." },
            { title: "Stress Testing", desc: "Pushing the system progressively beyond capacity to identify breaking points, failure modes, and graceful degradation behaviour." },
            { title: "Spike Testing", desc: "Simulating sudden, sharp traffic surges to measure how quickly the system responds and recovers from unexpected demand." },
            { title: "Soak Testing", desc: "Sustained load over extended periods to detect memory leaks, connection pool exhaustion, and performance degradation over time." },
            { title: "Bottleneck Analysis", desc: "Deep profiling of database queries, API latency, server CPU/memory, and network throughput to pinpoint root causes." },
            { title: "Performance Reports & SLA Validation", desc: "Baseline metrics, trend analysis, and clear recommendations mapped to your SLA thresholds and business requirements." }
          ],
          benefits: [
            { icon: "fa-server", text: "Confident scaling & capacity planning" },
            { icon: "fa-search", text: "Bottleneck identification before launch" },
            { icon: "fa-tools", text: "JMeter & k6 tooling" },
            { icon: "fa-cloud", text: "Cloud-based load generation" },
            { icon: "fa-handshake", text: "SLA & SLO validation" },
            { icon: "fa-file-alt", text: "Detailed performance reports" }
          ]
        },
        accessibility: {
          tag: "ACCESSIBILITY", glow: false,
          title: "Accessibility Testing",
          lead: "WCAG 2.1-compliant audits combining automated scanning and real assistive technology testing for truly inclusive products.",
          features: [
            { title: "WCAG 2.1 Compliance Audits", desc: "Structured testing against Level A, AA, and AAA success criteria — covering perceivability, operability, understandability, and robustness." },
            { title: "Screen Reader Testing", desc: "Real testing with NVDA, JAWS, and VoiceOver to validate that all content and interactions work correctly with assistive technology." },
            { title: "Keyboard Navigation", desc: "Full keyboard operability verification including focus management, tab order, skip links, and keyboard trap prevention." },
            { title: "Colour Contrast & Visual Design", desc: "Contrast ratio checks for text and interactive elements, text sizing validation, and visual presentation requirements." },
            { title: "Automated CI/CD Scanning", desc: "axe-core and Lighthouse integrated into your pipeline for continuous accessibility monitoring on every build." },
            { title: "VPAT Generation", desc: "Voluntary Product Accessibility Template documentation to support enterprise procurement and legal compliance requirements." }
          ],
          benefits: [
            { icon: "fa-universal-access", text: "WCAG 2.1 A / AA / AAA coverage" },
            { icon: "fa-assistive-listening-systems", text: "Real screen reader validation" },
            { icon: "fa-keyboard", text: "Full keyboard operability checks" },
            { icon: "fa-code-branch", text: "Automated CI/CD integration" },
            { icon: "fa-file-alt", text: "VPAT documentation" },
            { icon: "fa-gavel", text: "Legal compliance support" }
          ]
        },
        regression: {
          tag: "REGRESSION", glow: false,
          title: "Regression Testing",
          lead: "Every release verified — automation covers the happy paths so your engineers can focus on what changed.",
          features: [
            { title: "Automated Smoke Tests", desc: "Fast, lightweight checks triggered on every commit to catch critical breakages immediately and keep the pipeline green." },
            { title: "Full Regression Suites", desc: "Comprehensive functional coverage executed before every release to confirm existing features remain unaffected by new changes." },
            { title: "Risk-Based Prioritisation", desc: "Test effort focused on highest-impact areas based on code change analysis, reducing execution time without sacrificing coverage." },
            { title: "Parallel Multi-Environment Execution", desc: "Suites run simultaneously across staging, UAT, and pre-production environments to cut total execution time." },
            { title: "Flaky Test Detection & Quarantine", desc: "Automated identification of unstable tests with quarantine workflows to keep pipeline results reliable and trustworthy." },
            { title: "Regression Trend Reporting", desc: "Historical pass/fail trend analysis surfacing recurring problem areas and measuring the impact of fixes over time." }
          ],
          benefits: [
            { icon: "fa-check-circle", text: "Confidence in every release" },
            { icon: "fa-filter", text: "Risk-based test prioritisation" },
            { icon: "fa-bolt", text: "Fast smoke tests on every PR" },
            { icon: "fa-random", text: "Flaky test detection & quarantine" },
            { icon: "fa-chart-line", text: "Historical trend analysis" },
            { icon: "fa-layer-group", text: "Parallel multi-environment runs" }
          ]
        },
        integration: {
          tag: "INTEGRATION", glow: false,
          title: "Integration Testing",
          lead: "Testing where systems connect — third-party APIs, microservices, payment gateways, and event-driven architectures.",
          features: [
            { title: "Third-Party API Integration", desc: "End-to-end validation of integrations with payment gateways, CRMs, ERPs, analytics platforms, and external service providers." },
            { title: "Microservices Testing", desc: "Service-to-service communication, data contracts, circuit breaker behaviour, and error propagation validated in realistic environments." },
            { title: "Database Integration", desc: "ORM behaviour, query correctness, migration integrity, transactions, and data consistency across service boundaries." },
            { title: "Message Queue & Event Testing", desc: "Kafka, RabbitMQ, and SQS integration validation covering message ordering, delivery guarantees, and consumer behaviour." },
            { title: "End-to-End Workflow Testing", desc: "Full business flow validation across multiple systems — from user action through every downstream service to final state." },
            { title: "Environment Parity Testing", desc: "Configuration drift detection between staging and production environments to prevent integration failures at release." }
          ],
          benefits: [
            { icon: "fa-plug", text: "Third-party API & gateway coverage" },
            { icon: "fa-cubes", text: "Microservices contract validation" },
            { icon: "fa-database", text: "Database & migration integrity" },
            { icon: "fa-exchange-alt", text: "Event-driven architecture testing" },
            { icon: "fa-sitemap", text: "End-to-end workflow coverage" },
            { icon: "fa-equals", text: "Staging/production parity checks" }
          ]
        }
      };

      function buildModal(key) {
        const d = data[key];
        if (!d) return;
        const tagClass = d.glow ? "svc-tag svc-tag-glow" : "svc-tag";
        const featuresHtml = d.features.map(f => `
          <div class="agentic-step">
            <div class="step-num">${String(d.features.indexOf(f) + 1).padStart(2, "0")}</div>
            <div><strong>${f.title}</strong><p>${f.desc}</p></div>
          </div>`).join("");
        const benefitsHtml = d.benefits.map(b => `
          <div class="benefit-item"><i class="fas ${b.icon}"></i><span>${b.text}</span></div>`).join("");
        body.innerHTML = `
          <span class="${tagClass}">${d.tag}</span>
          <h3 class="agentic-modal-title">${d.title}</h3>
          <p class="agentic-modal-lead">${d.lead}</p>
          <h4 class="agentic-section-hd">How It Works</h4>
          <div class="agentic-steps">${featuresHtml}</div>
          <h4 class="agentic-section-hd">What You Get</h4>
          <div class="agentic-benefits">${benefitsHtml}</div>
          <a href="#contact" class="btn btn-glow agentic-modal-cta svc-generic-cta">Get Started →</a>`;
        // close modal when CTA is clicked (smooth scroll handled by existing anchor listener)
        body.querySelector(".svc-generic-cta").addEventListener("click", closeModal);
      }

      function openModal(key) {
        buildModal(key);
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        modal.scrollTop = 0;
      }
      function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }

      closeBtn.addEventListener("click", closeModal);
      modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

      document.querySelectorAll("[data-service-key]").forEach(link => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          openModal(link.dataset.serviceKey);
        });
      });
    })();

    /* ---------- Agentic Testing Modal ---------- */
    (function agenticModal() {
      const trigger = document.getElementById("agentic-learn-more");
      const modal = document.getElementById("agentic-modal");
      const closeBtn = modal && modal.querySelector(".agentic-close-btn");
      if (!trigger || !modal) return;

      const open = (e) => {
        e.preventDefault();
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      };
      const close = () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      };

      trigger.addEventListener("click", open);
      closeBtn.addEventListener("click", close);
      modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

      // Close modal CTA should close modal then scroll to contact
      const cta = modal.querySelector(".agentic-modal-cta");
      if (cta) cta.addEventListener("click", () => close());
    })();

    /* ---------- Add fade-up to main sections ---------- */
    ["#home", "#about", "#services", "#team", "#tech", "#testimonials", "#contact"].forEach(id => {
      const el = document.querySelector(id);
      if (el) el.classList.add("fade-up");
    });
  


/* ---------- Team Carousel ---------- */
(function teamCarousel() {
  const viewport = document.querySelector(".carousel-viewport");
  const track    = document.querySelector(".carousel-track");
  const btnPrev  = document.querySelector(".carousel-btn--prev");
  const btnNext  = document.querySelector(".carousel-btn--next");
  const dotsWrap = document.getElementById("team-dots");
  if (!track || !viewport) return;

  const cards = Array.from(track.querySelectorAll(".team-card"));
  const total = cards.length;
  let current = 0;
  let autoTimer = null;

  function stepPx() {
    return cards[0] ? cards[0].offsetWidth + 18 : 218;
  }
  function visibleCount() {
    return Math.max(1, Math.floor(viewport.offsetWidth / stepPx()));
  }
  function maxIdx() {
    return Math.max(0, total - visibleCount());
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIdx()));
    track.style.transform = "translateX(-" + (current * stepPx()) + "px)";
    updateDots();
    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.disabled = current >= maxIdx();
  }

  function buildDots() {
    if (!dotsWrap) return;
    var pages = Math.ceil(total / Math.max(1, visibleCount()));
    dotsWrap.innerHTML = Array.from({ length: pages }, function(_, i) {
      return '<button class="carousel-dot' + (i === 0 ? " active" : "") +
             '" data-page="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>';
    }).join("");
    dotsWrap.querySelectorAll(".carousel-dot").forEach(function(dot) {
      dot.addEventListener("click", function() {
        goTo(parseInt(dot.dataset.page) * visibleCount());
        resetAuto();
      });
    });
  }

  function updateDots() {
    if (!dotsWrap) return;
    var pg = Math.floor(current / Math.max(1, visibleCount()));
    dotsWrap.querySelectorAll(".carousel-dot").forEach(function(dot, i) {
      dot.classList.toggle("active", i === pg);
    });
  }

  function autoNext() { goTo(current >= maxIdx() ? 0 : current + 1); }
  function startAuto() { autoTimer = setInterval(autoNext, 4000); }
  function stopAuto()  { clearInterval(autoTimer); }
  function resetAuto() { stopAuto(); startAuto(); }

  if (btnPrev) btnPrev.addEventListener("click", function() { goTo(current - 1); resetAuto(); });
  if (btnNext) btnNext.addEventListener("click", function() { goTo(current + 1); resetAuto(); });

  viewport.addEventListener("mouseenter", stopAuto);
  viewport.addEventListener("mouseleave", startAuto);

  var touchStartX = 0;
  viewport.addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  viewport.addEventListener("touchend", function(e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  window.addEventListener("resize", function() { buildDots(); goTo(Math.min(current, maxIdx())); });

  buildDots();
  goTo(0);
  startAuto();
})();

  })();
  