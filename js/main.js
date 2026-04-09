/* ============================================================
   KIRIMARI EMPOWERMENT CENTRE - Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== NAVIGATION ====================
  
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');
  
  // Scroll effect for navbar
  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll(); // Initial check
  
  // Mobile menu toggle
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
  }
  
  // Close mobile menu when clicking a link
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  
  // Close mobile menu on window resize (if desktop)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && mobileNav.classList.contains('open')) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  
  
  // ==================== SCROLL REVEAL ANIMATIONS ====================
  
  function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
    
    reveals.forEach(function(element) {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 100;
      
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('revealed');
      }
    });
  }
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check
  
  
  // ==================== COUNTER ANIMATION ====================
  
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(function(counter) {
      const windowHeight = window.innerHeight;
      const elementTop = counter.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - 50 && !counter.classList.contains('counted')) {
        counter.classList.add('counted');
        
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = function() {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
      }
    });
  }
  
  window.addEventListener('scroll', animateCounters);
  animateCounters(); // Initial check
  
  
  // ==================== ACCORDION ====================
  
  const accordionItems = document.querySelectorAll('.accordion__item');
  
  accordionItems.forEach(function(item) {
    const header = item.querySelector('.accordion__header');
    
    header.addEventListener('click', function() {
      // Check if this item is already active
      const isActive = item.classList.contains('active');
      
      // Close all items
      accordionItems.forEach(function(otherItem) {
        otherItem.classList.remove('active');
      });
      
      // Open clicked item if it wasn't already active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
  
  
  // ==================== GALLERY FILTER ====================
  
  const filterButtons = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-card');
  
  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button styles
      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Filter gallery items
      galleryItems.forEach(function(item) {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(function() {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(function() {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  
  // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
  
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          const navHeight = navbar.offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  
  // ==================== FORM HANDLING ====================
  
  const enrollmentForm = document.getElementById('enrollmentForm');
  const contactForm = document.getElementById('contactForm');
  
  function handleFormSubmit(e, formName) {
    e.preventDefault();
    
    const form = e.target;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    // Show loading state
    button.textContent = 'Sending...';
    button.disabled = true;
    button.style.opacity = '0.7';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(function() {
      // Show success message
      button.textContent = 'Message Sent!';
      button.style.background = 'var(--success)';
      
      // Reset form
      form.reset();
      
      // Show success alert
      showNotification('Thank you! We will contact you soon via WhatsApp or phone.', 'success');
      
      // Reset button after delay
      setTimeout(function() {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
        button.style.background = '';
      }, 3000);
    }, 1500);
  }
  
  if (enrollmentForm) {
    enrollmentForm.addEventListener('submit', function(e) {
      handleFormSubmit(e, 'enrollment');
    });
  }
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      handleFormSubmit(e, 'contact');
    });
  }
  
  
  // ==================== NOTIFICATION SYSTEM ====================
  
  function showNotification(message, type) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 1.3rem;">${type === 'success' ? '&#x2714;' : '&#x26A0;'}</span>
        <span>${message}</span>
      </div>
      <button class="notification-close" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 1.2rem; padding: 0 4px;">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#10B981' : '#F59E0B'};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      max-width: 400px;
      animation: slideIn 0.3s ease;
      font-size: 0.95rem;
    `;
    
    // Add animation keyframes if not already added
    if (!document.getElementById('notification-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'notification-styles';
      styleSheet.textContent = `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100px);
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(function() {
        notification.remove();
      }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(function() {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
          notification.remove();
        }, 300);
      }
    }, 5000);
  }
  
  
  // ==================== TYPING EFFECT (HERO SECTION) ====================
  
  function typeWriter(element, text, speed) {
    let i = 0;
    element.textContent = '';
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }
  
  
  // ==================== PARALLAX EFFECT ====================
  
  function handleParallax() {
    const shapes = document.querySelectorAll('.hero__shape');
    
    if (shapes.length > 0) {
      const scrolled = window.pageYOffset;
      
      shapes.forEach(function(shape, index) {
        const speed = 0.05 * (index + 1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }
  }
  
  window.addEventListener('scroll', handleParallax);
  
  
  // ==================== LAZY LOADING FOR IMAGES ====================
  
  function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(function(img) {
      imageObserver.observe(img);
    });
  }
  
  lazyLoadImages();
  
  
  // ==================== BACK TO TOP BUTTON ====================
  
  // Create back to top button
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '&#x2191;';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #D4A843, #E8C97A);
    color: #1B2A4A;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(212,168,67,0.4);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  document.body.appendChild(backToTop);
  
  // Show/hide back to top button
  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
    }
  });
  
  // Scroll to top on click
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Hover effects
  backToTop.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-4px)';
    this.style.boxShadow = '0 8px 30px rgba(212,168,67,0.5)';
  });
  
  backToTop.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 4px 20px rgba(212,168,67,0.4)';
  });
  
  
  // ==================== ACTIVE NAV LINK DETECTION ====================
  
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(function(link) {
      const href = link.getAttribute('href');
      link.classList.remove('active');
      
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
  
  setActiveNavLink();
  
  
  // ==================== PRELOADER (OPTIONAL) ====================
  
  // Hide preloader when page is loaded
  window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(function() {
        preloader.style.display = 'none';
      }, 500);
    }
    
    // Trigger initial animations
    revealOnScroll();
    animateCounters();
  });
  
  
  // ==================== KEYBOARD ACCESSIBILITY ====================
  
  // Make accordion items keyboard accessible
  accordionItems.forEach(function(item) {
    const header = item.querySelector('.accordion__header');
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    
    header.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
  
  
  // ==================== FORM VALIDATION FEEDBACK ====================
  
  const formInputs = document.querySelectorAll('.form__input, .form__select, .form__textarea');
  
  formInputs.forEach(function(input) {
    input.addEventListener('blur', function() {
      if (this.required && !this.value.trim()) {
        this.style.borderColor = '#EF4444';
      } else {
        this.style.borderColor = '#10B981';
      }
    });
    
    input.addEventListener('focus', function() {
      this.style.borderColor = '#D4A843';
    });
  });
  
  // ==================== HERO SLIDESHOW ====================
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 0) {
    let currentSlide = 0;
    
    function nextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }
    
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }
  
}); // End DOMContentLoaded
