// Sign-In Form Handler

document.addEventListener('DOMContentLoaded', function() {
    console.log('Sign-in form handler initialized');
    
    const signinForm = document.getElementById('signin-form');
    const signinError = document.getElementById('signin-error');
    
    // Check if form exists
    if (!signinForm) {
        console.error('Sign-in form not found');
        return;
    }

    console.log('Sign-in form found and ready');

    // Handle sign-in form submission
    signinForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log('Sign-in form submitted');
        
        // Get form values
        const formData = new FormData(signinForm);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Hide previous errors
        if (signinError) {
            signinError.style.display = 'none';
        }

        // Validate email format
        if (!isValidEmail(email)) {
            signinError.textContent = 'Please enter a valid email address';
            signinError.style.display = 'block';
            return;
        }

        // Validate password
        if (!password || password.length < 6) {
            signinError.textContent = 'Password must be at least 6 characters';
            signinError.style.display = 'block';
            return;
        }

        // Check if email is authorized
        if (!isAuthorizedEmail(email)) {
            signinError.textContent = 'Access denied. You are not authorized to access this system.';
            signinError.style.display = 'block';
            console.log('Unauthorized email attempt:', email);
            return;
        }

        // Get submit button
        const submitButton = signinForm.querySelector('.continue-button');
        const originalButtonText = submitButton.textContent;

        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Signing In...';
            submitButton.style.opacity = '0.7';
            
            console.log('Processing sign-in...');

            // Prepare user data object
            const userData = {
                email: email,
                authMethod: 'manual-signin',
                timestamp: new Date().toISOString()
            };

            console.log('User data prepared:', {
                email: userData.email,
                authMethod: userData.authMethod
            });

            // Send data to Make.com webhook
            console.log('Sending data to Make.com...');
            await sendToMake(userData);
            
            console.log('Sign-in successful, redirecting...');
            
            // Show success message briefly
            submitButton.textContent = '✓ Sign-In Successful!';
            submitButton.style.backgroundColor = '#28a745';
            
            // Wait a moment then redirect
            setTimeout(() => {
                window.location.href = DASHBOARD_URL;
            }, 1000);
            
        } catch (error) {
            console.error('Failed to process sign-in:', error);
            
            // Show error message to user
            signinError.textContent = 'Failed to sign in. Please check your credentials and try again.';
            signinError.style.display = 'block';
            
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.style.opacity = '1';
            submitButton.style.backgroundColor = '';
            
            // Scroll to error message
            signinError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Add input validation for email field
    const emailInput = signinForm.querySelector('input[name="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#dc3545';
            } else if (this.value) {
                this.style.borderColor = '#28a745';
            }
        });
    }

    console.log('Sign-in form validation and handlers ready');
});