document.addEventListener('DOMContentLoaded', function() {
  // Function tabs (text panel + phone mock switch together)
  const tabs = document.querySelectorAll('.function-tab');
  const panels = document.querySelectorAll('.function-panel');
  const phones = document.querySelectorAll('.function-phone img');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      phones.forEach(ph => ph.classList.toggle('active', ph.dataset.panel === target));
      tab.classList.add('active');
      document.getElementById('panel-' + target).classList.add('active');
    });
  });

  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav--open');
      menuToggle.classList.toggle('menu-toggle--open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        menuToggle.classList.remove('menu-toggle--open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Mascot voice button
  const voiceBtn = document.querySelector('.btn-voice');
  if (voiceBtn) {
    const original = voiceBtn.innerHTML;
    const voice = new Audio(voiceBtn.dataset.voice || 'audio/imappi-voice.wav');
    voice.preload = 'none';
    voice.addEventListener('ended', () => { voiceBtn.innerHTML = original; voiceBtn.disabled = false; });
    voice.addEventListener('error', () => { voiceBtn.innerHTML = original; voiceBtn.disabled = false; });
    voiceBtn.addEventListener('click', () => {
      voice.currentTime = 0;
      voice.play();
      voiceBtn.innerHTML = '&#127911; おはなし中だっぴ…';
      voiceBtn.disabled = true;
    });
  }

  // Scroll reveal animation
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.pain-card, .feature-card, .emotion-card, .security-card, .voice-card, ' +
      '.pricing-card, .faq-item, .about-catch, .about-desc, .story-text, .story-image, ' +
      '.mascot-left, .mascot-bubble, .app-intro__screens, .chat-row, .conversation-phone'
    );
    revealTargets.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => observer.observe(el));
  }
});
