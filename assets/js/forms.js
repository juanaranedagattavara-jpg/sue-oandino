/**
 * Sueño Andino - Forms
 * Form handling and validation
 */

(function() {
    'use strict';

    // Ensure SuenoAndino exists
    if (typeof window.SuenoAndino === 'undefined') {
        window.SuenoAndino = {};
    }

    /**
     * Form Manager
     */
    SuenoAndino.Forms = {
        forms: new Map(),
        
        init: function() {
            try {
                this.bindEvents();
                this.setupValidation();
                SuenoAndino.Logger.log('Forms manager initialized');
            } catch (error) {
                SuenoAndino.Logger.error('Forms initialization error', error);
            }
        },
        
        bindEvents: function() {
            // Newsletter form
            const newsletterForm = SuenoAndino.DOM.query('#newsletterForm');
            if (newsletterForm) {
                this.setupNewsletterForm(newsletterForm);
            }
            
            // Contact form
            const contactForm = SuenoAndino.DOM.query('.contacto-form');
            if (contactForm) {
                this.setupContactForm(contactForm);
            }
            
            // All forms with validation
            const allForms = SuenoAndino.DOM.queryAll('form');
            allForms.forEach(form => {
                this.setupForm(form);
            });
        },
        
        setupForm: function(form) {
            try {
                const formId = form.id || `form_${Date.now()}`;
                this.forms.set(formId, form);
                
                // Form submission
                SuenoAndino.Events.on(form, 'submit', (e) => {
                    this.handleSubmit(e, formId);
                });
                
                // Real-time validation
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    SuenoAndino.Events.on(input, 'blur', () => {
                        this.validateField(input);
                    });
                    
                    SuenoAndino.Events.on(input, 'input', () => {
                        this.clearFieldError(input);
                    });
                });
                
                SuenoAndino.Logger.log(`Form setup completed: ${formId}`);
            } catch (error) {
                SuenoAndino.Logger.error(`Form setup error: ${form.id}`, error);
            }
        },
        
        setupNewsletterForm: function(form) {
            try {
                const emailInput = SuenoAndino.DOM.query('#newsletterEmail', form);
                const errorDiv = SuenoAndino.DOM.query('#newsletterError', form);
                const successDiv = SuenoAndino.DOM.query('#newsletterSuccess', form);
                
                if (!emailInput) return;
                
                // Enhanced email validation
                SuenoAndino.Events.on(emailInput, 'input', () => {
                    this.validateNewsletterEmail(emailInput, errorDiv);
                });
                
                SuenoAndino.Logger.log('Newsletter form setup completed');
            } catch (error) {
                SuenoAndino.Logger.error('Newsletter form setup error', error);
            }
        },
        
        setupContactForm: function(form) {
            try {
                // Add any specific contact form setup here
                SuenoAndino.Logger.log('Contact form setup completed');
            } catch (error) {
                SuenoAndino.Logger.error('Contact form setup error', error);
            }
        },
        
        validateField: function(field) {
            try {
                const value = field.value.trim();
                const fieldName = field.name;
                const fieldType = field.type;
                let isValid = true;
                let errorMessage = '';
                
                // Required validation
                if (field.hasAttribute('required') && !SuenoAndino.Validation.required(value)) {
                    isValid = false;
                    errorMessage = 'Este campo es requerido';
                }
                
                // Email validation
                if (fieldType === 'email' && value && !SuenoAndino.Validation.email(value)) {
                    isValid = false;
                    errorMessage = 'Ingresa un email válido';
                }
                
                // Phone validation
                if (fieldType === 'tel' && value && !SuenoAndino.Validation.phone(value)) {
                    isValid = false;
                    errorMessage = 'Ingresa un teléfono válido';
                }
                
                // Name validation
                if (fieldName === 'nombre' && value && !SuenoAndino.Validation.minLength(value, 2)) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                }
                
                // Message validation
                if (fieldName === 'mensaje' && value && !SuenoAndino.Validation.minLength(value, 10)) {
                    isValid = false;
                    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                }
                
                if (isValid) {
                    this.clearFieldError(field);
                    this.showFieldSuccess(field);
                } else {
                    this.showFieldError(field, errorMessage);
                }
                
                return isValid;
            } catch (error) {
                SuenoAndino.Logger.error('Field validation error', error);
                return false;
            }
        },
        
        validateNewsletterEmail: function(emailInput, errorDiv) {
            try {
                const email = emailInput.value.trim();
                const isValid = SuenoAndino.Validation.email(email);
                
                if (email && !isValid) {
                    this.showNewsletterError(errorDiv, 'Ingresa un email válido');
                    emailInput.style.borderColor = 'var(--error-color, #e53e3e)';
                } else {
                    this.clearNewsletterError(errorDiv);
                    emailInput.style.borderColor = 'var(--primary-color, #d3600f)';
                }
                
                return isValid;
            } catch (error) {
                SuenoAndino.Logger.error('Newsletter email validation error', error);
                return false;
            }
        },
        
        showFieldError: function(field, message) {
            try {
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
                    display: block;
                `;
                
                field.parentNode.appendChild(errorDiv);
                field.style.borderColor = 'var(--error-color, #e53e3e)';
            } catch (error) {
                SuenoAndino.Logger.error('Show field error error', error);
            }
        },
        
        clearFieldError: function(field) {
            try {
                const errorDiv = field.parentNode.querySelector('.field-error');
                if (errorDiv) {
                    errorDiv.remove();
                }
                field.style.borderColor = '';
            } catch (error) {
                SuenoAndino.Logger.error('Clear field error error', error);
            }
        },
        
        showFieldSuccess: function(field) {
            try {
                field.style.borderColor = 'var(--success-color, #16a34a)';
            } catch (error) {
                SuenoAndino.Logger.error('Show field success error', error);
            }
        },
        
        showNewsletterError: function(errorDiv, message) {
            try {
                if (errorDiv) {
                    errorDiv.textContent = message;
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                SuenoAndino.Logger.error('Show newsletter error error', error);
            }
        },
        
        clearNewsletterError: function(errorDiv) {
            try {
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                }
            } catch (error) {
                SuenoAndino.Logger.error('Clear newsletter error error', error);
            }
        },
        
        showNewsletterSuccess: function(successDiv) {
            try {
                if (successDiv) {
                    successDiv.style.display = 'block';
                    setTimeout(() => {
                        successDiv.style.display = 'none';
                    }, 5000);
                }
            } catch (error) {
                SuenoAndino.Logger.error('Show newsletter success error', error);
            }
        },
        
        handleSubmit: function(e, formId) {
            try {
                e.preventDefault();
                
                const form = e.target;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Validate all fields
                const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
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
                
                // Handle specific form types
                if (formId === 'newsletterForm') {
                    this.handleNewsletterSubmit(data);
                } else if (form.classList.contains('contacto-form')) {
                    this.handleContactSubmit(data);
                } else {
                    this.handleGenericSubmit(data, formId);
                }
                
            } catch (error) {
                SuenoAndino.Logger.error(`Form submission error: ${formId}`, error);
                SuenoAndino.Notify.error('Error al enviar el formulario. Inténtalo de nuevo.');
            }
        },
        
        handleNewsletterSubmit: function(data) {
            try {
                const email = data.newsletterEmail || data.email;
                
                if (!SuenoAndino.Validation.email(email)) {
                    SuenoAndino.Notify.error('Por favor ingresa un email válido');
                    return;
                }
                
                // Track analytics
                SuenoAndino.Analytics.track('newsletter_subscribe', {
                    email: email,
                    source: 'newsletter_form'
                });
                
                // Show success message
                const successDiv = SuenoAndino.DOM.query('#newsletterSuccess');
                this.showNewsletterSuccess(successDiv);
                
                // Clear form
                const emailInput = SuenoAndino.DOM.query('#newsletterEmail');
                if (emailInput) {
                    emailInput.value = '';
                }
                
                SuenoAndino.Logger.log('Newsletter subscription successful', { email });
                
            } catch (error) {
                SuenoAndino.Logger.error('Newsletter submission error', error);
                SuenoAndino.Notify.error('Error al suscribirse al newsletter. Inténtalo de nuevo.');
            }
        },
        
        handleContactSubmit: function(data) {
            try {
                // Track analytics
                SuenoAndino.Analytics.track('contact_form_submit', {
                    has_name: !!data.nombre,
                    has_email: !!data.email,
                    has_message: !!data.mensaje
                });
                
                // Show success message
                SuenoAndino.Notify.success('¡Mensaje enviado! Te contactaremos pronto.');
                
                // Clear form
                const form = SuenoAndino.DOM.query('.contacto-form');
                if (form) {
                    form.reset();
                }
                
                SuenoAndino.Logger.log('Contact form submission successful', data);
                
            } catch (error) {
                SuenoAndino.Logger.error('Contact form submission error', error);
                SuenoAndino.Notify.error('Error al enviar el mensaje. Inténtalo de nuevo.');
            }
        },
        
        handleGenericSubmit: function(data, formId) {
            try {
                // Track analytics
                SuenoAndino.Analytics.track('form_submit', {
                    form_id: formId,
                    form_data: data
                });
                
                // Show success message
                SuenoAndino.Notify.success('¡Formulario enviado correctamente!');
                
                // Clear form
                const form = this.forms.get(formId);
                if (form) {
                    form.reset();
                }
                
                SuenoAndino.Logger.log(`Generic form submission successful: ${formId}`, data);
                
            } catch (error) {
                SuenoAndino.Logger.error(`Generic form submission error: ${formId}`, error);
                SuenoAndino.Notify.error('Error al enviar el formulario. Inténtalo de nuevo.');
            }
        }
    };

    /**
     * Form Validation Rules
     */
    SuenoAndino.FormValidation = {
        rules: {
            required: {
                validate: (value) => SuenoAndino.Validation.required(value),
                message: 'Este campo es requerido'
            },
            email: {
                validate: (value) => !value || SuenoAndino.Validation.email(value),
                message: 'Ingresa un email válido'
            },
            phone: {
                validate: (value) => !value || SuenoAndino.Validation.phone(value),
                message: 'Ingresa un teléfono válido'
            },
            minLength: (min) => ({
                validate: (value) => !value || SuenoAndino.Validation.minLength(value, min),
                message: `Debe tener al menos ${min} caracteres`
            }),
            maxLength: (max) => ({
                validate: (value) => !value || SuenoAndino.Validation.maxLength(value, max),
                message: `No puede tener más de ${max} caracteres`
            })
        },
        
        validateField: function(field, rules = []) {
            try {
                const value = field.value.trim();
                let isValid = true;
                let errorMessage = '';
                
                for (const rule of rules) {
                    if (typeof rule === 'string' && this.rules[rule]) {
                        if (!this.rules[rule].validate(value)) {
                            isValid = false;
                            errorMessage = this.rules[rule].message;
                            break;
                        }
                    } else if (typeof rule === 'function') {
                        const result = rule(value);
                        if (result !== true) {
                            isValid = false;
                            errorMessage = result || 'Valor inválido';
                            break;
                        }
                    }
                }
                
                return { isValid, errorMessage };
            } catch (error) {
                SuenoAndino.Logger.error('Form validation error', error);
                return { isValid: false, errorMessage: 'Error de validación' };
            }
        }
    };

    // Initialize forms when DOM is ready
    SuenoAndino.DOM.ready(() => {
        SuenoAndino.Forms.init();
    });

})();
