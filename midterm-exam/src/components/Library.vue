<template>
    <div v-if="books.length > 0" class="library">
        <div v-for="book in books" :key="book.id" class="book-card" >
            <h2>{{ book.titre }}</h2>
            <p>Author: {{ book.auteur }}</p>
            <p>Published Year: {{ book.annee }}</p>
            <p>Genre: {{ book.categorie }}</p>
            <p>Status: {{ book.status ? "available" : "unavailable" }}</p>
            <router-link :to="'detail/' + book.id">
                <button>See more...</button>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Library',
    props: {
        books: {
            type: Array,
            required: true
        },
        // availability: {
        //     type: Boolean,
        //     default: true
        // }
    },
    data() {
        return {};
    }
}
</script>

<style scoped>
.library {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    margin-left: 10%;
}

.book-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    width: 250px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.book-card h2 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333;
}

.book-card p {
    margin: 5px 0;
    color: #555;
}

.book-card button {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.book-card button:hover {
    background-color: #0056b3;
}
.library :hover {
    background-color: #dbe6f0;
    transition: background-color 0.3s ease;
    transform: scale(1.02);
}
</style>