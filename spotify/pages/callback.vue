<template>
    <div class="auth-container">
        <h2>Spotify Authentication</h2>
        <div class="auth-status">{{ authStatus }}</div>

        <button v-if="!showDebugInfo" @click="toggleDebugInfo" class="debug-button">Show Debug Info</button>
        <button v-else @click="toggleDebugInfo" class="debug-button">Hide Debug Info</button>

        <div v-if="showDebugInfo" class="debug-info">
            <div v-for="(item, index) in $authDebug?.getAuthLogs()" :key="index">
                {{ item.timestamp }} | {{ item.event }}
                <template v-if="item.details">
                    : {{ JSON.stringify(item.details) }}
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAccessToken } from '#imports'
import { logAuthEvent, clearAuthLogs } from '~/composables/useAuthDebug'

const router = useRouter()
const authStatus = ref('Processing authentication...')
const showDebugInfo = ref(false)

onMounted(async () => {
    // Ensure we're running on the client side
    if (!process.client) return;

    // Clear previous debug logs when starting a new auth flow
    clearAuthLogs()
    logAuthEvent('callback_mounted')

    // Extract code from URL
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const truncatedCode = code ? code.substring(0, 10) + '...' : 'null'
    logAuthEvent('code_from_url', { code: truncatedCode })

    try {
        if (code) {
            // IMPORTANT: Delete all tokens from localStorage first
            logAuthEvent('clearing_tokens_before_auth')
            localStorage.clear() // Clear ALL localStorage to ensure clean state

            // Small delay to ensure tokens are cleared
            await new Promise(resolve => setTimeout(resolve, 50))

            // Get fresh tokens
            authStatus.value = 'Getting access token...'
            await getAccessToken(code)
            logAuthEvent('token_exchange_successful')
            // Verify tokens were actually stored
            const hasAccessToken = !!localStorage.getItem('spotify_token')
            const hasRefreshToken = !!localStorage.getItem('spotify_refresh_token')
            const expiresAt = localStorage.getItem('spotify_expires_at')

            logAuthEvent('token_storage_verified', {
                hasAccessToken,
                hasRefreshToken,
                expiresAt: expiresAt ? new Date(parseInt(expiresAt)).toISOString() : null,
                timeLeft: expiresAt ? Math.floor((parseInt(expiresAt) - Date.now()) / 1000) + ' seconds' : 'unknown'
            })

            console.log('Token storage check:', {
                hasAccessToken,
                hasRefreshToken,
                expiresAt: expiresAt ? new Date(parseInt(expiresAt)).toISOString() : null
            })
            // Let's run a token verification first
            authStatus.value = 'Verifying token...'

            // Check if token was properly stored
            const storedToken = localStorage.getItem('spotify_token')
            if (!storedToken) {
                throw new Error('Token was not properly stored');
            }

            // Navigate to dashboard only after verification
            authStatus.value = 'Success! Redirecting to dashboard...'

            // Use a timeout to give localStorage time to fully update
            setTimeout(() => {
                logAuthEvent('navigating_to_dashboard')
                router.push('/dashboard')
            }, 500)
        } else {
            const errorMsg = 'No authorization code found in URL'
            console.error(errorMsg)
            logAuthEvent('error_no_code')
            authStatus.value = errorMsg
            setTimeout(() => router.push('/'), 2000)
        }
    } catch (error) {
        const errorMsg = `Error during authentication: ${error.message}`
        console.error(errorMsg, error)
        logAuthEvent('auth_error', { message: error.message })
        authStatus.value = errorMsg
        showDebugInfo.value = true
        // Don't redirect immediately on error to allow seeing the debug info
    }
})

function toggleDebugInfo() {
    showDebugInfo.value = !showDebugInfo.value
}
</script>

<style scoped>
.auth-container {
    max-width: 600px;
    margin: 100px auto;
    padding: 2rem;
    background-color: rgba(25, 20, 30, 0.8);
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    text-align: center;
}

.auth-status {
    margin: 2rem 0;
    font-size: 1.2rem;
    color: #fff;
}

.debug-button {
    padding: 0.5rem 1rem;
    background-color: #333;
    color: #ccc;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    margin-top: 2rem;
}

.debug-info {
    margin-top: 1rem;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    text-align: left;
    color: #ccc;
    font-family: monospace;
    white-space: pre-wrap;
    font-size: 0.8rem;
    max-height: 300px;
    overflow-y: auto;
}
</style>
