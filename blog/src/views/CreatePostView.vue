<template>
    <div class="create-post">
        <h1>Create a New Post</h1>
        <form @submit.prevent="createPost" class="form-container">
            <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" id="title" v-model="newPost.title" required />
            </div>
            <div class="form-group">
                <label for="content">Content:</label>
                <textarea id="content" v-model="newPost.content" required></textarea>
            </div>
            <div class="form-group">
                <label for="tags">Tags (comma separated):</label>
                <input type="text" id="tags" v-model="newPost.tags" />
            </div>
            <button type="submit" class="submit-button">Create Post</button>
        </form>
    </div>
</template>

<script>
import { getPosts } from '@/composables/getPosts';
export default {
    name: 'CreatePostView',
    data() {
        return {
            newPost: {
                title: '',
                content: '',
                tags: '',
            posts: [],
            }
        };
    },
    
    async created() {
        try {
            this.posts = await getPosts();
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    },
    methods: {
        async createPost() {
            const tagsArray = this.newPost.tags.split(',').map(tag => tag.trim());
            const post = {
            id: this.posts.length + 1,
            title: this.newPost.title,
            content: this.newPost.content,
            tags: tagsArray
            };

            try {
            const response = await fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(post)
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            alert('Post created successfully!');
            this.$router.push('/');
            this.newPost.title = '';
            this.newPost.content = '';
            this.newPost.tags = '';
            } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred while creating the post.');
            }
        }
    }
}
</script>

<style scoped>
.create-post {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
}

input, textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
}

textarea {
    resize: vertical;
    min-height: 100px;
}

.submit-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #0056b3;
}
</style>