import Vue from 'vue'
import VueRouter from 'vue-router'
import Topics from '../views/Topics.vue'

Vue.use(VueRouter)

const News = () => import(/* webpackChunkName: 'news' */ '../views/News.vue')

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      name: 'topics',
      path: '/topics',
      component: Topics
    },
    {
      name: 'topic',
      path: '/topic/:id',
      component: () =>
        import(/* webpackChunkName: 'topic' */ '../views/Topic.vue')
    },
    {
      name: 'news',
      path: '/news',
      component: News
    },
    {
      name: 'technews',
      path: '/tech',
      component: News
    },
    {
      name: 'blockchain',
      path: '/blockchain',
      component: News
    },
    {
      name: 'jobs',
      path: '/jobs',
      component: () =>
        import(/* webpackChunkName: 'jobs' */ '../views/Jobs.vue')
    },
    {
      path: '*',
      redirect: { name: 'topics' }
    }
  ],
  scrollBehavior: () => ({ x: 0, y: 0 })
})

export const categories = {
  topics: '热门',
  news: '科技',
  technews: '开发',
  blockchain: '区块',
  jobs: '招聘'
}
const routes = { topic: '话题', ...categories }

router.afterEach(({ name }) => {
  document.title = `Readhub - ${routes[name]}`
})

export default router
