// server/api/spotify/refresh.post.ts
export default defineEventHandler(async (event) => {  const body = await readBody(event);
  
  const config = useRuntimeConfig();
  const refreshToken = body.refresh_token;
  
  console.log('[SERVER] Refresh token request received');
  console.log('[SERVER] Environment check:', {
    hasClientId: !!config.public.spotifyClientId,
    hasClientSecret: !!config.spotifyClientSecret,
    hasRefreshToken: !!refreshToken,
  });
  
  if (!refreshToken) {
    return createError({
      statusCode: 400,
      message: 'Refresh token is required'
    });
  }

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
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
      console.error('Spotify token refresh error:', errorData);
      return createError({
        statusCode: res.status,
        message: errorData.error_description || 'Failed to refresh token'
      });
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error in /api/spotify/refresh:', err);
    return createError({
      statusCode: 500,
      message: 'Failed to refresh token'
    });
  }
});
