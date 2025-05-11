import axios from 'axios'


const TOKEN_URL     = 'https://accounts.spotify.com/api/token'
const CLIENT_ID     = '49b1640e09494130aff858433399a770'
const CLIENT_SECRET = import.meta.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI  = 'https://fa24-197-230-122-196.ngrok-free.app/callback'

export async function getAccessToken(code) {
  console.log('TOKEN →', { code, REDIRECT_URI, CLIENT_ID, CLIENT_SECRET })
  try {
    const { data } = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        grant_type:    'authorization_code',
        code,
        redirect_uri:  REDIRECT_URI,
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    const expiresAt = Date.now() + data.expires_in * 1000
    localStorage.setItem('spotify_token',         data.access_token)
    localStorage.setItem('spotify_refresh_token', data.refresh_token)
    localStorage.setItem('spotify_expires_at',    expiresAt)
    return data
  } catch (error) {
    if (error.response) {
      console.error('💥 Spotify replied:', error.response.status, error.response.data)
    } else {
      console.error('Network or CORS error:', error)
    }
    throw error
  }
}

export default getAccessToken
