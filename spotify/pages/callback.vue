<template>
    <div class="p-4">
        <h2>Logging in...</h2>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)

    const getAccessToken = async (code) => {
        try {
            const response = await axios.post(
                TOKEN_URL,
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: REDIRECT_URI,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            const expirationTime = new Date().getTime() + response.data.expires_in * 1000;

            // Save tokens to local storage
            localStorage.setItem(TOKEN_KEY, response.data.access_token);
            localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
            localStorage.setItem(EXPIRATION_KEY, expirationTime);

            // After successful login, fetch the user data and save to localStorage
            const userProfile = await getCurrentUserProfile();
            localStorage.setItem('user', JSON.stringify(userProfile));

            return response.data;
        } catch (error) {
            console.error('Error exchanging code for token:', error);
            throw error;
        }
    };

    const accessToken = getAccessToken(params.get('code'));

    if (accessToken) {
        localStorage.setItem('spotify_token', accessToken)
        router.push('/dashboard')
    } else {
        console.error('No access token found in redirect.')
    }
})
</script>
