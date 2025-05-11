<template>
    <div class="navbar-container">
        <div class="navbar-left">
            <button class="home-button" @click="$router.push('/dashboard')">
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
        <div class="profile">
            <img :src="user?.images?.[0]?.url || '/defaultpfp.jpg'" alt="Profile Picture" class="profile-pic"
                @click="goToProfile" />
            <div class="profile-name" @click="goToProfile">{{ user?.display_name }}</div>
        </div>
        <div class="logout">
            <button class="logout-button" @click="logout">
                <i class="bi bi-box-arrow-right"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { fetchUserProfile, searchSpotify } from '#imports';
const router = useRouter();

const user = ref(null);
const searchQuery = ref('');

const search = () => {
    router.push({
        path: '/search',
        query: { q: searchQuery.value.trim() }
    });
}

onMounted(async () => {
    if (process.client) {
        try {
            user.value = await fetchUserProfile();
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // Handle error gracefully
        }
    }
});
const goToProfile = () => {
    router.push('/profile');
}

const logout = () => {
    if (process.client) {
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_expires_at');
    }
    router.push('/');
}
</script>

<style scoped>
:root {
    --color-light-purple: #D3BBC1;
    --color-medium-purple: #582A40;
    --color-dark-purple: #371D33;
    --color-charcoal: #271B2C;
    --color-black: #161925;
}

.navbar-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background-color: var(--color-black);
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    gap: 1.5rem;
    width: 100%;

    right: 0;
    top: 0;
    z-index: 1000;
    margin-bottom: 1rem;
}

.navbar-left {
    margin-right: 1.5rem;
}

.home-button {
    background: var(--color-charcoal);
    border: none;
    color: #ffffff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.7rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.home-button:hover {
    background-color: var(--color-medium-purple);
    transform: scale(1.1);
}

.search-container {
    display: flex;
    align-items: center;
    flex: 1;
    max-width: 500px;
    position: relative;
    border-radius: 20px;
    background-color: var(--color-charcoal);
    overflow: hidden;
    border: 1px solid var(--color-dark-purple);
    margin: 0 1rem;
}

.search-input {
    flex: 1;
    border: none;
    padding: 0.8rem 1rem;
    background-color: transparent;
    color: white;
    font-size: 1rem;
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
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    transition: all 0.2s ease;
}

.search-button:hover {
    background-color: var(--color-light-purple);
    color: var(--color-black);
}

.profile {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--color-medium-purple);
}

.profile-pic:hover {
    cursor: pointer;
    transform: scale(1.05);
    transition: all 0.2s ease;
}

.profile-name {
    font-size: 1rem;
    font-weight: bold;
    color: var(--color-light-purple);
}

.profile-name:hover {
    cursor: pointer;
    text-decoration: underline;
}

.logout {
    margin-left: 1rem;
}

.logout-button {
    background: var(--color-charcoal);
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.6rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.logout-button:hover {
    background-color: var(--color-medium-purple);
    transform: scale(1.1);
}
</style>