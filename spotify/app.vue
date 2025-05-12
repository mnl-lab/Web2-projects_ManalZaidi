<template>
  <div class="app-container">
    <main class="main-content">
      <NuxtPage />
    </main>
    <!-- Audio player fixed at bottom, hide on login page -->
    <div class="audio-player-container" v-if="playerStore.isPlayerVisible && !isLoginPage">
      <AudioPlayer />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { getStoredAccessToken } from '~/composables/spotifyUsage';
import { useRoute } from 'vue-router';
import { useAudioPlayer } from '~/composables/audioPlayer';

const route = useRoute();
const playerStore = useAudioPlayer();

// Check if current page is the login page
const isLoginPage = computed(() => {
  return route.path === '/' || route.path === '/index';
});

// Set the access token when the app loads
onMounted(() => {
  if (process.client) {
    const token = getStoredAccessToken();
    if (token) {
      playerStore.setAccessToken(token);
    }
  }
});
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-bottom: 80px;
  /* Space for the audio player */
}

.audio-player-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--background-secondary);
  border-top: 1px solid var(--color-medium-purple);
  padding: 10px;
  z-index: 1000;
  height: 70px;
}
</style>