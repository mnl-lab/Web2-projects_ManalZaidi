<template>
    <div class="post-detail">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else>
            <h1>{{ post.title }}</h1>
            <div class="content">{{ post.content }}</div>
            <div class="tags">
                <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <router-link to="/" class="home-link">← Back to Home</router-link>
        </div>
    </div>
</template>

<script>
import { getPost } from '@/composables/getPost'

export default {
    props: ['id'],
    data() {
        return {
            post: null,
            loading: true,
            error: null
        }
    },
    async created() {
        try {
            const numericId = Number(this.id)
            if (isNaN(numericId)) throw new Error('Invalid post ID')

            this.post = await getPost(numericId)
            if (!this.post) throw new Error('Post not found')
        } catch (err) {
            this.error = err.message
        } finally {
            this.loading = false
        }
    }
}
</script>

<style scoped>
.post-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.content {
    white-space: pre-wrap;
    line-height: 1.6;
    margin: 2rem 0;
}

.tags {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
}

.tag {
    background: #eee;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.9em;
}

.home-link {
    display: inline-block;
    margin-top: 2rem;
    color: #666;
    text-decoration: none;
}
</style>