<template>
    <div id="app">
        <h1>Edit a job</h1>
        <div id="bod">
            <label>Enter the name of the job you want to edit:</label> <br>
            <input type="text" v-model="fil"> <br>
            

        </div>
        <div id="toedit" v-show="!showForm">
            <div v-for="job in filteredJobs" :key="job.id">
                <JobDetail :titre="job.titre" :description="job.description" :salaire="job.salaire" :date="job.date" /> <br>
                <button @click="editJob(job)">Edit</button>
            </div> 
        </div>
                <form id="edit" v-show="showForm">
                    <div class="container">
                        <label>job title:</label> 
                        <input type="text" v-model="jobTitle" >
                    </div>
                    <div class="container">
                        <label>job description:</label>
                        <input type="text" v-model="jobDescription">
                    </div>
                    <div class="container">
                        <label>salary: </label>
                        <input type="text" v-model="salary">
                    </div>
                    <div class="container">
                        <label>date: </label>
                        <input type="text" v-model="date">
                    </div>
                    <div class="container">
                        <button @click.prevent="updateJob">Update Job</button>
                    </div> 
                </form>

    </div>
</template>

<script>
import JobDetail from '@/components/JobDetail.vue';
export default {
    components: {
        JobDetail
    },
    data() {
        return {
            jobs: [],
            fil: '',
            jobTitle: '',
            jobDescription: '',
            salary: '',
            date: '',
            showForm: false
        }
    },

    computed: {
        filteredJobs() {
            return this.jobs.filter(job => job.titre.toLowerCase().includes(this.fil.toLowerCase()))
        }
    },
    mounted() {
        fetch('http://localhost:3000/jobs')
            .then(response => response.json())
            .then(data => this.jobs = data)
            .catch(console.error);
    },


    methods: {
        editJob(job) {
            this.showForm = true;
            this.jobTitle = job.titre;
            this.jobDescription = job.description;
            this.salary = job.salaire;
            this.date = job.date;
            
        },
        updateJob() {
            const jobIndex = this.jobs.findIndex(job => job.titre === this.jobTitle);
            if (jobIndex !== -1) {
                this.jobs[jobIndex] = {
                    ...this.jobs[jobIndex],
                    titre: this.jobTitle,
                    description: this.jobDescription,
                    salaire: this.salary,
                    date: this.date
                };
                this.showForm = false;
                this.jobTitle = '';
                this.jobDescription = '';
                this.salary = '';
                this.date = '';

            }

        }
    }
}
</script>

<style scoped> 
    #app {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 20px;
        background-color: #f4f4f4;
        font-family: 'Arial', sans-serif;
    }

    h1 {
        color: #0A66C2;
        margin-bottom: 30px;
        text-align: center;
    }

    #bod {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        width: 80%;
        max-width: 600px;
        margin-bottom: 30px;
    }

    #bod label {
        color: #0A66C2;
        font-weight: bold;
    }

    #bod input[type="text"] {
        width: 100%;
        padding: 10px;
        border: 2px solid #0A66C2;
        border-radius: 25px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    #toedit {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 80%;
        max-width: 600px;
    }

    #toedit button {
        background-color: #0A66C2;
        color: white;
        border: none;
        border-radius: 25px;
        padding: 10px 20px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    #toedit button:hover {
        background-color: #004a99;
    }

    #edit {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 80%;
        max-width: 600px;
    }
    .container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }
    .container label {
        color: #0A66C2;
        font-weight: bold;
    }
    .container input[type="text"] {
        width: 100%;
        padding: 10px;
        border: 2px solid #0A66C2;
        border-radius: 25px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .container button {
        background-color: #0A66C2;
        color: white;
        border: none;
        border-radius: 25px;
        padding: 10px 20px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    .container button:hover {
        background-color: #004a99;
    }
</style>
