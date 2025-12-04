import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: '首页',
    component: () => import('@/views/首页.vue')
  },
  {
    path: '/ad',
    name: '111',
    component: () => import('@/views/111.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
