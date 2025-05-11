// server/api/spotify/token.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const config = useRuntimeConfig();
  const { code } = body;
  
  if (!code) {
    return createError({
      statusCode: 400,
      message: 'Authorization code is required'
    });
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.public.spotifyRedirectUri,
    client_id: config.public.spotifyClientId,
    client_secret: config.spotifyClientSecret,
  });

  try {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Spotify token error:', errorData);
      return createError({
        statusCode: res.status,
        message: errorData.error_description || 'Failed to get token'
      });
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error in /api/spotify/token:', err);
    return createError({
      statusCode: 500,
      message: 'Failed to get token'
    });
  }
});