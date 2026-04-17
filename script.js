// ===========================
// CALHAS CUMBICA — script.js
// ===========================

// Header scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile nav
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navClose = document.getElementById('navClose');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('.nav-link');

function openNav() {
  navMenu.classList.add('open');
  navOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  navMenu.classList.remove('open');
  navOverlay.classList.remove('show');
  document.body.style.overflow = '';
}
menuToggle.addEventListener('click', openNav);
navClose.addEventListener('click', closeNav);
navOverlay.addEventListener('click', closeNav);
navLinks.forEach(l => l.addEventListener('click', closeNav));

// Smooth scroll para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal], .servico-card, .mvv-card, .mercado-card, .diferencial-item');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

// Formulário → WhatsApp
const form = document.getElementById('contatoForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const nome = form.nome.value.trim();
  const telefone = form.telefone.value.trim();
  const segmento = form.segmento.value;
  const mensagem = form.mensagem.value.trim();

  if (!nome || !telefone) {
    alert('Por favor, preencha pelo menos seu nome e telefone.');
    return;
  }

  const seg = segmento ? `\nSegmento: ${segmento}` : '';
  const msg = mensagem ? `\nMensagem: ${mensagem}` : '';
  const texto = `Olá! Me chamo *${nome}*.\nTelefone: ${telefone}${seg}${msg}\n\nGostaria de solicitar um orçamento.`;
  const url = `https://wa.me/5511974204001?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
});

// Máscara de telefone
const telInput = document.getElementById('telefone');
if (telInput) {
  telInput.addEventListener('input', () => {
    let v = telInput.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    telInput.value = v;
  });
}
