<template>
    <div class="tag-cloud">
        <ul v-if="tags.length > 0">
            <li v-for="tag in tags" :key="tag">
                <router-link :to="`/tags/${tag}`"><button> {{ tag }} </button></router-link>
            </li>
        </ul>
        <p v-else>No tags available.</p>
    </div>
</template>

<script>
export default {
    name: "TagCloud",
    
    props: {
        tags: {
            type: Array,
            required: true,
            default: () => []
        },
    },
    
};
</script>

<style scoped>
.tag-cloud {
    display: flex;
        flex-wrap: wrap;
        justify-content: center;

        gap: 20px;
        width: 100%;
        margin-top: 20px;
}

.tag-cloud h3 {
    font-size: 1.2em;
    margin-bottom: 10px;
}

.tag-cloud ul {
    list-style: none;
    padding: 0;
}

.tag-cloud li {
    margin: 5px 0;
}

.tag-cloud a {
    text-decoration: none;
    color: black;
}

.tag-cloud a:hover {
    text-decoration: underline;
}
button:hover {
    transform: translateY(-5px);
    /* Lift on hover */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    /* Stronger shadow on hover */
}
button {
    border: none;
    /* Remove the default border */
    border-radius: 10px;
    /* Rounded corners */
    width: 100px;
    /* Slightly wider */
    height: auto;
    /* Adjust height based on content */
    padding: 10px;
    /* More padding */
    background-color: #f7f0f0;
    /* Light background */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* Soft shadow */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    /* Smooth transitions */
}
</style>