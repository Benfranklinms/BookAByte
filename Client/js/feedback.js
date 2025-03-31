/**
 * BookABite - Feedback Page
 * Complete functional implementation with all fixes
 */

document.addEventListener("DOMContentLoaded", async () => {
  // DOM elements
  const feedbackForm = document.getElementById("feedback-form");
  const restaurantSelect = document.getElementById("restaurant");
  const submitBtn = document.getElementById("submit-btn");
  const submitText = document.getElementById("submit-text");
  const submitSpinner = document.getElementById("submit-spinner");

  // Modal elements
  const successModal = document.getElementById("success-modal");
  const errorModal = document.getElementById("error-modal");
  const errorMessage = document.getElementById("error-message");

  // Modal functions
  const showModal = (modal) => {
    if (modal) {
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = (modal) => {
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

  // Set up modal close events
  document.getElementById("close-modal-btn")?.addEventListener("click", () => closeModal(successModal));
  document.getElementById("close-error-btn")?.addEventListener("click", () => closeModal(errorModal));
  
  document.querySelectorAll(".close-modal").forEach(icon => {
    icon.addEventListener("click", () => {
      const modal = icon.closest(".modal");
      closeModal(modal);
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === successModal) closeModal(successModal);
    if (e.target === errorModal) closeModal(errorModal);
  });

  const showError = (message) => {
    errorMessage.textContent = message;
    showModal(errorModal);
  };

  // Fetch restaurants
  async function fetchRestaurants() {
    try {
      const response = await api.restaurants.getAll();
      
      if (response.success) {
        restaurantSelect.innerHTML = '<option value="" selected>Select a restaurant</option>';
        
        response.data.forEach(restaurant => {
          const option = document.createElement("option");
          option.value = restaurant._id;
          option.textContent = restaurant.name;
          restaurantSelect.appendChild(option);
        });
      } else {
        throw new Error(response.error?.message || "Failed to load restaurants");
      }
    } catch (error) {
      console.error("Restaurant fetch error:", error);
      showError("Couldn't load restaurants. You can still submit general feedback.");
    }
  }

  // Form submission
  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Show loading state
    submitText.style.display = "none";
    submitSpinner.style.display = "inline";
    submitBtn.disabled = true;

    try {
      const formData = {
        restaurantId: restaurantSelect.value || null,
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        rating: document.querySelector('input[name="rating"]:checked').value,
        message: document.getElementById("message").value.trim(),
        recommend: document.querySelector('input[name="recommend"]:checked').value === "yes"
      };

      // Validation
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error("Please fill in all required fields");
      }

      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Submit feedback
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${api.auth.getToken() || ''}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.errors?.[0]?.msg || 
          result.message || 
          "Failed to submit feedback"
        );
      }

      // Success
      showModal(successModal);
      feedbackForm.reset();
    } catch (error) {
      console.error("Feedback error:", error);
      showError(error.message || "An error occurred. Please try again.");
    } finally {
      submitText.style.display = "inline";
      submitSpinner.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  // Initialize
  await fetchRestaurants();
});