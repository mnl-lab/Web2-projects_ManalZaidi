# Spotify Music Explorer
# deployement link: https://spotify-clone-rho-fawn-54.vercel.app/

A feature-rich Spotify client built with Nuxt 3 that allows users to explore their music, manage playlists, and enjoy a seamless music discovery experience.

⚠️**important side note:** for correction purposes, please email me or send me a message to add your spotify account in the authorized users because not everyone is allowed to log in because of the API's developement mode, thanks for undrestanding.

## ✨ Features

- **User Authentication**: Secure Spotify OAuth authentication flow
- **Music Discovery**: Browse personalized recommendations based on your listening history
- **Profile Dashboard**: View your top artists and recently played tracks
- **Playlist Management**: Create, view, and modify your Spotify playlists
- **Search**: Find your favorite songs, artists, albums, and playlists
- **Music Player**: Control music playback (Premium accounts only)
- **Album & Track Details**: View detailed information about albums and tracks

## 🔐 Environment Variables

This app requires Spotify API credentials. Create a `.env` file in the root directory with:

```bash
NUXT_SPOTIFY_CLIENT_ID=your_spotify_client_id
NUXT_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NUXT_SPOTIFY_REDIRECT_URI=your_callback_url  # e.g., http://localhost:3000/callback
```

To obtain these credentials:
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
2. Create a new application
3. Add your redirect URI in the app settings
4. Copy your Client ID and Client Secret

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or later
- Spotify account (Premium account required for playback features)
- Spotify Developer application credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/spotify-music-explorer.git
cd spotify-music-explorer
```

2. Install dependencies
```bash
npm install
```

3. Set up your environment variables as described above

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

- `components/` - Reusable Vue components (AudioPlayer, PlaylistCard, etc.)
- `composables/` - Shared logic and API integration with Spotify
- `pages/` - Application routes and views
- `server/` - Server-side API endpoints for secure token handling
- `assets/` - Stylesheets and static assets

## 🔧 Technical Details

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Authentication**: Server-side token management with secure refresh mechanism
- **Styling**: Custom CSS with responsive design
- **API Integration**: Axios for API requests with interceptors for error handling

## 📱 Screenshots

- Add some screenshots of your application here

## 🚀 Deployment

1. Build the application for production:
```bash
npm run build
```

2. Preview the production build locally:
```bash
npm run preview
```

3. Deploy to your preferred hosting provider (Vercel, Netlify, etc.)

## ⚠️ Important Notes

- Spotify Premium is required for music playback functionality
- Session handling is client-side, so users will need to log in again after their token expires
- Rate limits apply as per Spotify API guidelines

