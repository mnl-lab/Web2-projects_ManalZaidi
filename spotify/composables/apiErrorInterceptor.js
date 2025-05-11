// composables/apiErrorInterceptor.js
import axios from 'axios';
import { logAuthEvent } from './useAuthDebug';

// Add a global Axios interceptor to handle 401/403 errors consistently
export function setupAxiosInterceptors() {
  // Skip in server context
  if (!process.client) return;

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      // Do nothing with successful responses
      return response;
    },
    (error) => {
      // Only handle client-side errors
      if (!process.client) return Promise.reject(error);

      // Check for authentication errors (401/403)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logAuthEvent('axios_auth_error', {
          status: error.response.status,
          url: error.config.url
        });

        // Check if this is an API call (not a token refresh)
        if (!error.config.url.includes('/token')) {
          // Clear tokens
          localStorage.removeItem('spotify_token');
          localStorage.removeItem('spotify_refresh_token');
          localStorage.removeItem('spotify_expires_at');

          // Log the error but don't redirect automatically
          // Let the calling component decide whether to redirect
          logAuthEvent('tokens_cleared_due_to_auth_error');
          console.warn('Authentication error intercepted, tokens cleared');
        }
      }

      // Always reject the promise so the calling code can handle it
      return Promise.reject(error);
    }
  );
}

export default setupAxiosInterceptors;
