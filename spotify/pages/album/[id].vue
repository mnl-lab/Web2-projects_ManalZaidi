<template>
    <div class="container">
        <!-- Add Material Icons -->
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <navbar />
        <div v-if="loading">
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        </div>
        <div v-else-if="error" class="error-message">
            <p>{{ error.message || error }}</p>
            <button @click="reload" class="retry-button">Try Again</button>
        </div>
        <div v-else>
            <div class="album-info">
                <img :src="albumInfo?.images[0]?.url || '/default-album.jpg'" alt="Album Cover" class="album-cover" />
                <div class="text-info">
                    <h1>{{ albumInfo?.name }}</h1>
                    <p>By {{ albumInfo?.artists[0]?.name }}</p>
                    <p v-if="albumInfo?.release_date">Release Date: {{ formattedDate }}</p>
                    <p>Tracks: {{ albumTracks.length }}</p>
                    <button @click="playCurrentAlbum" class="play-album-button">
                        <i class="material-icons">play_circle_filled</i>
                        Play Album
                    </button>
                </div>
            </div>
            <div class="tracks-list">
                <div class="track-header">
                    <h2>Tracks</h2>
                </div>
                <div class="tracks-table" v-if="albumTracks.length > 0">
                    <div class="tracks-table-header">
                        <div class="header-item">#</div>
                        <div class="header-item title">Title</div>
                        <div class="header-item duration">Duration</div>
                        <div class="header-item"></div>
                    </div> <album-track v-for="(track, index) in albumTracks" :key="track.id || index" :track="{
                        ...track,
                        album: {
                            id: albumInfo?.id,
                            name: albumInfo?.name,
                            images: albumInfo?.images || []
                        }
                    }" :index="index" @track-added="handleTrackAdded" />
                </div>
                <div v-else class="no-tracks">
                    <p>No tracks available in this album.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchAlbumInfo, fetchAlbumTracks, playAlbum } from '#imports';
import { usePlayerStore } from '~/composables/usePlayerStore';

const route = useRoute();
const albumTracks = ref([]);
const albumInfo = ref(null);
const loading = ref(true);
const error = ref(null);
const albumId = route.params.id;
const playerStore = usePlayerStore();

// Play the current album
const playCurrentAlbum = async () => {
    try {
        // Update the player store
        playerStore.playAlbum(albumId);

        // Call the Spotify API to play the album
        const success = await playAlbum(albumId);
        if (!success) {
            error.value = "Failed to play album. Make sure you have an active Spotify device.";
        }
    } catch (err) {
        console.error('Error playing album:', err);
        error.value = err.message || 'Failed to play album';
    }
};

// Reload page function
const reload = () => {
    window.location.reload();
};

// Format date to a more readable format
const formattedDate = computed(() => {
    if (!albumInfo.value?.release_date) return '';
    const date = new Date(albumInfo.value.release_date);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

// Enhance track objects to have album info for TrackCard component
const displayTracks = computed(() => {
    return albumTracks.value.map(track => ({
        ...track,
        album: {
            id: albumInfo.value?.id,
            name: albumInfo.value?.name,
            images: albumInfo.value?.images || []
        }
    }));
});

const fetchData = async (retryAttempt = 0) => {
    loading.value = true;
    error.value = null;
    try {
        albumInfo.value = await fetchAlbumInfo(albumId);
        console.log('Album Info:', albumInfo.value);
        if (!albumInfo.value) {
            throw new Error('Failed to fetch album info');
        }
        const tracks = await fetchAlbumTracks(albumId);
        if (!tracks) {
            throw new Error('Failed to fetch album tracks');
        }
        albumTracks.value = tracks;
        loading.value = false;
    } catch (err) {
        console.error('Error loading album:', err);

        // Handle 401 errors (unauthorized) - might be an expired token
        if (err.response && err.response.status === 401 && retryAttempt < 1) {
            console.log('Unauthorized error, attempting to refresh token and retry...');
            // Small delay before retry
            setTimeout(() => fetchData(retryAttempt + 1), 1000);
            return;
        }

        error.value = err.message || 'An error occurred while loading the album';
        loading.value = false;
    }
};

// Called when a track is successfully added to a playlist
const handleTrackAdded = (data) => {
    console.log('Track added to playlist:', data);
    // We could add additional user feedback here if needed
};

onMounted(() => {
    // Only run on client-side
    if (process.client) {
        fetchData();
    }
});
</script>

<style scoped>
.container {
    padding: 20px;
    font-family: Arial, sans-serif;
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

.album-info {
    display: flex;
    align-items: flex-end;
    margin-bottom: 20px;
    background-color: var(--color-charcoal);
    padding: 40px 5%;
    border-radius: 10px;
}

.album-cover {
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

.play-album-button {
    display: flex;
    align-items: center;
    background-color: var(--color-medium-purple);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 20px;
    margin-top: 15px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
}

.play-album-button:hover {
    background-color: var(--color-light-purple);
}

.play-album-button i {
    margin-right: 5px;
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

.tracks-table {
    width: 100%;
    margin-top: 20px;
}

.tracks-table-header {
    display: grid;
    grid-template-columns: 40px 1fr 80px 60px;
    padding: 0 16px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 8px;
}

.header-item {
    color: #b3b3b3;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.header-item.title {
    margin-left: 0;
}

.header-item.duration {
    text-align: right;
}

.no-tracks {
    text-align: center;
    color: #777;
    margin-top: 20px;
}

h2 {
    color: var(--color-light-purple);
}
</style>