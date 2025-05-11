<template>
    <div class="navbar-container">
        <div class="navbar-left">
            <button class="home-button" @click="$router.push('/')">
                <i class="bi bi-house-door-fill"></i>
            </button>
        </div>
        <div class="search-container">
            <input type="text" placeholder="Search for songs, artists, albums..." v-model="searchQuery"
                @keyup.enter="search" class="search-input" />
            <button class="search-button" @click="search">
                <i class="bi bi-search"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { fetchUserProfile, searchSpotify, createPlaylist } from '#imports';
const router = useRouter();

const user = ref(null);
const searchQuery = ref('');

const search = () => {
    if (searchQuery.value.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`);
        searchQuery.value = '';
    }
}

onMounted(async () => {
    user.value = await fetchUserProfile();
});
</script>

<style scoped>
:root {
    /* Spotify Color Palette */
    --color-light-purple: #D3BBC1;
    --color-medium-purple: #582A40;
    --color-dark-purple: #371D33;
    --color-charcoal: #271B2C;
    --color-black: #161925;
}

.navbar-container {
    display: flex;
    align-items: center;
    padding: 0.8rem 1.5rem;
    background-color: var(--color-black);
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.navbar-left {
    margin-right: 1rem;
}

.home-button {
    background: var(--color-charcoal);
    border: none;
    color: #ffffff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.home-button:hover {
    background-color: var(--color-medium-purple);
    transform: scale(1.05);
}

.search-container {
    display: flex;
    align-items: center;
    flex: 1;
    max-width: 400px;
    position: relative;
    border-radius: 20px;
    background-color: var(--color-charcoal);
    overflow: hidden;
    border: 1px solid var(--color-dark-purple);
}

.search-input {
    flex: 1;
    border: none;
    padding: 0.7rem 1rem;
    background-color: transparent;
    color: white;
    font-size: 0.9rem;
    width: 100%;
    outline: none;
}

.search-input::placeholder {
    color: #aaaaaa;
}

.search-button {
    background: var(--color-medium-purple);
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    transition: all 0.2s ease;
}

.search-button:hover {
    background-color: var(--color-light-purple);
    color: var(--color-black);
}
</style>