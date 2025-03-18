<template>
  <div id="app">
    <nav>
      <router-link to="/" class="l">Job board</router-link>
      <router-link to="/add" class="l">Add Job</router-link>
      <router-link to="/jobs/edit" class="l">Edit Job</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {

}
</script>

<style>
  #app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh; /* Ensure the app takes up at least the full viewport height */
    background-color: #f4f4f4; /* Light background */
    font-family: 'Arial', sans-serif; /* Modern font */
  }
  
  nav {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    background: linear-gradient(to right, #0A66C2, #e0e0e0, #0A66C2); /* Gradient background */
    padding: 15px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  }
  
  .l {
    border: none;
    border-radius: 25px; /* Rounded corners */
    width: auto; /* Adjust width based on content */
    text-align: center;
    padding: 15px 30px; /* More padding */
    cursor: pointer;
    background-color: #0A66C2; /* Primary color */
    color: white; /* White text */
    text-decoration: none; /* Remove underline */
    transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transitions */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Shadow for depth */
  }
  
  .l:hover {
    background-color: #004a99; /* Darker shade on hover */
    transform: translateY(-2px); /* Slight lift on hover */
  }
  </style>

