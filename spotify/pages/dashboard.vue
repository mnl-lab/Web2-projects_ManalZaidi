<template>
    <div class="dashboard-container">
        <navbar></navbar>
        <div class="content-container">
            <h1 class="section-title">Recommended Tracks</h1>

            <div v-if="loading" class="loading">
                <div class="spinner"></div>
                <p>Loading your recommendations...</p>
            </div>

            <div v-else-if="error" class="error-message">
                <p>{{ error }}</p>
                <button @click="loadRecommendations">Try Again</button>
            </div>

            <div v-else-if="recommendedTracks.length === 0" class="no-results">
                <p>No recommendations found. Try playing some songs on Spotify to get personalized recommendations.</p>
            </div>

            <div v-else class="tracks-grid">
                <track-card v-for="track in recommendedTracks" :key="track.id" :track="track"></track-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { fetchUserProfile, fetchRecommendedTracks } from '#imports';

const router = useRouter();
const user = ref(null);
const recommendedTracks = ref([]);
const loading = ref(true);
const error = ref(null);

const loadRecommendations = async () => {
    loading.value = true;
    error.value = null;

    try {
        recommendedTracks.value = await fetchRecommendedTracks();
        console.log('Recommended tracks:', recommendedTracks.value);
    } catch (err) {
        console.error('Error fetching recommendations:', err);
        error.value = 'Failed to load recommendations. Please try again later.';
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    try {
        user.value = await fetchUserProfile();
        console.log('User profile loaded:', user.value.display_name);
        await loadRecommendations();
    } catch (err) {
        console.error('Error initializing dashboard:', err);
        error.value = 'Failed to load your profile. Please try signing in again.';
        loading.value = false;
    }
});
</script>

<style scoped>
.dashboard-container {
    min-height: 100vh;
    background-color: var(--background-primary);
}

.content-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.section-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: var(--text-primary);
}

.tracks-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: var(--text-secondary);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.1);
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
    padding: 3rem;
    color: var(--text-secondary);
}

.error-message button {
    background-color: var(--button-primary);
    color: var(--button-text);
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.2s;
}

.error-message button:hover {
    background-color: var(--button-hover);
}
</style>