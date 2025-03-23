<template>
    <div>
        <h1>Posts for Tag: {{ tag }}</h1>
        <div v-if="posts.length === 0">Loading posts...</div>
        <ul v-else>
            <li v-for="post in filteredPosts" :key="post.id">
                <router-link :to="'/post/' + post.id">{{ post.title }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import { getPosts } from '@/composables/getPosts';
export default {
    name: "TagsView",
    data() {
        return {
            posts: []
        };
    },
    async created() {
        try {
            this.posts = await getPosts();
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    },
    computed: {
        tag() {
            return this.$route.params.tag;
        },
        filteredPosts() {
            return this.posts.filter((post) => post.tags.includes(this.tag));
        },
    },
};
</script>

<style scoped>
h1 {
    margin-bottom: 20px;
}

ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

li {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    transition: background-color 0.3s ease;
}

li:hover {
    background-color: #f0f0f0;
}

li {
    margin-bottom: 10px;
}
</style>