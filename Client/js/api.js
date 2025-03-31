/**
 * BookABite - Enhanced API Service
 * Production-ready API handler with proper auth, error handling, and retries
 */

const API_BASE_URL = window.API_BASE_URL || "http://localhost:3000/api";
const MAX_RETRIES = 2;
const TOKEN_REFRESH_BUFFER = 300; // 5 minutes in seconds

// Token management
const AuthToken = {
  get: () => {
    const token = localStorage.getItem('auth_token');
    const expiresAt = localStorage.getItem('auth_expires_at');
    
    if (!token || !expiresAt) return null;
    if (Date.now() > parseInt(expiresAt)) {
      AuthToken.clear();
      return null;
    }
    
    return token;
  },
  set: (token, expiresIn) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_expires_at', Date.now() + (expiresIn * 1000));
  },
  clear: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_expires_at');
    localStorage.removeItem('refresh_token');
  },
  refresh: {
    get: () => localStorage.getItem('refresh_token'),
    set: (token) => localStorage.setItem('refresh_token', token)
  }
};

// Enhanced fetch with retry logic
const apiFetch = async (endpoint, options = {}, retries = MAX_RETRIES) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(AuthToken.get() && { 'Authorization': `Bearer ${AuthToken.get()}` })
  };

  const config = {
    method: 'GET',
    credentials: 'same-origin',
    headers: { ...headers, ...options.headers },
    ...options
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized (token refresh)
    if (response.status === 401 && retries > 0) {
      const refreshToken = AuthToken.refresh.get();
      if (refreshToken) {
        const refreshResponse = await api.auth.refreshToken({ refreshToken });
        if (refreshResponse.success) {
          return apiFetch(endpoint, options, retries - 1);
        }
      }
      
      // If refresh fails, clear tokens and redirect to login
      AuthToken.clear();
      window.dispatchEvent(new CustomEvent('auth-change'));
      throw { status: 401, message: 'Session expired. Please login again.' };
    }

    const data = await response.json();

    if (!response.ok) {
      throw { 
        status: response.status, 
        message: data.message || `HTTP error ${response.status}`,
        data 
      };
    }

    return data;
  } catch (error) {
    if (retries > 0 && !error.status) {
      return apiFetch(endpoint, options, retries - 1);
    }
    throw error;
  }
};

// API Service
const api = {
  auth: {
    login: async (credentials) => {
      try {
        const data = await apiFetch('/auth/login', {
          method: 'POST',
          body: credentials
        });
        
        AuthToken.set(data.token, data.expiresIn);
        AuthToken.refresh.set(data.refreshToken);
        
        window.dispatchEvent(new CustomEvent('auth-change'));
        return { success: true, data };
      } catch (error) {
        return { success: false, error };
      }
    },
    register: async (userData) => {
      try {
        const data = await apiFetch('/auth/register', {
          method: 'POST',
          body: userData
        });
        return { success: true, data };
      } catch (error) {
        return { success: false, error };
      }
    },
    refreshToken: async (payload) => {
      try {
        const data = await apiFetch('/auth/refresh', {
          method: 'POST',
          body: payload
        });
        AuthToken.set(data.token, data.expiresIn);
        return { success: true, data };
      } catch (error) {
        AuthToken.clear();
        return { success: false, error };
      }
    },
    logout: async () => {
      try {
        await apiFetch('/auth/logout', { method: 'POST' });
        AuthToken.clear();
        window.dispatchEvent(new CustomEvent('auth-change'));
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    isAuthenticated: () => !!AuthToken.get()
  },
  restaurants: {
    getAll: async () => {
      try {
        const data = await apiFetch('/restaurants');
        return { success: true, data };
      } catch (error) {
        return { success: false, error };
      }
    }
  },
  reservations: {
    create: async (reservationData) => {
      try {
        const data = await apiFetch('/reservations', {
          method: 'POST',
          body: reservationData
        });
        return { success: true, data };
      } catch (error) {
        return { success: false, error };
      }
    },
    getUserReservations: async () => {
      try {
        const data = await apiFetch('/reservations');
        return { success: true, data };
      } catch (error) {
        return { success: false, error };
      }
    }
  }
};

// Initialize API on window
window.api = api;

// Auth state change handler
window.addEventListener('auth-change', () => {
  const authButtons = document.querySelectorAll('.auth-buttons');
  authButtons.forEach(container => {
    container.innerHTML = api.auth.isAuthenticated() ? 
      `<button class="btn btn-outline" id="logout-btn">Logout</button>` :
      `<a href="login.html" class="btn btn-outline">Login</a>`;
  });

  document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await api.auth.logout();
    window.location.href = 'index.html';
  });
});


// Initialize auth state on load
document.addEventListener('DOMContentLoaded', () => {
  window.dispatchEvent(new CustomEvent('auth-change'));
});