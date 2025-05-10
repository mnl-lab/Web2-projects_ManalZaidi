<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Extract token from the URL hash fragment
const hash = window.location.hash
const token = new URLSearchParams(hash.substring(1)).get('access_token')

if (token) {
    const spotifyToken = useState('spotifyToken', () => token)
    localStorage.setItem('spotify_token', token)
    router.push('/') // redirect to homepage
} else {
    console.error('No token found in URL.')
}
</script>

<template>
    <div>Authenticating...</div>
</template>
