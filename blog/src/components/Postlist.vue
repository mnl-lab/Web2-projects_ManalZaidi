<template>
    <div id="container">
        <div class="onepost" v-for="post in posts" :key="post.id">
            <SinglePost :id="post.id" :title="post.title" :tags="post.tags" :content="post.content" />

            <button @click="confirmDelete(post.id)">Delete</button>
            <router-link :to="'/edit/' + post.id">
                <button>Edit Post</button>
            </router-link>
        </div>
    </div>
</template>

<script>
import SinglePost from './SinglePost.vue';

export default {
    name: 'PostList',
    components: {
        SinglePost
    },
    props: {
        posts: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    methods: {
        confirmDelete(postId) {
            if (confirm('Are you sure you want to delete this post?')) {
                this.$emit('delete-post', postId);
            }
        }
    }
}
</script>

<style scoped>
#container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    width: 100%;
    margin-top: 20px;
}
</style>

