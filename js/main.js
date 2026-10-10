/**
 * Nizam Ansari - Quantitative Software Engineer & Applied Mathematics
 * Interactive Script with Smooth Block-to-Block Transition Animations
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Top Scroll Progress Indicator
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  // 2. Mobile Navigation Drawer Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const isOpen = navLinks.classList.contains('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // 3. Smooth Block-to-Block Scroll Reveal Animation System
  const animateSelectors = [
    '.section-header',
    '.stat-item',
    '.timeline-card',
    '.project-card',
    '.skill-category-card',
    '.edu-card',
    '.achievement-card',
    '.profile-card',
    '.contact-method-card',
    '.contact-form-card',
    '.terminal-card',
    '.hero-content'
  ];

  // Assign reveal classes and staggered delays
  const elementsToAnimate = document.querySelectorAll(animateSelectors.join(', '));
  
  // Group elements within parent grids for staggering
  document.querySelectorAll('.stats-grid, .projects-grid, .skills-grid, .edu-grid, .achievements-grid, .profiles-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, index) => {
      child.classList.add(`stagger-${(index % 6) + 1}`);
    });
  });

  elementsToAnimate.forEach(el => {
    el.classList.add('reveal-block');
  });

  // Intersection Observer for smoothly revealing blocks on scroll
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal once smoothly
      }
    });
  }, observerOptions);

  elementsToAnimate.forEach(el => {
    // If element is already in initial viewport on page load, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      el.classList.add('revealed');
    } else {
      revealObserver.observe(el);
    }
  });

  // 4. Smooth Animated Project Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active filter button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategories = card.getAttribute('data-category') || '';
          const isMatch = (category === 'all') || cardCategories.split(' ').includes(category);

          if (isMatch) {
            card.style.display = 'flex';
            card.classList.remove('filtering-out');
            card.classList.add('filtering-in');
            setTimeout(() => {
              card.classList.remove('filtering-in');
            }, 450);
          } else {
            card.classList.add('filtering-out');
            setTimeout(() => {
              card.style.display = 'none';
              card.classList.remove('filtering-out');
            }, 250);
          }
        });
      });
    });
  }

  // 5. Smooth Anchor Scrolling for Nav Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const navHeight = document.querySelector('.site-nav')?.offsetHeight || 74;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 6. Copy to Clipboard Functionality
  window.copyToClipboard = function (text, label) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied to clipboard!`);
    }).catch(err => {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showToast(`${label} copied to clipboard!`);
      } catch (e) {
        showToast(`Failed to copy`);
      }
      document.body.removeChild(textArea);
    });
  };

  // 7. Toast Notification System
  function showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // 8. Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName')?.value || '';
      const email = document.getElementById('senderEmail')?.value || '';
      const subject = document.getElementById('messageSubject')?.value || 'Portfolio Contact Inquiry';
      const message = document.getElementById('senderMessage')?.value || '';

      const mailtoUrl = `mailto:nansari.0134@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      
      showToast('Opening default email client...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);
    });
  }
});
