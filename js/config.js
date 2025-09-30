// Configuration file for SafeAgroMENA authentication

// Make.com webhook URL
const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/ebqg8sxm53ji14miey5127b0jnhnuub8';

// Google Sign-In Configuration
const GOOGLE_CONFIG = {
    client_id: '910134358750-l7gikjort353nv6isipjig0vrvrd6e5n.apps.googleusercontent.com',
    login_uri: 'https://safeagromena.softr.app',
    ux_mode: 'redirect'
};

// Microsoft Authentication Configuration
const MSAL_CONFIG = {
    auth: {
        clientId: "1155d9d7-01b6-4ad4-af79-d8579bfa0f04",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: "https://safeagromena.softr.app",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    }
};

// Dashboard redirect URL

const DASHBOARD_URL = 'https://www.youtube.com/';
