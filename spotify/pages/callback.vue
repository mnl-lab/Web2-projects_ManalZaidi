<template>
    <div class="p-4">
        <h2>Logging in...</h2>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAccessToken } from '#imports'

const router = useRouter()

onMounted(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)

    
    const accessToken = getAccessToken(params.get('code'));

    if (accessToken) {
        localStorage.setItem('spotify_token', accessToken)
        router.push('/dashboard')
    } else {
        console.error('No access token found in redirect.')
    }
})
</script>
