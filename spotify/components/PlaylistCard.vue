<template>
    <div class="playlist-card" @click="playPlaylist">
        <div class="playlist-image-container">
            <img :src="playlist.images?.[0]?.url || '/default-album.jpg'" alt="Playlist Image" class="playlist-image" />
            <div class="play-overlay" @click="playPlaylist">
                <i class="bi bi-play-fill"></i>
            </div>
        </div>
        <div class="playlist-info">
            <h3 class="playlist-title">{{ playlist.name }}</h3>
            <p class="playlist-description">{{ playlist.description || `By ${playlist.owner?.display_name}` }}</p>
            <div class="playlist-meta">
                <span>{{ playlist.tracks?.total || 0 }} tracks</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    playlist: {
        type: Object,
        required: true
    }
});

const router = useRouter();
const playPlaylist = () => {
    router.push(`/playlists/${props.playlist.id}`);
};
</script>

<style scoped>
.playlist-card {
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

.playlist-card:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.playlist-image-container {
    position: relative;
    width: 100%;
    height: 156px;
    margin-bottom: 16px;
}

.playlist-image {
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

.playlist-card:hover .play-overlay {
    opacity: 1;
    transform: translateY(0);
}

.play-overlay i {
    font-size: 1.5rem;
    color: var(--color-white);
    margin-left: 2px;
    /* Center the triangle play icon */
}

.playlist-info {
    padding: 0;
}

.playlist-title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
}

.playlist-description {
    margin: 2px 0 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
}

.playlist-meta {
    margin-top: 5px;
    font-size: 0.7rem;
    color: var(--text-muted);
    display: none;
    /* Hide the track count to match Spotify design */
}
</style>