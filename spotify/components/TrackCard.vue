<template>
    <div class="track-card">
        <div class="track-image">
            <img :src="track.album.images[0]?.url || '/default-album.jpg'" alt="Album Cover"
                @click="navigateToTrackAlbum" />
            <div class="play-overlay" @click.stop="playThisTrack">
                <i class="bi bi-play-fill"></i>
            </div>
        </div>
        <div class="track-info">
            <h3 class="track-name">{{ track.name }}</h3>
            <p class="track-artist">{{ track.artists[0].name }}</p>
            <p class="track-album">{{ track.album.name }}</p>
            <div class="track-actions">
                <div class="dropdown-wrapper">
                    <button class="menu-btn" @click.stop.prevent="toggleDropdown">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>

                    <!-- Main Dropdown Menu -->
                    <div class="menu-content" v-if="showPlaylistOptions">
                        <!-- Add to playlist submenu -->
                        <div v-if="showAddToPlaylist" class="submenu">
                            <div class="submenu-header">
                                <p>Add to playlist:</p>
                            </div>
                            <div v-if="loadingPlaylists" class="menu-item loading">
                                Loading playlists...
                            </div>
                            <div v-else-if="userPlaylists.length === 0" class="menu-item empty">
                                No playlists found
                            </div>
                            <div v-else class="scrollable-area">
                                <button v-for="playlist in userPlaylists" :key="playlist.id"
                                    @click.stop.prevent="addToPlaylist(playlist.id, playlist.name)" class="menu-item">
                                    {{ playlist.name }}
                                </button>
                            </div>
                            <button @click.stop.prevent="showAddToPlaylist = false" class="back-button">
                                <i class="bi bi-arrow-left"></i> Back
                            </button>
                        </div>

                        <!-- Remove from playlist confirmation -->
                        <div v-else-if="showRemoveFromPlaylist" class="submenu">
                            <div class="submenu-header">
                                <p>Remove from playlist?</p>
                            </div>
                            <div class="confirm-buttons">
                                <button @click.stop.prevent="confirmRemoveFromPlaylist" class="confirm-button yes">
                                    Yes, remove
                                </button>
                                <button @click.stop.prevent="showRemoveFromPlaylist = false" class="confirm-button no">
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <!-- Main menu options -->
                        <div v-else class="main-menu">
                            <button @click.stop.prevent="openAddToPlaylist" class="menu-item">
                                <i class="bi bi-plus-circle"></i> Add to playlist
                            </button>
                            <button v-if="currentPlaylistId" @click.stop.prevent="openRemoveFromPlaylist"
                                class="menu-item">
                                <i class="bi bi-dash-circle"></i> Remove from playlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="toast-container" v-if="toastVisible">
            <div class="toast" :class="{ 'toast-success': !toastIsError, 'toast-error': toastIsError }">
                {{ toastMessage }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted, defineEmits, inject, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchTrackInfo, fetchUserPlaylists, addTrackToPlaylist, removeTrackFromPlaylist, playTrack as spotifyPlayTrack } from '#imports';
import { usePlayerStore } from '~/composables/usePlayerStore';

const props = defineProps({
    track: {
        type: Object,
        required: true
    },
    currentPlaylistId: {
        type: String,
        default: ''
    }
});

// Try to get current playlist ID from route if not provided in props
const route = useRoute();
const currentPlaylistId = ref(props.currentPlaylistId ||
    (route.path.includes('/playlists/') ? route.params.id : null));

const emit = defineEmits(['track-removed', 'track-added']);
const trackInfo = ref(null);
const router = useRouter();
const userPlaylists = ref([]);
const loadingPlaylists = ref(false);
const showPlaylistOptions = ref(false);
const showAddToPlaylist = ref(false);
const showRemoveFromPlaylist = ref(false);

// Toast notification
const toastVisible = ref(false);
const toastMessage = ref('');
const toastIsError = ref(false);

const navigateToTrackAlbum = () => {
    // Navigate to the album page
    if (trackInfo.value && trackInfo.value.album && trackInfo.value.album.id) {
        router.push(`/album/${trackInfo.value.album.id}`);
    } else if (props.track.album && props.track.album.id) {
        router.push(`/album/${props.track.album.id}`);
    }
}

// Get player store
const playerStore = usePlayerStore();

// Play this track
const playThisTrack = async (event) => {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Construct the track URI
    const trackUri = `spotify:track:${props.track.id}`;
    // Use the global player store to play this track
    playerStore.playTrack(trackUri);

    // Also call the actual Spotify API function
    const success = await spotifyPlayTrack(trackUri);
    if (!success) {
        showToast('Failed to play track. Make sure a Spotify device is active.', true);
    }
};

const toggleDropdown = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Toggle the dropdown visibility
    showPlaylistOptions.value = !showPlaylistOptions.value;

    if (showPlaylistOptions.value) {
        // Reset sub-menus when opening dropdown
        showAddToPlaylist.value = false;
        showRemoveFromPlaylist.value = false;

        // Position the dropdown relative to the button
        // We need to wait for Vue to render the dropdown first
        setTimeout(() => {
            const button = event.target.closest('.menu-btn');
            const menuContent = document.querySelector('.menu-content');

            if (button && menuContent) {
                const buttonRect = button.getBoundingClientRect();                // Position the dropdown above the button instead of below
                // Calculate the menu height to position it properly
                const menuHeight = menuContent.offsetHeight || 200; // Default height if not measurable yet
                menuContent.style.top = `${buttonRect.top - menuHeight - 10}px`; // Place above with 10px gap
                menuContent.style.right = `${window.innerWidth - buttonRect.right}px`;
            }
        }, 0);
    }
}

const openAddToPlaylist = async () => {
    showAddToPlaylist.value = true;
    loadingPlaylists.value = true;

    try {
        userPlaylists.value = await fetchUserPlaylists();
        // Filter out the current playlist if we're viewing one
        if (currentPlaylistId.value) {
            userPlaylists.value = userPlaylists.value.filter(p => p.id !== currentPlaylistId.value);
        }
    } catch (error) {
        console.error('Error fetching user playlists:', error);
        showToast('Failed to load your playlists', true);
    } finally {
        loadingPlaylists.value = false;
    }
}

const openRemoveFromPlaylist = () => {
    showRemoveFromPlaylist.value = true;
}

const addToPlaylist = async (playlistId, playlistName) => {
    try {
        // Construct the Spotify URI from track ID
        const trackUri = `spotify:track:${props.track.id}`;
        await addTrackToPlaylist(playlistId, trackUri);
        showToast(`Added to "${playlistName}"`, false);
        emit('track-added', { trackId: props.track.id, playlistId });
        alert(`Added to "${playlistName}"`);
    } catch (error) {
        console.error('Error adding track to playlist:', error);
        showToast('Failed to add track to playlist', true);
    } finally {
        showAddToPlaylist.value = false;
        showPlaylistOptions.value = false;
    }
}

const confirmRemoveFromPlaylist = async () => {
    if (!currentPlaylistId.value) return;

    try {
        // Construct the Spotify URI from track ID
        const trackUri = `spotify:track:${props.track.id}`;
        await removeTrackFromPlaylist(currentPlaylistId.value, trackUri);
        showToast('Track removed from playlist', false);
        emit('track-removed', props.track.id);
    } catch (error) {
        console.error('Error removing track from playlist:', error);
        showToast('Failed to remove track from playlist', true);
    } finally {
        showRemoveFromPlaylist.value = false;
        showPlaylistOptions.value = false;
    }
}

const showToast = (message, isError = false) => {
    toastMessage.value = message;
    toastIsError.value = isError;
    toastVisible.value = true;

    // Hide toast after 3 seconds
    setTimeout(() => {
        toastVisible.value = false;
    }, 3000);
}

// Close dropdown when clicking outside
const clickOutsideHandler = (event) => {
    if (showPlaylistOptions.value &&
        !event.target.closest('.menu-content') &&
        !event.target.closest('.menu-btn')) {
        showPlaylistOptions.value = false;
        showAddToPlaylist.value = false;
        showRemoveFromPlaylist.value = false;
    }
};

onMounted(async () => {
    // Only run on client-side
    if (process.client) {
        try {
            trackInfo.value = await fetchTrackInfo(props.track.id);
            // Add event listener for closing dropdown
            document.addEventListener('click', clickOutsideHandler);
        } catch (error) {
            console.error('Error fetching track info:', error);
        }
    }
});

// Clean up event listener
onUnmounted(() => {
    // Only run on client-side
    if (process.client) {
        document.removeEventListener('click', clickOutsideHandler);
    }
});
</script>

<style scoped>
.track-card {
    position: relative;
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

/* Dropdown menu and actions */
.track-actions {
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
    position: relative;

}

/* Dropdown Wrapper */
.dropdown-wrapper {
    position: relative;
    display: inline-block;
    z-index: 100;

}

/* Menu Button */
.menu-btn {
    background-color: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 50%;
    transition: all 0.2s;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-btn:hover {
    color: var(--text-primary);
    background-color: rgba(255, 255, 255, 0.1);
}

.menu-btn:active {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(0.95);
}

/* Menu Content */
.menu-content {
    position: fixed;
    /* Use fixed positioning instead of absolute */
    min-width: 220px;
    background-color: #333;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.8);
    border-radius: 4px;
    z-index: 9999;
    overflow: hidden;
    transform-origin: top right;
    animation: scaleIn 0.15s ease;
    margin-bottom: 50px;
}

/* Submenu Header */
.submenu-header {
    padding: 12px 16px 8px;
    font-weight: 600;
    color: #d1d1d1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin: 0;
    font-size: 14px;
}

.submenu-header p {
    margin: 0;
}

/* Menu Items */
.menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    text-align: left;
    border: none;
    background-color: transparent;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 14px;
}

.menu-item:hover {
    background-color: #5a429b;
}

.menu-item.loading,
.menu-item.empty {
    padding: 12px 16px;
    color: #b3b3b3;
    font-style: italic;
    cursor: default;
}

.menu-item.loading:hover,
.menu-item.empty:hover {
    background-color: transparent;
}

/* Scrollable Area */
.scrollable-area {
    max-height: 220px;
    overflow-y: auto;
}

/* Back Button */
.back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    text-align: left;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background-color: transparent;
    color: #b3b3b3;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
}

.back-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
}

/* Confirmation buttons */
.confirm-buttons {
    display: flex;
    padding: 10px;
    gap: 8px;
}

.confirm-button {
    flex: 1;
    padding: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s;
}

.confirm-button.yes {
    background-color: rgba(220, 53, 69, 0.7);
    color: white;
}

.confirm-button.yes:hover {
    background-color: rgba(220, 53, 69, 0.9);
}

.confirm-button.no {
    background-color: rgba(73, 80, 87, 0.5);
    color: white;
}

.confirm-button.no:hover {
    background-color: rgba(73, 80, 87, 0.7);
}

/* Toast notification */
.toast-container {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
}

.toast {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 0.9rem;
    animation: fadeInOut 3s ease-in-out;
    white-space: nowrap;
}

.toast-success {
    background-color: rgba(40, 167, 69, 0.9);
    color: white;
}

.toast-error {
    background-color: rgba(220, 53, 69, 0.9);
    color: white;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    10% {
        opacity: 1;
        transform: translateY(0);
    }

    90% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(-10px);
    }
}

@keyframes scaleIn {
    0% {
        opacity: 0;
        transform: scale(0.9);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>