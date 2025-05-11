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
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    width: 200px;
    margin: 10px;
}

.track-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.track-image {
    position: relative;
    width: 100%;
    height: 200px;
}

.track-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.track-card:hover .play-overlay {
    opacity: 1;
}

.play-overlay i {
    font-size: 3rem;
    color: var(--color-white);
}

.track-info {
    padding: 15px;
}

.track-name {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.track-artist,
.track-album {
    margin: 5px 0 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>