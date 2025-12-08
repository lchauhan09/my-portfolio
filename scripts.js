document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-links a');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      if (isOpen) {
        mobileMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      } else {
        mobileMenu.classList.add('active');
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
      }
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // --- GSAP Animations ---
  if (typeof gsap !== 'undefined') {
    // Register ScrollTrigger if available (it might be global)
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Init Animations
    const tl = gsap.timeline();

    tl.from('.display-text', {
      duration: 1.2,
      y: 50,
      opacity: 0,
      ease: 'power4.out',
      delay: 0.2
    })
      .from('.hero-main p, .hero-main h2, .hero-actions', {
        duration: 1,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out'
      }, "-=0.8")
      .from('.hero-data', {
        duration: 1.2,
        x: 50,
        opacity: 0,
        ease: 'expo.out'
      }, "-=1.0");

    // Scroll Reveals for Sections
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.utils.toArray('.glass-panel, .timeline-item').forEach(panel => {
        gsap.from(panel, {
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      });

      // Stagger for Grids
      const grids = document.querySelectorAll('.grid-3');
      grids.forEach(grid => {
        const cards = grid.querySelectorAll('.feature-card');
        if (cards.length > 0) {
          gsap.from(cards, {
            scrollTrigger: {
              trigger: grid,
              start: 'top 80%',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
          });
        }
      });
    }
  }
});
