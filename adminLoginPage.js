// Hardcoded admin credentials
const adminCredentials = {
    email: "admin@gmail.com",   // admin email
    password: "admin123"        //admin password
};

// Get elements from the HTML
const adminEmail = document.getElementById('adminEmail');
const adminPassword = document.getElementById('adminPassword');
const submitAdminLogin = document.getElementById('submitAdminLogin');
const adminLoginMessage = document.getElementById('adminLoginMessage');

// Admin Login Event
submitAdminLogin.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission

    // Get the entered email and password
    const email = adminEmail.value.trim();
    const password = adminPassword.value.trim();

    // Validate the credentials
    if (email === adminCredentials.email && password === adminCredentials.password) {
        // Redirect to admin dashboard
        window.location.href = 'adminPage.html';
    } else {
        // Show error message
        adminLoginMessage.style.display = 'block';
        adminLoginMessage.textContent = 'Invalid admin email or password.';
    }
});
