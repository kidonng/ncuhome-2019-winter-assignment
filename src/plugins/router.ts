import { createRouter, createWebHistory } from 'vue-router'
import { ga } from 'vue-router-ga-lite'

const News = () => import('../views/News.vue')
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
      name: 'news',
      path: '/news',
      meta: { title: '科技' },
      component: News,
    },
    {
      name: 'technews',
      path: '/tech',
      meta: { title: '开发' },
      component: News,
    },
    {
      name: 'blockchain',
      path: '/blockchain',
      meta: { title: '区块' },
      component: News,
    },
    {
      name: 'jobs',
      path: '/jobs',
      meta: { title: '招聘' },
      component: () => import('../views/Jobs.vue'),
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

ga('UA-140053908-2', router)
