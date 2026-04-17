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

// ===========================
// SCROLL PROGRESS BAR
// ===========================
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(window.scrollY / total) * 100}%`;
}, { passive: true });

// ===========================
// ACTIVE NAV POR SEÇÃO
// ===========================
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-desktop a');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-desktop a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObs.observe(s));

// ===========================
// RIPPLE EM BOTÕES
// ===========================
function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple-wave';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}
document.querySelectorAll('.btn-primary, .btn-outline, .btn-form, .btn-header, .btn-nav-wpp')
  .forEach(btn => btn.addEventListener('click', addRipple));

// ===========================
// MENU TOGGLE X
// ===========================
menuToggle.addEventListener('click', () => menuToggle.classList.add('open'));
[navClose, navOverlay, ...Array.from(navLinks)].forEach(el =>
  el.addEventListener('click', () => menuToggle.classList.remove('open'))
);

// ===========================
// CONTADOR ANIMADO NOS STATS
// ===========================
function animateCounter(el, target, prefix, suffix, duration) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${prefix}${Math.round(eased * target)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${prefix}${target}${suffix}`;
      el.classList.add('popped');
    }
  };
  requestAnimationFrame(update);
}

let countersDone = false;
const statsBar = document.querySelector('.hero-bottom-bar');
if (statsBar) {
  const cObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersDone) {
      countersDone = true;
      setTimeout(() => {
        document.querySelectorAll('.stat-num[data-count]').forEach(el => {
          animateCounter(
            el,
            parseInt(el.dataset.count, 10),
            el.dataset.prefix || '',
            el.dataset.suffix || '',
            1800
          );
        });
      }, 400);
    }
  }, { threshold: 0.5 });
  cObs.observe(statsBar);
}

// ===========================
// PARTÍCULAS NO HERO
// ===========================
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : (Math.random() > 0.5 ? 0 : canvas.height);
      this.radius = Math.random() * 1.4 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.alpha  = Math.random() * 0.35 + 0.08;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(204,27,32,${this.alpha})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 70 }, () => new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(204,27,32,${0.07 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  let animFrameId;
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animFrameId = requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Pausa quando hero sai do viewport (performance)
  const heroEl = document.getElementById('hero');
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) animateParticles();
    else cancelAnimationFrame(animFrameId);
  }, { threshold: 0 }).observe(heroEl);
}

// ===========================
// TILT 3D NOS CARDS (desktop)
// ===========================
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.servico-card, .mercado-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ===========================
// MÁSCARA DE TELEFONE
// ===========================
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
