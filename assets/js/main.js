/**
 * Sueño Andino - Main JavaScript
 * Core functionality and performance optimizations
 */

(function() {
    'use strict';

    // Ensure SuenoAndino exists
    if (typeof window.SuenoAndino === 'undefined') {
        window.SuenoAndino = {};
    }

    /**
     * Main Application
     */
    SuenoAndino.App = {
        init: function() {
            try {
                SuenoAndino.Performance.mark('app-init-start');
                
                this.initSmoothScrolling();
                this.initHeaderScroll();
                this.initLogoClick();
                this.initAccessibility();
                this.initPerformanceOptimizations();
                this.initGalleryCarousel();
                this.initScrollTracking();
                
                SuenoAndino.Performance.mark('app-init-end');
                SuenoAndino.Performance.measureBetween('app-init-start', 'app-init-end', 'app-initialization');
                
                SuenoAndino.Logger.log('Application initialized successfully');
            } catch (error) {
                SuenoAndino.Logger.error('Application initialization error', error);
            }
        },

        /**
         * Smooth scrolling for anchor links
         */
        initSmoothScrolling: function() {
            try {
                const links = SuenoAndino.DOM.queryAll('a[href^="#"]');
                const header = SuenoAndino.DOM.query('header');
                
                links.forEach(link => {
                    SuenoAndino.Events.on(link, 'click', (e) => {
                        const targetId = link.getAttribute('href');
                        const targetElement = SuenoAndino.DOM.query(targetId);
                        
                        if (targetElement) {
                            e.preventDefault();
                            
                            // Hide header when navigating to specific sections
                            if (targetId !== '#hero' && targetId !== '#') {
                                if (header) {
                                    header.style.transform = 'translateY(-100%)';
                                    header.style.transition = 'transform 0.3s ease';
                                }
                            }
                            
                            const headerHeight = header?.offsetHeight || 0;
                            const targetPosition = targetElement.offsetTop - headerHeight - 20;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                            
                            // Focus management for accessibility
                            targetElement.focus();
                            
                            // Track analytics
                            SuenoAndino.Analytics.track('smooth_scroll', {
                                target: targetId
                            });
                        }
                    });
                });
                
                SuenoAndino.Logger.log('Smooth scrolling initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Smooth scrolling initialization error', error);
            }
        },

        /**
         * Header scroll effects - Show only when scrolling up
         */
        initHeaderScroll: function() {
            try {
                const header = SuenoAndino.DOM.query('header');
                if (!header) return;

                let lastScrollY = window.scrollY;
                let isHeaderVisible = true;

                const updateHeader = SuenoAndino.throttle(() => {
                    const currentScrollY = window.scrollY;
                    const scrollDifference = currentScrollY - lastScrollY;
                    
                    // Show header if scrolling up or at top
                    if (currentScrollY < 100) {
                        // At top, always show
                        header.style.transform = 'translateY(0)';
                        header.style.transition = 'transform 0.3s ease';
                        isHeaderVisible = true;
                    } else if (scrollDifference < -10 && !isHeaderVisible) {
                        // Scrolling up, show header
                        header.style.transform = 'translateY(0)';
                        header.style.transition = 'transform 0.3s ease';
                        isHeaderVisible = true;
                    } else if (scrollDifference > 10 && isHeaderVisible) {
                        // Scrolling down, hide header
                        header.style.transform = 'translateY(-100%)';
                        header.style.transition = 'transform 0.3s ease';
                        isHeaderVisible = false;
                    }
                    
                    lastScrollY = currentScrollY;
                }, 16); // ~60fps

                SuenoAndino.Events.on(window, 'scroll', updateHeader, { passive: true });
                SuenoAndino.Logger.log('Header scroll effects initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Header scroll initialization error', error);
            }
        },

        /**
         * Logo click handler - Navigate to Hero
         */
        initLogoClick: function() {
            try {
                const logo = SuenoAndino.DOM.query('header img[alt*="Logo"]');
                if (!logo) return;

                // Make logo clickable
                logo.style.cursor = 'pointer';
                
                SuenoAndino.Events.on(logo, 'click', () => {
                    const heroSection = SuenoAndino.DOM.query('#hero');
                    if (heroSection) {
                        // Show header when returning to hero
                        const header = SuenoAndino.DOM.query('header');
                        if (header) {
                            header.style.transform = 'translateY(0)';
                            header.style.transition = 'transform 0.3s ease';
                        }
                        
                        // Smooth scroll to hero
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        
                        // Track analytics
                        SuenoAndino.Analytics.track('logo_click', {
                            action: 'navigate_to_hero'
                        });
                    }
                });
                
                SuenoAndino.Logger.log('Logo click handler initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Logo click initialization error', error);
            }
        },

        /**
         * Accessibility enhancements
         */
        initAccessibility: function() {
            try {
                // Skip to main content functionality
                const skipLink = SuenoAndino.DOM.query('a[href="#main-content"]');
                if (skipLink) {
                    SuenoAndino.Events.on(skipLink, 'click', (e) => {
                        e.preventDefault();
                        const target = SuenoAndino.DOM.query('#main-content');
                        if (target) {
                            target.focus();
                            target.scrollIntoView();
                        }
                    });
                }

                // Keyboard navigation for cards
                const cards = SuenoAndino.DOM.queryAll('.card, .circle-card, .servicio-card, .testimonio-card');
                cards.forEach(card => {
                    card.setAttribute('tabindex', '0');
                    
                    SuenoAndino.Events.on(card, 'keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            const link = card.querySelector('a');
                            if (link) {
                                e.preventDefault();
                                link.click();
                            }
                        }
                    });
                });

                // Focus management for modals
                const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                
                // Trap focus in modals
                SuenoAndino.Events.on(document, 'keydown', (e) => {
                    const openModal = SuenoAndino.DOM.query('.modal[style*="block"]');
                    if (!openModal || e.key !== 'Tab') return;
                    
                    const focusableContent = openModal.querySelectorAll(focusableElements);
                    const firstFocusableElement = focusableContent[0];
                    const lastFocusableElement = focusableContent[focusableContent.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }
                });
                
                SuenoAndino.Logger.log('Accessibility enhancements initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Accessibility initialization error', error);
            }
        },

        /**
         * Performance optimizations
         */
        initPerformanceOptimizations: function() {
            try {
                // Lazy loading for images
                if ('IntersectionObserver' in window) {
                    const imageObserver = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                if (img.dataset.src) {
                                    img.src = img.dataset.src;
                                    img.classList.remove('lazy');
                                    observer.unobserve(img);
                                }
                            }
                        });
                    });

                    const lazyImages = SuenoAndino.DOM.queryAll('img[data-src]');
                    lazyImages.forEach(img => imageObserver.observe(img));
                }

                // Preload critical resources
                const criticalResources = [
                    'assets/css/main.css',
                    'assets/css/components.css',
                    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap'
                ];

                criticalResources.forEach(resource => {
                    const link = SuenoAndino.DOM.create('link', {
                        rel: 'preload',
                        href: resource,
                        as: 'style'
                    });
                    if (link) {
                        document.head.appendChild(link);
                    }
                });

                // Optimize scroll performance
                document.documentElement.style.scrollBehavior = 'smooth';
                
                // Font loading optimization
                if ('fonts' in document) {
                    document.fonts.ready.then(() => {
                        document.body.classList.add('fonts-loaded');
                    });
                }
                
                SuenoAndino.Logger.log('Performance optimizations initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Performance optimizations initialization error', error);
            }
        },

        /**
         * Gallery Carousel - Automatic photo rotation in 4 fixed columns
         */
        initGalleryCarousel: function() {
            try {
                // Array with all gallery photos (3-8)
                const fotosGaleria = [
                    { src: 'assets/img/galeria3.jpg', alt: 'Taller de emprendimiento comunitario en los Andes' },
                    { src: 'assets/img/galeria4.jpg', alt: 'Reunión comunitaria para planificación de proyectos' },
                    { src: 'assets/img/galeria5.jpg', alt: 'Celebración de logros comunitarios en los Andes' },
                    { src: 'assets/img/galeria6.jpg', alt: 'Paisaje andino con infraestructura comunitaria' },
                    { src: 'assets/img/galeria7.jpg', alt: 'Proyecto de desarrollo comunitario en los Andes' },
                    { src: 'assets/img/galeria8.jpg', alt: 'Comunidad andina trabajando en proyectos sostenibles' }
                ];

                let currentIndex = 0;
                let autoSlideInterval;

                // Function to show a specific set of photos
                function mostrarSlide(index) {
                    currentIndex = index;
                    
                    // Calculate which photos to show in each column
                    for (let i = 1; i <= 4; i++) {
                        const fotoIndex = (index + i - 1) % fotosGaleria.length;
                        const img = SuenoAndino.DOM.query(`#foto-columna-${i}`);
                        if (img) {
                            // Fade out/in effect
                            img.style.opacity = '0';
                            setTimeout(() => {
                                img.src = fotosGaleria[fotoIndex].src;
                                img.alt = fotosGaleria[fotoIndex].alt;
                                img.style.opacity = '1';
                            }, 250);
                        }
                    }
                }

                // Function to advance to next slide
                function nextSlide() {
                    const nextIndex = (currentIndex + 1) % 3; // 3 different sets
                    mostrarSlide(nextIndex);
                }

                // Function to start automatic rotation
                function startAutoSlide() {
                    autoSlideInterval = setInterval(nextSlide, 3000); // Change every 3 seconds
                }

                // Function to stop automatic rotation
                function stopAutoSlide() {
                    if (autoSlideInterval) {
                        clearInterval(autoSlideInterval);
                        autoSlideInterval = null;
                    }
                }

                // Pause carousel on hover over columns
                const columnas = SuenoAndino.DOM.queryAll('.carrusel-columna');
                columnas.forEach(columna => {
                    SuenoAndino.Events.on(columna, 'mouseenter', stopAutoSlide);
                    SuenoAndino.Events.on(columna, 'mouseleave', startAutoSlide);
                });

                // Make mostrarSlide function global (in case it's needed in the future)
                window.mostrarSlide = mostrarSlide;

                // Initialize with first set of photos
                mostrarSlide(0);
                startAutoSlide();

                // Pause carousel when page is not visible (optimization)
                SuenoAndino.Events.on(document, 'visibilitychange', () => {
                    if (document.hidden) {
                        stopAutoSlide();
                    } else {
                        startAutoSlide();
                    }
                });
                
                SuenoAndino.Logger.log('Gallery carousel initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Gallery carousel initialization error', error);
            }
        },

        /**
         * Scroll tracking for analytics
         */
        initScrollTracking: function() {
            try {
                let maxScroll = 0;
                const milestones = [25, 50, 75, 90, 100];
                const trackedMilestones = new Set();
                
                const trackScrollDepth = SuenoAndino.throttle(() => {
                    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                    maxScroll = Math.max(maxScroll, scrollPercent);
                    
                    milestones.forEach(milestone => {
                        if (maxScroll >= milestone && !trackedMilestones.has(milestone)) {
                            trackedMilestones.add(milestone);
                            SuenoAndino.Analytics.track('scroll_depth', {
                                scroll_percentage: milestone
                            });
                        }
                    });
                }, 100);
                
                SuenoAndino.Events.on(window, 'scroll', trackScrollDepth, { passive: true });
                SuenoAndino.Logger.log('Scroll tracking initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Scroll tracking initialization error', error);
            }
        }
    };

    /**
     * Utility functions for backward compatibility
     */
    SuenoAndino.scrollTo = function(elementId, offset = 0) {
        try {
            const element = SuenoAndino.DOM.query(elementId);
            if (element) {
                const headerHeight = SuenoAndino.DOM.query('header')?.offsetHeight || 0;
                const targetPosition = element.offsetTop - headerHeight - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            SuenoAndino.Logger.error('ScrollTo error', error);
        }
    };

    SuenoAndino.track = function(event, data = {}) {
        SuenoAndino.Analytics.track(event, data);
    };

    SuenoAndino.notify = function(message, type = 'info') {
        return SuenoAndino.Notify.show(message, type);
    };

    // Initialize application when DOM is ready
    SuenoAndino.DOM.ready(() => {
        SuenoAndino.App.init();
    });

    // Global error handler
    window.addEventListener('error', function(e) {
        SuenoAndino.Logger.error('Global error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            error: e.error
        });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
        SuenoAndino.Logger.error('Unhandled promise rejection', e.reason);
    });

})();