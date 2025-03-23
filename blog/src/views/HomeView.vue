<template>
    <div id="cnt">
        <div class="left">
            <h1>Home</h1>
            <Postlist :posts="posts" @delete-post="deletePost" />
        </div>
        <div class="right">
            <h3>Tags</h3>
            <TagCloud :tags="tagscomp" />
        </div>
    </div>
</template>

<script>
import { getPosts } from '@/composables/getPosts';
import Postlist from '@/components/Postlist.vue';
import TagCloud from '@/components/TagCloud.vue';

export default {
    components: {
        Postlist,
        TagCloud
    },
    data() {
        return {
            posts: [],
        };
    },
    computed: {
        tagscomp() {
            const allTags = [];
            this.posts?.forEach(post => {
                post.tags?.forEach(tag => {
                    if (!allTags.includes(tag)) allTags.push(tag);
                });
            });
            return allTags;
        }
    },
    async created() {
        try {
            this.posts = await getPosts();
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    },
    methods: {
        async deletePost(id) {
            try {
                await fetch(`http://localhost:3000/posts/${id}`, {
                    method: 'DELETE',
                });
                this.posts = this.posts.filter(post => post.id !== id);
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    }
}
</script>

<style scoped>
#cnt {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px;
    background-color: #f4f4f4;
}

.left {
    flex: 2;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 80%;
}

.right {
    flex: 1;
    padding: 20px;
    background-color: #9d3737;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 20%;
}
</style>