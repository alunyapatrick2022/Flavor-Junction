// Check if user is already logged in
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (token) {
    if (user) {
        window.location.href = '1home.html';
    } else {
        window.location.href = 'login.html';
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Update navigation based on auth status
function updateNavigation() {
    const loginLink = document.getElementById('loginLink');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token) {
        // User is logged in
        loginLink.style.display = 'inline-block';
        loginLink.textContent = `Logout`;
        loginLink.href = 'login.html';
    } else {
        // User is not logged in
        loginLink.style.display = 'inline-block';
        loginLink.textContent = 'Login';
        loginLink.href = 'login.html';
        loginLink.onclick = null;
    }
}

// Protect routes that require authentication
function protectRoute() {
    const publicRoutes = ['1home.html', 'login.html', 'register.html','3about.html','2menu.html','5booking.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'login.html';
    
    if (!publicRoutes.includes(currentPage) && !isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Initialize auth check on every page
document.addEventListener('DOMContentLoaded', () => {
    protectRoute();
    updateNavigation();
});

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) {
        strength += 1;
    } else {
        feedback.push('Password should be at least 8 characters long');
    }

    // Contains number
    if (/\d/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Add at least one number');
    }

    // Contains letter
    if (/[a-zA-Z]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Add at least one letter');
    }

    // Contains special character
    if (/[!@#$%^&*]/.test(password)) {
        strength += 1;
    } else {
        feedback.push('Add at least one special character (!@#$%^&*)');
    }

    return {
        score: strength,
        feedback: feedback
    };
}

// Show password strength indicator
const passwordInput = document.getElementById('password');
if (passwordInput) {
    // Create strength indicator element
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    passwordInput.parentNode.insertBefore(strengthIndicator, passwordInput.nextSibling);

    passwordInput.addEventListener('input', () => {
        const result = checkPasswordStrength(passwordInput.value);
        const strengthText = ['Weak', 'Fair', 'Good', 'Strong'];
        const strengthColor = ['#ff4444', '#ffbb33', '#00C851', '#007E33'];
        
        if (passwordInput.value.length > 0) {
            strengthIndicator.innerHTML = `
                <div>Strength: <span style="color: ${strengthColor[result.score - 1]}">${strengthText[result.score - 1]}</span></div>
                ${result.feedback.length > 0 ? `<ul>${result.feedback.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
            `;
        } else {
            strengthIndicator.innerHTML = '';
        }
    });
}