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
      if (href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Mascot expression switcher: clicking a face swaps the big mascot image
  const mascotMain = document.querySelector('.mascot-image img');
  const expressions = document.querySelectorAll('.mascot-expressions img');
  if (mascotMain && expressions.length) {
    const defaultSrc = mascotMain.getAttribute('src');
    expressions.forEach(img => {
      img.addEventListener('click', () => {
        const alreadyActive = img.classList.contains('active');
        expressions.forEach(i => i.classList.remove('active'));
        if (alreadyActive) {
          mascotMain.src = defaultSrc;
        } else {
          img.classList.add('active');
          mascotMain.src = img.getAttribute('src');
        }
      });
    });
  }

  // Contact form: submit directly via FormSubmit (delivered to CONTACT_EMAIL),
  // falling back to the user's mail app if the request fails
  const CONTACT_EMAIL = 'info@hikaso.com';
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const status = document.getElementById('form-status');
      const data = new FormData(form);
      btn.disabled = true;
      btn.textContent = '送信中…';
      status.textContent = '';
      try {
        const res = await fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: '【イマッピ】お問い合わせ：' + data.get('type'),
            _template: 'table',
            'お名前': data.get('name'),
            '会社名': data.get('company') || '（記入なし）',
            'メールアドレス': data.get('email'),
            'お問い合わせ種別': data.get('type'),
            'お問い合わせ内容': data.get('message')
          })
        });
        if (!res.ok) throw new Error('send failed: ' + res.status);
        form.reset();
        status.textContent = 'お問い合わせを送信しました！';
      } catch (err) {
        // fallback: compose the inquiry in the visitor's mail app
        const body = [
          'お名前：' + data.get('name'),
          '会社名：' + (data.get('company') || '（記入なし）'),
          'メールアドレス：' + data.get('email'),
          'お問い合わせ種別：' + data.get('type'),
          '',
          'お問い合わせ内容：',
          data.get('message')
        ].join('\n');
        const link = document.createElement('a');
        link.href = 'mailto:' + CONTACT_EMAIL +
          '?subject=' + encodeURIComponent('【イマッピ】お問い合わせ：' + data.get('type')) +
          '&body=' + encodeURIComponent(body);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        link.remove();
        status.textContent = '送信できなかったため、メールアプリを開きました。開かない場合は ' + CONTACT_EMAIL + ' まで直接ご連絡ください。';
      }
      btn.disabled = false;
      btn.textContent = '送信する';
    });
  }

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
