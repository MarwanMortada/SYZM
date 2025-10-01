// Manual Sign-Up Form Handler

document.addEventListener('DOMContentLoaded', function() {
    console.log('Manual signup form handler initialized');
    
    const signupForm = document.getElementById('signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const errorMessage = document.getElementById('error-message');
    
    // Check if form exists
    if (!signupForm) {
        console.error('Signup form not found');
        return;
    }

    console.log('Manual signup form found and ready');

    // Real-time password matching validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword.length > 0) {
                if (password !== confirmPassword) {
                    errorMessage.textContent = 'Passwords do not match';
                    errorMessage.style.display = 'block';
                    confirmPasswordInput.style.borderColor = '#dc3545';
                } else {
                    errorMessage.style.display = 'none';
                    confirmPasswordInput.style.borderColor = '#28a745';
                }
            }
        });
    }

    // Handle manual signup form submission
    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log('Manual signup form submitted');
        
        // Get form values
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match';
            errorMessage.style.display = 'block';
            confirmPasswordInput.focus();
            return;
        }

        // Validate password strength (minimum 6 characters)
        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters';
            errorMessage.style.display = 'block';
            passwordInput.focus();
            return;
        }

        // Collect form data
        const formData = new FormData(signupForm);
        const email = formData.get('email') || '';

        // Validate required fields
        const firstName = formData.get('firstName') || '';
        const lastName = formData.get('lastName') || '';

        if (!firstName || !lastName || !email) {
            errorMessage.textContent = 'Please fill in all required fields';
            errorMessage.style.display = 'block';
            return;
        }

        // Validate email format
        if (!isValidEmail(email)) {
            errorMessage.textContent = 'Please enter a valid email address';
            errorMessage.style.display = 'block';
            return;
        }

        // Check if email is authorized
        if (!isAuthorizedEmail(email)) {
            errorMessage.textContent = 'Access denied. You are not authorized to access this system.';
            errorMessage.style.display = 'block';
            console.log('Unauthorized email attempt:', email);
            return;
        }

        // Hide error message
        errorMessage.style.display = 'none';

        // Get submit button
        const submitButton = signupForm.querySelector('.continue-button');
        const originalButtonText = submitButton.textContent;

        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Creating Account...';
            submitButton.style.opacity = '0.7';
            
            console.log('Collecting form data...');

            // Prepare user data object
            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: formData.get('phone') || '',
                birthDate: formData.get('birthDate') || '',
                gender: formData.get('gender') || '',
                authMethod: 'manual',
                timestamp: new Date().toISOString()
            };

            console.log('User data prepared:', {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                authMethod: userData.authMethod
            });

            // Send data to Make.com webhook
            console.log('Sending data to Make.com...');
            await sendToMake(userData);
            
            console.log('Account created successfully, redirecting...');
            
            // Show success message briefly
            submitButton.textContent = '✓ Account Created!';
            submitButton.style.backgroundColor = '#28a745';
            
            // Wait a moment then redirect
            setTimeout(() => {
                window.location.href = DASHBOARD_URL;
            }, 1000);
            
        } catch (error) {
            console.error('Failed to process manual sign-up:', error);
            
            // Show error message to user
            errorMessage.textContent = error.message || 'Failed to create account. Please try again.';
            errorMessage.style.display = 'block';
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.style.opacity = '1';
            submitButton.style.backgroundColor = '#333';
            
            // Scroll to error message
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Add input validation for email field
    const emailInput = signupForm.querySelector('input[name="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#dc3545';
            } else if (this.value) {
                this.style.borderColor = '#28a745';
            }
        });
    }

    // Add input validation for phone field (optional but nice)
    const phoneInput = signupForm.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Remove non-numeric characters
            this.value = this.value.replace(/[^0-9+\-() ]/g, '');
        });
    }

    console.log('Manual signup form validation and handlers ready');
});