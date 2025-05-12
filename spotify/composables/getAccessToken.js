import axios from 'axios'
import { logAuthEvent } from './useAuthDebug'
import { useRuntimeConfig } from '#app'

const TOKEN_URL = '/api/spotify/token'

export async function getAccessToken(code) {
  const config = useRuntimeConfig()
  const REDIRECT_URI = config.public.spotifyRedirectUri
    logAuthEvent('getAccessToken_started', { code: code.substring(0, 10) + '...' })
  console.log('TOKEN →', { code, REDIRECT_URI })
  try {
    const { data } = await axios.post(
      TOKEN_URL,
      { code }
    )// Only access localStorage on the client side
    if (process.client) {
      try {
        // First, clear all localStorage to ensure clean state
        localStorage.clear();
        
        // Add a slight delay to ensure clearing is complete
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Generate fresh expiration timestamp
        const expiresAt = Date.now() + data.expires_in * 1000
        
        // Set new tokens
        localStorage.setItem('spotify_token', data.access_token);
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
        localStorage.setItem('spotify_expires_at', expiresAt.toString());
        
        // Verify the tokens were properly stored
        const storedToken = localStorage.getItem('spotify_token');
        const storedRefresh = localStorage.getItem('spotify_refresh_token');
        const storedExpires = localStorage.getItem('spotify_expires_at');
        
        if (!storedToken || !storedRefresh || !storedExpires) {
          console.error('Token storage verification failed!');
          logAuthEvent('token_storage_failed', {
            hasToken: !!storedToken,
            hasRefresh: !!storedRefresh,
            hasExpires: !!storedExpires
          });
          throw new Error('Failed to store authentication tokens');
        }
        
        // Store token hash for debugging (first few chars only)
        const tokenPreview = data.access_token.substring(0, 10) + '...';
        logAuthEvent('tokens_stored', { 
          tokenPreview, 
          expiresAt: new Date(expiresAt).toISOString(),
          hasRefreshToken: !!data.refresh_token
        });
      } catch (error) {
        console.error('Error storing tokens:', error);
        logAuthEvent('token_storage_error', { message: error.message });
        throw error;  // Re-throw to be handled by caller
      }
    }
    return data
  } catch (error) {
    if (error.response) {
      console.error('💥 Spotify replied:', error.response.status, error.response.data)
    } else {
      console.error('Network or CORS error:', error)
    }
    throw error
  }
}

export default getAccessToken
