<template>
    <div class="track-card">
        <div class="track-image">
            <img :src="track.album.images[0]?.url || '/default-album.jpg'" alt="Album Cover" />
            <div class="play-overlay" @click="playTrack">
                <i class="bi bi-play-fill"></i>
            </div>
        </div>
        <div class="track-info">
            <h3 class="track-name">{{ track.name }}</h3>
            <p class="track-artist">{{ track.artists[0].name }}</p>
            <p class="track-album">{{ track.album.name }}</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    track: {
        type: Object,
        required: true
    }
});

const playTrack = () => {
    // Play track functionality can be implemented here
    // For now, just log the track information
    console.log('Playing track:', props.track.name, 'by', props.track.artists[0].name);
}
</script>

<style scoped>
.track-card {
    display: flex;
    flex-direction: column;
    background-color: var(--background-secondary);
    border-radius: 8px;
    overflow: hidden;
    transition: background-color 0.3s ease;
    width: 180px;
    min-width: 180px;
    padding: 12px;
    cursor: pointer;
}

.track-card:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.track-image {
    position: relative;
    width: 100%;
    height: 156px;
    margin-bottom: 16px;
}

.track-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    border-radius: 4px;
}

.play-overlay {
    position: absolute;
    bottom: 8px;
    right: 8px;
    width: 48px;
    height: 48px;
    background-color: var(--color-medium-purple);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transform: translateY(8px);
    transition: all 0.3s ease;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.track-card:hover .play-overlay {
    opacity: 1;
    transform: translateY(0);
}

.play-overlay i {
    font-size: 1.5rem;
    color: var(--color-white);
    margin-left: 2px;
    /* Center the triangle play icon */
}

.track-info {
    padding: 0;
}

.track-name {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
}

.track-artist,
.track-album {
    margin: 2px 0 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
}

.track-album {
    display: none;
    /* Hide album name to match Spotify's design */
}
</style>