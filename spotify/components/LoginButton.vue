<template>
    <button class="btn btn-primary" @click="loginWithSpotify">Login with Spotify</button>
</template>

<script setup>
const loginWithSpotify = () => {
    const clientId = "49b1640e09494130aff858433399a770"
    // const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = 'https://93a0-197-230-122-196.ngrok-free.app/callback';
    const scopes = [
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-top-read',
        'user-read-playback-state'
    ].join(' ');

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&show_dialog=true`;
    window.location.href = authUrl;
}
</script>
