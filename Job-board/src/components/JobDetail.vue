<template>
    <div >
        <h6> {{ titre }} </h6>
        <p class="d"> {{ description }}</p>
        <p class="s"> {{ salaire }}</p>
        <p class="dat"> {{ date }}</p>

    </div>
</template>

<script>
export default {

    props: [
        "titre",
        "description",
        "salaire",
        "date"
    ],


    
}
</script>

<style scoped>
div{
    border: none; /* Remove the default border */
    border-radius: 10px; /* Rounded corners */
    width: 350px; /* Slightly wider */
    height: auto; /* Adjust height based on content */
    padding: 20px; /* More padding */
    background-color: #f8f8f8; /* Light background */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transitions */
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 10px;
}
div:hover {
    transform: translateY(-5px); /* Lift on hover */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Stronger shadow on hover */
}
h6{
    
    text-align: left; /* Align text to the left */
    color: #0A66C2;
    font-size: 1.2em; /* Slightly larger font */
    font-weight: bold; /* Bold title */
    margin-bottom: 5px; /* Space below title */
}
.s{
    color: #666; /* Darker gray */
    font-size: 0.9em; /* Slightly smaller font */
    font-style: italic; /* Italic salary */
}
.d{
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Modern font */
    font-size: 1em; /* Regular font size */
    line-height: 1.4; /* Improved line spacing */
}
.dat{
    color: #008000; /* Darker green */
    font-size: 0.8em; /* Smaller font */
}

</style>
