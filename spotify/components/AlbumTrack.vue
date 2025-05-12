<template>
  <div class="track-item" @click="playTrackIfNotDropdown">
    <div class="track-number">{{ index + 1 }}</div>
    <div class="track-info">
      <div class="track-name">{{ track.name }}</div>
      <div class="track-artists">{{ artistNames }}</div>
    </div>
    <div class="track-duration">{{ formatDuration(track.duration_ms) }}</div>
    <div class="track-actions">
      <button class="play-button" title="Play">
        <span class="material-icons">play_arrow</span>
      </button>
      <div class="menu-container">
        <button @click.stop.prevent="toggleDropdown" class="options-btn" title="More options">
          <span class="material-icons">more_vert</span>
        </button>
        <div class="menu-popup" v-if="showDropdown" @click.stop> <!-- Add to playlist view -->
          <div v-if="showAddToPlaylist" class="menu-view">
            <div class="menu-header">Add to playlist:</div>
            <div v-if="loadingPlaylists" class="menu-message">
              <span class="loading-text">Loading playlists...</span>
            </div>
            <div v-else-if="userPlaylists.length === 0" class="menu-message">
              <span>No playlists found</span>
            </div>
            <div v-else class="menu-scroll-area">
              <button v-for="playlist in userPlaylists" :key="playlist.id"
                @click.stop.prevent="addToPlaylist(playlist.id, playlist.name)" class="menu-option">
                {{ playlist.name }}
              </button>
            </div>
            <button @click.stop.prevent="showAddToPlaylist = false" class="menu-back-btn">
              <span class="material-icons">arrow_back</span> Back
            </button>
          </div>

          <!-- Main options view -->
          <div v-else class="menu-view">
            <button @click.stop.prevent="openAddToPlaylist" class="menu-option">
              <span class="material-icons">playlist_add</span> Add to playlist
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="toast-container" v-if="toastVisible">
      <div class="toast" :class="{ 'toast-success': !toastIsError, 'toast-error': toastIsError }">
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { fetchUserPlaylists, addTrackToPlaylist } from '#imports';

const props = defineProps({
  track: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['track-added']);

const showDropdown = ref(false);
const showAddToPlaylist = ref(false);
const loadingPlaylists = ref(false);
const userPlaylists = ref([]);

// Toast notification
const toastVisible = ref(false);
const toastMessage = ref('');
const toastIsError = ref(false);

// Get artist names formatted as a comma separated string
const artistNames = computed(() => {
  if (!props.track.artists || !props.track.artists.length) return '';
  return props.track.artists.map(artist => artist.name).join(', ');
});

// Format track duration from milliseconds to MM:SS format
const formatDuration = (ms) => {
  if (!ms) return '0:00';

  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

import { useAudioPlayer } from '#imports';
const player = useAudioPlayer();

const playTrack = async () => {
  // Check if the track has a preview URL
  if (!props.track.preview_url) {
    showToast('This track has no preview available', true);
    return;
  }

  const trackUrl = props.track.preview_url;
  const result = await player.playTrack(
    trackUrl,
    {
      name: props.track.name,
      artist: artistNames.value,
      albumArt: props.track.album?.images?.[0]?.url
    }
  );

  // If playTrack returns false, it means there was an issue (likely not premium)
  if (result === false) {
    showToast('Premium subscription required to play tracks', true);
  }
};

// Only play track if we're not interacting with the dropdown
const playTrackIfNotDropdown = (event) => {
  if (showDropdown.value) {
    event.stopPropagation();
    return;
  }
  playTrack();
};

const toggleDropdown = (event) => {
  event.preventDefault();
  event.stopPropagation();

  // Toggle visibility
  showDropdown.value = !showDropdown.value;

  if (showDropdown.value) {
    // Reset sub-menus when opening dropdown
    showAddToPlaylist.value = false;

    // Position the popup menu correctly
    setTimeout(() => {
      const button = event.target.closest('.options-btn');
      const menuPopup = document.querySelector('.menu-popup');

      if (button && menuPopup) {
        const buttonRect = button.getBoundingClientRect();
        // Position the dropdown above the button
        menuPopup.style.position = 'fixed';
        const menuHeight = menuPopup.offsetHeight || 200; // Default height if not measurable yet
        menuPopup.style.top = `${buttonRect.top - menuHeight - 10}px`; // Place above with 10px gap
        menuPopup.style.left = `${buttonRect.left}px`;
        menuPopup.style.zIndex = '9999';
      }
    }, 0);
  }
};

const openAddToPlaylist = async () => {
  showAddToPlaylist.value = true;
  loadingPlaylists.value = true;

  try {
    userPlaylists.value = await fetchUserPlaylists();
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    showToast('Failed to load your playlists', true);
  } finally {
    loadingPlaylists.value = false;
  }
};

const addToPlaylist = async (playlistId, playlistName) => {
  try {
    // Construct the Spotify URI from track ID
    const trackUri = `spotify:track:${props.track.id}`;
    await addTrackToPlaylist(playlistId, trackUri);
    showToast(`Added to "${playlistName}"`, false);

    // Emit event to parent component
    emit('track-added', {
      trackId: props.track.id,
      playlistId: playlistId,
      playlistName: playlistName
    });
    alert(`Track added to "${playlistName}"`);
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    showToast('Failed to add track to playlist', true);
  } finally {
    showAddToPlaylist.value = false;
    showDropdown.value = false;
  }
};

const showToast = (message, isError = false) => {
  toastMessage.value = message;
  toastIsError.value = isError;
  toastVisible.value = true;

  // Hide toast after 3 seconds
  setTimeout(() => {
    toastVisible.value = false;
  }, 3000);
};

// Close dropdown when clicking outside
const clickOutsideHandler = (event) => {
  if (showDropdown.value &&
    !event.target.closest('.menu-popup') &&
    !event.target.closest('.options-btn')) {
    showDropdown.value = false;
    showAddToPlaylist.value = false;
  }
};

onMounted(() => {
  // Only add the event listener on client-side
  if (process.client) {
    document.addEventListener('click', clickOutsideHandler);
  }
});

onUnmounted(() => {
  // Clean up event listener
  if (process.client) {
    document.removeEventListener('click', clickOutsideHandler);
  }
});
</script>

<style scoped>
.track-item {
  display: grid;
  grid-template-columns: 40px 1fr 80px 60px;
  align-items: center;
  padding: 12px 16px;
  border-radius: 4px;
  transition: background-color 0.2s;
  cursor: pointer;
  position: relative;
}

.track-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.track-number {
  color: #b3b3b3;
  font-size: 16px;
  text-align: center;
}

.track-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-right: 10px;
}

.track-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artists {
  color: #b3b3b3;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-duration {
  color: #b3b3b3;
  font-size: 14px;
  text-align: right;
}

.track-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 10;
  text-align: center;
  /* Make controls slightly visible by default */
  opacity: 0.5;
  transition: opacity 0.2s;
}

.track-item:hover .track-actions {
  opacity: 1;
}

.play-button {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-icons {
  font-size: 24px;
}

/* Menu Styles */
.track-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.menu-container {
  position: relative;
  display: inline-block;
  z-index: 100;
}

.options-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 50%;
  box-sizing: border-box;
}

.options-btn:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.options-btn:active {
  transform: scale(0.95);
  background-color: rgba(255, 255, 255, 0.2);
}

.menu-popup {
  position: fixed;
  /* Will be positioned via JS */
  background-color: #333;
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
  min-width: 220px;
  z-index: 9999;
  overflow: hidden;
  transform-origin: top left;
  animation: menuAppear 0.2s ease;
}

@keyframes menuAppear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.menu-view {
  width: 100%;
}

.menu-header {
  padding: 12px 16px 8px;
  color: #d1d1d1;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.menu-option:hover {
  background-color: #5a429b;
}

.menu-scroll-area {
  max-height: 220px;
  overflow-y: auto;
}

.menu-message {
  padding: 12px 16px;
  color: #b3b3b3;
  font-size: 14px;
}

.loading-text {
  font-style: italic;
}

.menu-back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  width: 100%;
  text-align: left;
  background: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #b3b3b3;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  border-bottom: none;
  border-right: none;
  border-left: none;
}

.menu-back-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Toast Notification Styles */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast {
  padding: 12px 16px;
  border-radius: 4px;
  margin-top: 8px;
  font-size: 14px;
  animation: slideIn 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-success {
  background-color: #1DB954;
  color: white;
}

.toast-error {
  background-color: #E91429;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
