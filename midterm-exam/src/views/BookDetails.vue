<template>
    <div class="book-details">
        <div class="info">
            <h1>{{ book.titre }}</h1>
            <p>Author: {{ book.auteur }}</p>
            <p>Published Year: {{ book.annee }}</p>
            <p>Genre: {{ book.categorie }}</p>
            <p>Resume: {{ book.resume }} </p>
            <p>Status: {{ book.status ? "available" : "unavailable" }}</p>
        </div>
        <div class="image">
            <img :src="book.image" alt="Book Cover" />
        </div>
        <router-link to="/" class="back-link"> Go back to library</router-link>
    </div>
</template>

<script>
export default {
    name: 'BookDetails',
    props:['id'],
    data() {
        return {
            book: [],
        };
    },
    mounted() {
        fetch(`http://localhost:3000/books/${this.id}`)
            .then(response => response.json())
            .then(data => this.book = data)
            .catch(console.error);
    },
}
</script>

<style scoped>
.book-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
    padding: 20px;
}

.info {
    text-align: center;
    margin-bottom: 20px;
}

.image img {
    max-width: 200px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.back-link {
    margin-top: 20px;
    text-decoration: none;
    color: #007BFF;
    font-weight: bold;
}

.back-link:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>