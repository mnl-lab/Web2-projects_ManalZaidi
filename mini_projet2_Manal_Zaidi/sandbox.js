document.getElementsByName("add")[0].addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        const todo = this.value.trim(); // Get the input value and trim whitespace
        if (todo === "") return; // Do nothing if the input is empty

        const todoList = document.querySelector(".list-group.todos"); // Select the todo list
        const newTodo = document.createElement("li"); // Create a new list item
        newTodo.className = "list-group-item d-flex justify-content-between align-items-center"; // Add classes
        newTodo.innerHTML = `
            <span>${todo}</span>
            <i class="far fa-trash-alt delete"></i>
        `; 
        todoList.appendChild(newTodo); // Add the new todo to the list
        this.value = ""; // Clear the input field
    }
});

// Delete a todo
document.querySelector(".list-group.todos").addEventListener("click", function (e) {
    if (e.target.classList.contains("delete")) {
        e.target.parentElement.remove(); // Remove the parent <li> of the delete icon
    }
});

//filter todos
document.querySelector('.search input[name="search"]').addEventListener('input', function () {
    const searchTerm = this.value.trim().toLowerCase(); // Get the search term and trim spaces
    const todoItems = document.querySelectorAll(".list-group.todos li"); // Select all todo items

    todoItems.forEach(function (todoItem) {
        const todoText = todoItem.querySelector("span").textContent.trim().toLowerCase(); // Get the todo text
        if (todoText.includes(searchTerm)) {
            todoItem.style.display = "flex"; // Show matching item
        } else {
           todoItem.style.setProperty("display", "none", "important"); // Hide non-matching item
        }
    });
});
