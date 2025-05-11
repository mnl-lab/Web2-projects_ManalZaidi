// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  pages: true,
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    '~/assets/css/main.css'
  ],
  vite: {
    server: {
      allowedHosts: ['fa24-197-230-122-196.ngrok-free.app']
    }
  },
  runtimeConfig: {
    spotifyClientSecret: process.env.NUXT_SPOTIFY_CLIENT_SECRET, // server only
    public: {
      spotifyClientId: process.env.NUXT_SPOTIFY_CLIENT_ID,
      spotifyRedirectUri: process.env.NUXT_SPOTIFY_REDIRECT_URI,
    }
  }
})