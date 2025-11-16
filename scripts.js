document.getElementById('year').textContent = new Date().getFullYear();

const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if(saved) root.setAttribute('data-theme', saved);

themeToggle?.addEventListener('click', () => {
  const cur = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  if(cur === 'dark') root.setAttribute('data-theme','dark'); else root.removeAttribute('data-theme');
  localStorage.setItem('theme', cur === 'dark' ? 'dark' : 'light');
});

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle?.addEventListener('click', () => navLinks.classList.toggle('show'));