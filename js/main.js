(function () {
  'use strict';

  const nav = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const stickyCta = document.getElementById('sticky-cta');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const heroParallax = document.getElementById('hero-parallax');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.body.classList.add('is-loaded');

  // Navbar scroll effect
  function handleScroll() {
    const scrolled = window.scrollY > 60;
    nav?.classList.toggle('is-scrolled', scrolled);
    nav?.classList.toggle('shadow-lg', scrolled);

    if (window.scrollY > 600) {
      stickyCta?.classList.add('show');
    } else {
      stickyCta?.classList.remove('show');
    }

    updateActiveNavLink();

    if (!prefersReducedMotion && heroParallax) {
      const offset = Math.min(window.scrollY * 0.28, 140);
      heroParallax.style.transform = `translate3d(0, ${offset}px, 0) scale(1.05)`;
    }
  }

  // Active nav link on scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Mobile menu toggle
  function openMobileMenu() {
    mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  }

  mobileMenuBtn?.addEventListener('click', openMobileMenu);
  mobileMenuClose?.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Stagger delays for grouped reveals
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    const items = group.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    items.forEach((el, index) => {
      el.style.transitionDelay = `${index * 0.1}s`;
    });
  });

  // Scroll reveal
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const accentLines = document.querySelectorAll('.reveal-line');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    accentLines.forEach((el) => lineObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
    accentLines.forEach((el) => el.classList.add('is-visible'));
  }

  // Animated counters
  function animateCounter(el) {
    if (el.dataset.counted === 'true') return;

    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    el.dataset.counted = 'true';

    if (prefersReducedMotion || Number.isNaN(target)) {
      el.textContent = `${target}${suffix}`;
      el.classList.add('is-counted');
      return;
    }

    el.textContent = `0${suffix}`;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);
      el.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${target}${suffix}`;
        el.classList.add('is-counted');
      }
    }

    requestAnimationFrame(tick);
  }

  function startCounters() {
    document.querySelectorAll('[data-counter]').forEach(animateCounter);
  }

  const statsSection = document.getElementById('stats');
  const counters = document.querySelectorAll('[data-counter]');

  if (counters.length && statsSection && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounters();
            counterObserver.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );

    counterObserver.observe(statsSection);
  } else if (counters.length) {
    startCounters();
  }

  // Gallery drag scroll
  const gallery = document.getElementById('gallery-scroll');
  if (gallery) {
    let isDown = false;
    let startX;
    let scrollLeft;

    gallery.addEventListener('mousedown', (e) => {
      isDown = true;
      gallery.classList.add('cursor-grabbing');
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
    });

    gallery.addEventListener('mouseleave', () => {
      isDown = false;
      gallery.classList.remove('cursor-grabbing');
    });

    gallery.addEventListener('mouseup', () => {
      isDown = false;
      gallery.classList.remove('cursor-grabbing');
    });

    gallery.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 1.5;
      gallery.scrollLeft = scrollLeft - walk;
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();
