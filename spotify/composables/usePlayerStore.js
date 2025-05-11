// composables/usePlayerStore.js
import { ref, readonly } from 'vue'

// Create a reactive state
const isPlayerVisible = ref(false)
const currentTrackUri = ref(null)
const currentPlaylistId = ref(null)
const currentAlbumId = ref(null)
const playbackType = ref('none') // can be 'track', 'playlist', 'album', or 'none'
const accessToken = ref('')

// Create a composable to expose the state and methods
export function usePlayerStore() {  
  // Function to play a track
  const playTrack = (uri) => {
    currentTrackUri.value = uri
    currentPlaylistId.value = null
    currentAlbumId.value = null
    playbackType.value = 'track'
    isPlayerVisible.value = true
  }
  
  // Function to play a playlist
  const playPlaylist = (playlistId) => {
    currentPlaylistId.value = playlistId
    currentTrackUri.value = null
    currentAlbumId.value = null
    playbackType.value = 'playlist'
    isPlayerVisible.value = true
  }
  
  // Function to play an album
  const playAlbum = (albumId) => {
    currentAlbumId.value = albumId
    currentPlaylistId.value = null
    currentTrackUri.value = null
    playbackType.value = 'album'
    isPlayerVisible.value = true
  }

  // Function to hide the player
  const hidePlayer = () => {
    isPlayerVisible.value = false
  }
  // Function to set the access token
  const setAccessToken = (token) => {
    accessToken.value = token
  }
  
  // Return readonly state and methods
  return {
    // State (readonly)
    isPlayerVisible: readonly(isPlayerVisible),
    currentTrackUri: readonly(currentTrackUri),
    currentPlaylistId: readonly(currentPlaylistId),
    currentAlbumId: readonly(currentAlbumId),
    playbackType: readonly(playbackType),
    accessToken: readonly(accessToken),

    // Methods
    playTrack,
    playPlaylist,
    playAlbum,
    hidePlayer,
    setAccessToken
  }
}
