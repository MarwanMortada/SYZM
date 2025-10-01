// Google Authentication Handler

// Wait for Google library to load
window.addEventListener('load', function() {
    // Check if Google library is loaded
    if (typeof google === 'undefined') {
        console.error('Google Sign-In library failed to load');
        return;
    }

    // Initialize Google Sign-In
    google.accounts.id.initialize({
        client_id: GOOGLE_CONFIG.client_id,
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: true
    });

    // Render the Google Sign-In button
    const googleButtonContainer = document.querySelector('.g_id_signin');
    
    if (googleButtonContainer) {
        google.accounts.id.renderButton(
            googleButtonContainer,
            { 
                type: 'icon',
                size: 'large',
                theme: 'outline',
                shape: 'square',
            }
        );
        
        console.log('Google Sign-In button initialized successfully');
    } else {
        console.error('Google button container not found');
    }

    // Also enable One Tap (optional - can be removed if not needed)
    // google.accounts.id.prompt();
});

// Handle Google Sign In Response
async function handleGoogleSignIn(response) {
    console.log('Google Sign-In initiated');
    
    try {
        // Extract the credential (JWT token) from response
        const { credential } = response;
        
        if (!credential) {
            throw new Error('No credential received from Google');
        }

        // Decode the JWT token to get user information
        // JWT structure: header.payload.signature
        const base64Url = credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        
        const decodedToken = JSON.parse(jsonPayload);
        
        console.log('User info decoded:', {
            name: decodedToken.name,
            email: decodedToken.email
        });

        // Check if email is authorized
        if (!isAuthorizedEmail(decodedToken.email)) {
            alert('Access denied. You are not authorized to access this system.');
            console.log('Unauthorized email attempt:', decodedToken.email);
            
            // Reset button state
            const googleButton = document.querySelector('.g_id_signin');
            if (googleButton) {
                googleButton.style.opacity = '1';
                googleButton.style.pointerEvents = 'auto';
            }
            return;
        }

        // Prepare user data for Make.com
        const userData = {
            firstName: decodedToken.given_name || '',
            lastName: decodedToken.family_name || '',
            email: decodedToken.email,
            authMethod: 'google',
            timestamp: new Date().toISOString()
        };

        // Show loading state (optional)
        const googleButton = document.querySelector('.g_id_signin');
        if (googleButton) {
            googleButton.style.opacity = '0.5';
            googleButton.style.pointerEvents = 'none';
        }

        // Send data to Make.com webhook
        console.log('Sending data to Make.com...');
        await sendToMake(userData);
        
        console.log('Data sent successfully, redirecting...');
        
        // Redirect to dashboard
        window.location.href = DASHBOARD_URL;
        
    } catch (error) {
        console.error('Failed to process Google sign-in:', error);
        
        // Show error message to user
        alert('Failed to sign in with Google. Please try again.');
        
        // Reset button state
        const googleButton = document.querySelector('.g_id_signin');
        if (googleButton) {
            googleButton.style.opacity = '1';
            googleButton.style.pointerEvents = 'auto';
        }
    }
}