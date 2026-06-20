(function () {
  'use strict';

  const nav = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const stickyCta = document.getElementById('sticky-cta');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Navbar scroll effect
  function handleScroll() {
    if (window.scrollY > 80) {
      nav?.classList.add('shadow-lg');
    } else {
      nav?.classList.remove('shadow-lg');
    }

    if (window.scrollY > 600) {
      stickyCta?.classList.add('show');
    } else {
      stickyCta?.classList.remove('show');
    }

    updateActiveNavLink();
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

  // Scroll reveal
  const revealElements = document.querySelectorAll('.reveal');

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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
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
