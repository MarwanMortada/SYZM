// Google Authentication Handler

window.addEventListener('load', function() {
    google.accounts.id.initialize({
        client_id: GOOGLE_CONFIG.client_id,
        callback: handleGoogleSignIn,
        login_uri: GOOGLE_CONFIG.login_uri,
        ux_mode: GOOGLE_CONFIG.ux_mode
    });

    google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        { 
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'square',
        }
    );
});

// Handle Google Sign In
async function handleGoogleSignIn(response) {
    const { credential } = response;
    const decodedToken = JSON.parse(atob(credential.split('.')[1]));
    
    const userData = {
        firstName: decodedToken.given_name,
        lastName: decodedToken.family_name,
        email: decodedToken.email,
        authMethod: 'google'
    };

    try {
        await sendToMake(userData);
        window.location.href = DASHBOARD_URL;
    } catch (error) {
        console.error('Failed to process Google sign-in:', error);
    }
}