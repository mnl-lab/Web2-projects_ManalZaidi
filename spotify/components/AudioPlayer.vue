<template>
  <div v-if="player.currentTrack" class="audio-player-bar">
    <!-- Premium user warning if needed -->
    <div v-if="!isPremium" class="premium-warning">
      Spotify Premium is required to play tracks
    </div>

    <div class="track-info">
      <img :src="player.currentTrack.albumArt || player.currentTrack.image || '/default-album.jpg'" alt="Cover"
        class="cover" />
      <div>
        <div class="title">{{ player.currentTrack.name }}</div>
        <div class="artist">{{ player.currentTrack.artist }}</div>
      </div>
    </div>
    <div class="controls">
      <button @click="togglePlay" :class="{ 'disabled-control': !isPremium }">
        <span v-if="player.isPlaying">❚❚</span>
        <span v-else>►</span>
      </button>
      <div class="progress-container">
        <input type="range" min="0" max="1" step="0.001" v-model="localProgress" @change="onSeek"
          :class="{ 'disabled-control': !isPremium }" />
        <div class="time-display">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useAudioPlayer, isUserPremium } from '#imports';

const player = useAudioPlayer();
const isPremium = ref(false);
onMounted(async () => {
  try {
    // First check if we have an access token before trying premium check
    const accessToken = localStorage.getItem('spotify_token');
    if (!accessToken) {
      console.log("No access token available, user not logged in yet"); // Changed to log instead of warn
      isPremium.value = false;
      return;
    }

    // Check if the user is a premium user
    isPremium.value = await isUserPremium();
    console.log("Is user premium:", isPremium.value);

    // Synchronize the premium status with the audio player
    if (isPremium.value) {
      await player.checkPremiumStatus();
    }
  } catch (error) {
    console.error("Error checking premium status:", error);

    // Handle authentication errors specially
    if (error.message === 'No valid authentication token available') {
      console.log("Authentication required for premium check"); // Changed to log instead of warn
      isPremium.value = false;
    } else {
      // For other errors
      isPremium.value = false;
    }
  }
});
// two‑way sync slider
const localProgress = ref(0);
watch(
  () => player.progress,
  p => (localProgress.value = p)
);

// Compute current time and duration for display
const currentTime = computed(() => {
  if (!player.audio || !player.audio.duration) return 0;
  return player.audio.currentTime || 0;
});

const duration = computed(() => {
  if (!player.audio) return 0;
  return player.audio.duration || 0;
});

// Format seconds to MM:SS
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const togglePlay = () => {
  if (!isPremium.value) {
    alert("This feature requires a Spotify Premium subscription. Please upgrade your account to play tracks.");
    return;
  }

  player.isPlaying ? player.pause() : player.playTrack(player.currentTrack.url);
};

const onSeek = () => {
  if (!isPremium.value) {
    alert("This feature requires a Spotify Premium subscription.");
    return;
  }
  player.seekTo(localProgress.value);
};
</script>

<style scoped>
.audio-player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background: #222;
  color: #fff;
}

.premium-warning {
  position: absolute;
  top: -25px;
  left: 0;
  right: 0;
  background-color: var(--color-light-purple);
  color: black;
  text-align: center;
  padding: 3px;
  font-size: 0.8rem;
}

.cover {
  width: 48px;
  height: 48px;
  margin-right: 0.75rem;
}

.track-info {
  display: flex;
  align-items: center;
}

.title {
  font-weight: bold;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
}

.time-display {
  font-size: 0.7rem;
  color: #ccc;
  text-align: center;
  margin-top: 4px;
}

.disabled-control {
  opacity: 0.5;
  cursor: not-allowed;
}

button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

button:hover:not(.disabled-control) {
  transform: scale(1.1);
}

input[type="range"] {
  width: 100%;
  accent-color: var(--color-light-purple, #9370DB);
}

input[type="range"].disabled-control {
  accent-color: #555;
}
</style>