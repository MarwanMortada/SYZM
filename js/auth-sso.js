// auth-sso.js - SSO and Verification Logic

// Global variables for verification state
let verificationCode = null;
let resendTimer = null;
let attempts = 0;
const maxAttempts = 3;

/**
 * Generate a random 6-digit verification code
 */
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Start countdown timer for resend code button
 */
function startResendTimer() {
    const timerDisplay = document.querySelector('.timer');
    const resendButton = document.querySelector('.resend-code');
    let timeLeft = 30;
    
    if (resendButton) {
        resendButton.classList.add('disabled');
    }
    
    if (resendTimer) {
        clearInterval(resendTimer);
    }
    
    resendTimer = setInterval(() => {
        if (timerDisplay) {
            timerDisplay.textContent = `Resend code in ${timeLeft} seconds`;
        }
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(resendTimer);
            if (timerDisplay) {
                timerDisplay.textContent = '';
            }
            if (resendButton) {
                resendButton.classList.remove('disabled');
            }
        }
    }, 1000);
}

/**
 * Initialize SSO authentication
 */
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const ssoVerificationForm = document.getElementById('sso-verification-form');
    const verificationCodeForm = document.getElementById('verification-code-form');
    const ssoButton = document.querySelector('.auth-button img[alt="SSO"]')?.parentElement;
    
    // Handle SSO button click
    if (ssoButton) {
        ssoButton.addEventListener('click', function() {
            signupForm.style.display = 'none';
            ssoVerificationForm.style.display = 'block';
            verificationCodeForm.style.display = 'none';
        });
    }
    
    // Handle SSO verification form submission
    if (ssoVerificationForm) {
        ssoVerificationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('sso-email').value;
            const emailError = document.getElementById('email-error');
            
            if (!isValidEmail(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
                return;
            }
            
            setLoadingState(ssoVerificationForm, true);
            emailError.style.display = 'none';
            
            try {
                verificationCode = generateVerificationCode();
                await new Promise(resolve => setTimeout(resolve, 1500));
                console.log('Verification code:', verificationCode);
                
                const userData = {
                    email: email,
                    authMethod: 'sso',
                    verificationCode: verificationCode
                };
                
                await sendToMake(userData);
                
                const displayEmail = document.getElementById('display-email');
                if (displayEmail) {
                    displayEmail.textContent = email;
                }
                
                ssoVerificationForm.style.display = 'none';
                verificationCodeForm.style.display = 'block';
                
                startResendTimer();
                
                const firstInput = verificationCodeForm.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
                
            } catch (error) {
                emailError.textContent = 'Failed to send verification code. Please try again.';
                emailError.style.display = 'block';
            } finally {
                setLoadingState(ssoVerificationForm, false);
            }
        });
    }
    
    // Handle verification code input auto-focus
    const codeInputs = verificationCodeForm?.querySelectorAll('.verification-code-input input');
    if (codeInputs) {
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', function(e) {
                if (this.value.length >= 1) {
                    this.value = this.value[0];
                    if (index < codeInputs.length - 1) {
                        codeInputs[index + 1].focus();
                    }
                }
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && !this.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });
        });
    }
    
    // Handle verification code form submission
    if (verificationCodeForm) {
        verificationCodeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const verificationError = document.getElementById('verification-error');
            const verificationSuccess = document.getElementById('verification-success');
            const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
            
            setLoadingState(verificationCodeForm, true);
            verificationError.style.display = 'none';
            verificationSuccess.style.display = 'none';
            
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                if (enteredCode === verificationCode) {
                    verificationSuccess.textContent = 'Verification successful! Redirecting...';
                    verificationSuccess.style.display = 'block';
                    
                    setTimeout(() => {
                        window.location.href = DASHBOARD_URL;
                    }, 2000);
                    
                } else {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        verificationError.textContent = 'Maximum attempts reached. Please request a new code.';
                        Array.from(codeInputs).forEach(input => input.disabled = true);
                    } else {
                        verificationError.textContent = `Invalid code. ${maxAttempts - attempts} attempts remaining.`;
                    }
                    verificationError.style.display = 'block';
                }
            } catch (error) {
                verificationError.textContent = 'Verification failed. Please try again.';
                verificationError.style.display = 'block';
            } finally {
                setLoadingState(verificationCodeForm, false);
            }
        });
    }
    
    // Handle resend code button
    const resendButton = document.querySelector('.resend-code');
    if (resendButton) {
        resendButton.addEventListener('click', async function() {
            if (this.classList.contains('disabled')) return;
            
            const verificationError = document.getElementById('verification-error');
            if (verificationError) {
                verificationError.style.display = 'none';
            }
            
            attempts = 0;
            const codeInputs = document.querySelectorAll('.verification-code-input input');
            Array.from(codeInputs).forEach(input => {
                input.value = '';
                input.disabled = false;
            });
            
            verificationCode = generateVerificationCode();
            console.log('New verification code:', verificationCode);
            
            clearInterval(resendTimer);
            startResendTimer();
            
            codeInputs[0].focus();
        });
    }
});