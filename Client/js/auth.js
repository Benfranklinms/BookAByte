/**
 * BookABite - Authentication
 *
 * This file handles user authentication functionality
 * including login, signup, and session management
 */

// Assuming 'api' and 'closeModal' are globally available or imported elsewhere.
// If not, you'll need to define or import them here.
// For example:
// import { api } from './api'; // If 'api' is in a separate module
// function closeModal(modalId) { ... } // If 'closeModal' is a custom function

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  if (window.api && api.auth.isAuthenticated()) {
    updateAuthUI(true)
  }

  // Handle login form submission
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.textContent
      submitBtn.textContent = "Logging in..."
      submitBtn.disabled = true

      // Clear previous status
      const statusEl = document.getElementById("login-status")
      statusEl.textContent = ""
      statusEl.className = "login-status"

      // Get form data
      const formData = new FormData(this)
      const loginData = {
        username: formData.get("username"),
        password: formData.get("password"),
        remember: formData.get("remember") === "on",
      }

      // Try to login via API
      if (window.api) {
        api.auth
          .login(loginData)
          .then((response) => {
            // Reset button state
            submitBtn.textContent = originalBtnText
            submitBtn.disabled = false

            if (response.success) {
              // Show success message
              statusEl.textContent = "Login successful! Redirecting..."
              statusEl.className = "login-status success"

              // Update UI
              updateAuthUI(true)

              // Redirect to home page
              setTimeout(() => {
                window.location.href = "index.html"
              }, 1000)
            } else {
              // Show error
              statusEl.textContent = response.message || "Invalid username or password"
              statusEl.className = "login-status error"
            }
          })
          .catch((error) => {
            console.error("Login error:", error)
            // Reset button state
            submitBtn.textContent = originalBtnText
            submitBtn.disabled = false
            // Show error
            statusEl.textContent = "Error connecting to server. Please try again later."
            statusEl.className = "login-status error"

            // For demo purposes, simulate successful login
            simulateSuccessfulLogin()
          })
      } else {
        // API not available, simulate successful login
        setTimeout(() => {
          // Reset button state
          submitBtn.textContent = originalBtnText
          submitBtn.disabled = false

          simulateSuccessfulLogin()
        }, 1000)
      }

      function simulateSuccessfulLogin() {
        // Store demo token
        localStorage.setItem("auth_token", "demo_token")

        // Show success message
        statusEl.textContent = "Login successful! Redirecting..."
        statusEl.className = "login-status success"

        // Update UI
        updateAuthUI(true)

        // Redirect to home page
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1000)
      }
    })
  }

  // Handle signup form submission
  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.textContent
      submitBtn.textContent = "Signing up..."
      submitBtn.disabled = true

      // Clear previous status
      const statusEl = document.getElementById("signup-status")
      if (statusEl) {
        statusEl.textContent = ""
        statusEl.className = "signup-status"
      }

      // Get form data
      const formData = new FormData(this)
      const signupData = {
        firstName: formData.get("first-name"),
        lastName: formData.get("last-name"),
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirm-password"),
        terms: formData.get("terms") === "on",
      }

      // Check if passwords match
      if (signupData.password !== signupData.confirmPassword) {
        // Reset button state
        submitBtn.textContent = originalBtnText
        submitBtn.disabled = false

        // Show error
        if (statusEl) {
          statusEl.textContent = "Passwords do not match!"
          statusEl.className = "signup-status error"
        } else {
          alert("Passwords do not match!")
        }
        return
      }

      // Try to register via API
      if (window.api) {
        api.auth
          .register(signupData)
          .then((response) => {
            // Reset button state
            submitBtn.textContent = originalBtnText
            submitBtn.disabled = false

            if (response.success) {
              // Show success message
              if (statusEl) {
                statusEl.textContent = "Account created successfully! Please log in."
                statusEl.className = "signup-status success"
              }

              // Close signup modal
              if (typeof closeModal === "function") {
                closeModal("signup-modal")
              } else {
                console.warn("closeModal function is not defined.")
              }

              // Reset form
              signupForm.reset()

              // Show success message
              alert("Account created successfully! Please log in.")
            } else {
              // Show error
              if (statusEl) {
                statusEl.textContent = response.message || "Failed to create account"
                statusEl.className = "signup-status error"
              } else {
                alert(`Error: ${response.message || "Failed to create account"}`)
              }
            }
          })
          .catch((error) => {
            console.error("Signup error:", error)
            // Reset button state
            submitBtn.textContent = originalBtnText
            submitBtn.disabled = false
            // Show error
            if (statusEl) {
              statusEl.textContent = "Error connecting to server. Please try again later."
              statusEl.className = "signup-status error"
            } else {
              alert("Error connecting to server. Please try again later.")
            }

            // For demo purposes, simulate successful signup
            simulateSuccessfulSignup()
          })
      } else {
        // API not available, simulate successful signup
        setTimeout(() => {
          // Reset button state
          submitBtn.textContent = originalBtnText
          submitBtn.disabled = false

          simulateSuccessfulSignup()
        }, 1000)
      }

      function simulateSuccessfulSignup() {
        // Close signup modal
        if (typeof closeModal === "function") {
          closeModal("signup-modal")
        } else {
          console.warn("closeModal function is not defined.")
        }

        // Reset form
        signupForm.reset()

        // Show success message
        alert("Account created successfully! Please log in.")
      }
    })
  }

  // Update UI based on authentication state
  function updateAuthUI(isAuthenticated) {
    const authButtons = document.querySelectorAll(".auth-buttons")

    authButtons.forEach((container) => {
      // Clear existing buttons
      container.innerHTML = ""

      if (isAuthenticated) {
        // Add logout button
        const logoutBtn = document.createElement("a")
        logoutBtn.href = "#"
        logoutBtn.className = "btn btn-outline"
        logoutBtn.textContent = "Logout"
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault()

          // Logout
          if (window.api) {
            api.auth.logout()
          } else {
            localStorage.removeItem("auth_token")
          }

          // Update UI
          updateAuthUI(false)

          // Redirect to home page if on a protected page
          const currentPage = window.location.pathname.split("/").pop()
          if (currentPage === "profile.html" || currentPage === "my-reservations.html") {
            window.location.href = "index.html"
          }
        })

        container.appendChild(logoutBtn)
      } else {
        // Add login button
        const loginBtn = document.createElement("a")
        loginBtn.href = "login.html"
        loginBtn.className = "btn btn-outline"
        loginBtn.textContent = "Login"

        container.appendChild(loginBtn)
      }
    })
  }
})

