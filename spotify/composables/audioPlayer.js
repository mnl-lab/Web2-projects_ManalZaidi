// ~/composables/useAudioPlayer.js
import { ref, computed } from 'vue';

// Initialize variables to store state
let audio = null;
const isPlaying = ref(false);
const currentTrack = ref(null);
const progress = ref(0);
const isPlayerVisible = ref(false);
const accessToken = ref(null);
const isPremium = ref(false);
const premiumChecked = ref(false);

// Initialize audio only on client side
if (process.client) {
  try {
    audio = new Audio();
    
    // Update progress every 500ms
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        progress.value = audio.currentTime / audio.duration;
      }
    });
    audio.addEventListener('ended', () => {
      isPlaying.value = false;
      currentTrack.value = null;
    });
  } catch (error) {
    console.error('Audio initialization failed:', error);
  }
}

export function useAudioPlayer() {  const setAccessToken = (token) => {
    accessToken.value = token;
    // Check premium status when token is set
    checkPremiumStatus();
  };

  const checkPremiumStatus = async () => {
    if (!process.client || !accessToken.value) return;
    
    // Don't check again if we've already checked
    if (premiumChecked.value) return;

    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Check if user has premium subscription
        isPremium.value = data.product === 'premium';
        // Mark as checked
        premiumChecked.value = true;
        // Always show player, but functionality will be limited for non-premium
        isPlayerVisible.value = true;
        
        console.log(`User premium status: ${isPremium.value ? 'Premium' : 'Free'}`);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      isPremium.value = false;
    }
  };
  const playTrack = async (trackUrl, meta = {}) => {
    if (!process.client || !trackUrl) return;
    
    // Check if premium status has been checked, if not check it now
    if (!premiumChecked.value && accessToken.value) {
      await checkPremiumStatus();
    }
    
    // Check if user is premium before playing
    if (!isPremium.value) {
      console.log("Non-premium user attempting to play track");
      alert("This feature requires a Spotify Premium subscription. Please upgrade your account to play this track.");
      return false;
    }
    
    if (!audio) {
      console.error("Audio object is not initialized");
      return false;
    }
    
    if (audio.src !== trackUrl) {
      audio.src = trackUrl;
      currentTrack.value = { ...meta, url: trackUrl };
    }
    
    try {
      await audio.play();
      isPlaying.value = true;
      return true;
    } catch (error) {
      console.error('Error playing audio:', error);
      alert("There was an error playing this track. Please try again later.");
      return false;
    }
  };

  const pause = () => {
    if (!process.client || !audio) return;
    
    audio.pause();
    isPlaying.value = false;
  };

  const seekTo = (fraction) => {
    if (!process.client || !audio || !audio.duration) return;
    
    audio.currentTime = audio.duration * fraction;
  };  return {
    isPlaying: computed(() => isPlaying.value),
    currentTrack: computed(() => currentTrack.value),
    progress: computed(() => progress.value),
    isPremium: computed(() => isPremium.value),
    isPlayerVisible: computed(() => isPlayerVisible.value || (currentTrack.value !== null)), // Show player if we have a track
    audio, // Expose audio element for time calculations
    setAccessToken,
    playTrack,
    pause,
    seekTo,
    checkPremiumStatus
  };
}