/**
 * Sueño Andino - Modals
 * Modal management and interactions
 */

(function() {
    'use strict';

    // Ensure SuenoAndino exists
    if (typeof window.SuenoAndino === 'undefined') {
        window.SuenoAndino = {};
    }

    /**
     * Modal Manager
     */
    SuenoAndino.Modal = {
        modals: new Map(),
        
        init: function() {
            try {
                this.bindEvents();
                this.setupAccessibility();
                SuenoAndino.Logger.log('Modal manager initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Modal initialization error', error);
            }
        },
        
        bindEvents: function() {
            // Close modal on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAll();
                }
            });
            
            // Close modal on backdrop click
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal')) {
                    this.close(e.target.id);
                }
            });
        },
        
        setupAccessibility: function() {
            // Focus trap for modals
            const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            
            document.addEventListener('keydown', (e) => {
                const openModal = document.querySelector('.modal[style*="block"]');
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
        },
        
        open: function(modalId) {
            try {
                const modal = SuenoAndino.DOM.query(`#${modalId}`);
                if (!modal) {
                    SuenoAndino.Logger.warn(`Modal not found: ${modalId}`);
                    return false;
                }
                
                // Store previous focus
                this.previousFocus = document.activeElement;
                
                // Show modal
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // Add to modals map
                this.modals.set(modalId, modal);
                
                // Focus first focusable element
                const firstFocusable = modal.querySelector('button, input, textarea, [tabindex]:not([tabindex="-1"])');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
                
                // Animate in
                SuenoAndino.Animation.fadeIn(modal, 300);
                
                // Track analytics
                SuenoAndino.Analytics.track('modal_open', {
                    modal_id: modalId
                });
                
                SuenoAndino.Logger.log(`Modal opened: ${modalId}`);
                return true;
            } catch (error) {
                SuenoAndino.Logger.error(`Error opening modal ${modalId}`, error);
                return false;
            }
        },
        
        close: function(modalId) {
            try {
                const modal = this.modals.get(modalId) || SuenoAndino.DOM.query(`#${modalId}`);
                if (!modal) {
                    SuenoAndino.Logger.warn(`Modal not found: ${modalId}`);
                    return false;
                }
                
                // Animate out
                SuenoAndino.Animation.fadeOut(modal, 300);
                
                // Hide modal after animation
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    
                    // Remove from modals map
                    this.modals.delete(modalId);
                    
                    // Restore focus
                    if (this.previousFocus) {
                        this.previousFocus.focus();
                    }
                }, 300);
                
                // Track analytics
                SuenoAndino.Analytics.track('modal_close', {
                    modal_id: modalId
                });
                
                SuenoAndino.Logger.log(`Modal closed: ${modalId}`);
                return true;
            } catch (error) {
                SuenoAndino.Logger.error(`Error closing modal ${modalId}`, error);
                return false;
            }
        },
        
        closeAll: function() {
            try {
                this.modals.forEach((modal, modalId) => {
                    this.close(modalId);
                });
                SuenoAndino.Logger.log('All modals closed');
            } catch (error) {
                SuenoAndino.Logger.error('Error closing all modals', error);
            }
        },
        
        toggle: function(modalId) {
            const modal = SuenoAndino.DOM.query(`#${modalId}`);
            if (!modal) return false;
            
            if (modal.style.display === 'block') {
                return this.close(modalId);
            } else {
                return this.open(modalId);
            }
        }
    };

    /**
     * Calendar Modal
     */
    SuenoAndino.CalendarModal = {
        init: function() {
            try {
                this.bindEvents();
                SuenoAndino.Logger.log('Calendar modal initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Calendar modal initialization error', error);
            }
        },
        
        bindEvents: function() {
            // Open calendar modal
            SuenoAndino.Events.delegate(document, '[onclick*="abrirModalCalendario"]', 'click', (e) => {
                e.preventDefault();
                this.open();
            });
            
            // Close calendar modal
            SuenoAndino.Events.delegate(document, '[onclick*="cerrarModalCalendario"]', 'click', (e) => {
                e.preventDefault();
                this.close();
            });
        },
        
        open: function() {
            return SuenoAndino.Modal.open('modalCalendario');
        },
        
        close: function() {
            return SuenoAndino.Modal.close('modalCalendario');
        }
    };

    /**
     * Lead Magnet Modal
     */
    SuenoAndino.LeadMagnetModal = {
        init: function() {
            try {
                this.bindEvents();
                this.setupForm();
                SuenoAndino.Logger.log('Lead magnet modal initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Lead magnet modal initialization error', error);
            }
        },
        
        bindEvents: function() {
            // Open lead magnet modal
            SuenoAndino.Events.delegate(document, '#leadMagnetBtn', 'click', (e) => {
                e.preventDefault();
                this.open();
            });
            
            SuenoAndino.Events.delegate(document, '#floatingBtn', 'click', (e) => {
                e.preventDefault();
                this.open();
            });
            
            // Close lead magnet modal
            SuenoAndino.Events.delegate(document, '#closeModal', 'click', (e) => {
                e.preventDefault();
                this.close();
            });
        },
        
        setupForm: function() {
            const form = SuenoAndino.DOM.query('#leadMagnetForm');
            if (!form) return;
            
            // Form submission
            SuenoAndino.Events.on(form, 'submit', (e) => {
                e.preventDefault();
                this.handleSubmit(e);
            });
            
            // Real-time validation
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                SuenoAndino.Events.on(input, 'blur', () => {
                    this.validateField(input);
                });
                
                SuenoAndino.Events.on(input, 'input', () => {
                    this.clearFieldError(input);
                });
            });
        },
        
        open: function() {
            return SuenoAndino.Modal.open('leadMagnetModal');
        },
        
        close: function() {
            return SuenoAndino.Modal.close('leadMagnetModal');
        },
        
        validateField: function(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            let isValid = true;
            let errorMessage = '';
            
            // Required validation
            if (!SuenoAndino.Validation.required(value)) {
                isValid = false;
                errorMessage = 'Este campo es requerido';
            }
            
            // Email validation
            if (fieldName === 'email' && value && !SuenoAndino.Validation.email(value)) {
                isValid = false;
                errorMessage = 'Ingresa un email válido';
            }
            
            // Name validation
            if (fieldName === 'nombre' && value && !SuenoAndino.Validation.minLength(value, 2)) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
            }
            
            if (isValid) {
                this.clearFieldError(field);
                this.showFieldSuccess(field);
            } else {
                this.showFieldError(field, errorMessage);
            }
            
            return isValid;
        },
        
        showFieldError: function(field, message) {
            this.clearFieldError(field);
            
            const errorDiv = SuenoAndino.DOM.create('div', {
                className: 'field-error',
                innerHTML: message
            });
            
            errorDiv.style.cssText = `
                color: var(--error-color, #e53e3e);
                font-size: 0.75rem;
                margin-top: 0.25rem;
                text-align: left;
            `;
            
            field.parentNode.appendChild(errorDiv);
            field.style.borderColor = 'var(--error-color, #e53e3e)';
        },
        
        clearFieldError: function(field) {
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.remove();
            }
            field.style.borderColor = '';
        },
        
        showFieldSuccess: function(field) {
            field.style.borderColor = 'var(--success-color, #16a34a)';
        },
        
        handleSubmit: function(e) {
            try {
                const form = e.target;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Validate all fields
                const inputs = form.querySelectorAll('input[required]');
                let allValid = true;
                
                inputs.forEach(input => {
                    if (!this.validateField(input)) {
                        allValid = false;
                    }
                });
                
                if (!allValid) {
                    SuenoAndino.Notify.error('Por favor corrige los errores en el formulario');
                    return;
                }
                
                // Submit form
                this.submitForm(data);
                
            } catch (error) {
                SuenoAndino.Logger.error('Form submission error', error);
                SuenoAndino.Notify.error('Error al enviar el formulario. Inténtalo de nuevo.');
            }
        },
        
        submitForm: function(data) {
            try {
                // Simulate form submission
                SuenoAndino.Logger.log('Lead magnet form submitted', data);
                
                // Track analytics
                SuenoAndino.Analytics.track('lead_magnet_submit', {
                    form_type: 'lead_magnet',
                    has_name: !!data.nombre,
                    has_email: !!data.email,
                    has_phone: !!data.telefono
                });
                
                // Show success message
                SuenoAndino.Notify.success('¡Gracias! Te enviaremos la guía por email en los próximos minutos.');
                
                // Close modal
                this.close();
                
                // Reset form
                const form = SuenoAndino.DOM.query('#leadMagnetForm');
                if (form) {
                    form.reset();
                }
                
            } catch (error) {
                SuenoAndino.Logger.error('Form submission processing error', error);
                SuenoAndino.Notify.error('Error al procesar el formulario. Inténtalo de nuevo.');
            }
        }
    };

    /**
     * Floating CTA
     */
    SuenoAndino.FloatingCTA = {
        init: function() {
            try {
                this.bindEvents();
                this.setupScrollBehavior();
                SuenoAndino.Logger.log('Floating CTA initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Floating CTA initialization error', error);
            }
        },
        
        bindEvents: function() {
            const floatingBtn = SuenoAndino.DOM.query('#floatingBtn');
            if (floatingBtn) {
                SuenoAndino.Events.on(floatingBtn, 'click', (e) => {
                    e.preventDefault();
                    SuenoAndino.LeadMagnetModal.open();
                });
            }
        },
        
        setupScrollBehavior: function() {
            const floatingCTA = SuenoAndino.DOM.query('#floatingCTA');
            if (!floatingCTA) return;
            
            let isVisible = false;
            
            const toggleVisibility = SuenoAndino.throttle(() => {
                const scrollY = window.scrollY;
                const shouldShow = scrollY > 500;
                
                if (shouldShow && !isVisible) {
                    floatingCTA.style.display = 'block';
                    isVisible = true;
                    SuenoAndino.Logger.log('Floating CTA shown');
                } else if (!shouldShow && isVisible) {
                    floatingCTA.style.display = 'none';
                    isVisible = false;
                    SuenoAndino.Logger.log('Floating CTA hidden');
                }
            }, 100);
            
            SuenoAndino.Events.on(window, 'scroll', toggleVisibility);
        }
    };

    // Initialize all modal components when DOM is ready
    SuenoAndino.DOM.ready(() => {
        SuenoAndino.Modal.init();
        SuenoAndino.CalendarModal.init();
        SuenoAndino.LeadMagnetModal.init();
        SuenoAndino.FloatingCTA.init();
    });

    // Global functions for backward compatibility
    window.abrirModalCalendario = function() {
        return SuenoAndino.CalendarModal.open();
    };
    
    window.cerrarModalCalendario = function() {
        return SuenoAndino.CalendarModal.close();
    };

})();
