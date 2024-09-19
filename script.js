// A sample username and password for validation
const validUsername = "Vikram Shelavale";
const validPassword = "Dhruvi@1506";

function validateLogin() {
    // Get username and password input values
    const username = document.getElementById("Vikram Shelavale").value;
    const password = document.getElementById("Dhruvi@1506").value;
    const errorMessage = document.getElementById("error-message");

    // Check if username and password match the valid credentials
    if (username === validUsername && password === validPassword) {
        // Redirect to a homepage or another page on successful login
        window.location.href = "home.html";
        return false; // Prevent form from submitting
    } else {
        // Show error message if credentials are incorrect
        errorMessage.textContent = "Invalid username or password";
        return false; // Prevent form from submitting
    }
}