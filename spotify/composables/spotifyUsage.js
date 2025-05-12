// composables/spotifyUsage.js
import axios from 'axios'
import { useRuntimeConfig } from '#app'

const BASE_URL = 'https://api.spotify.com/v1'
const TOKEN_URL = 'https://accounts.spotify.com/api/token'

function getStoredAccessToken() {
  // Check if we're in a browser environment
  if (process.client) {
    try {
      const token = localStorage.getItem('spotify_token')
      if (token) {
        logAuthEvent('token_retrieved', { preview: token.substring(0, 5) + '...' })
      } else {
        logAuthEvent('token_not_found')
      }
      return token
    } catch (error) {
      logAuthEvent('error_accessing_token', { error: error.message })
      return null
    }
  }
  return null
}

// Check if token is expired and refresh if needed
import { logAuthEvent } from './useAuthDebug'

async function checkAndRefreshToken() {
  // Skip token checks on server-side
  if (!process.client) {
    return null;
  }
  
  logAuthEvent('checking_token');
  
  const accessToken = localStorage.getItem('spotify_token');
  if (!accessToken) {
    logAuthEvent('no_access_token_found');
    console.warn('No access token found in localStorage');
    return null;
  }
    const expiresAt = localStorage.getItem('spotify_expires_at')
  
  // Check if expiresAt is valid
  const parsedExpiresAt = expiresAt ? parseInt(expiresAt) : 0;
  if (isNaN(parsedExpiresAt)) {
    console.warn('Invalid expires_at value:', expiresAt);
    logAuthEvent('invalid_expires_at', { value: expiresAt });
  }
  
  // If token expires in less than 5 minutes (or is expired), refresh it
  const nowTime = Date.now();
  const timeUntilExpiry = parsedExpiresAt - nowTime;
  
  if (!expiresAt || nowTime > (parsedExpiresAt - 300000)) {
    logAuthEvent('token_expired_or_expiring_soon', { 
      expiresAt: new Date(parsedExpiresAt).toISOString(),
      nowTime: new Date(nowTime).toISOString(),
      timeUntilExpirySecs: Math.floor(timeUntilExpiry / 1000)
    });
    const refreshToken = localStorage.getItem('spotify_refresh_token')
    if (refreshToken) {
      logAuthEvent('refresh_token_found');
      try {
        // Use our server endpoint to refresh the token (more secure)
        // This way we don't expose client secret in the frontend
        const response = await axios.post('/api/spotify/refresh', { 
          refresh_token: refreshToken 
        });
        
        if (!response.data || !response.data.access_token) {
          throw new Error('Invalid token response');
        }
          // Update stored tokens only on client-side
        const data = response.data;
        const newExpiresAt = Date.now() + (data.expires_in * 1000);
        
        if (process.client) {
          localStorage.setItem('spotify_token', data.access_token);
          localStorage.setItem('spotify_expires_at', newExpiresAt);
          
          // If a new refresh token is provided (optional), update it as well
          if (data.refresh_token) {
            localStorage.setItem('spotify_refresh_token', data.refresh_token);
          }
        }
        
        console.log('Token refreshed successfully!');
        return data.access_token;      } catch (error) {
        console.error('Failed to refresh token:', error);
          // As fallback, try again with a delay - the original error might be temporary
        try {
          console.log('Attempting token refresh retry after delay...');
          // Wait 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
            // Retry the server endpoint (not direct API call which needs CLIENT_SECRET)
          const response = await axios.post('/api/spotify/refresh', { 
            refresh_token: refreshToken 
          });
          
          if (!response.data || !response.data.access_token) {
            throw new Error('Invalid token response in fallback');
          }
          
          const data = response.data;
            // Update stored tokens
          const newExpiresAt = Date.now() + (data.expires_in * 1000);
          if (process.client) {
            localStorage.setItem('spotify_token', data.access_token);
            localStorage.setItem('spotify_expires_at', newExpiresAt);
            
            if (data.refresh_token) {
              localStorage.setItem('spotify_refresh_token', data.refresh_token);
            }
          }
          
          console.log('Token refreshed using fallback method');
          return data.access_token;        } catch (fallbackError) {
          console.error('Both token refresh methods failed:', fallbackError);
          
          // Don't redirect immediately - clear tokens and return null
          // This allows the calling component to handle the error gracefully
          if (process.client) {
            console.warn('Clearing invalid tokens');
            localStorage.removeItem('spotify_token');
            localStorage.removeItem('spotify_refresh_token');
            localStorage.removeItem('spotify_expires_at');
          }
          return null;
        }
      }
    } else {
      // No refresh token, but don't redirect automatically
      console.error('No refresh token available');
      return null;
    }
  }
  return getStoredAccessToken()
}

async function authHeader() {
  try {
    const token = await checkAndRefreshToken()
    
    // If no token is available, throw a specific error
    if (!token) {
      logAuthEvent('auth_header_no_token');
      console.warn('No valid token available for API request');
      const error = new Error('No valid authentication token available');
      error.statusCode = 401; // Unauthorized
      throw error;
    }
    
    // Log successful token acquisition (only first 5 chars for security)
    logAuthEvent('auth_header_success', { tokenPreview: token.substring(0, 5) + '...' });
    
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  } catch (error) {
    logAuthEvent('auth_header_error', { message: error.message });
    throw error;
  }
}

// 🎵 User Profile
export async function fetchUserProfile() {
  try {
    // Get headers or throw if no valid token
    const headers = await authHeader()
    
    const { data } = await axios.get(`${BASE_URL}/me`, headers)
    
    // Store the user ID which is needed for some operations
    if (process.client && data && data.id) {
      localStorage.setItem('spotify_user_id', data.id)
    }
    
    return data
  } catch (error) {
    console.error('Error in fetchUserProfile:', error.message || error)
    
    // Check for specific errors
    if (error.response) {
      // Set status code for better error handling
      error.statusCode = error.response.status
      
      if (error.response.status === 401 || error.response.status === 403) {
        // For auth errors, clear tokens - don't redirect here to avoid multiple redirects
        if (process.client) {
          console.warn('Authentication error in fetchUserProfile, clearing tokens')
          localStorage.removeItem('spotify_token')
          localStorage.removeItem('spotify_refresh_token')
          localStorage.removeItem('spotify_expires_at')
        }
      }
    }
    throw error
  }
}
// is the user premium?
export async function isUserPremium() {
  try {
    const { data } = await axios.get(`${BASE_URL}/me`, await authHeader())
    return data.product === 'premium'
  } catch (error) {
    console.error('Error in isUserPremium:', error.message)
    // Propagate the error with status code for better handling
    if (error.response && error.response.status) {
      error.statusCode = error.response.status
    }
    throw error
  }
}

// 🎧 Home Recommendations (simplified, using top tracks)
export async function fetchRecommendedTracks() {
  try {
    const { data } = await axios.get(`${BASE_URL}/me/top/tracks?limit=10`, await authHeader())
    return data.items
  } catch (error) {
    console.error('Error in fetchRecommendedTracks:', error.message)
    // Propagate the error with status code for better handling
    if (error.response && error.response.status) {
      error.statusCode = error.response.status
    }
    throw error
  }
}

export async function fetchTopArtists() {
  const { data } = await axios.get(`${BASE_URL}/me/top/artists?limit=10`, await authHeader())
  return data.items
}


// 📂 User Playlists
export async function fetchUserPlaylists() {
  try {
    const { data } = await axios.get(`${BASE_URL}/me/playlists?limit=10`, await authHeader())
    return data.items
  } catch (error) {
    console.error('Error in fetchUserPlaylists:', error.message)
    // Propagate the error with status code for better handling
    if (error.response && error.response.status) {
      error.statusCode = error.response.status
    }
    throw error
  }
}

// ➕ Create Playlist
export async function createPlaylist(userId, name, description = '') {
  const { data } = await axios.post(
    `${BASE_URL}/users/${userId}/playlists`,
    { name, description, public: false },
    await authHeader()
  )
  return data
}

// ✏️ Add Track to Playlist
export async function addTrackToPlaylist(playlistId, trackUri) {
  await axios.post(
    `${BASE_URL}/playlists/${playlistId}/tracks`,
    { uris: [trackUri] },
    await authHeader()
  )
}

// ❌ Remove Track from Playlist
export async function removeTrackFromPlaylist(playlistId, trackUri) {
  await axios.request({
    method: 'DELETE',
    url: `${BASE_URL}/playlists/${playlistId}/tracks`,
    data: { tracks: [{ uri: trackUri }] },
    ...(await authHeader())
  })
}

// get track info
export async function fetchTrackInfo(trackId) {
  const { data } = await axios.get(`${BASE_URL}/tracks/${trackId}`, await authHeader())
  return data
}

// get playlist info
export async function fetchPlaylistInfo(playlistId) {
  const { data } = await axios.get(`${BASE_URL}/playlists/${playlistId}`, await authHeader())
  return data
}


// get playlist tracks
export async function fetchPlaylistTracks(playlistId) {
  const { data } = await axios.get(`${BASE_URL}/playlists/${playlistId}/tracks`, await authHeader())
  return data.items.map(item => ({
    ...item.track,
    added_at: item.added_at  // Keep the added_at property
  }))
}
// get album info
export async function fetchAlbumInfo(albumId) {
  try {
    const headers = await authHeader();
    const { data } = await axios.get(`${BASE_URL}/albums/${albumId}`, headers);
    return data;
  } catch (error) {
    console.error(`Error fetching album info for ID ${albumId}:`, error);
    // Rethrow to let the caller handle it
    throw error;
  }
}

// get album tracks
export async function fetchAlbumTracks(albumId) {
  try {
    const headers = await authHeader();
    const { data } = await axios.get(`${BASE_URL}/albums/${albumId}/tracks`, headers);
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching tracks for album ID ${albumId}:`, error);
    // Rethrow to let the caller handle it
    throw error;
  }
}

export async function pausePlayback() {
  await axios.put(`${BASE_URL}/me/player/pause`, null, await authHeader())
}

export async function skipToNext() {
  await axios.post(`${BASE_URL}/me/player/next`, null, await authHeader())
}

export async function skipToPrevious() {
  await axios.post(`${BASE_URL}/me/player/previous`, null, await authHeader())
}

export async function fetchCurrentlyPlaying() {
  const { data } = await axios.get(`${BASE_URL}/me/player/currently-playing`, await authHeader())
  return data
}

// // 💿 User's Saved Albums
// export async function fetchUserAlbums() {
//   const { data } = await axios.get(`${BASE_URL}/me/albums?limit=10`, await authHeader())
//   return data.items.map(item => item.album)
// }

// 🔍 Search
export async function searchSpotify(query, type = 'track,artist,album,playlist') {
  // Get user's market from profile for better relevance
  let market = 'US'; // Default market
  try {
    const profileData = await fetchUserProfile();
    if (profileData && profileData.country) {
      market = profileData.country;
    }
  } catch (error) {
    console.warn('Could not get user market, using default', error);
  }

  // Make search request with additional parameters for relevance
  const { data } = await axios.get(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=${type}&limit=20&market=${market}&include_external=audio`,
    await authHeader()
  )

  // Post-process results to filter out low relevance items
  if (data.tracks && data.tracks.items) {
    // Filter tracks by relevance and popularity
    const minPopularity = 20; // Minimum popularity threshold
    data.tracks.items = data.tracks.items
      .filter(track => track.popularity >= minPopularity)
      .filter(track => {
        const queryLower = query.toLowerCase();
        const trackNameLower = track.name.toLowerCase();
        const artistNameLower = track.artists[0]?.name.toLowerCase() || '';
        
        // Keep tracks that have a strong match with the query
        return trackNameLower.includes(queryLower) || 
               artistNameLower.includes(queryLower) ||
               queryLower.includes(trackNameLower) ||
               queryLower.includes(artistNameLower);
      })
      .slice(0, 10); // Limit to 10 most relevant results
  }

  if (data.artists && data.artists.items) {
    // Filter artists by relevance and popularity
    data.artists.items = data.artists.items
      .filter(artist => artist.popularity >= 30) // Artists need higher popularity
      .filter(artist => {
        const queryLower = query.toLowerCase();
        const artistNameLower = artist.name.toLowerCase();
        
        // Keep artists with strong name match
        return artistNameLower.includes(queryLower) || 
               queryLower.includes(artistNameLower);
      })
      .slice(0, 10);
  }

  if (data.albums && data.albums.items) {
    // Filter albums by relevance
    data.albums.items = data.albums.items
      .filter(album => {
        const queryLower = query.toLowerCase();
        const albumNameLower = album.name.toLowerCase();
        const artistNameLower = album.artists[0]?.name.toLowerCase() || '';
        
        return albumNameLower.includes(queryLower) || 
               artistNameLower.includes(queryLower) ||
               queryLower.includes(albumNameLower) ||
               queryLower.includes(artistNameLower);
      })
      .slice(0, 10);
  }
  return data;
}

// Export the getStoredAccessToken function
export { getStoredAccessToken }