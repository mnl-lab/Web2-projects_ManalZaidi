<template>
    <div class="filter-container">
        <label for="job-filter">Search for a job:</label>
        <input type="text" id="job-filter" v-model="job" placeholder="Enter job name">
    </div>
</template>

<script>
export default {
    props: [

    ],

    data() {
        return {
            job: ""
        }
    },
    watch: {
        job(newJob) {
            this.$emit('filter-jobs', newJob);
        }
    },
}

</script>
<style scoped>
.filter-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    background-color: #f0f0f0;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

label {
    font-weight: bold;
    color: #333;
}

input[type="text"] {
    width: 250px;
    height: 35px;
    border: 2px solid #0A66C2;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

</style>

