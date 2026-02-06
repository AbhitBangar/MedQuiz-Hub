// Login Page JavaScript - Ashvin College

// Valid credentials
const studentCredentials = [
    {
        username: "student",
        password: "student123"
    },
    {
        username: "Abhit Bangar",
        password: "Raddha@303"
    },
    {
        username: "Swaraj Shelavale",
        password: "SS@1973"
    }
];

const adminCredentials = {
    username: "Vikram Shelavale",
    password: "Dhruvi@1506"
};

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const loginContainers = document.querySelectorAll('.login-container');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and containers
            tabButtons.forEach(btn => btn.classList.remove('active'));
            loginContainers.forEach(container => container.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding container
            this.classList.add('active');
            document.getElementById(targetTab + '-login').classList.add('active');
        });
    });
});

// Student login validation
function validateStudentLogin() {
    const username = document.getElementById("student-username").value;
    const password = document.getElementById("student-password").value;
    const errorMessage = document.getElementById("student-error-message");

    // Clear previous error
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';

    // Validation
    if (!username || !password) {
        errorMessage.textContent = "Please enter both username and password";
        errorMessage.classList.add('show');
        return false;
    }

    // Check if credentials match any student or admin credentials
    const isValidStudent = studentCredentials.some(cred => cred.username === username && cred.password === password);
    const isAdmin = username === adminCredentials.username && password === adminCredentials.password;

    if (isValidStudent || isAdmin) {
        // Store user info
        localStorage.setItem('currentUser', username);
        localStorage.setItem('userRole', isAdmin ? 'admin' : 'student');
        
        // Show success message briefly before redirect
        errorMessage.textContent = "Login successful! Redirecting...";
        errorMessage.style.color = '#28a745';
        errorMessage.style.borderColor = '#28a745';
        errorMessage.style.background = 'rgba(40, 167, 69, 0.1)';
        errorMessage.classList.add('show');
        
        // Redirect to student dashboard after 1 second
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1000);
        
        return false;
    } else {
        errorMessage.textContent = "Invalid student credentials";
        errorMessage.classList.add('show');
        return false;
    }
}

// Admin login validation
function validateAdminLogin() {
    const username = document.getElementById("admin-username").value;
    const password = document.getElementById("admin-password").value;
    const errorMessage = document.getElementById("admin-error-message");

    // Clear previous error
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';

    // Validation
    if (!username || !password) {
        errorMessage.textContent = "Please enter both username and password";
        errorMessage.classList.add('show');
        return false;
    }

    // Check credentials (you can modify this for actual authentication)
    if (username === adminCredentials.username && password === adminCredentials.password) {
        // Store user info
        localStorage.setItem('currentUser', username);
        localStorage.setItem('userRole', 'admin');
        
        // Show success message briefly before redirect
        errorMessage.textContent = "Login successful! Redirecting...";
        errorMessage.style.color = '#28a745';
        errorMessage.style.borderColor = '#28a745';
        errorMessage.style.background = 'rgba(40, 167, 69, 0.1)';
        errorMessage.classList.add('show');
        
        // Redirect to admin dashboard or home page after 1 second
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1000);
        
        return false;
    } else {
        errorMessage.textContent = "Invalid admin credentials";
        errorMessage.classList.add('show');
        return false;
    }
}

// Add input focus effects
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});

// Add form submission loading states
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Logging in...';
            submitButton.disabled = true;
            
            // Reset after a delay (in case validation fails)
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    });
});
