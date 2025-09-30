// Configuration file for SafeAgroMENA authentication

// ============================================
// Make.com Webhook Configuration
// ============================================
// This webhook receives user data from all authentication methods
const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/tcw8txlr4rp97iahlq7hcfqvq6cpdmio';

// ============================================
// Google Sign-In Configuration
// ============================================
// Get your Google Client ID from: https://console.cloud.google.com/
const GOOGLE_CONFIG = {
    // Your Google OAuth 2.0 Client ID
    client_id: '910134358750-l7gikjort353nv6isipjig0vrvrd6e5n.apps.googleusercontent.com',
    
    // Note: For standalone websites, we use callback mode instead of redirect
    // The old redirect settings are kept here for reference but not used
    // login_uri: 'https://safeagromena.softr.app',
    // ux_mode: 'redirect'
};

// ============================================
// Microsoft Authentication Configuration
// ============================================
// Get your Microsoft App from: https://portal.azure.com/
const MSAL_CONFIG = {
    auth: {
        // Your Microsoft Application (client) ID
        clientId: "1155d9d7-01b6-4ad4-af79-d8579bfa0f04",
        
        // Authority URL - 'common' allows any Microsoft account
        // Use 'organizations' for work/school accounts only
        // Use 'consumers' for personal accounts only
        authority: "https://login.microsoftonline.com/common",
        
        // Redirect URI - where Microsoft sends users after login
        redirectUri: "https://marwanmortada.github.io/SafeAgroMENA_SignUp_Page/",
    },
    cache: {
        // Where to store authentication tokens
        // 'sessionStorage' = cleared when browser closes (more secure)
        // 'localStorage' = persists across browser sessions
        cacheLocation: "sessionStorage",
        
        // Set to true if using IE11 (handles cookie issues)
        storeAuthStateInCookie: false
    }
};

// ============================================
// Dashboard / Success Redirect URL
// ============================================
// Where users go after successful authentication
const DASHBOARD_URL = 'https://marwanmortada.github.io/SafeAgroMENA_SignUp_Page/going.html';

// ============================================
// Environment Detection (Optional)
// ============================================
// Detect if running locally for debugging
const IS_LOCAL = window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1' ||
                 window.location.hostname === '';

// ============================================
// Debug Mode (Optional)
// ============================================
// Set to true to see detailed console logs
const DEBUG_MODE = true;

// Helper function for debug logging
function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log('[SafeAgroMENA Debug]:', ...args);
    }
}

// ============================================
// Configuration Validation
// ============================================
// Check if all required configs are set
function validateConfig() {
    const errors = [];
    
    if (!MAKE_WEBHOOK_URL || MAKE_WEBHOOK_URL === '') {
        errors.push('MAKE_WEBHOOK_URL is not set');
    }
    
    if (!GOOGLE_CONFIG.client_id || GOOGLE_CONFIG.client_id === '') {
        errors.push('Google Client ID is not set');
    }
    
    if (!MSAL_CONFIG.auth.clientId || MSAL_CONFIG.auth.clientId === '') {
        errors.push('Microsoft Client ID is not set');
    }
    
    if (!DASHBOARD_URL || DASHBOARD_URL === '') {
        errors.push('DASHBOARD_URL is not set');
    }
    
    if (errors.length > 0) {
        console.error('Configuration Errors:');
        errors.forEach(error => console.error('  -', error));
        return false;
    }
    
    console.log('All configurations validated successfully');
    return true;
}

// ============================================
// Log Configuration Status
// ============================================
console.log('SafeAgroMENA Configuration Loaded');
console.log('=========================================');
console.log('Environment:', IS_LOCAL ? 'Local' : 'Production');
console.log('Dashboard URL:', DASHBOARD_URL);
console.log('Debug Mode:', DEBUG_MODE ? 'ON' : 'OFF');
console.log('Webhook:', MAKE_WEBHOOK_URL ? 'Configured' : 'Missing');
console.log('Google Auth:', GOOGLE_CONFIG.client_id ? 'Configured' : 'Missing');
console.log('Microsoft Auth:', MSAL_CONFIG.auth.clientId ? 'Configured' : 'Missing');
console.log('=========================================');

// Validate configuration
validateConfig();

// ============================================
// Export for debugging (optional)
// ============================================
// Uncomment this if you want to inspect config in console
// window.SafeAgroConfig = {
//     MAKE_WEBHOOK_URL,
//     GOOGLE_CONFIG,
//     MSAL_CONFIG,
//     DASHBOARD_URL,
//     IS_LOCAL,
//     DEBUG_MODE
// };

