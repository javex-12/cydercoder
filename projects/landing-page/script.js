// TechFlow - Modern SaaS Landing Page JavaScript

class LandingPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
    }

    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove background on scroll
            if (currentScrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }

            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });

        // Active link highlighting
        this.setupActiveLinks();
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Remove active class from all links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        link.style.color = '';
                    });
                    
                    // Add active class to current section's link
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                        activeLink.style.color = 'var(--primary-color)';
                    }
                }
            });
        }, {
            threshold: 0.3
        });

        sections.forEach(section => observer.observe(section));
    }

    setupScrollEffects() {
        // Parallax effect for hero shapes
        const heroShapes = document.querySelectorAll('.hero-shape');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroShapes.forEach((shape, index) => {
                const speed = 0.3 + (index * 0.1);
                shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });

        // Dashboard mockup tilt effect
        const dashboard = document.querySelector('.dashboard-mockup');
        if (dashboard) {
            window.addEventListener('scroll', () => {
                const rect = dashboard.getBoundingClientRect();
                const scrollPercent = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
                
                if (scrollPercent > 0 && scrollPercent < 1) {
                    const tiltX = (scrollPercent - 0.5) * 10;
                    const tiltY = (scrollPercent - 0.5) * -5;
                    dashboard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                }
            });
        }
    }

    setupAnimations() {
        // Intersection Observer for fade-in animations
        const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Set initial state and observe
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Staggered animation for features
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        // Counter animation for hero stats
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = counter.textContent;
                    const isPercentage = target.includes('%');
                    const hasPlus = target.includes('+');
                    const numericValue = parseFloat(target.replace(/[^\d.]/g, ''));
                    
                    let current = 0;
                    const increment = numericValue / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= numericValue) {
                            current = numericValue;
                            clearInterval(timer);
                        }
                        
                        let displayValue = Math.floor(current);
                        if (target.includes('K')) {
                            displayValue = Math.floor(current) + 'K';
                        } else if (isPercentage) {
                            displayValue = current.toFixed(1) + '%';
                        } else if (target.includes('/')) {
                            displayValue = target; // Keep original for "24/7"
                            clearInterval(timer);
                        }
                        
                        if (hasPlus && !target.includes('/')) {
                            displayValue += '+';
                        }
                        
                        counter.textContent = displayValue;
                    }, 50);
                    
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.querySelector('.nav-menu');
        const navActions = document.querySelector('.nav-actions');
        
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                // Toggle mobile menu (you would implement the mobile menu logic here)
                console.log('Mobile menu toggled');
                
                // Animate hamburger icon
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    span.style.transform = mobileToggle.classList.contains('active') 
                        ? 'none' 
                        : index === 0 ? 'rotate(45deg) translate(5px, 5px)' 
                        : index === 1 ? 'opacity(0)' 
                        : 'rotate(-45deg) translate(7px, -6px)';
                });
                
                mobileToggle.classList.toggle('active');
            });
        }
    }

    setupSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Utility methods
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Interactive button effects
class ButtonEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupHoverEffects();
        this.setupClickEffects();
    }

    setupHoverEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                if (button.classList.contains('btn-primary')) {
                    button.style.transform = 'translateY(-2px)';
                    button.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.3)';
                }
            });
            
            button.addEventListener('mouseleave', (e) => {
                if (button.classList.contains('btn-primary')) {
                    button.style.transform = 'translateY(0)';
                    button.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
            });
        });
    }

    setupClickEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Form handling
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupCTAButtons();
    }

    setupCTAButtons() {
        const ctaButtons = document.querySelectorAll('.btn-primary');
        
        ctaButtons.forEach(button => {
            if (button.textContent.includes('Start Free Trial') || button.textContent.includes('Get Started')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showSignupModal();
                });
            }
        });
    }

    showSignupModal() {
        // Simple alert for demo purposes
        // In a real application, you would show a proper modal
        alert('Thank you for your interest! This would open a signup form in a real application.');
        
        // You could also redirect to a signup page
        // window.location.href = '/signup';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LandingPage();
    new ButtonEffects();
    new FormHandler();
    
    console.log('TechFlow landing page initialized!');
    console.log('Features: Smooth scrolling, animations, responsive design, interactive elements');
});