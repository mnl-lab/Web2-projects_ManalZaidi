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

onMounted(async () => {
    // Ensure we're running on the client side
    if (!process.client) return;
    
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    console.log('Code received in URL:', code)
    
    try {
        if (code) {
            await getAccessToken(code)
            // No need to set token in localStorage as getAccessToken already does this
            router.replace('/dashboard')
        } else {
            console.error('No authorization code found in URL')
            router.replace('/')
        }
    } catch (error) {
        console.error('Error during authentication:', error)
        router.replace('/')
    }
})
</script>
