<template>
    <div class="dashboard-container">
        <navbar></navbar>
        <div class="content-container">
            <!-- Add Playlist Section -->
            <add-playlist @playlist-created="refreshPlaylists" />

            <!-- Recommended Tracks Section -->
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">Recommended Tracks</h2>

                </div>

                <div v-if="loadingTracks" class="loading">
                    <div class="spinner"></div>
                    <p>Loading your recommendations...</p>
                </div>

                <div v-else-if="trackError" class="error-message">
                    <p>{{ trackError }}</p>
                    <button @click="loadRecommendations">Try Again</button>
                </div>

                <div v-else-if="recommendedTracks.length === 0" class="no-results">
                    <p>No recommendations found. Try playing some songs on Spotify to get personalized recommendations.
                    </p>
                </div>

                <div v-else class="scrollable-container">
                    <div class="tracks-grid">
                        <track-card v-for="track in recommendedTracks" :key="track.id" :track="track"></track-card>
                    </div>
                </div>
            </div>

            <!-- User Playlists Section -->
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">Your Playlists</h2>
                    
                </div>

                <div v-if="loadingPlaylists" class="loading">
                    <div class="spinner"></div>
                    <p>Loading your playlists...</p>
                </div>

                <div v-else-if="playlistError" class="error-message">
                    <p>{{ playlistError }}</p>
                    <button @click="loadPlaylists">Try Again</button>
                </div>

                <div v-else-if="userPlaylists.length === 0" class="no-results">
                    <p>You don't have any playlists yet. Create one to get started!</p>
                </div>

                <div v-else class="scrollable-container">
                    <div class="playlists-grid">
                        <playlist-card v-for="playlist in userPlaylists" :key="playlist.id"
                            :playlist="playlist"></playlist-card>
                    </div>
                </div>
            </div>

           
        </div>
        <!-- <div v-if="accessToken">
            <audio-player :accessToken="accessToken"></audio-player>

        </div> -->
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import {
    fetchUserProfile,
    fetchRecommendedTracks,
    fetchUserPlaylists,
    getStoredAccessToken
} from '#imports';
import { logAuthEvent } from '~/composables/useAuthDebug';

const router = useRouter();
const user = ref(null);
const accessToken = ref(null);

// Delayed token validation function
const validateToken = () => {
    if (!process.client) return true;
    
    logAuthEvent('dashboard_token_check');
    accessToken.value = getStoredAccessToken();
    
    if (!accessToken.value) {
        logAuthEvent('dashboard_no_token_found');
        console.warn('No access token found, redirecting to login');
        // Clear any lingering tokens
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_expires_at');
        router.push('/');
        return false;
    } else {
        const tokenPreview = accessToken.value.substring(0, 10) + '...';
        logAuthEvent('dashboard_token_found', { tokenPreview });
        console.log('Access token available:', !!accessToken.value);
        return true;
    }
}

// Wait a bit to check token to ensure any token clearing has happened
setTimeout(() => validateToken(), 100);

// Tracks
const recommendedTracks = ref([]);
const loadingTracks = ref(true);
const trackError = ref(null);

// Playlists
const userPlaylists = ref([]);
const loadingPlaylists = ref(true);
const playlistError = ref(null);

// Clear all authentication tokens and redirect to login
const clearAuthAndRedirect = () => {
    if (process.client) {
        console.log('Clearing auth tokens due to authentication error');
        localStorage.clear(); // Clear ALL localStorage to ensure clean state
        
        // Add a delay before redirect to ensure tokens are cleared
        setTimeout(() => {
            logAuthEvent('redirecting_to_login_after_clearing');
            router.push('/');
        }, 300);
    }
};

const loadRecommendations = async () => {
    loadingTracks.value = true;
    trackError.value = null;

    try {
        recommendedTracks.value = await fetchRecommendedTracks();
        console.log('Recommended tracks loaded:', recommendedTracks.value.length);
    } catch (err) {
        console.error('Error fetching recommendations:', err);
        trackError.value = 'Failed to load recommendations. Please try again later.';
        
        // Handle 403 Forbidden - likely an authentication issue
        if (err.response && err.response.status === 403) {
            trackError.value = 'Authentication error. Please sign in again.';
            clearAuthAndRedirect();
        }
    } finally {
        loadingTracks.value = false;
    }
};

const loadPlaylists = async () => {
    loadingPlaylists.value = true;
    playlistError.value = null;

    try {
        userPlaylists.value = await fetchUserPlaylists();
        console.log('User playlists loaded:', userPlaylists.value.length);
    } catch (err) {
        console.error('Error fetching playlists:', err);
        playlistError.value = 'Failed to load playlists. Please try again later.';
        
        // Handle 403 Forbidden - likely an authentication issue
        if (err.response && err.response.status === 403) {
            playlistError.value = 'Authentication error. Please sign in again.';
            clearAuthAndRedirect();
        }
    } finally {
        loadingPlaylists.value = false;
    }
};

const refreshPlaylists = (newPlaylist) => {
    // Add the newly created playlist to the top of the list
    if (newPlaylist) {
        userPlaylists.value = [newPlaylist, ...userPlaylists.value];
    } else {
        loadPlaylists();
    }
};

onMounted(async () => {
    // Skip initialization on server-side rendering
    if (!process.client) return;

    logAuthEvent('dashboard_mounted');
    
    try {
        // Validate token
        if (!validateToken()) {
            logAuthEvent('dashboard_token_validation_failed');
            return;
        }

        // Load user profile
        logAuthEvent('dashboard_loading_profile');
        try {
            user.value = await fetchUserProfile();
            logAuthEvent('dashboard_profile_loaded', { 
                username: user.value?.display_name,
                userId: user.value?.id 
            });
            console.log('User profile loaded:', user.value?.display_name);
        } catch (err) {
            console.error('Error fetching user profile:', err);
            logAuthEvent('dashboard_profile_error', { 
                status: err.response?.status,
                message: err.message 
            });
            
            if (err.response && err.response.status === 403) {
                console.error('Authentication error (403). Clearing tokens and redirecting to login.');
                logAuthEvent('dashboard_auth_error_403');
                clearAuthAndRedirect();
                return; // Stop further execution
            }
            throw err; // Re-throw for the outer catch block
        }        // Only proceed if we successfully loaded the user profile
        if (user.value && user.value.id) {
            logAuthEvent('user_profile_loaded_successfully', { userId: user.value.id });
            
            // Load all data in parallel
            await Promise.all([
                loadRecommendations(),
                loadPlaylists()
            ]);
        } else {
            logAuthEvent('skip_loading_data_no_user_profile');
            console.warn('Skipping data loading because user profile was not loaded');
        }
    } catch (err) {
        console.error('Error initializing dashboard:', err);
        trackError.value = 'Failed to load your profile. Please try signing in again.';
        loadingTracks.value = false;
    }
});
</script>

<style scoped>
.dashboard-container {
    min-height: 100vh;
    background-color: var(--background-primary);
    background-image: linear-gradient(180deg, rgba(40, 30, 50, 0.6) 0%, rgba(18, 18, 23, 0) 30%);
}

.content-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem 2rem;
}

.section {
    margin-bottom: 2.5rem;
    position: relative;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
}

.section-link {
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 600;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.8;
}

.section-link:hover {
    color: var(--text-primary);
    opacity: 1;
    transform: scale(1.02);
}

.scrollable-container {
    overflow-x: auto;
    padding-bottom: 15px;
    margin-bottom: 5px;
    /* Hide scrollbar but keep functionality */
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.scrollable-container::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}

/* Only show scrollbar on hover for better aesthetics */
.section:hover .scrollable-container {
    scrollbar-width: thin;
    scrollbar-color: var(--color-dark-purple) var(--color-black);
    -ms-overflow-style: auto;
}

.section:hover .scrollable-container::-webkit-scrollbar {
    display: block;
    height: 6px;
}

.section:hover .scrollable-container::-webkit-scrollbar-track {
    background: var(--color-black);
    border-radius: 5px;
}

.section:hover .scrollable-container::-webkit-scrollbar-thumb {
    background-color: var(--color-dark-purple);
    border-radius: 5px;
}

.tracks-grid,
.playlists-grid,
.albums-grid {
    display: flex;
    gap: 15px;
    padding-bottom: 5px;
    min-width: max-content;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: var(--text-secondary);
}

.spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border-top-color: var(--color-light-purple);
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-message,
.no-results {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin-bottom: 1rem;
}

.error-message button {
    background-color: var(--color-medium-purple);
    color: var(--color-white);
    border: none;
    padding: 0.6rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.2s;
}

.error-message button:hover {
    transform: scale(1.04);
    background-color: var(--color-light-purple);
    color: var(--color-black);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .content-container {
        padding: 1rem;
    }

    .section-title {
        font-size: 1.5rem;
    }

    .tracks-grid,
    .playlists-grid,
    .albums-grid {
        gap: 15px;
    }
}

@media (min-width: 1200px) {

    /* For large screens, allow multiple rows in the non-scrolling view */
    .tracks-grid,
    .playlists-grid {
        flex-wrap: wrap;
        min-width: auto;
    }

    .scrollable-container {
        overflow-x: visible;
    }
}
</style>