import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreatePostView from '@/views/CreatePostView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import tags from '@/views/tags.vue'
import EditPost from '@/views/EditPost.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePostView,
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostDetailView,
      props: true,
    },
    {
      path: '/tags/:tag',
      name: 'tags',
      component: tags,
      props: true,
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: EditPost,
      props: true,
    }
  ],
})

export default router
