// ===================================
// PR Boutique - JavaScript
// Interactive Features & Animations
// ===================================

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

// Sticky Navbar on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink.classList.add('active');
        } else if (navLink) {
            navLink.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', scrollActive);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== TESTIMONIALS SLIDER =====
let currentTestimonialIndex = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateTestimonialSlider() {
    // Hide all testimonials
    testimonialCards.forEach((card, index) => {
        card.style.display = 'none';
    });

    // Show current set of testimonials based on screen size
    const screenWidth = window.innerWidth;
    let visibleCount = 3;

    if (screenWidth <= 768) {
        visibleCount = 1;
    } else if (screenWidth <= 1024) {
        visibleCount = 2;
    }

    for (let i = 0; i < visibleCount; i++) {
        const index = (currentTestimonialIndex + i) % testimonialCards.length;
        if (testimonialCards[index]) {
            testimonialCards[index].style.display = 'block';
        }
    }
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
        updateTestimonialSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
        updateTestimonialSlider();
    });

    // Auto-slide testimonials every 5 seconds
    setInterval(() => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
        updateTestimonialSlider();
    }, 5000);

    // Initialize slider
    updateTestimonialSlider();
}

// Update slider on window resize
window.addEventListener('resize', updateTestimonialSlider);

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightboxImage.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// ===== LEAD FORM SUBMISSION =====
const leadForm = document.getElementById('leadForm');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value
        };

        // Validate form
        if (!formData.name || !formData.phone || !formData.email || !formData.interest) {
            showToast('Please fill in all required fields!', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showToast('Please enter a valid email address!', 'error');
            return;
        }

        // Phone validation (Indian format)
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (cleanPhone.length !== 10 || !phoneRegex.test(cleanPhone)) {
            showToast('Please enter a valid 10-digit phone number!', 'error');
            return;
        }

        // Simulate form submission (In production, send to backend)
        console.log('Form Data:', formData);

        // Show success message
        showToast('Thank you! We will contact you soon. 🎉', 'success');

        // Reset form
        leadForm.reset();

        // Optional: Send to WhatsApp
        setTimeout(() => {
            const whatsappMessage = `Hi! I'm ${formData.name}. I'm interested in ${formData.interest}. Phone: ${formData.phone}, Email: ${formData.email}`;
            const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;
            
            if (confirm('Would you like to continue this conversation on WhatsApp?')) {
                window.open(whatsappUrl, '_blank');
            }
        }, 2000);
    });
}

// Toast Notification Function
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    
    if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #f44336, #e53935)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ===== SCROLL REVEAL ANIMATIONS =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.stat-item, .service-card, .package-card');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// ===== NUMBER COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll('.stat-number');
let hasAnimated = false;

function animateNumbers() {
    if (hasAnimated) return;
    
    const statsSection = document.querySelector('.about-stats');
    if (!statsSection) return;
    
    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isVisible) {
        hasAnimated = true;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target + '+';
                }
            };
            
            updateNumber();
        });
    }
}

window.addEventListener('scroll', animateNumbers);

// ===== FORM INPUT ANIMATIONS =====
const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// ===== PRELOAD IMAGES =====
function preloadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===== PACKAGE CARD HOVER EFFECTS =====
const packageCards = document.querySelectorAll('.package-card');

packageCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        packageCards.forEach(otherCard => {
            if (otherCard !== card && !otherCard.classList.contains('featured')) {
                otherCard.style.opacity = '0.7';
            }
        });
    });
    
    card.addEventListener('mouseleave', () => {
        packageCards.forEach(otherCard => {
            otherCard.style.opacity = '1';
        });
    });
});

// ===== TRACK CTA BUTTON CLICKS =====
const ctaButtons = document.querySelectorAll('.btn-primary, .btn-package, .btn-submit');

ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Track analytics (Google Analytics, Facebook Pixel, etc.)
        console.log('CTA Clicked:', button.textContent);
        
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        const rect = button.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to stylesheet dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize number animation after page load
    setTimeout(animateNumbers, 500);
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c🌸 Welcome to PR Boutique! 🌸', 'color: #ff6b9d; font-size: 24px; font-weight: bold;');
console.log('%cWhere Style Meets Skill', 'color: #ffb88c; font-size: 16px; font-style: italic;');
console.log('%cWebsite crafted with ❤️ for fashion lovers', 'color: #6c757d; font-size: 12px;');

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// ===== PERFORMANCE MONITORING =====
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.loadTime > 3000) {
                console.warn('Slow resource detected:', entry.name);
            }
        }
    });
    
    observer.observe({ entryTypes: ['resource'] });
}

// ===== SERVICE WORKER (Optional - for PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you create a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

console.log('✅ PR Boutique website loaded successfully!');
