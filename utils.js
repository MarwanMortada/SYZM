// Utility functions for SafeAgroMENA authentication

// Function to send data to Make.com
async function sendToMake(userData) {
    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to send data to Make.com');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error sending data to Make:', error);
        throw error;
    }
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Set loading state for forms
function setLoadingState(form, isLoading) {
    const button = form.querySelector('.continue-button');
    const spinner = form.querySelector('.loading-spinner');
    const buttonText = form.querySelector('.button-text');
    
    if (button && spinner && buttonText) {
        button.disabled = isLoading;
        spinner.style.display = isLoading ? 'block' : 'none';
        buttonText.style.opacity = isLoading ? '0' : '1';
    }
}