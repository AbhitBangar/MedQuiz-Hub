// Authentication System - Ashvin College Quiz Website

// Check if user is authenticated
function isAuthenticated() {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    return currentUser && userRole;
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        // Store current page URL to redirect back after login
        localStorage.setItem('redirectAfterLogin', window.location.href);
        
        // Show brief unauthorized message
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
            ">
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 2rem;
                    border-radius: 1rem;
                    backdrop-filter: blur(10px);
                ">
                    <h2 style="margin: 0 0 1rem 0;">🔒 Authentication Required</h2>
                    <p style="margin: 0 0 1.5rem 0;">Please login to access this page.</p>
                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">Redirecting to login...</p>
                </div>
            </div>
        `;
        
        // Use helper function to get correct path
        setTimeout(() => {
            window.location.href = getIndexPath();
        }, 1500);
        return false;
    }
    return true;
}

// Logout function
function logout() {
    // Clear authentication data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('redirectAfterLogin');
    
    // Use helper function to get correct path
    window.location.href = getIndexPath();
}

// Get current user info
function getCurrentUser() {
    return {
        username: localStorage.getItem('currentUser'),
        role: localStorage.getItem('userRole')
    };
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Require authentication for all pages except login
    if (!window.location.pathname.includes('index.html')) {
        requireAuth();
    }
    
    // Handle redirect after login
    const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
    if (redirectAfterLogin && window.location.pathname.includes('index.html')) {
        // This shouldn't happen, but just in case
        localStorage.removeItem('redirectAfterLogin');
    }
});

// Helper function to get correct path to index.html
function getIndexPath() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/subjects/')) {
        return '../../index.html';
    } else if (currentPath.includes('/level')) {
        return '../index.html';
    } else {
        return 'index.html';
    }
}
