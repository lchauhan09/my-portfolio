// ============================================
// AURORA COMMAND - Main Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuToggle.querySelector('i').classList.remove('fa-times');
        menuToggle.querySelector('i').classList.add('fa-bars');
      });
    });
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // --- Active Nav Link ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const linkPath = href.split('/').pop();
      if (linkPath === currentPath ||
        (currentPath === '' && linkPath === '') ||
        (currentPath === 'index.html' && (linkPath === '' || linkPath === '/'))) {
        link.classList.add('active');
      }
    }
  });

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('revealed');
      }
    });
  };

  // Initial check
  revealOnScroll();

  // Listen for scroll
  window.addEventListener('scroll', revealOnScroll, { passive: true });

  // --- GSAP Animations (if available) ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Animate feature cards on scroll
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        delay: i * 0.05,
        ease: 'power3.out'
      });
    });

    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        x: -20,
        opacity: 0,
        duration: 0.5,
        delay: i * 0.08,
        ease: 'power3.out'
      });
    });

    // Animate project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        delay: (i % 3) * 0.05,
        ease: 'power3.out'
      });
    });
  }

  // --- Update Copyright Year ---
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // --- Console Easter Egg ---
  console.log('%c🚀 Aurora Command Portfolio', 'color: #00d4aa; font-size: 20px; font-weight: bold;');
  console.log('%cDesigned & Built by Lokesh Chauhan', 'color: #8892a2; font-size: 12px;');
  console.log('%cInterested in working together? Reach out!', 'color: #0099ff; font-size: 12px;');

});
