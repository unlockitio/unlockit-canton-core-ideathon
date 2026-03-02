/*
 * Form Utilities
 * Reusable form helper functions
 */

/**
 * Toggle password visibility
 * @param {string} inputId - The ID of the password input field
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) {
        console.error(`Input element with ID "${inputId}" not found`);
        return;
    }

    const currentType = input.getAttribute('type');
    const newType = currentType === 'password' ? 'text' : 'password';
    input.setAttribute('type', newType);

    // Update icon if toggle button has one
    const toggleButton = input.parentElement.querySelector('.toggle-password');
    if (toggleButton) {
        const icon = toggleButton.querySelector('svg use');
        if (icon) {
            const newIcon = newType === 'password' ? '#icon-eye' : '#icon-eye-off';
            icon.setAttribute('href', newIcon);
        }
    }
}

/**
 * Confirm delete action
 * @param {HTMLElement} element - The element to delete
 * @param {string} message - Custom confirmation message (optional)
 * @returns {boolean} - Whether the deletion was confirmed
 */
function confirmDelete(element, message = 'Are you sure you want to delete this item?') {
    if (!element) {
        console.error('No element provided to confirmDelete');
        return false;
    }

    if (confirm(message)) {
        element.remove();
        return true;
    }
    return false;
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return {
            isValid: false,
            message: `Password must be at least ${minLength} characters long`
        };
    }

    if (!hasUpperCase) {
        return {
            isValid: false,
            message: 'Password must contain at least one uppercase letter'
        };
    }

    if (!hasLowerCase) {
        return {
            isValid: false,
            message: 'Password must contain at least one lowercase letter'
        };
    }

    if (!hasNumbers) {
        return {
            isValid: false,
            message: 'Password must contain at least one number'
        };
    }

    if (!hasSpecialChar) {
        return {
            isValid: false,
            message: 'Password must contain at least one special character'
        };
    }

    return {
        isValid: true,
        message: 'Password is strong'
    };
}

/**
 * Show form field error
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
function showFieldError(input, message) {
    if (!input) return;

    // Remove existing error
    clearFieldError(input);

    // Add error class
    input.classList.add('error');

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;

    // Insert error message after input
    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

/**
 * Clear form field error
 * @param {HTMLElement} input - Input element
 */
function clearFieldError(input) {
    if (!input) return;

    // Remove error class
    input.classList.remove('error');

    // Remove error message
    const errorElement = input.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Validate form field on blur
 * @param {HTMLElement} input - Input element
 * @param {function} validator - Validation function
 */
function validateFieldOnBlur(input, validator) {
    if (!input || !validator) return;

    input.addEventListener('blur', function() {
        const result = validator(this.value);
        if (result.isValid) {
            clearFieldError(this);
        } else {
            showFieldError(this, result.message);
        }
    });

    // Clear error on input
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            clearFieldError(this);
        }
    });
}

/**
 * Serialize form data to object
 * @param {HTMLFormElement} form - Form element
 * @returns {object} - Form data as object
 */
function serializeForm(form) {
    if (!form) {
        console.error('No form provided to serializeForm');
        return {};
    }

    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    return data;
}

/**
 * Disable form submission
 * @param {HTMLFormElement} form - Form element
 */
function disableForm(form) {
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
        input.disabled = true;
    });

    form.classList.add('form-disabled');
}

/**
 * Enable form submission
 * @param {HTMLFormElement} form - Form element
 */
function enableForm(form) {
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
        input.disabled = false;
    });

    form.classList.remove('form-disabled');
}

/**
 * Show loading state on submit button
 * @param {HTMLElement} button - Submit button element
 * @param {string} loadingText - Text to show while loading (optional)
 */
function showButtonLoading(button, loadingText = 'Loading...') {
    if (!button) return;

    button.disabled = true;
    button.setAttribute('data-original-text', button.textContent);
    button.textContent = loadingText;
    button.classList.add('loading');
}

/**
 * Hide loading state on submit button
 * @param {HTMLElement} button - Submit button element
 */
function hideButtonLoading(button) {
    if (!button) return;

    button.disabled = false;
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
        button.textContent = originalText;
        button.removeAttribute('data-original-text');
    }
    button.classList.remove('loading');
}

/**
 * Auto-resize textarea based on content
 * @param {HTMLTextAreaElement} textarea - Textarea element
 */
function autoResizeTextarea(textarea) {
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

/**
 * Initialize auto-resize for all textareas with class
 */
function initAutoResizeTextareas() {
    const textareas = document.querySelectorAll('textarea.auto-resize');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            autoResizeTextarea(this);
        });
        // Initial resize
        autoResizeTextarea(textarea);
    });
}

// Export functions for global access
if (typeof window !== 'undefined') {
    window.togglePassword = togglePassword;
    window.confirmDelete = confirmDelete;
    window.validateEmail = validateEmail;
    window.validatePassword = validatePassword;
    window.showFieldError = showFieldError;
    window.clearFieldError = clearFieldError;
    window.validateFieldOnBlur = validateFieldOnBlur;
    window.serializeForm = serializeForm;
    window.disableForm = disableForm;
    window.enableForm = enableForm;
    window.showButtonLoading = showButtonLoading;
    window.hideButtonLoading = hideButtonLoading;
    window.autoResizeTextarea = autoResizeTextarea;
    window.initAutoResizeTextareas = initAutoResizeTextareas;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initAutoResizeTextareas();
});
