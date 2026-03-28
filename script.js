// ===================================
// イマッピ Landing Page JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  // FAQ Accordion
  initFaqAccordion();

  // Function Tabs
  initFunctionTabs();

  // Mobile Menu
  initMobileMenu();

  // Smooth Scroll
  initSmoothScroll();

  // Header Scroll Effect
  initHeaderScroll();
});

// ===================================
// FAQ Accordion
// ===================================
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(faq => {
        faq.classList.remove('active');
        const icon = faq.querySelector('.faq-icon');
        if (icon) icon.textContent = '+';
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        const icon = item.querySelector('.faq-icon');
        if (icon) icon.textContent = '−';
      }
    });
  });
}

// ===================================
// Function Tabs
// ===================================
function initFunctionTabs() {
  const tabs = document.querySelectorAll('.function-tab');
  const panels = document.querySelectorAll('.function-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');

      // Remove active from all tabs and panels
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Add active to clicked tab and corresponding panel
      tab.classList.add('active');
      const activePanel = document.querySelector(`.function-panel[data-panel="${tabId}"]`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });
}

// ===================================
// Mobile Menu
// ===================================
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuBtn.classList.toggle('active');
    });
  }
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const nav = document.querySelector('.nav');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (nav) nav.classList.remove('active');
        if (menuBtn) menuBtn.classList.remove('active');
      }
    });
  });
}

// ===================================
// Header Scroll Effect
// ===================================
function initHeaderScroll() {
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  });
}

// ===================================
// Intersection Observer for Animations
// ===================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements with animation class
  const animatedElements = document.querySelectorAll('.feature-card, .security-card, .review-card, .pricing-card');
  animatedElements.forEach(el => observer.observe(el));
}
