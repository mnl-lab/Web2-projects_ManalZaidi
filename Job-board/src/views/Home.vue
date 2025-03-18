<template>
    <div id="app">
        <h1>Applied Jobs</h1>
        <FilterNav @filter-jobs="filterJobs" />
        <div id="joby">
            <div v-for="job in filteredJobs" :key="job.id">
                <JobDetail :titre="job.titre" :description="job.description" :salaire="job.salaire" :date="job.date" />
                <button @click="deleteJob(job.id)">Delete</button>
                <button><router-link to="/jobs/edit">Edit Job</router-link></button>
            </div>
        </div>
    </div>
</template>

<script>
import JobDetail from '@/components/JobDetail.vue';
import FilterNav from '@/components/FilterNav.vue';
export default {
    components: {
        JobDetail,
        FilterNav
    },
    data() {
        return {
            jobs: [],
            filter: ""
        }
    },
    computed: {
        filteredJobs() {
            return this.jobs.filter(job => job.titre.toLowerCase().includes(this.filter.toLowerCase()))
        }
    },

    methods: {
        filterJobs(job) {
            this.filter = job;
        },
        deleteJob(id) {
            if (confirm('Are you sure you want to delete this job?')) {
                fetch(`http://localhost:3000/jobs/${id}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (response.ok) {
                            this.jobs = this.jobs.filter(job => job.id !== id);
                        }
                    })
                    .catch(error => console.error('Error:', error));
            }

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
    padding: 20px;
    background-color: #f4f4f4;
    color: #333;
}

h1 {
    color: #0A66C2;
    text-align: center;
    margin-bottom: 20px;
}

#joby {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    width: 100%;
    margin-top: 20px;
}

button {
    background-color: #0A66C2;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
}
</style>
