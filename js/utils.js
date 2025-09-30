// Utility functions for SafeAgroMENA authentication

/**
 * Send user data to Make.com webhook
 * @param {Object} userData - User information to send
 * @returns {Promise} - Response from webhook
 */
async function sendToMake(userData) {
    console.log('sendToMake function called with data:', userData);
    
    try {
        // Validate that webhook URL exists
        if (!MAKE_WEBHOOK_URL) {
            throw new Error('Make.com webhook URL is not configured');
        }

        console.log('Sending POST request to:', MAKE_WEBHOOK_URL);

        // Send POST request to Make.com webhook
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);

        // Check if response is OK (status 200-299)
        if (!response.ok) {
            throw new Error(`Webhook returned status ${response.status}: ${response.statusText}`);
        }
        
        // Try to parse response as JSON
        let responseData;
        try {
            const responseText = await response.text();
            console.log('Response body:', responseText);
            
            // If response has content, try to parse it
            if (responseText) {
                responseData = JSON.parse(responseText);
            } else {
                responseData = { success: true };
            }
        } catch (parseError) {
            console.log('Response is not JSON, treating as success');
            responseData = { success: true };
        }
        
        console.log('Data sent to Make.com successfully');
        return responseData;
        
    } catch (error) {
        console.error('Error sending data to Make.com:', error);
        console.error('Error details:', {
            message: error.message,
            name: error.name
        });
        throw error;
    }
}

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    // Check if email exists and is a string
    if (!email || typeof email !== 'string') {
        return false;
    }

    // Trim whitespace
    email = email.trim();

    // Basic email regex pattern
    // Allows: letters, numbers, dots, hyphens, underscores before @
    // Requires @ symbol
    // Allows: letters, numbers, dots, hyphens after @
    // Requires at least one dot after @
    // Requires at least 2 characters after final dot
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
        console.log('Invalid email format:', email);
    }
    
    return isValid;
}

/**
 * Set loading state for forms
 * @param {HTMLFormElement} form - The form element
 * @param {boolean} isLoading - Whether form is in loading state
 */
function setLoadingState(form, isLoading) {
    if (!form) {
        console.error('Form element not provided to setLoadingState');
        return;
    }

    // Find button in the form
    const button = form.querySelector('.continue-button');
    const spinner = form.querySelector('.loading-spinner');
    const buttonText = form.querySelector('.button-text');
    
    if (button) {
        button.disabled = isLoading;
        button.style.cursor = isLoading ? 'not-allowed' : 'pointer';
        
        // Change button appearance during loading
        if (isLoading) {
            button.style.opacity = '0.7';
        } else {
            button.style.opacity = '1';
        }
    } else {
        console.warn('Continue button not found in form');
    }
    
    if (spinner) {
        spinner.style.display = isLoading ? 'block' : 'none';
    }
    
    if (buttonText) {
        buttonText.style.opacity = isLoading ? '0' : '1';
    }
}

/**
 * Validate phone number format (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidPhone(phone) {
    // Check if phone exists and is a string
    if (!phone || typeof phone !== 'string') {
        return false;
    }

    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it has at least 7 digits (minimum for most phone numbers)
    return cleaned.length >= 7 && cleaned.length <= 15;
}

/**
 * Format phone number for display
 * @param {string} phone - Raw phone number
 * @returns {string} - Formatted phone number
 */
function formatPhone(phone) {
    if (!phone) return '';
    
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format based on length (simple US format example)
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
}

/**
 * Show error message
 * @param {HTMLElement} element - Element to show error in
 * @param {string} message - Error message to display
 */
function showError(element, message) {
    if (!element) return;
    
    element.textContent = message;
    element.style.display = 'block';
    element.style.color = '#dc3545';
    
    // Scroll error into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Hide error message
 * @param {HTMLElement} element - Element to hide
 */
function hideError(element) {
    if (!element) return;
    
    element.style.display = 'none';
    element.textContent = '';
}

/**
 * Show success message
 * @param {HTMLElement} element - Element to show success in
 * @param {string} message - Success message to display
 */
function showSuccess(element, message) {
    if (!element) return;
    
    element.textContent = message;
    element.style.display = 'block';
    element.style.color = '#28a745';
}

/**
 * Validate required form fields
 * @param {HTMLFormElement} form - Form to validate
 * @returns {Object} - {isValid: boolean, message: string}
 */
function validateForm(form) {
    if (!form) {
        return { isValid: false, message: 'Form not found' };
    }

    // Get all required inputs
    const requiredInputs = form.querySelectorAll('[required]');
    
    for (let input of requiredInputs) {
        if (!input.value || input.value.trim() === '') {
            return {
                isValid: false,
                message: `Please fill in: ${input.placeholder || input.name}`
            };
        }
        
        // Special validation for email fields
        if (input.type === 'email' && !isValidEmail(input.value)) {
            return {
                isValid: false,
                message: 'Please enter a valid email address'
            };
        }
        
        // Special validation for phone fields
        if (input.type === 'tel' && !isValidPhone(input.value)) {
            return {
                isValid: false,
                message: 'Please enter a valid phone number'
            };
        }
    }
    
    return { isValid: true, message: '' };
}

/**
 * Debounce function for input validation
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 300) {
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

// Log that utils are loaded
console.log('Utils.js loaded successfully');
console.log('Available utility functions:', [
    'sendToMake',
    'isValidEmail', 
    'setLoadingState',
    'isValidPhone',
    'formatPhone',
    'showError',
    'hideError',
    'showSuccess',
    'validateForm',
    'debounce'
]);
