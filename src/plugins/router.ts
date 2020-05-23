import { createRouter, createWebHistory } from 'vue-router'
// TODO: import { ga } from 'vue-router-ga-lite'

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
    {
      path: '/',
      redirect: 'topics',
    },
  ],
  scrollBehavior: () => ({ x: 0, y: 0 }),
})

router.afterEach(({ meta }) => {
  if (meta) document.title = `Readhub - ${meta.title}`
})

// TODO: ga('UA-140053908-2', router)
