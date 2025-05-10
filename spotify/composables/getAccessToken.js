const getAccessToken = async (code) => {
    try {
        const response = await axios.post(
            TOKEN_URL,
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        const expirationTime = new Date().getTime() + response.data.expires_in * 1000;

        // Save tokens to local storage
        localStorage.setItem(TOKEN_KEY, response.data.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
        localStorage.setItem(EXPIRATION_KEY, expirationTime);

        

        return response.data;
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        throw error;
    }
};
export default getAccessToken;