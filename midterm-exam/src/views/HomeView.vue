<template>
    <div>
        <h1>Library</h1>
        <input type="text" v-model="filter" placeholder="Search by title or by author" @input="filterBooks(filter)" />
        <label for="status">Book availability: </label>
        <input type="radio" name="status" :value="true" v-model="availability" /> Available
        <input type="radio" name="status" :value="false" v-model="availability" /> Unavailable
        <Library :books="filteredBooks"  />
    </div>
</template>

<script>
import Library from '@/components/Library.vue';

export default {
    name: 'HomeView',
    components: {
        Library
    },
    data() {
        return {
            books: [],
            filter: "",
            availability: true
        };
    },
    computed: {
        filteredBooks() {
            return this.books.filter(book => {
            const titleMatch = book.titre.toLowerCase().includes(this.filter.toLowerCase());
                const authorMatch = book.auteur.toLowerCase().includes(this.filter.toLowerCase());
                const availabilityMatch = this.availability ? book.status : !book.status;
                return (titleMatch || authorMatch) && availabilityMatch;
            });
        }
    },
    methods: {
        filterBooks(book) {
            this.filter = book;
        }
    },
    mounted() {
        fetch('http://localhost:3000/books')
            .then(response => response.json())
            .then(data => this.books = data)
            .catch(console.error);
    }
}
</script>
<style scoped>
div {
    font-family: Arial, sans-serif;
    padding: 20px;
}

h1 {
    color: #393374;
    text-align: center;
}

input[type="text"] {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
}

label {
    margin-right: 10px;
    font-weight: bold;
}

input[type="radio"] {
    margin: 0 5px;
}

p {
    color: #888;
    text-align: center;
    font-style: italic;
}
</style>