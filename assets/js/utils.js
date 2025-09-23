/**
 * Sueño Andino - Utils
 * Utility functions and error handling
 */

(function() {
    'use strict';

    // Error handling and logging
    window.SuenoAndino = window.SuenoAndino || {};

    /**
     * Error logging utility
     */
    SuenoAndino.Logger = {
        log: function(message, data = {}) {
            console.log(`[Sueño Andino] ${message}`, data);
        },
        
        error: function(message, error = null) {
            console.error(`[Sueño Andino ERROR] ${message}`, error);
            
            // Send error to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exception', {
                    'description': message,
                    'fatal': false
                });
            }
        },
        
        warn: function(message, data = {}) {
            console.warn(`[Sueño Andino WARNING] ${message}`, data);
        }
    };

    /**
     * Performance monitoring
     */
    SuenoAndino.Performance = {
        measure: function(name, fn) {
            const start = performance.now();
            try {
                const result = fn();
                const end = performance.now();
                SuenoAndino.Logger.log(`Performance: ${name} took ${end - start}ms`);
                return result;
            } catch (error) {
                SuenoAndino.Logger.error(`Performance error in ${name}:`, error);
                throw error;
            }
        },
        
        mark: function(name) {
            if (performance.mark) {
                performance.mark(name);
            }
        },
        
        measureBetween: function(startMark, endMark, name) {
            if (performance.measure) {
                try {
                    performance.measure(name, startMark, endMark);
                } catch (error) {
                    SuenoAndino.Logger.warn(`Could not measure between ${startMark} and ${endMark}`);
                }
            }
        }
    };

    /**
     * DOM utilities
     */
    SuenoAndino.DOM = {
        ready: function(fn) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', fn);
            } else {
                fn();
            }
        },
        
        query: function(selector, context = document) {
            try {
                return context.querySelector(selector);
            } catch (error) {
                SuenoAndino.Logger.error(`Query selector error: ${selector}`, error);
                return null;
            }
        },
        
        queryAll: function(selector, context = document) {
            try {
                return Array.from(context.querySelectorAll(selector));
            } catch (error) {
                SuenoAndino.Logger.error(`Query all selector error: ${selector}`, error);
                return [];
            }
        },
        
        create: function(tag, attributes = {}, content = '') {
            try {
                const element = document.createElement(tag);
                
                Object.keys(attributes).forEach(key => {
                    if (key === 'className') {
                        element.className = attributes[key];
                    } else if (key === 'innerHTML') {
                        element.innerHTML = attributes[key];
                    } else {
                        element.setAttribute(key, attributes[key]);
                    }
                });
                
                if (content) {
                    element.textContent = content;
                }
                
                return element;
            } catch (error) {
                SuenoAndino.Logger.error(`Create element error: ${tag}`, error);
                return null;
            }
        },
        
        addClass: function(element, className) {
            if (element && element.classList) {
                element.classList.add(className);
            }
        },
        
        removeClass: function(element, className) {
            if (element && element.classList) {
                element.classList.remove(className);
            }
        },
        
        toggleClass: function(element, className) {
            if (element && element.classList) {
                element.classList.toggle(className);
            }
        },
        
        hasClass: function(element, className) {
            return element && element.classList && element.classList.contains(className);
        }
    };

    /**
     * Event utilities
     */
    SuenoAndino.Events = {
        on: function(element, event, handler, options = {}) {
            if (element && typeof handler === 'function') {
                element.addEventListener(event, handler, options);
            }
        },
        
        off: function(element, event, handler) {
            if (element && typeof handler === 'function') {
                element.removeEventListener(event, handler);
            }
        },
        
        once: function(element, event, handler) {
            if (element && typeof handler === 'function') {
                const onceHandler = function(e) {
                    handler(e);
                    element.removeEventListener(event, onceHandler);
                };
                element.addEventListener(event, onceHandler);
            }
        },
        
        delegate: function(parent, selector, event, handler) {
            if (parent && typeof handler === 'function') {
                parent.addEventListener(event, function(e) {
                    if (e.target.matches(selector)) {
                        handler.call(e.target, e);
                    }
                });
            }
        }
    };

    /**
     * Animation utilities
     */
    SuenoAndino.Animation = {
        fadeIn: function(element, duration = 300) {
            if (!element) return;
            
            element.style.opacity = '0';
            element.style.display = 'block';
            
            const start = performance.now();
            
            function animate(time) {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        },
        
        fadeOut: function(element, duration = 300) {
            if (!element) return;
            
            const start = performance.now();
            const startOpacity = parseFloat(getComputedStyle(element).opacity) || 1;
            
            function animate(time) {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.opacity = startOpacity * (1 - progress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                }
            }
            
            requestAnimationFrame(animate);
        },
        
        slideDown: function(element, duration = 300) {
            if (!element) return;
            
            element.style.height = '0';
            element.style.overflow = 'hidden';
            element.style.display = 'block';
            
            const targetHeight = element.scrollHeight;
            const start = performance.now();
            
            function animate(time) {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.height = (targetHeight * progress) + 'px';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.height = 'auto';
                    element.style.overflow = '';
                }
            }
            
            requestAnimationFrame(animate);
        },
        
        slideUp: function(element, duration = 300) {
            if (!element) return;
            
            const startHeight = element.offsetHeight;
            element.style.height = startHeight + 'px';
            element.style.overflow = 'hidden';
            
            const start = performance.now();
            
            function animate(time) {
                const elapsed = time - start;
                const progress = Math.min(elapsed / duration, 1);
                
                element.style.height = (startHeight * (1 - progress)) + 'px';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.style.display = 'none';
                    element.style.height = '';
                    element.style.overflow = '';
                }
            }
            
            requestAnimationFrame(animate);
        }
    };

    /**
     * Storage utilities
     */
    SuenoAndino.Storage = {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                SuenoAndino.Logger.error(`Storage set error: ${key}`, error);
            }
        },
        
        get: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                SuenoAndino.Logger.error(`Storage get error: ${key}`, error);
                return defaultValue;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                SuenoAndino.Logger.error(`Storage remove error: ${key}`, error);
            }
        },
        
        clear: function() {
            try {
                localStorage.clear();
            } catch (error) {
                SuenoAndino.Logger.error('Storage clear error', error);
            }
        }
    };

    /**
     * Validation utilities
     */
    SuenoAndino.Validation = {
        email: function(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },
        
        phone: function(phone) {
            const regex = /^[\+]?[1-9][\d]{0,15}$/;
            return regex.test(phone.replace(/\s/g, ''));
        },
        
        required: function(value) {
            return value && value.toString().trim().length > 0;
        },
        
        minLength: function(value, min) {
            return value && value.toString().length >= min;
        },
        
        maxLength: function(value, max) {
            return value && value.toString().length <= max;
        }
    };

    /**
     * Analytics utilities
     */
    SuenoAndino.Analytics = {
        track: function(event, data = {}) {
            try {
                // Google Analytics 4
                if (typeof gtag !== 'undefined') {
                    gtag('event', event, {
                        event_category: 'user_interaction',
                        ...data
                    });
                }
                
                // Facebook Pixel
                if (typeof fbq !== 'undefined') {
                    fbq('track', event, data);
                }
                
                // Google Tag Manager
                if (typeof dataLayer !== 'undefined') {
                    dataLayer.push({
                        'event': event,
                        ...data
                    });
                }
                
                SuenoAndino.Logger.log(`Analytics tracked: ${event}`, data);
            } catch (error) {
                SuenoAndino.Logger.error(`Analytics tracking error: ${event}`, error);
            }
        },
        
        pageView: function(page) {
            try {
                if (typeof gtag !== 'undefined') {
                    gtag('config', 'GA_MEASUREMENT_ID', {
                        page_title: document.title,
                        page_location: window.location.href,
                        page_path: page || window.location.pathname
                    });
                }
                
                SuenoAndino.Logger.log('Page view tracked', { page });
            } catch (error) {
                SuenoAndino.Logger.error('Page view tracking error', error);
            }
        }
    };

    /**
     * Notification system
     */
    SuenoAndino.Notify = {
        show: function(message, type = 'info', duration = 3000) {
            try {
                const notification = SuenoAndino.DOM.create('div', {
                    className: `notification notification-${type}`,
                    innerHTML: message
                });
                
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--primary-color, #d3600f);
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 0.5rem;
                    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                    word-wrap: break-word;
                `;
                
                document.body.appendChild(notification);
                
                // Animate in
                setTimeout(() => {
                    notification.style.transform = 'translateX(0)';
                }, 100);
                
                // Auto remove
                setTimeout(() => {
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }, duration);
                
                return notification;
            } catch (error) {
                SuenoAndino.Logger.error('Notification error', error);
                return null;
            }
        },
        
        success: function(message, duration = 3000) {
            return SuenoAndino.Notify.show(`✅ ${message}`, 'success', duration);
        },
        
        error: function(message, duration = 5000) {
            return SuenoAndino.Notify.show(`❌ ${message}`, 'error', duration);
        },
        
        warning: function(message, duration = 4000) {
            return SuenoAndino.Notify.show(`⚠️ ${message}`, 'warning', duration);
        },
        
        info: function(message, duration = 3000) {
            return SuenoAndino.Notify.show(`ℹ️ ${message}`, 'info', duration);
        }
    };

    /**
     * Debounce utility
     */
    SuenoAndino.debounce = function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    /**
     * Throttle utility
     */
    SuenoAndino.throttle = function(func, limit) {
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
    };

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

    SuenoAndino.Logger.log('Utils module loaded successfully');

})();
