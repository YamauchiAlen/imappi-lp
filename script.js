document.addEventListener('DOMContentLoaded', function() {
  // Function tabs
  const tabs = document.querySelectorAll('.function-tab');
  const panels = document.querySelectorAll('.function-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
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

  // Contact form: open the user's mail app with the composed inquiry
  const CONTACT_EMAIL = 'info@hikaso.com';
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const data = new FormData(form);
      const subject = '【イマッピ】お問い合わせ：' + data.get('type');
      const body = [
        'お名前：' + data.get('name'),
        '会社名：' + (data.get('company') || '（記入なし）'),
        'メールアドレス：' + data.get('email'),
        'お問い合わせ種別：' + data.get('type'),
        '',
        'お問い合わせ内容：',
        data.get('message')
      ].join('\n');
      window.location.href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      const status = document.getElementById('form-status');
      if (status) {
        status.textContent = 'メールアプリが開きます。開かない場合は ' + CONTACT_EMAIL + ' まで直接ご連絡ください。';
      }
    });
  }

  // Scroll reveal animation
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.pain-card, .feature-card, .emotion-card, .security-card, .voice-card, ' +
      '.pricing-card, .faq-item, .about-catch, .about-desc, .story-text, .story-image, ' +
      '.mascot-image, .mascot-info, .app-intro__screens, .chat-row, .phone-frame'
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
