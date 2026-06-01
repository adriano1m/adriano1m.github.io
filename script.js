/* ============================================================
   ADRIANO MISCHIATTI — MEDIA KIT WEBSITE
   script.js
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR — scroll effect + mobile toggle
============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navbarToggle');
  const menu   = document.getElementById('navbarMenu');
  const links  = menu ? menu.querySelectorAll('.nav-link') : [];

  // Scroll: add .scrolled class
  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !navbar.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  }

  function closeMenu() {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
})();

/* ============================================================
   2. ACTIVE NAV LINK — highlight on scroll
============================================================ */
(function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + entry.target.id);
          });
        }
      });
    },
    { rootMargin: '-30% 0px -65% 0px' }
  );

  sections.forEach(function (s) { observer.observe(s); });
})();

/* ============================================================
   3. SCROLL REVEAL — fade-in sections on scroll
============================================================ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Stagger cards inside containers
  document.querySelectorAll('.services-grid, .portfolio-grid, .social-grid').forEach(function (grid) {
    grid.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.1) + 's';
    });
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   4. COUNTER ANIMATION — hero stats
============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1400;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (el) { observer.observe(el); });
})();

/* ============================================================
   5. FOOTER — current year
============================================================ */
(function setYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   6. MEDIA KIT DOWNLOAD — placeholder handler
============================================================ */
(function initMediaKitDownload() {
  const btn = document.querySelector('.mediakit-download');
  if (!btn) return;

  btn.addEventListener('click', function (e) {
    // If no real PDF is linked, show a friendly message
    const href = btn.getAttribute('href');
    if (!href || href === '#') {
      e.preventDefault();
      showToast('Media Kit em breve. Entre em contato para receber o material.');
    }
  });
})();

/* ============================================================
   7. TOAST NOTIFICATION — lightweight feedback
============================================================ */
function showToast(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  // Inline styles to avoid extra CSS dependencies
  Object.assign(toast.style, {
    position:      'fixed',
    bottom:        '28px',
    left:          '50%',
    transform:     'translateX(-50%) translateY(8px)',
    background:    '#0A1F44',
    color:         '#ffffff',
    padding:       '13px 24px',
    borderRadius:  '100px',
    fontSize:      '.875rem',
    fontWeight:    '500',
    fontFamily:    "'Montserrat', sans-serif",
    boxShadow:     '0 8px 32px rgba(0,0,0,.2)',
    zIndex:        '9999',
    border:        '1px solid rgba(0,174,239,.3)',
    maxWidth:      'calc(100vw - 48px)',
    textAlign:     'center',
    opacity:       '0',
    transition:    'opacity .3s ease, transform .3s ease',
    pointerEvents: 'none',
    whiteSpace:    'nowrap',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(function () {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(function () {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(8px)';
    setTimeout(function () { toast.remove(); }, 350);
  }, 3800);
}

/* ============================================================
   8. TYPEWRITER — hero title
============================================================ */
(function initTypewriter() {
  const title = document.querySelector('[data-typewriter]');
  if (!title) return;

  // Acessibilidade: respeitar prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lines  = Array.from(title.querySelectorAll('.tw-line'));
  const cursor = title.querySelector('.tw-cursor');
  if (!lines.length || !cursor) return;

  // Captura o texto original (SEO preservado no HTML antes do JS rodar)
  const texts = lines.map(function (l) { return l.textContent.trim(); });
  lines.forEach(function (l) { l.textContent = ''; });

  let lineIdx = 0;
  let charIdx = 0;
  const speed  = 50;   // ms por caractere
  const pause  = 260;  // pausa entre linhas
  const jitter = 35;   // variação pra parecer humano

  function step() {
    if (lineIdx >= lines.length) {
      lines[lines.length - 1].appendChild(cursor);
      return;
    }

    const line = lines[lineIdx];
    const text = texts[lineIdx];

    if (charIdx === 0) line.appendChild(cursor);

    if (charIdx < text.length) {
      line.insertBefore(document.createTextNode(text[charIdx]), cursor);
      charIdx++;
      setTimeout(step, speed + Math.random() * jitter);
    } else {
      lineIdx++;
      charIdx = 0;
      setTimeout(step, pause);
    }
  }

  // Inicia logo após o fade-in do hero
  setTimeout(step, 650);
})();

/* ============================================================
   9. SMOOTH SCROLL OFFSET — account for fixed navbar height
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar').offsetHeight;
      const offset    = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
})();
