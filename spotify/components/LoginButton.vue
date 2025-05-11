<template>
    <button class="btn btn-primary" @click="loginWithSpotify">Login with Spotify</button>
</template>

<script setup>

const loginWithSpotify = () => {
    const clientId = "49b1640e09494130aff858433399a770"
    const redirectUri = "https://fa24-197-230-122-196.ngrok-free.app/callback"
    const scopes = [
        "user-read-private",
        "user-read-email",
        "playlist-read-private",
        "playlist-modify-public",
        "playlist-modify-private",
        "user-top-read",
        "user-read-playback-state"
    ]

    
    const params = new URLSearchParams()
    params.append("client_id", clientId)
    params.append("response_type", "code")
    params.append("redirect_uri", redirectUri)
    params.append("show_dialog", "true")

    // Append each scope separately
    scopes.forEach(s => params.append("scope", s))

    // Navigate to Spotify's authorize endpoint
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
}

</script>
