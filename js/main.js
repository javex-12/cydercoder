/**
 * Michael Dosunmu | Digital Craftsman Portfolio
 * Main Animation & Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const bodyWrap = document.getElementById('body-wrap');
    const menuLinks = document.querySelectorAll('.menu-link');
    const scene = document.getElementById('ring-scene');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileViewport = window.matchMedia('(max-width: 768px)');
    const lowPowerDevice = prefersReducedMotion.matches || mobileViewport.matches;
    const totalThreads = lowPowerDevice ? 8 : 14; 
    const frameInterval = lowPowerDevice ? 3 : 1;
    const threads = [];

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            bodyWrap.classList.toggle('menu-open');
        });
    }

    // Menu Close Button
    const menuClose = document.getElementById('menu-close');
    if (menuClose) {
        menuClose.addEventListener('click', () => {
            bodyWrap.classList.remove('menu-open');
        });
        
        // Close on Enter key
        menuClose.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                bodyWrap.classList.remove('menu-open');
            }
        });
    }

    // Close menu on overlay click (outside content)
    const menuOverlay = document.querySelector('.menu-overlay');
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                bodyWrap.classList.remove('menu-open');
            }
        });
    }

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bodyWrap.classList.contains('menu-open')) {
            bodyWrap.classList.remove('menu-open');
        }
    });

    // Close menu on link click
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            bodyWrap.classList.remove('menu-open');
        });
    });

    // 3D Ring Setup
    if (scene) {
        for (let i = 0; i < totalThreads; i++) {
            const thread = document.createElement('div');
            thread.className = 'luminous-thread';
            const size = lowPowerDevice ? 280 : 380;
            thread.style.width = `${size}px`;
            thread.style.height = `${size}px`;
            thread.style.left = `-${size/2}px`;
            thread.style.top = `-${size/2}px`;
            
            const isBlue = i % 3 === 0;
            thread.style.borderTopColor = isBlue ? 'rgba(59, 130, 246, 0.28)' : 'rgba(240, 195, 142, 0.25)';

            const rotX = 60 + (i * 0.4);
            const rotY = (i / totalThreads) * 8;
            const spinDuration = 18 + (i * 2);
            const depthBase = 35 + (i * 8);
            const opacityBase = isBlue ? 0.6 : 0.4;

            thread.style.setProperty('--ring-rotX', `${rotX}deg`);
            thread.style.setProperty('--ring-rotY', `${rotY}deg`);
            thread.style.setProperty('--ring-spin-duration', `${spinDuration}s`);
            thread.style.setProperty('--ring-depth', `${depthBase}px`);
            thread.style.setProperty('--ring-opacity', opacityBase);

            threads.push({ el: thread, depthBase, opacityBase });
            scene.appendChild(thread);
        }
    }

    // Scroll variable
    let scrollY = 0;
    window.addEventListener('scroll', () => { 
        scrollY = window.pageYOffset; 
    }, { passive: true });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('pointermove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    const sceneState = {
        scale: 1,
        targetScale: 1,
        translateX: 0,
        targetTranslateX: 0,
        opacity: 1,
        targetOpacity: 1,
        rotX: 0,
        rotY: 0
    };

    let cachedDepthShift = null;
    let cachedOpacity = null;
    let cachedMenuState = null;

    function updateThreads(depthShift, globalOpacity, isMenuOpen) {
        if (
            cachedDepthShift === depthShift &&
            cachedOpacity === globalOpacity &&
            cachedMenuState === isMenuOpen
        ) return;

        threads.forEach(({ el, depthBase, opacityBase }) => {
            el.style.setProperty('--ring-depth', `${depthBase + depthShift}px`);
            const opacity = Math.min(1, Math.max(0.2, opacityBase * globalOpacity));
            el.style.opacity = opacity;
            el.style.borderWidth = isMenuOpen ? '0.5px' : '1px';
        });

        cachedDepthShift = depthShift;
        cachedOpacity = globalOpacity;
        cachedMenuState = isMenuOpen;
    }

    function lerp(start, end, amount) {
        return start + (end - start) * amount;
    }

    function animateRing() {
        const projects = document.querySelector('#projects');
        const contact = document.querySelector('#contact');
        
        if (!scene) return;

        const isMenuOpen = bodyWrap.classList.contains('menu-open');
        const isMobile = window.innerWidth < 768;
        
        let targetScale = isMobile ? 0.9 : 1.05;
        let targetTranslateX = 0;
        let targetOpacity = 0.85;
        let depthShift = lowPowerDevice ? 0 : 10;

        if (isMenuOpen) {
            targetScale = isMobile ? 2 : 3.2;
            targetOpacity = 0.25;
            depthShift = lowPowerDevice ? 25 : 50; 
        } else if (projects && contact) {
            if (scrollY > projects.offsetTop - 400 && scrollY < contact.offsetTop - 400) {
                targetScale = isMobile ? 0.4 : 0.55;
                targetTranslateX = isMobile ? window.innerWidth * 0.05 : window.innerWidth * 0.28;
                targetOpacity = 0.5;
                depthShift = 8;
            } else if (scrollY >= contact.offsetTop - 400) {
                targetScale = isMobile ? 0.95 : 1.3;
                targetTranslateX = 0;
                targetOpacity = 1;
                depthShift = 12;
            } else if (scrollY > 120) {
                targetScale = isMobile ? 0.55 : 0.75;
                targetTranslateX = isMobile ? -window.innerWidth * 0.08 : -window.innerWidth * 0.22;
                targetOpacity = 0.65;
                depthShift = 6;
            }
        } else if (scrollY > 80) {
            targetScale = isMobile ? 0.65 : 0.85;
            targetTranslateX = isMobile ? window.innerWidth * 0.04 : window.innerWidth * 0.18;
            targetOpacity = 0.55;
            depthShift = 6;
        }

        sceneState.targetScale = targetScale;
        sceneState.targetTranslateX = targetTranslateX;
        sceneState.targetOpacity = targetOpacity;

        sceneState.scale = lerp(sceneState.scale, sceneState.targetScale, 0.12);
        sceneState.translateX = lerp(sceneState.translateX, sceneState.targetTranslateX, 0.12);
        sceneState.opacity = lerp(sceneState.opacity, sceneState.targetOpacity, 0.12);

        const pointerX = (window.innerWidth / 2 - mouseX) / window.innerWidth;
        const pointerY = (window.innerHeight / 2 - mouseY) / window.innerHeight;
        sceneState.rotX = lerp(sceneState.rotX, pointerY * 10, 0.08);
        sceneState.rotY = lerp(sceneState.rotY, -pointerX * 10, 0.08);

        scene.style.transform = `
            translateX(${sceneState.translateX}px)
            scale(${sceneState.scale})
            rotateY(${sceneState.rotY}deg)
            rotateX(${sceneState.rotX}deg)
        `;

        updateThreads(depthShift, sceneState.opacity, isMenuOpen);
    }

    let frameCounter = 0;
    function startRingLoop() {
        function loop() {
            frameCounter++;
            if (frameCounter % frameInterval === 0) {
                animateRing();
            }
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    // Intersection Observer for Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    // Initializations
    if (scene) {
        startRingLoop();
    }
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Profile Modal (Logo Click)
    let profileModal = null;

    function createProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'custom-modal profile-modal';
        modal.id = 'profile-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="profile-avatar">
                    <img src="./logo.jpeg" alt="Michael Dosunmu">
                </div>
                <h2 class="profile-name">Michael "CyderCoder" Dosunmu</h2>
                <p class="profile-title">Full-Stack Product Engineer</p>
                <div class="profile-status">
                    <span class="profile-status-dot"></span>
                    Available for projects
                </div>
                <p class="profile-bio">
                    Building thoughtful interfaces and reliable backends. 
                    From web dashboards to Electron/Tauri apps, I ship clean code with calm communication.
                </p>
                <div class="profile-actions">
                    <a href="#" class="profile-action-btn" data-whatsapp="2348085741430" data-default-message="Hey Michael! I just saw your profile and would love to discuss a project with you.">
                        <div class="profile-action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </div>
                        <span class="profile-action-label">WhatsApp</span>
                    </a>
                    <a href="mailto:cydercoder@gmail.com" class="profile-action-btn">
                        <div class="profile-action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </div>
                        <span class="profile-action-label">Email</span>
                    </a>
                    <a href="portfolio.html" class="profile-action-btn">
                        <div class="profile-action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        </div>
                        <span class="profile-action-label">View Work</span>
                    </a>
                    <a href="contact.html" class="profile-action-btn">
                        <div class="profile-action-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <span class="profile-action-label">Contact</span>
                    </a>
                </div>
                <div class="profile-social">
                    <a href="https://github.com/javex-12" target="_blank" rel="noopener" class="profile-social-link" title="GitHub">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
                    <a href="https://x.com/michael_do85102" target="_blank" rel="noopener" class="profile-social-link" title="X (Twitter)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                    </a>
                    <a href="https://www.linkedin.com/in/michael-dosunmu-4979a9344?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener" class="profile-social-link" title="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    function openProfileModal() {
        if (!profileModal) {
            profileModal = createProfileModal();
            
            // Attach WhatsApp handler to button inside profile modal
            const profileWhatsAppBtn = profileModal.querySelector('[data-whatsapp]');
            if (profileWhatsAppBtn) {
                profileWhatsAppBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const number = profileWhatsAppBtn.getAttribute('data-whatsapp');
                    const defaultMessage = profileWhatsAppBtn.getAttribute('data-default-message') || 'Hey Michael! I just saw your profile and would love to discuss a project with you.';
                    closeProfileModal();
                    setTimeout(() => openWhatsAppModal(number, defaultMessage), 300);
                });
            }
            
            // Close on overlay click
            profileModal.addEventListener('click', (e) => {
                if (e.target === profileModal) {
                    closeProfileModal();
                }
            });
            
            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && profileModal.classList.contains('active')) {
                    closeProfileModal();
                }
            });
        }
        
        profileModal.classList.add('active');
    }

    function closeProfileModal() {
        if (profileModal) {
            profileModal.classList.remove('active');
        }
    }

    // Logo click handler
    const brandLogo = document.querySelector('.brand-logo');
    if (brandLogo) {
        brandLogo.style.cursor = 'pointer';
        brandLogo.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openProfileModal();
        });
    }

    // WhatsApp CTA logic with custom modal
    let whatsappModal = null;
    let whatsappNumber = null;
    let whatsappTextarea = null;

    function createWhatsAppModal() {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.id = 'whatsapp-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </div>
                    <h3 class="modal-title">Send WhatsApp Message</h3>
                </div>
                <div class="modal-body">
                    <label class="modal-label" for="whatsapp-message">Your message</label>
                    <textarea class="modal-textarea" id="whatsapp-message" placeholder="Type your message here..."></textarea>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn modal-btn-cancel" id="modal-cancel">Cancel</button>
                    <button class="modal-btn modal-btn-send" id="modal-send">Send via WhatsApp</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    function openWhatsAppModal(number, defaultMessage) {
        if (!whatsappModal) {
            whatsappModal = createWhatsAppModal();
            whatsappTextarea = document.getElementById('whatsapp-message');
            
            // Cancel button
            document.getElementById('modal-cancel').addEventListener('click', closeWhatsAppModal);
            
            // Send button
            document.getElementById('modal-send').addEventListener('click', () => {
                const message = whatsappTextarea.value.trim() || defaultMessage;
                const encoded = encodeURIComponent(message);
                const link = `https://wa.me/${number}?text=${encoded}`;
                window.open(link, '_blank');
                closeWhatsAppModal();
            });
            
            // Close on overlay click
            whatsappModal.addEventListener('click', (e) => {
                if (e.target === whatsappModal) {
                    closeWhatsAppModal();
                }
            });
            
            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && whatsappModal.classList.contains('active')) {
                    closeWhatsAppModal();
                }
            });
        }
        
        whatsappNumber = number;
        whatsappTextarea.value = defaultMessage;
        whatsappModal.classList.add('active');
        setTimeout(() => whatsappTextarea.focus(), 100);
    }

    function closeWhatsAppModal() {
        if (whatsappModal) {
            whatsappModal.classList.remove('active');
        }
    }

    document.querySelectorAll('[data-whatsapp]').forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const number = btn.getAttribute('data-whatsapp');
            const defaultMessage = btn.getAttribute('data-default-message') || 'Hey Michael, I just visited your portfolio and would love to chat about a project.';
            openWhatsAppModal(number, defaultMessage);
        });
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            formStatus.style.display = 'none';
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // Success
                    formStatus.innerHTML = `
                        <div style="color: #25D366; padding: 1rem; background: rgba(37, 211, 102, 0.1); border: 1px solid rgba(37, 211, 102, 0.3); border-radius: 12px;">
                            <strong>✓ Message sent successfully!</strong><br>
                            <span style="font-size: 0.85rem; opacity: 0.9;">I'll reply to you within 24 hours.</span>
                        </div>
                    `;
                    formStatus.style.display = 'block';
                    contactForm.reset();
                    submitBtn.textContent = 'Sent!';
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error(result.message || 'Something went wrong');
                }
            } catch (error) {
                // Error
                formStatus.innerHTML = `
                    <div style="color: #ff6b6b; padding: 1rem; background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.3); border-radius: 12px;">
                        <strong>✗ Oops! Something went wrong.</strong><br>
                        <span style="font-size: 0.85rem; opacity: 0.9;">Please try emailing me directly at cydercoder@gmail.com</span>
                    </div>
                `;
                formStatus.style.display = 'block';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
