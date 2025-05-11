// plugins/axios.js
import { setupAxiosInterceptors } from '~/composables/apiErrorInterceptor'

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client-side
  if (process.client) {
    setupAxiosInterceptors()
  }
})
