import Vue from 'vue'
import VueRouter from 'vue-router'
import Topics from '@/views/Topics.vue'

Vue.use(VueRouter)

const News = () => import(/* webpackChunkName: 'news' */ '../views/News.vue')
const routes = [
  {
    name: 'topics',
    path: '/topics',
    meta: '热门',
    component: Topics
  },
  {
    name: 'topic',
    path: '/topic/:id',
    meta: '话题',
    component: () =>
      import(/* webpackChunkName: 'topic' */ '../views/Topic.vue')
  },
  {
    name: 'news',
    path: '/news',
    meta: '科技',
    component: News
  },
  {
    name: 'technews',
    path: '/tech',
    meta: '开发',
    component: News
  },
  {
    name: 'blockchain',
    path: '/blockchain',
    meta: '区块',
    component: News
  },
  {
    name: 'jobs',
    path: '/jobs',
    meta: '招聘',
    component: () => import(/* webpackChunkName: 'jobs' */ '../views/Jobs.vue')
  },
  {
    path: '*',
    redirect: { name: 'topics' }
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: () => ({ x: 0, y: 0 })
})

router.afterEach(({ meta }) => {
  if (meta) document.title = `Readhub - ${meta}`
})

export default router
export { routes }
