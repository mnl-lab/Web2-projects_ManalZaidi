// composables/useSpotify.js
import axios from 'axios'

const BASE_URL = 'https://api.spotify.com/v1'

function getAccessToken() {
  return localStorage.getItem('spotify_token')
}

function authHeader() {
  return {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`
    }
  }
}

// 🎵 User Profile
export async function fetchUserProfile() {
  const { data } = await axios.get(`${BASE_URL}/me`, authHeader())
  return data
}

// 🎧 Home Recommendations (simplified, using top tracks)
export async function fetchRecommendedTracks() {
  const { data } = await axios.get(`${BASE_URL}/me/top/tracks?limit=10`, authHeader())
  return data.items
}

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
    authHeader()
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

// 📂 User Playlists
export async function fetchUserPlaylists() {
  const { data } = await axios.get(`${BASE_URL}/me/playlists?limit=10`, authHeader())
  return data.items
}

// ➕ Create Playlist
export async function createPlaylist(userId, name, description = '') {
  const { data } = await axios.post(
    `${BASE_URL}/users/${userId}/playlists`,
    { name, description, public: false },
    authHeader()
  )
  return data
}

// ✏️ Add Track to Playlist
export async function addTrackToPlaylist(playlistId, trackUri) {
  await axios.post(
    `${BASE_URL}/playlists/${playlistId}/tracks`,
    { uris: [trackUri] },
    authHeader()
  )
}

// ❌ Remove Track from Playlist
export async function removeTrackFromPlaylist(playlistId, trackUri) {
  await axios.request({
    method: 'DELETE',
    url: `${BASE_URL}/playlists/${playlistId}/tracks`,
    data: { tracks: [{ uri: trackUri }] },
    ...authHeader()
  })
}

export async function pausePlayback() {
  await axios.put(`${BASE_URL}/me/player/pause`, null, authHeader())
}

export async function skipToNext() {
  await axios.post(`${BASE_URL}/me/player/next`, null, authHeader())
}

export async function skipToPrevious() {
  await axios.post(`${BASE_URL}/me/player/previous`, null, authHeader())
}

export async function fetchCurrentlyPlaying() {
  const { data } = await axios.get(`${BASE_URL}/me/player/currently-playing`, authHeader())
  return data
}

// 💿 User's Saved Albums
export async function fetchUserAlbums(limit = 10) {
  try {
    const { data } = await axios.get(`${BASE_URL}/me/albums?limit=${limit}`, authHeader())
    return data.items ? data.items.map(item => item.album) : []
  } catch (error) {
    console.error('Error fetching user albums:', error)
    // Fallback to using user's top artists for demo purposes
    // This is in case the user doesn't have saved albums or the API endpoint isn't working
    const { data } = await axios.get(`${BASE_URL}/me/top/artists?limit=${limit}`, authHeader())
    // Transform artists to album-like objects for UI compatibility
    return data.items ? data.items.map(artist => ({
      id: artist.id,
      name: `Best of ${artist.name}`,
      images: artist.images,
      type: 'album',
      artists: [artist],
      description: `Music by ${artist.name}`
    })) : []
  }
}
