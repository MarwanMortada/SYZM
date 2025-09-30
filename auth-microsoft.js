// Microsoft Authentication Handler

// Check if in preview mode
function isPreviewMode() {
    return window.location.href.includes('preview') || 
           window.location.href.includes('localhost') ||
           window.location.href.includes('127.0.0.1');
}

// Initialize Microsoft authentication after page load
window.addEventListener('load', function() {
    // Create MSAL instance
    const msalInstance = new msal.PublicClientApplication(MSAL_CONFIG);

    // Handle Microsoft login
    document.getElementById("microsoft-login").addEventListener("click", async () => {
        try {
            if (isPreviewMode()) {
                const loginRequest = {
                    scopes: ["openid", "profile", "email", "User.Read"],
                    prompt: "select_account"
                };
                
                const response = await msalInstance.loginPopup(loginRequest);
                if (response) {
                    const userData = {
                        email: response.account.username,
                        firstName: response.account.name.split(' ')[0],
                        lastName: response.account.name.split(' ').slice(1).join(' '),
                        authMethod: 'microsoft'
                    };
                    
                    await sendToMake(userData);
                    window.location.href = DASHBOARD_URL;
                }
            } else {
                const loginRequest = {
                    scopes: ["openid", "profile", "email", "User.Read"],
                    prompt: "select_account"
                };
                await msalInstance.loginRedirect(loginRequest);
            }
        } catch (error) {
            console.error("Microsoft login error:", error);
        }
    });

    // Handle Microsoft redirect response
    if (!isPreviewMode()) {
        msalInstance.handleRedirectPromise().then(async (response) => {
            if (response) {
                const userData = {
                    email: response.account.username,
                    firstName: response.account.name.split(' ')[0],
                    lastName: response.account.name.split(' ').slice(1).join(' '),
                    authMethod: 'microsoft'
                };
                
                await sendToMake(userData);
                window.location.href = MSAL_CONFIG.auth.redirectUri;
            }
        }).catch((error) => {
            console.error("Error handling redirect:", error);
        });
    }
});