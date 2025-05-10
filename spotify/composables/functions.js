function getToken() {
    const token = localStorage.getItem('spotify_token')
    if (!token) throw new Error('No Spotify token found')
    return token
}
  
function getUserProfile() {
    const token = getToken()
    const response =  fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })

}

function getUserPlaylists() {
    const token = getToken()
    const response =  fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
}
function getPlaylistTracks(playlistId) {
    const token = getToken()
    const response =  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
}
function getTrackDetails(trackId) {
    const token = getToken()
    const response =  fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
}