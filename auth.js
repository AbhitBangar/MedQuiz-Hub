// auth.js
// This script checks if the user is authenticated before the page loads.
(function() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // Calculate the relative path to index.html based on current URL
        let basePath = '';
        if (window.location.pathname.includes('/subjects/')) {
            basePath = '../../';
        } else if (window.location.pathname.includes('/level')) {
            basePath = '../';
        }
        
        window.location.replace(basePath + 'index.html');
    }
})();

// Global logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    
    let basePath = '';
    if (window.location.pathname.includes('/subjects/')) {
        basePath = '../../';
    } else if (window.location.pathname.includes('/level')) {
        basePath = '../';
    }
    
    window.location.replace(basePath + 'index.html');
}
