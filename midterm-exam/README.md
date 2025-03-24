
# midterm exam
<!-- ## Features

- View paginated list of blog posts
- Create new blog posts with tags
- Edit existing posts
- Delete posts
- View post details
- Tag filtering system
- Responsive design
- Mock REST API with JSON Server -->

## Installation

1. Clone the repository:
```bash
git clonehttps://github.com/mnl-lab/Web2-projects_ManalZaidi.git
cd vue-blog
```

2. Install project dependencies:
```bash
npm install
```

3. Install JSON Server (if not already installed):
```bash
npm install -g json-server
```

## Usage

1. Start the Vue development server:
```bash
npm run dev
```

2. In a separate terminal, start the JSON Server:
```bash
cd src
cd assets
json-server --watch db.json --port 3000
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── NavBar.vue
│   ├── PostList.vue
│   ├── SinglePost.vue
│   └── TagCloud.vue
├── views/
│   ├── HomeView.vue
│   ├── CreatePostView.vue
│   ├── PostDetailView.vue
│   ├── tag.vue
│   └── EditPost.vue

├── composables/
│   ├── getPosts.js
│   └── getPost.js
├── App.vue
└── main.js
```

# By: Manal Zaidi