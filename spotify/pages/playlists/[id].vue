<template>
    <div class="container">
        <navbar />
        <div v-if="loading">
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        </div>
        <div v-else-if="error" class="error-message">
            <p>{{ error.message }}</p>
            <button @click="window.location.reload()" class="retry-button">Try Again</button>
        </div>
        <div v-else>
            <div class="playlist-info">
                <img :src="playlistInfo?.images?.url || '/default-album.jpg'" alt="Playlist Cover"
                    class="playlist-cover" />
                <div class="text-info">
                    <h1>{{ playlistInfo?.name }}</h1>
                    <p>By {{ playlistInfo?.owner?.display_name }}</p>
                    <p>Tracks: {{ playlistTracks.length }}</p>
                    <button @click="playAllTracks" class="play-all-button">
                        <i class="bi bi-play-fill"></i> Play All
                    </button>
                </div>
            </div>

            <div class="tracks-list">
                <div class="track-header">
                    <h2>Tracks</h2>
                    <div class="sort-buttons">
                        <button @click="sortTracks('date')" class="sort-button">
                            Sort by Date
                            <span v-if="sortOption === 'date'" class="sort-icon">
                                {{ sortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                        </button>
                        <button @click="sortTracks('name')" class="sort-button">
                            Sort by Name
                            <span v-if="sortOption === 'name'" class="sort-icon">
                                {{ sortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                        </button>
                    </div>
                </div>
                <div class="tracks-grid" v-if="playlistTracks.length > 0">
                    <track-card v-for="(track, index) in sortedTracks" :key="track.id || index" :track="track"
                        :current-playlist-id="playlistId" @track-removed="handleTrackRemoved" />
                </div>
                <div v-else class="no-tracks">
                    <p>No tracks available in this playlist.</p>
                </div>
            </div>
        </div>

        <!-- Toast notification -->
        <div class="toast-container" v-if="toastVisible">
            <div class="toast" :class="{ 'toast-success': !toastIsError, 'toast-error': toastIsError }">
                {{ toastMessage }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchPlaylistTracks, fetchPlaylistInfo } from '#imports';
import { useAudioPlayer } from '~/composables/audioPlayer';

const player = useAudioPlayer();
const route = useRoute();
const playlistTracks = ref([]);
const playlistInfo = ref(null);
const loading = ref(true);
const error = ref(null);
const playlistId = route.params.id;
const sortOption = ref('date'); // Default sort option
const sortDirection = ref('desc'); // Default sort direction: 'asc' or 'desc'

const sortedTracks = computed(() => {
    const tracks = [...playlistTracks.value];

    if (sortOption.value === 'date') {
        return tracks.sort((a, b) => {
            const dateComparison = new Date(b.added_at) - new Date(a.added_at);
            return sortDirection.value === 'asc' ? -dateComparison : dateComparison;
        });
    } else if (sortOption.value === 'name') {
        return tracks.sort((a, b) => {
            const nameComparison = a.name.localeCompare(b.name);
            return sortDirection.value === 'asc' ? nameComparison : -nameComparison;
        });
    }
    return tracks;
});

const sortTracks = (option) => {
    // If clicking the same option, toggle direction
    if (sortOption.value === option) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        // If changing sort option, set default direction
        sortOption.value = option;
        sortDirection.value = option === 'date' ? 'desc' : 'asc'; // Default: newest dates first, A-Z for names
    }
};

// Handle track removal from playlist
const handleTrackRemoved = (trackId) => {
    // Update local state by removing the track
    playlistTracks.value = playlistTracks.value.filter(track => track.id !== trackId);

    // Update the tracks count in the UI
    if (playlistInfo.value) {
        playlistInfo.value.tracks.total -= 1;
    }
};

const loadPlaylistData = async () => {
    loading.value = true;
    error.value = null;
    try {
        playlistInfo.value = await fetchPlaylistInfo(playlistId);
        if (!playlistInfo.value) {
            throw new Error('Failed to fetch playlist info');
        }
        playlistTracks.value = await fetchPlaylistTracks(playlistId);
        if (!playlistTracks.value) {
            throw new Error('Failed to fetch playlist tracks');
        }
    } catch (err) {
        console.error('Error loading playlist:', err);
        error.value = err;
    } finally {
        loading.value = false;
    }
};

// Toast notification
const toastVisible = ref(false);
const toastMessage = ref('');
const toastIsError = ref(false);

const showToast = (message, isError = false) => {
    toastMessage.value = message;
    toastIsError.value = isError;
    toastVisible.value = true;

    // Hide toast after 3 seconds
    setTimeout(() => {
        toastVisible.value = false;
    }, 3000);
};

// Play all tracks in the playlist
const playAllTracks = async () => {
    // Check if there are any tracks in the playlist
    if (playlistTracks.value.length === 0) {
        showToast('No tracks available to play', true);
        return;
    }

    // Find the first track with a preview URL
    const trackWithPreview = playlistTracks.value.find(track => track.preview_url);

    if (!trackWithPreview) {
        showToast('No tracks with preview are available', true);
        return;
    }

    // Check premium status and play the first track
    const result = await player.playTrack(
        trackWithPreview.preview_url,
        {
            name: trackWithPreview.name,
            artist: trackWithPreview.artists.map(a => a.name).join(', '),
            albumArt: trackWithPreview.album.images[0]?.url
        }
    );

    if (result === false) {
        showToast('Premium subscription required to play tracks', true);
    } else {
        showToast(`Playing "${trackWithPreview.name}"`, false);
    }
};

onMounted(() => {
    // Only run on client-side
    if (process.client) {
        loadPlaylistData();
    }
});
</script>

<style scoped>
.container {
    padding: 20px;
    font-family: Arial, sans-serif;
    height: 100%;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #ccc;
    border-top: 5px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-message {
    text-align: center;
    color: red;
}

.retry-button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.retry-button:hover {
    background-color: #0056b3;
}

.playlist-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    background-color: var(--color-charcoal);
    padding: 20px;
    padding-left: 5%;
    padding-right: 5%;
    border-radius: 10px;
}

.playlist-cover {
    width: 150px;
    height: 150px;
    border-radius: 10px;
    margin-right: 20px;
}

.text-info h1 {
    margin: 0;
    font-size: 24px;
}

.text-info p {
    margin: 5px 0;
    color: #555;
}

.tracks-list {
    margin-top: 20px;
}

.track-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.tracks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.no-tracks {
    text-align: center;
    color: #777;
}

h2 {
    color: var(--color-light-purple);
}

.sort-buttons {
    margin-bottom: 10px;
}

.sort-buttons button {
    margin-right: 10px;
    padding: 10px 15px;
    background-color: var(--color-medium-purple);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.sort-buttons button:hover {
    background-color: var(--color-light-purple);
    color: var(--color-black);
}

.sort-icon {
    margin-left: 5px;
    font-size: 0.8rem;
}

.play-all-button {
    margin-top: 15px;
    padding: 10px 20px;
    background-color: var(--color-medium-purple);
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
}

.play-all-button:hover {
    background-color: var(--color-light-purple);
}

.play-all-button i {
    margin-right: 5px;
    font-size: 1.2em;
}

/* Toast notifications */
.toast-container {
    position: fixed;
    bottom: 80px;
    /* Above the audio player */
    left: 50%;
    transform: translateX(-50%);
    z-index: 1100;
}

.toast {
    padding: 12px 24px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: fadeInUp 0.3s forwards;
}

.toast-success {
    background-color: #4caf50;
}

.toast-error {
    background-color: #f44336;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>