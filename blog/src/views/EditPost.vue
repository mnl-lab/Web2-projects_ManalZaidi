<template>
    <div class="edit-post">
        <NavBar />
        <div v-if="loading" class="loading">Loading post data...</div>
        <form v-else @submit.prevent="handleSubmit">
            <h1>Edit Post</h1>

            <div class="form-group">
                <label>Title</label>
                <input type="text" v-model="form.title" required>
            </div>

            <div class="form-group">
                <label>Content</label>
                <textarea v-model="form.content" required></textarea>
            </div>

            <div class="form-group">
                <label>Tags (comma-separated)</label>
                <input type="text" v-model="tagsInput" required>
            </div>

            <div class="actions">
                <button type="submit">Save Changes</button>
                <router-link to="/" class="cancel">Cancel</router-link>
            </div>
        </form>
    </div>
</template>

<script>
import { getPost } from '@/composables/getPost'
import NavBar from '@/components/NavBar.vue'

export default {
    props: ['id'],
    components: { NavBar },
    data() {
        return {
            loading: true,
            form: {
                title: '',
                content: '',
                tags: []
            },
            tagsInput: ''
        }
    },
    async created() {
        try {
            const numericId = Number(this.id)
            if (isNaN(numericId)) throw new Error('Invalid post ID')

            const post = await getPost(numericId)
            this.form = { ...post }
            this.tagsInput = post.tags.join(', ')
        } catch (err) {
            alert(`Error loading post: ${err.message}`)
            this.$router.push('/')
        } finally {
            this.loading = false
        }
    },
    methods: {
        async handleSubmit() {
            try {
                const tagsArray = this.tagsInput.split(',').map(t => t.trim()).filter(t => t)

                const response = await fetch(`http://localhost:3000/posts/${this.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...this.form,
                        tags: tagsArray
                    })
                })

                if (!response.ok) throw new Error('Failed to update post')
                this.$router.push(`/post/${this.id}`)
            } catch (err) {
                alert(`Update failed: ${err.message}`)
            }
        }
    }
}
</script>

<style scoped>
.edit-post {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

input[type="text"],
textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

textarea {
    min-height: 200px;
    resize: vertical;
}

.actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
}

button {
    padding: 0.75rem 1.5rem;
    background: #2c3e50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background: #34495e;
}

.cancel {
    padding: 0.75rem 1.5rem;
    background: #95a5a6;
    color: white;
    text-decoration: none;
    border-radius: 4px;
}

.loading {
    text-align: center;
    padding: 2rem;
    color: #666;
}
</style>