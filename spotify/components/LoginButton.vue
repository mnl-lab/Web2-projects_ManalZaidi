<template>
    <button class="login-btn" @click="loginWithSpotify">
        <span class="login-icon"><i class="bi bi-spotify"></i></span>
        <span class="login-text">Login with Spotify</span>
    </button>
</template>

<script setup>

const runtimeConfig = useRuntimeConfig();
const clientId = runtimeConfig.public.spotifyClientId || "49b1640e09494130aff858433399a770";
const redirectUri = runtimeConfig.public.spotifyRedirectUri || "https://fa24-197-230-122-196.ngrok-free.app/callback";

const loginWithSpotify = () => {
    // Clear any existing tokens before redirecting to login
    if (process.client) {
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_expires_at');
        console.log('Cleared existing tokens before login');
    }

    const scopes = [
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-top-read',
        'user-read-playback-state'
    ].join(' ');    // Always force the login dialog to appear with show_dialog=true
    // and add a state parameter with timestamp to prevent caching issues
    const uniqueState = 'state_' + Date.now();
    const AUTH_URL = `https://accounts.spotify.com/authorize`
        + `?client_id=${clientId}`
        + `&response_type=code`
        + `&redirect_uri=${encodeURIComponent(redirectUri)}`
        + `&scope=${encodeURIComponent(scopes)}`
        + `&show_dialog=true`
        + `&state=${uniqueState}`;
        
    console.log('Redirecting to Spotify login with state:', uniqueState);
    window.location.href = AUTH_URL;
}

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

.login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-medium-purple);
    color: white;
    border: none;
    border-radius: 25px;
    padding: 0.8rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.login-btn:hover {
    background-color: var(--color-light-purple);
    color: var(--color-black);
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

.login-icon {
    margin-right: 10px;
    font-size: 1.3rem;
}

.login-text {
    letter-spacing: 0.5px;
}
</style>
