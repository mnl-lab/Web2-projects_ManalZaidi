// composables/useSpotify.js
import axios from 'axios'

const BASE_URL = 'https://api.spotify.com/v1'
const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const CLIENT_ID = '49b1640e09494130aff858433399a770'

function getAccessToken() {
  return localStorage.getItem('spotify_token')
}

// Check if token is expired and refresh if needed
async function checkAndRefreshToken() {
  const expiresAt = localStorage.getItem('spotify_expires_at')
  // If token expires in less than 5 minutes (or is expired), refresh it
  if (!expiresAt || Date.now() > (parseInt(expiresAt) - 300000)) {
    const refreshToken = localStorage.getItem('spotify_refresh_token')
    if (refreshToken) {
      try {
        // Use our server endpoint to refresh the token (more secure)
        // This way we don't expose client secret in the frontend
        const response = await axios.post('/api/spotify/refresh', { 
          refresh_token: refreshToken 
        });
        
        if (!response.data || !response.data.access_token) {
          throw new Error('Invalid token response');
        }
        
        // Update stored tokens
        const data = response.data;
        const newExpiresAt = Date.now() + (data.expires_in * 1000);
        localStorage.setItem('spotify_token', data.access_token);
        localStorage.setItem('spotify_expires_at', newExpiresAt);
        
        // If a new refresh token is provided (optional), update it as well
        if (data.refresh_token) {
          localStorage.setItem('spotify_refresh_token', data.refresh_token);
        }
        
        console.log('Token refreshed successfully!');
        return data.access_token;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        
        // As a fallback, try directly with Spotify API
        try {
          const { data } = await axios.post(
            TOKEN_URL,
            new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
              client_id: CLIENT_ID
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
          );
          
          // Update stored tokens
          const newExpiresAt = Date.now() + (data.expires_in * 1000);
          localStorage.setItem('spotify_token', data.access_token);
          localStorage.setItem('spotify_expires_at', newExpiresAt);
          
          if (data.refresh_token) {
            localStorage.setItem('spotify_refresh_token', data.refresh_token);
          }
          
          console.log('Token refreshed using fallback method');
          return data.access_token;
        } catch (fallbackError) {
          console.error('Both token refresh methods failed:', fallbackError);
          // If refresh fails, redirect to login
          window.location.href = '/';
          return null;
        }
      }
    } else {
      // No refresh token, redirect to login
      console.error('No refresh token available');
      window.location.href = '/';
      return null;
    }
  }
  return getAccessToken()
}

async function authHeader() {
  const token = await checkAndRefreshToken()
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

// 🎵 User Profile
export async function fetchUserProfile() {
  const { data } = await axios.get(`${BASE_URL}/me`, await authHeader())
  return data
}

// 🎧 Home Recommendations (simplified, using top tracks)
export async function fetchRecommendedTracks() {
  const { data } = await axios.get(`${BASE_URL}/me/top/tracks?limit=10`, await authHeader())
  return data.items
}

export async function fetchTopArtists() {
  const { data } = await axios.get(`${BASE_URL}/me/top/artists?limit=10`, await authHeader())
  return data.items
}


// 📂 User Playlists
export async function fetchUserPlaylists() {
  const { data } = await axios.get(`${BASE_URL}/me/playlists?limit=10`, await authHeader())
  return data.items
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