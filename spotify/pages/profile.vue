<template>
    <div class="container">
        <navbar />
        <div v-if="loading">
            <div class="loading-spinner"></div>
            <p>Loading...</p>
        </div>
        <div v-else-if="error" class="error-message">
            <p>{{ error.message }}</p>
            <button @click="window.location.reload()" class="retry-button">Try Again</button>
        </div>
        <div v-else>
            <div class="profile-info">
                <img :src="userProfile?.images?.[0]?.url || '/defaultpfp.jpg'" alt="Profile Picture"
                    class="profile-pic" />
                <div class="text-info">
                    <h1>{{ userProfile?.display_name }}</h1>
                    <p>Followers: {{ userProfile?.followers?.total }}</p>
                    <p>Country: {{ userProfile?.country }}</p>
                    
                </div>
            </div>

            <div class="top-artists">
                <h2>Top Artists</h2>
                <div class="artists-grid">
                    <div v-for="(artist, index) in topArtists" :key="artist.id || index" class="artist-card">
                        <img :src="artist.images?.[0]?.url || '/default-album.jpg'" :alt="artist.name"
                            class="artist-image">
                        <h5>{{ artist.name }}</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchUserProfile, fetchTopArtists } from '#imports';

const route = useRoute();
const userProfile = ref(null);
const topArtists = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    loading.value = true;
    error.value = null;
    try {
        userProfile.value = await fetchUserProfile();
        topArtists.value = await fetchTopArtists();
        if (!userProfile.value || !topArtists.value) {
            throw new Error('Failed to fetch user profile or top artists');
        }
    } catch (err) {
        error.value = err;
    } finally {
        loading.value = false;
    }
});

</script>

<style scoped>
.container {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    text-align: center;
}

.loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--color-light-purple);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-message {
    color: red;
    font-weight: bold;
}

.retry-button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.retry-button:hover {
    background-color: #2980b9;
}

.profile-info {
    margin-bottom: 30px;
    background-color:var(--color-charcoal) ;
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 20px;
    padding-left: 10%;
    padding-right: 10%;
    width: 100%;
}
.text-info {
    margin-left: 20px;
    color: #2c3e50;
}

.profile-pic {
    border-radius: 50%;
    width: 150px;
    height: 150px;
    object-fit: cover;
    margin-bottom: 20px;
}

.top-artists {
    margin-top: 40px;
}

.artists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    border: 1px solid var(--color-dark-purple);
    border-radius: 5px;
}

.artist-card {
    text-align: center;
    padding: 10px;
    /* border: 1px solid #ddd;
    border-radius: 50%; */
    transition: transform 0.2s;
}

.artist-card:hover {
    transform: scale(1.05);
}

.artist-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
}

h1, h2 {
    color: var(--color-light-purple);
}

p, h5 {
    color: #7f8c8d;
}
</style>