<template>
    <div class="playlist-card">
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
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    width: 200px;
    margin: 10px;
}

.playlist-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.playlist-image-container {
    position: relative;
    width: 100%;
    height: 200px;
}

.playlist-image {
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

.playlist-card:hover .play-overlay {
    opacity: 1;
}

.play-overlay i {
    font-size: 3rem;
    color: var(--color-white);
}

.playlist-info {
    padding: 15px;
}

.playlist-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.playlist-description {
    margin: 5px 0 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.playlist-meta {
    margin-top: 8px;
    font-size: 0.7rem;
    color: var(--text-muted);
}
</style>