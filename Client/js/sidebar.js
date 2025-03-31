document.addEventListener("DOMContentLoaded", () => {
  const accountBtn = document.getElementById("account-btn");
  const sidebar = document.getElementById("account-sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const closeSidebarBtn = document.getElementById("close-sidebar");
  const sidebarLogoutBtn = document.getElementById("sidebar-logout");

  const sidebarLoggedIn = document.getElementById("sidebar-logged-in");
  const sidebarLoggedOut = document.getElementById("sidebar-logged-out");
  const userReservationsContainer = document.getElementById("user-reservations");

  const sidebarUsername = document.getElementById("sidebar-username");
  const sidebarEmail = document.getElementById("sidebar-email");

  const API_BASE_URL = "http://localhost:3000/api";

  function toggleSidebar() {
    sidebar.classList.toggle("open");
    sidebarOverlay.classList.toggle("show");
    document.body.style.overflow = sidebar.classList.contains("open") ? "hidden" : "";

    if (sidebar.classList.contains("open")) {
      updateSidebarContent();
    }
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  function isAuthenticated() {
    return localStorage.getItem("auth_token") !== null;
  }

  async function updateSidebarContent() {
    const isAuth = isAuthenticated();

    if (isAuth) {
      sidebarLoggedIn.style.display = "block";
      sidebarLoggedOut.style.display = "none";

      const token = localStorage.getItem("auth_token");

      try {
        const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userResponse.ok) throw new Error("Failed to fetch user data");

        const userData = await userResponse.json();
        sidebarUsername.textContent = userData.username || "User";
        sidebarEmail.textContent = userData.email || "user@example.com";

        await fetchUserReservations(token);
      } catch (error) {
        console.error("Error fetching user data:", error);
        sidebarUsername.textContent = "Error";
        sidebarEmail.textContent = "Error fetching data";
      }
    } else {
      sidebarLoggedIn.style.display = "none";
      sidebarLoggedOut.style.display = "block";
    }
  }

  async function fetchUserReservations(token) {
    userReservationsContainer.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
    `;

    try {
      const response = await fetch(`${API_BASE_URL}/reservations/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch reservations");

      const reservations = await response.json();

      if (reservations.length > 0) {
        renderReservations(reservations);
      } else {
        showNoReservations();
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      userReservationsContainer.innerHTML = `
        <div class="no-reservations">
          <i class="fas fa-exclamation-circle"></i>
          <p>Failed to load reservations. Please try again later.</p>
        </div>
      `;
    }
  }

  function renderReservations(reservations) {
    const reservationsHTML = reservations
      .map((reservation) => {
        const date = new Date(reservation.date);
        const formattedDate = date.toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return `
          <div class="reservation-card">
            <h4>${reservation.restaurantId.name || "Restaurant"}</h4>
            <div class="reservation-details">
              <p><i class="fas fa-calendar"></i> ${formattedDate}</p>
              <p><i class="fas fa-clock"></i> ${reservation.time}</p>
              <p><i class="fas fa-user-friends"></i> ${reservation.guests} ${reservation.guests > 1 ? "people" : "person"}</p>
              <span class="reservation-status status-${reservation.status}">
                ${reservation.status || "Confirmed"}
              </span>
            </div>
          </div>
        `;
      })
      .join("");

    userReservationsContainer.innerHTML = reservationsHTML;
  }

  function showNoReservations() {
    userReservationsContainer.innerHTML = `
      <div class="no-reservations">
        <i class="fas fa-calendar-times"></i>
        <p>You don't have any reservations yet.</p>
        <a href="reservation.html" class="btn btn-primary btn-sm mt-3">Make a Reservation</a>
      </div>
    `;
  }

  async function handleSidebarLogout() {
    try {
      const token = localStorage.getItem("auth_token");

      if (token) {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to log out");
      }

      // Clear local storage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");

      // Update UI
      updateSidebarContent();
      closeSidebar();

      // Redirect to home page
      window.location.href = "index.html";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    }
  }

  if (accountBtn) accountBtn.addEventListener("click", toggleSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);
  if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener("click", handleSidebarLogout);

  updateSidebarContent();
});