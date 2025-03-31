document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loaderContainer = document.querySelector('.loader-container');
    const loginModal = document.getElementById('admin-login-modal');
    const dashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('admin-login-form');
    const logoutBtn = document.getElementById('admin-logout');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('admin-password');
    const menuItems = document.querySelectorAll('.admin-menu li');
    const tabs = document.querySelectorAll('.admin-tab');

    // Show login modal after loader
    setTimeout(() => {
        loaderContainer.style.display = 'none';
        loginModal.style.display = 'block';
    }, 1500);

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            
            // Simple validation
            if (username === 'admin' && password === 'admin123') {
                loginModal.style.display = 'none';
                dashboard.style.display = 'flex';
            } else {
                document.getElementById('admin-login-error').textContent = 'Invalid credentials';
            }
        });
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            dashboard.style.display = 'none';
            loginModal.style.display = 'block';
            loginForm.reset();
        });
    }

    // Tab switching
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all tabs
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Show corresponding tab
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
});