<template>
    <div id="app">
        <form id="addform">
            <div class="container">
                <label>Enter the job title:</label>
                <input type="text" v-model="jobTitle">
            </div>
            <div class="container">
                <label>Enter the job description:</label>
                <input type="text" v-model="jobDescription">
            </div>
            <div class="container">
                <label>Enter the salary: </label>
                <input type="text" v-model="salary">
            </div>
            <div class="container">
                <label>Enter the date: </label>
                <input type="text" v-model="date">
            </div>
            <div class="container">
                <button @click.prevent="addJob">Add Job</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            jobTitle: '',
            jobDescription: '',
            salary: '',
            date: '',
            jobs: []
        }
    },
    methods: {
        addJob() {
            fetch('http://localhost:3000/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titre: this.jobTitle,
                    description: this.jobDescription,
                    salaire: this.salary,
                    date: this.date
                })
            })
                .then(response => response.json())
                .then(data => {
                    this.jobs.push(data);
                    this.jobTitle = '';
                    this.jobDescription = '';
                    this.salary = '';
                    this.date = '';
                    alert('Job added successfully!');
                })
                .catch(error => console.error('Error:', error));
        }
    },

    mounted() {
        fetch('http://localhost:3000/jobs')
            .then(response => response.json())
            .then(data => this.jobs = data)
            .catch(console.error);
    }
}
</script>

<style scoped>
#app {
    font-family: 'Arial', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f4f4f4;
    padding: 20px;
}

#addform {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 400px;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

label {
    font-weight: bold;
    color: #333;
}

input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 2px solid #0A66C2;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

button {
    background-color: #0A66C2;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}
</style>


