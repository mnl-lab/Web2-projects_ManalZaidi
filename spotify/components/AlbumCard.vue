<template>
    <div class="album-card" @click="playalbum">
        <div class="album-image-container">
            <img :src="album?.images?.[0]?.url || '/default-album.jpg'" alt="album Image" class="album-image" />
            <div class="play-overlay" @click="playalbum">
                <i class="bi bi-play-fill"></i>
            </div>
        </div>
        <div class="album-info">
            <h3 class="album-title">{{ album?.name }}</h3>
            <p class="album-description">{{ album?.description || `By ${album?.owner?.display_name}` }}</p>
            <div class="album-meta">
                <span>{{ album.tracks?.total || 0 }} tracks</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    album: {
        type: Object,
        required: true
    }
});

const router = useRouter();
const playalbum = () => {
    router.push(`/album/${props.album.id}`);
};
</script>

<style scoped>
.album-card {
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

.album-card:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.album-image-container {
    position: relative;
    width: 100%;
    height: 156px;
    margin-bottom: 16px;
}

.album-image {
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

.album-card:hover .play-overlay {
    opacity: 1;
    transform: translateY(0);
}

.play-overlay i {
    font-size: 1.5rem;
    color: var(--color-white);
    margin-left: 2px;
    /* Center the triangle play icon */
}

.album-info {
    padding: 0;
}

.album-title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
}

.album-description {
    margin: 2px 0 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
}

.album-meta {
    margin-top: 5px;
    font-size: 0.7rem;
    color: var(--text-muted);
    display: none;
    /* Hide the track count to match Spotify design */
}
</style>