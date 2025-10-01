// Microsoft Authentication Handler

// Wait for page and MSAL library to load
window.addEventListener('load', function() {
    // Check if MSAL library is loaded
    if (typeof msal === 'undefined') {
        console.error('MSAL library failed to load');
        return;
    }

    console.log('Initializing Microsoft authentication...');

    // Create MSAL instance with configuration
    const msalInstance = new msal.PublicClientApplication(MSAL_CONFIG);

    // Initialize MSAL
    msalInstance.initialize().then(() => {
        console.log('MSAL initialized successfully');

        // Handle redirect response (for when user comes back after login)
        msalInstance.handleRedirectPromise()
            .then(response => handleMicrosoftResponse(response, msalInstance))
            .catch((error) => {
                console.error("Error handling redirect:", error);
            });
    }).catch((error) => {
        console.error('MSAL initialization failed:', error);
    });

    // Get the Microsoft login button
    const microsoftButton = document.getElementById("microsoft-login");
    
    if (!microsoftButton) {
        console.error('Microsoft button not found');
        return;
    }

    // Handle Microsoft login button click
    microsoftButton.addEventListener("click", async () => {
        console.log('Microsoft login button clicked');
        
        try {
            // Show loading state
            microsoftButton.style.opacity = '0.5';
            microsoftButton.style.pointerEvents = 'none';

            // Login request configuration
            const loginRequest = {
                scopes: ["openid", "profile", "email", "User.Read"],
                prompt: "select_account" // Always show account picker
            };

            // Use popup for better user experience
            console.log('Opening Microsoft login popup...');
            const response = await msalInstance.loginPopup(loginRequest);
            
            // Handle successful login
            await handleMicrosoftResponse(response, msalInstance);

        } catch (error) {
            console.error("Microsoft login error:", error);
            
            // Reset button state
            microsoftButton.style.opacity = '1';
            microsoftButton.style.pointerEvents = 'auto';
            
            // Show user-friendly error message
            if (error.errorCode === 'user_cancelled') {
                console.log('User cancelled the login');
            } else {
                alert('Failed to sign in with Microsoft. Please try again.');
            }
        }
    });

    console.log('Microsoft authentication setup complete');
});

// Handle Microsoft authentication response
async function handleMicrosoftResponse(response, msalInstance) {
    // If no response, user didn't complete login
    if (!response) {
        console.log('No response from Microsoft login');
        return;
    }

    console.log('Microsoft login successful');
    
    try {
        // Extract account information
        const account = response.account;
        
        if (!account) {
            throw new Error('No account information received');
        }

        console.log('User info:', {
            name: account.name,
            email: account.username
        });

        // Check if email is authorized
        if (!isAuthorizedEmail(account.username)) {
            alert('Access denied. You are not authorized to access this system.');
            console.log('Unauthorized email attempt:', account.username);
            
            // Reset button state
            const microsoftButton = document.getElementById("microsoft-login");
            if (microsoftButton) {
                microsoftButton.style.opacity = '1';
                microsoftButton.style.pointerEvents = 'auto';
            }
            return;
        }

        // Parse the name into first and last name
        const nameParts = account.name ? account.name.split(' ') : ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Prepare user data for Make.com
        const userData = {
            firstName: firstName,
            lastName: lastName,
            email: account.username,
            authMethod: 'microsoft',
            timestamp: new Date().toISOString()
        };

        // Send data to Make.com webhook
        console.log('Sending data to Make.com...');
        await sendToMake(userData);
        
        console.log('Data sent successfully, redirecting...');
        
        // Redirect to dashboard
        window.location.href = DASHBOARD_URL;
        
    } catch (error) {
        console.error('Failed to process Microsoft sign-in:', error);
        alert('Failed to complete sign-in. Please try again.');
        
        // Reset button state
        const microsoftButton = document.getElementById("microsoft-login");
        if (microsoftButton) {
            microsoftButton.style.opacity = '1';
            microsoftButton.style.pointerEvents = 'auto';
        }
    }
}