## Getting Started

These instructions will guide you through setting up and running the application on your local machine.

### Prerequisites

*   **Node.js and npm:** Ensure you have Node.js and npm (Node Package Manager) installed on your system. You can check this by running `node -v` and `npm -v` in your terminal.
* **json-server:** This application uses json-server to simulate a backend API.

### Installation

1.  **Clone the repository:**

2.  **Install dependencies:**
    Open a terminal in the project's root directory and run:
    ```bash
    npm install
    ```
    This command will install all the necessary dependencies listed in the `package.json` file.

### Running the Application

1.  **Start the JSON server:**
    Open a **new** terminal window and navigate to the project's root directory. Then, run the following commands:
    ```bash
    cd public
    npx json-server --watch db.json --port 3000
    ```
    This will start the JSON server, which will serve the data from the `db.json` file on port 3000. **Keep this terminal window open** while running the application.

2.  **Start the Vue.js development server:**
    In a **separate** terminal window (also in the project's root directory), run:
    ```bash
    npm run dev
    ```
    This command will start the Vue.js development server.

3.  **Access the application:**
    Once the development server is running, you can access the application in your web browser at `http://localhost:8080` (or the port indicated in the terminal output).

### Project Structure

*   `src/`: Contains the source code of the Vue.js application.
*   `public/`: Contains the static files that will be served directly.
*   `package.json`: Lists the project's dependencies and scripts.

### Data

The application uses the `db.json` file located in the `/public` directory as its data source. You can modify this file to change the auto parts displayed in the catalog.

### Technologies Used

*   Vue.js
*   JSON Server
*   npm

# By: Manal Zaidi