import { getAuthLogs } from '~/composables/useAuthDebug'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('authDebug', {
    getAuthLogs
  })
})
