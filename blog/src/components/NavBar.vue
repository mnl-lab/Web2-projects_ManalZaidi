<template>
    <nav class="navbar">
        <div class="navbar-brand">
            <h1>My blog</h1>
        </div>
        <div class="navbar-menu">
            <div class="navbar-start">
                <router-link to="/" class="navbar-item"><button>Home</button></router-link>
                <router-link to="/create" class="navbar-item"><button>Create Post</button></router-link>
            </div>
        </div>
        
    </nav>
</template>

<script>
export default {
    name: 'NavBar',

};
</script>
<style scoped>
.navbar {
    background-color: #763030;
    color: white;
    padding: 1rem;
}
.navbar-brand {
    font-size: 1.5rem;
        background-color: #763030;
}
.navbar-menu {
    display: flex;
    justify-content: space-between;
        background-color: #763030;
}
.navbar-start {
    display: flex;
        background-color: #763030;
        gap: 50px;
}
button:hover {
    transform: translateY(-5px);
    /* Lift on hover */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    /* Stronger shadow on hover */
}

button {
    
    /* Space between buttons */
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