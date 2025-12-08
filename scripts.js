document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Logic
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileClose = document.querySelector('.mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-links a');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileOverlay.classList.add('active');
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      mobileOverlay.classList.remove('active');
    });
  }

  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileOverlay.classList.remove('active');
    });
  });

  // Theme Toggle (if we kept it, but we are enforcing dark mode for now)
  // We can add more interactive JS here later
});
