// server/api/spotify/token.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {const body = await readBody(event);
  
  const config = useRuntimeConfig();
  const { code } = body;
  
  console.log('[SERVER] Token request received with code:', code?.substring(0, 10) + '...');
  console.log('[SERVER] Environment check:', {
    hasClientId: !!config.public.spotifyClientId,
    hasClientSecret: !!config.spotifyClientSecret,
    redirectUri: config.public.spotifyRedirectUri
  });
  
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
    });    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        errorData = { error: 'Could not parse error response' };
      }
      
      console.error('Spotify token error:', {
        status: res.status,
        statusText: res.statusText,
        errorData,
        requestParams: {
          grantType: 'authorization_code',
          redirectUri: config.public.spotifyRedirectUri,
          hasClientId: !!config.public.spotifyClientId,
          hasClientSecret: !!config.spotifyClientSecret
        }
      });
      
      return createError({
        statusCode: res.status,
        message: errorData.error_description || `Request failed with status code ${res.status}`
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