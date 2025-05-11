<template>
    <div class="add-playlist-container">
        <h2>Create New Playlist</h2>
        <div class="form-group">
            <input type="text" v-model="playlistName" placeholder="Playlist name" class="input-field" />
            <input type="text" v-model="playlistDescription" placeholder="Description (optional)" class="input-field" />
            <button @click="createNewPlaylist" class="create-button" :disabled="!playlistName || isCreating">
                <i class="bi bi-plus-circle"></i>
                {{ isCreating ? 'Creating...' : 'Create Playlist' }}
            </button>
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { createPlaylist, fetchUserProfile } from '#imports';

const playlistName = ref('');
const playlistDescription = ref('');
const isCreating = ref(false);
const error = ref('');

const createNewPlaylist = async () => {
    if (!playlistName.value.trim()) return;

    isCreating.value = true;
    error.value = '';

    try {
        // Get user profile to get the user ID
        const userProfile = await fetchUserProfile();

        // Create the playlist
        const newPlaylist = await createPlaylist(
            userProfile.id,
            playlistName.value.trim(),
            playlistDescription.value.trim()
        );

        // Reset form
        playlistName.value = '';
        playlistDescription.value = '';

        // Emit event to refresh playlists
        emit('playlist-created', newPlaylist);
    } catch (err) {
        console.error('Error creating playlist:', err);
        error.value = 'Failed to create playlist. Please try again.';
    } finally {
        isCreating.value = false;
    }
};

const emit = defineEmits(['playlist-created']);
</script>

<style scoped>
.add-playlist-container {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1.25rem;
    margin-bottom: 2.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
}

.add-playlist-container:hover {
    background-color: rgba(255, 255, 255, 0.08);
}

.add-playlist-container h2 {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    color: var(--text-primary);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.input-field {
    padding: 0.9rem 1rem;
    border-radius: 4px;
    border: none;
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    font-size: 0.9rem;
    transition: background-color 0.2s;
    font-weight: 500;
}

.input-field:focus {
    background-color: rgba(255, 255, 255, 0.15);
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.input-field::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 400;
}

.create-button {
    margin-top: 0.5rem;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 25px;
    background-color: var(--color-medium-purple);
    color: var(--color-white);
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.2s, background-color 0.2s;
}

.create-button:hover:not(:disabled) {
    transform: scale(1.04);
    background-color: var(--color-light-purple);
    color: var(--color-black);
}

.create-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error-message {
    margin-top: 0.8rem;
    color: var(--color-error);
    font-size: 0.9rem;
}

@media (min-width: 768px) {
    .form-group {
        flex-direction: row;
        align-items: center;
    }

    .create-button {
        margin-top: 0;
    }
}
</style>