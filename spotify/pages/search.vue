<template>
    <div class="search-page-container">
        <navbar />
        <h1>Search Results for "{{ $route.query.q }}"</h1>



        <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Searching...</p>
        </div>

        <div v-else-if="error" class="error-message">
            <p>{{ error }}</p>
            <button @click="performSearch" class="retry-button">Try Again</button>
        </div>

        <div v-else> <!-- Tracks section -->
            <section v-if="searchResults.tracks && searchResults.tracks.items?.length > 0" class="result-section">
                <h2>Songs</h2>
                <div class="results-grid">
                    <track-card v-for="(track, index) in validTracks" :key="track.id || index" :track="track" />
                </div>
            </section>
            <!-- Artists section -->
            <section v-if="searchResults.artists && searchResults.artists.items?.length > 0" class="result-section">
                <h2>Artists</h2>
                <div class="results-grid artists-grid">
                    <div v-for="(artist, index) in validArtists" :key="artist.id || index" class="artist-card">
                        <img :src="artist.images?.[0]?.url || '/default-album.jpg'" :alt="artist.name">
                        <h3>{{ artist.name }}</h3>
                    </div>
                </div>
            </section>
            <!-- Albums section -->
            <section v-if="searchResults.albums && searchResults.albums.items?.length > 0" class="result-section">
                <h2>Albums</h2>
                <div class="results-grid">
                    <div v-for="(album, index) in validAlbums" :key="album.id || index" class="album-card"
                        @click="goToAlbum(album.id)">
                        <img :src="album.images?.[0]?.url || '/default-album.jpg'" :alt="album.name">
                        <h3>{{ album.name }}</h3>
                        <p>{{ album.artists?.[0]?.name || 'Unknown Artist' }}</p>
                    </div>
                </div>
            </section>
            <!-- Playlists section -->
            <section v-if="searchResults.playlists && searchResults.playlists.items?.length > 0" class="result-section">
                <h2>Playlists</h2>
                <div class="results-grid">
                    <playlist-card v-for="(playlist, index) in validPlaylists" :key="playlist.id || index"
                        :playlist="playlist" />
                </div>
            </section>

            <div v-if="noResults" class="no-results">
                <h2>No results found for "{{ $route.query.q }}"</h2>
                <p>Try searching for something else or check your spelling.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchSpotify } from '#imports';
import TrackCard from '~/components/TrackCard.vue';
import PlaylistCard from '~/components/PlaylistCard.vue';

const route = useRoute();
const router = useRouter();
const searchResults = ref({});
const loading = ref(true);
const error = ref(null);

const validTracks = computed(() => {
    if (!searchResults.value?.tracks?.items) return [];
    return searchResults.value.tracks.items.filter(track => track && track.id);
});

const validArtists = computed(() => {
    if (!searchResults.value?.artists?.items) return [];
    return searchResults.value.artists.items.filter(artist => artist && artist.id);
});

const validAlbums = computed(() => {
    if (!searchResults.value?.albums?.items) return [];
    return searchResults.value.albums.items.filter(album => album && album.id);
});

const validPlaylists = computed(() => {
    if (!searchResults.value?.playlists?.items) return [];
    return searchResults.value.playlists.items.filter(playlist => playlist && playlist.id);
});

const noResults = computed(() => {
    if (!searchResults.value) return true;

    return validTracks.value.length === 0 &&
        validArtists.value.length === 0 &&
        validAlbums.value.length === 0 &&
        validPlaylists.value.length === 0;
});

const performSearch = async () => {
    const query = route.query.q;
    if (!query) {
        searchResults.value = {};
        loading.value = false;
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        searchResults.value = await searchSpotify(query);
        console.log('Search results:', searchResults.value);
    } catch (err) {
        console.error('Error searching Spotify:', err);
        error.value = 'Failed to search Spotify. Please try again.';
    } finally {
        loading.value = false;
    }
};

const goToAlbum = (albumId) => {
    if (albumId) {
        router.push(`/album/${albumId}`);
    } else {
        console.error('Attempted to navigate to album with invalid ID');
    }
};

// Perform search on initial load
onMounted(() => {
    performSearch();
});

// Watch for changes in the search query parameter
watch(() => route.query.q, (newQuery) => {
    if (newQuery) {
        performSearch();
    }
});
</script>

<style scoped>
:root {
    --color-light-purple: #D3BBC1;
    --color-medium-purple: #582A40;
    --color-dark-purple: #371D33;
    --color-charcoal: #271B2C;
    --color-black: #161925;
}

.search-page-container {
    padding: 2rem;
    max-width: 100%;
    margin: 0 auto;
}

h1 {
    font-size: 2rem;
    color: var(--color-light-purple);
    margin-bottom: 2rem;
}

.result-section {
    margin-bottom: 3rem;
}

h2 {
    font-size: 1.5rem;
    color: white;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--color-medium-purple);
    padding-bottom: 0.5rem;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
}

.artists-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

.artist-card,
.album-card {
    background-color: var(--color-charcoal);
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.3s ease;
    cursor: pointer;
}

.artist-card:hover,
.album-card:hover {
    background-color: var(--color-dark-purple);
    transform: translateY(-5px);
}

.artist-card img,
.album-card img {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 0.8rem;
}

.artist-card h3,
.album-card h3 {
    font-size: 1rem;
    margin-bottom: 0.3rem;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.album-card p {
    font-size: 0.9rem;
    color: #aaa;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-top-color: var(--color-medium-purple);
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-message {
    background-color: rgba(255, 82, 82, 0.2);
    border: 1px solid #ff5252;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.retry-button {
    background-color: var(--color-medium-purple);
    color: white;
    border: none;
    padding: 0.6rem 1.5rem;
    border-radius: 4px;
    margin-top: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.retry-button:hover {
    background-color: var(--color-light-purple);
    color: var(--color-black);
}

.no-results {
    text-align: center;
    padding: 3rem;
}

.no-results h2 {
    border: none;
    color: var(--color-light-purple);
}

</style>
