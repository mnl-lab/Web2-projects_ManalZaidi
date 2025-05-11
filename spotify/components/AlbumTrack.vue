<template>
  <div class="track-item" @click="playTrack">
    <div class="track-number">{{ index + 1 }}</div>
    <div class="track-info">
      <div class="track-name">{{ track.name }}</div>
      <div class="track-artists">{{ artistNames }}</div>
    </div>
    <div class="track-duration">{{ formatDuration(track.duration_ms) }}</div>
    <div class="track-actions">
      <button class="play-button">
        <span class="material-icons">play_arrow</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

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

const playTrack = () => {
  // This function would handle playing the track
  // It could emit an event that the parent component listens for
  console.log('Play track:', props.track.name);
};
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
  opacity: 0;
  transition: opacity 0.2s;
  text-align: center;
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
</style>
