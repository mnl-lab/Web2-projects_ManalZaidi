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
  const { data } = await axios.get(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=${type}&limit=10`,
    authHeader()
  )
  return data
}

// 📂 User Playlists
export async function fetchUserPlaylists() {
  const { data } = await axios.get(`${BASE_URL}/me/playlists`, authHeader())
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
