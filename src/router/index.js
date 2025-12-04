import { createRouter, createWebHashHistory } from 'vue-router'
import WelcomeView from '@/views/WelcomeView.vue'
import EditorView from '@/views/EditorView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
    },
    {
      path: '/editor',
      name: 'editor',
      component: EditorView,
    },
  ],
})

export default router
