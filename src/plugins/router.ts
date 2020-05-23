import { createRouter, createWebHistory } from 'vue-router'
// TODO: Add analytics

export const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: [
    {
      name: 'topics',
      path: '/topics',
      meta: { title: '热门' },
      component: () => import('../views/Topics.vue'),
    },
    {
      name: 'topic',
      path: '/topic/:id',
      meta: { title: '话题' },
      component: () => import('../views/Topic.vue'),
    },
  ],
  scrollBehavior: () => ({ x: 0, y: 0 }),
})

router.afterEach(({ meta }) => {
  if (meta) document.title = `Readhub - ${meta.title}`
})
