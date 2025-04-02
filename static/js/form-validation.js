document.addEventListener('DOMContentLoaded', function() {
    initializeFormValidation();
});

/**
 * Initialize form validation functionality
 */
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        // Reset previous error messages
        clearErrors();
        
        // Get form fields
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        let hasErrors = false;
        
        // Validate name (required, at least 2 characters)
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
            showError(nameInput, 'Por favor ingrese su nombre (mínimo 2 caracteres)');
            hasErrors = true;
        }
        
        // Validate email (required and valid format)
        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'Por favor ingrese un correo electrónico válido');
            hasErrors = true;
        }
        
        // Validate message (required, at least 10 characters)
        if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
            showError(messageInput, 'Por favor ingrese un mensaje (mínimo 10 caracteres)');
            hasErrors = true;
        }
        
        // If there are errors, prevent form submission
        if (hasErrors) {
            event.preventDefault();
        }
    });
    
    /**
     * Show error message for a form field
     * @param {HTMLElement} input - The input element
     * @param {string} message - The error message to display
     */
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
        input.classList.add('invalid');
    }
    
    /**
     * Clear all error messages
     */
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const invalidInputs = document.querySelectorAll('.invalid');
        
        errorMessages.forEach(error => error.remove());
        invalidInputs.forEach(input => input.classList.remove('invalid'));
    }
    
    /**
     * Validate email format
     * @param {string} email - The email to validate
     * @return {boolean} - True if valid, false otherwise
     */
    function validateEmail(email) {
        if (!email) return false;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
