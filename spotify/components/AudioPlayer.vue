<template>
    <div class="audio-player">
      <button @click="togglePlay">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      <button @click="playPrevious">Previous</button>
      <button @click="playNext">Next</button>
      <div v-if="currentTrack">
        <p>{{ currentTrack.name }} - {{ currentTrack.artists[0].name }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  
  // Props: expects a valid Spotify OAuth token with the required scopes
  defineProps({
    accessToken: {
      type: String,
      required: true,
    },
  });
  
  // Reactive state for player
  const player = ref(null);
  const deviceId = ref(null);
  const isPlaying = ref(false);
  const currentTrack = ref(null);
  
  // Initialize the Spotify Web Playback SDK when component mounts
  onMounted(() => {
    // Insert the Spotify Web Playback SDK script if not already present
    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
  
      // Once SDK is ready, call the setup function
      window.onSpotifyWebPlaybackSDKReady = setupPlayer;
    } else {
      // SDK already loaded
      setupPlayer();
    }
  });
  
  onBeforeUnmount(() => {
    // Disconnect the player when component is destroyed
    if (player.value) {
      player.value.disconnect();
    }
  });
  
  // Watch accessToken changes (e.g., on refresh) and re-initialize if needed
  watch(
    () => accessToken,
    (newToken) => {
      if (player.value && newToken) {
        player.value._options.getOAuthToken((cb) => cb(newToken));
      }
    }
  );
  
  /**
   * Sets up the Spotify Player instance and registers event listeners
   */
  function setupPlayer() {
    player.value = new window.Spotify.Player({
      name: 'Vue Spotify Clone Player',
      getOAuthToken: (cb) => {
        // Provide the current access token to Spotify SDK
        cb(accessToken);
      },
      volume: 0.5, // initial volume level
    });
  
    // Error handling listeners
    player.value.addListener('initialization_error', ({ message }) => console.error('Init Error:', message));
    player.value.addListener('authentication_error', ({ message }) => console.error('Auth Error:', message));
    player.value.addListener('account_error', ({ message }) => console.error('Account Error:', message));
    player.value.addListener('playback_error', ({ message }) => console.error('Playback Error:', message));
  
    // Playback state updates
    player.value.addListener('player_state_changed', (state) => {
      if (!state) return;
      isPlaying.value = !state.paused;
      currentTrack.value = state.track_window.current_track;
    });
  
    // When the player is ready, save the device ID and transfer playback
    player.value.addListener('ready', ({ device_id }) => {
      deviceId.value = device_id;
      transferPlayback(device_id);
    });
  
    // Connect to the player
    player.value.connect();
  }
  
  /**
   * Transfers playback to this Web Playback SDK device
   * @param {string} id - The device ID from the SDK
   */
  function transferPlayback(id) {
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_ids: [id],
        play: false,
      }),
    });
  }
  
  /**
   * Toggles between play and pause
   */
  function togglePlay() {
    if (!player.value) return;
    if (isPlaying.value) {
      player.value.pause();
    } else {
      player.value.resume();
    }
  }
  
  /**
   * Skips to the next track
   */
  function playNext() {
    player.value?.nextTrack();
  }
  
  /**
   * Goes back to the previous track
   */
  function playPrevious() {
    player.value?.previousTrack();
  }
  </script>
  
  <style scoped>
  .audio-player {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  