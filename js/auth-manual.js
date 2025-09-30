// Manual Sign-Up Form Handler

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    
    // Handle manual signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorMessage = document.getElementById('error-message');

            if (password !== confirmPassword) {
                errorMessage.style.display = 'block';
                return;
            }

            const formData = new FormData(signupForm);
            const userData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                birthDate: formData.get('birthDate'),
                gender: formData.get('gender'),
                authMethod: 'manual'
            };

            try {
                await sendToMake(userData);
                window.location.href = DASHBOARD_URL;
            } catch (error) {
                console.error('Failed to process manual sign-up:', error);
                errorMessage.textContent = 'Failed to create account. Please try again.';
                errorMessage.style.display = 'block';
            }
        });
    }
});