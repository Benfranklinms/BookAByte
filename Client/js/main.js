/**
 * BookABite - Main JavaScript
 *
 * This file contains core functionality for the BookABite website
 * including theme toggling, modal handling, and general UI interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Loading animation - reduced time for better user experience
  setTimeout(() => {
    const loader = document.querySelector(".loader-container")
    if (loader) {
      loader.classList.add("fade-out")
      setTimeout(() => {
        loader.style.display = "none"
      }, 300)
    }
  }, 500) // Reduced from 800ms to 500ms for faster loading

  // Theme toggle functionality
  const themeToggleBtn = document.getElementById("theme-toggle-btn")

  // Check if user has a theme preference stored
  const currentTheme = localStorage.getItem("theme")
  if (currentTheme) {
    document.body.classList.add(currentTheme)
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // If user has dark mode preference in browser
    document.body.classList.add("dark")
    localStorage.setItem("theme", "dark")
  }

  // Toggle theme when button is clicked
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark")
        localStorage.setItem("theme", "light")
      } else {
        document.body.classList.add("dark")
        localStorage.setItem("theme", "dark")
      }
    })
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileMenu = document.getElementById("mobile-menu")

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("show")
      this.classList.toggle("active")
    })
  }

  // Password visibility toggle
  const togglePasswordBtns = document.querySelectorAll(".toggle-password")

  togglePasswordBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const passwordInput = this.previousElementSibling
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
      passwordInput.setAttribute("type", type)

      // Toggle eye icon
      const icon = this.querySelector("i")
      icon.classList.toggle("fa-eye")
      icon.classList.toggle("fa-eye-slash")
    })
  })

  // Modal functionality - Fixed close/done buttons
  const modals = document.querySelectorAll(".modal")
  const closeModalBtns = document.querySelectorAll(".close-modal")
  const doneModalBtns = document.querySelectorAll("#close-modal-btn")

  // Show modal function
  window.showModal = (modalId) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.add("show")
      document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
    }
  }

  // Close modal function
  window.closeModal = (modalId) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.remove("show")
      document.body.style.overflow = ""
    }
  }

  // Close modal when clicking close button
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal")
      modal.classList.remove("show")
      document.body.style.overflow = ""
    })
  })

  // Close modal when clicking done button - Fixed functionality
  doneModalBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal")
      modal.classList.remove("show")
      document.body.style.overflow = ""
    })
  })

  // Close modal when clicking outside
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("show")
        document.body.style.overflow = ""
      }
    })
  })

  // Show signup modal when "Sign Up" is clicked
  const showSignupBtn = document.getElementById("show-signup")
  if (showSignupBtn) {
    showSignupBtn.addEventListener("click", (e) => {
      e.preventDefault()
      showModal("signup-modal")
    })
  }

  // Update auth UI based on authentication state
  window.updateAuthUI = (isAuthenticated) => {
    const authButtons = document.querySelectorAll(".auth-buttons")
    const accountBtn = document.getElementById("account-btn")

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
            localStorage.removeItem("user_data")
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

        // Show account button
        if (accountBtn) {
          accountBtn.style.display = "flex"
        }
      } else {
        // Add login button
        const loginBtn = document.createElement("a")
        loginBtn.href = "login.html"
        loginBtn.className = "btn btn-outline"
        loginBtn.textContent = "Login"

        container.appendChild(loginBtn)

        // Hide account button
        if (accountBtn) {
          accountBtn.style.display = "none"
        }
      }
    })
  }

  // Check if user is already logged in
  if (window.api && api.auth.isAuthenticated()) {
    updateAuthUI(true)
  } else if (localStorage.getItem("auth_token")) {
    updateAuthUI(true)
  } else {
    updateAuthUI(false)
  }
})

