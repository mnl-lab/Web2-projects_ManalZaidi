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
    const params = new URLSearchParams(window.location.search)

    console.log('Code received in URL:', params.get('code'))
    
    const accessToken = getAccessToken(params.get('code'));

    if (accessToken) {
        localStorage.setItem('spotify_token', accessToken)
        router.replace('/dashboard')
    } else {
        console.error('No access token found in redirect.')
    }
})
</script>
