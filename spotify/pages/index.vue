<template>
    <div class="login-page">
        <div class="login-container">
            <div class="logo">
                <i class="bi bi-music-note-beamed"></i>
                <h1>Sptf App</h1>
            </div>
            <p class="tagline">Discover, stream, and share your favorite music</p>
            <div class="login-area">
                <login-button />
            </div>
        </div>
    </div>
</template>

<script setup>
// No additional script needed
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

.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--color-black) 0%, var(--color-charcoal) 100%);
    padding: 2rem;
}

.login-container {
    max-width: 500px;
    width: 100%;
    text-align: center;
    padding: 3rem;
    background-color: var(--color-dark-purple);
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.logo {
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo i {
    font-size: 4rem;
    color: var(--color-light-purple);
    margin-bottom: 1rem;
}

.logo h1 {
    font-size: 2.5rem;
    color: white;
    font-weight: 700;
    margin: 0;
    letter-spacing: 1px;
}

.tagline {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 3rem;
}

.login-area {
    display: flex;
    justify-content: center;
}
</style>
