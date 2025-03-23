export function getPosts() {
    return fetch('http://localhost:3000/posts/')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Optional: Log the data for debugging
            return data; // Return the fetched posts
        })
        .catch(err => console.log(err));
}