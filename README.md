# IECC WTR (UI) Sign-Up Page

## Folder Structure

```
safeagro-signup/
│
├── index.html                 # Main HTML structure
├── README.md                  # This file
├── IECC Logo.png              # The official logo for the Innovation, Entrepreneurship and Competitiveness Centre (IECC) at Nile University
├── css/
│   ├── styles.css            # Main styles (layout, forms, buttons)
│   └── responsive.css        # Media queries and responsive design
│
└── js/
    ├── config.js             # Configuration (API keys, webhook URLs)
    ├── utils.js              # Shared utilities (validation, Make.com sender)
    ├── auth-google.js        # Google authentication logic
    ├── auth-microsoft.js     # Microsoft authentication logic
    ├── auth-manual.js        # Manual signup form handling
    └── auth-sso.js           # SSO and verification logic
```

## File Descriptions

### HTML
- **index.html**: Contains the complete page structure with all forms and sections

### CSS Files
- **styles.css**: All main styling including layout, forms, buttons, colors, and animations
- **responsive.css**: Media queries for tablet and mobile responsiveness

### JavaScript Files
- **config.js**: Configuration constants (webhook URL, client IDs, redirect URIs)
- **utils.js**: Shared utility functions used across all auth methods
- **auth-google.js**: Handles Google Sign-In initialization and callback
- **auth-microsoft.js**: Manages Microsoft authentication with MSAL
- **auth-manual.js**: Processes manual signup form with validation
- **auth-sso.js**: Handles SSO flow with email verification and 6-digit code

## Setup Instructions

1. Create the folder structure as shown above
2. Copy each file content into its respective location
3. Ensure all CSS files are in the `css/` folder
4. Ensure all JavaScript files are in the `js/` folder
5. Open `index.html` in a web browser

## Features

- ✅ Multiple authentication methods (Google, Microsoft, SSO, Manual)
- ✅ Email verification with 6-digit code for SSO
- ✅ Password matching validation
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Loading states and error handling
- ✅ Integration with Make.com webhook
- ✅ Automatic redirect to dashboard on success

## Configuration

To customize the configuration, edit `js/config.js`:
- Update webhook URL
- Change Google Client ID
- Modify Microsoft Client ID
- Set redirect URLs

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- All external dependencies (Google GSI, MSAL) are loaded via CDN
- Icons are loaded from Icons8 CDN
- Background image from Unsplash
- No additional npm packages required
