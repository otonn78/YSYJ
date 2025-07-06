document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatusMessage = document.getElementById('form-status-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Prevenir el envío por defecto si vamos a manejarlo con JS completamente
            // Si se usa Formspree y se quiere su validación HTML5, no se previene siempre.
            // Por ahora, prevendremos para mostrar nuestra propia lógica de validación y simulación.
            event.preventDefault();

            if (validateForm()) {
                // Simulación de envío exitoso
                // En una implementación real con Formspree, simplemente se dejaría que el form haga el submit
                // o se enviaría con fetch y se manejaría la respuesta de Formspree.

                if (formStatusMessage) {
                    formStatusMessage.textContent = '¡Gracias! Tu mensaje ha sido enviado correctamente (simulación). Nos pondremos en contacto contigo pronto.';
                    formStatusMessage.className = 'success'; // Para aplicar estilos de éxito
                    formStatusMessage.style.display = 'block';
                }
                contactForm.reset(); // Limpiar el formulario

                // Ocultar el mensaje después de unos segundos
                setTimeout(() => {
                    if (formStatusMessage) {
                        formStatusMessage.style.display = 'none';
                        formStatusMessage.textContent = '';
                        formStatusMessage.className = '';
                    }
                }, 5000);

            } else {
                if (formStatusMessage) {
                    formStatusMessage.textContent = 'Por favor, corrige los errores en el formulario.';
                    formStatusMessage.className = 'error'; // Para aplicar estilos de error
                    formStatusMessage.style.display = 'block';
                     setTimeout(() => {
                        if (formStatusMessage) {
                            formStatusMessage.style.display = 'none';
                            formStatusMessage.textContent = '';
                            formStatusMessage.className = '';
                        }
                    }, 3000);
                }
            }
        });
    }

    function validateForm() {
        let isValid = true;
        clearAllErrors();

        // Campos requeridos
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const subjectField = document.getElementById('subject');
        const messageField = document.getElementById('message');

        if (!nameField.value.trim()) {
            setErrorFor(nameField, 'El nombre completo es obligatorio.');
            isValid = false;
        }

        if (!emailField.value.trim()) {
            setErrorFor(emailField, 'El correo electrónico es obligatorio.');
            isValid = false;
        } else if (!isValidEmail(emailField.value.trim())) {
            setErrorFor(emailField, 'Por favor, introduce un correo electrónico válido.');
            isValid = false;
        }

        if (!subjectField.value.trim()) {
            setErrorFor(subjectField, 'El asunto es obligatorio.');
            isValid = false;
        }

        if (!messageField.value.trim()) {
            setErrorFor(messageField, 'El mensaje es obligatorio.');
            isValid = false;
        } else if (messageField.value.trim().length < 10) {
            setErrorFor(messageField, 'El mensaje debe tener al menos 10 caracteres.');
            isValid = false;
        }

        return isValid;
    }

    function setErrorFor(inputElement, message) {
        const formGroup = inputElement.parentElement;
        const errorMessageElement = formGroup.querySelector('.form-error-message');

        formGroup.classList.add('error');
        if (errorMessageElement) {
            errorMessageElement.textContent = message;
        }
    }

    function clearErrorFor(inputElement) {
        const formGroup = inputElement.parentElement;
        const errorMessageElement = formGroup.querySelector('.form-error-message');

        formGroup.classList.remove('error');
        if (errorMessageElement) {
            errorMessageElement.textContent = '';
        }
    }

    function clearAllErrors() {
        const errorGroups = contactForm.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
            const errorMessageElement = group.querySelector('.form-error-message');
            if (errorMessageElement) {
                errorMessageElement.textContent = '';
            }
        });
    }

    function isValidEmail(email) {
        // Expresión regular simple para validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Limpiar errores al empezar a escribir en un campo
    if (contactForm) {
        ['name', 'email', 'subject', 'message'].forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('input', () => {
                    clearErrorFor(field);
                });
            }
        });
    }
});
