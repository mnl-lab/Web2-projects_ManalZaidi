// server/api/token.ts
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
  
    const config = useRuntimeConfig()
    const { code } = body
  
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.public.spotifyRedirectUri,
      client_id: config.public.spotifyClientId,
      client_secret: config.spotifyClientSecret,
    })
  
    try {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      })
  
      const data = await res.json()
      return data
    } catch (err) {
      console.error('Error in /api/token:', err)
      return { error: 'Failed to get token' }
    }
  })
  