import Vue from 'vue'
import VueRouter from 'vue-router'
import Topics from '../views/Topics'
import categories from '../categories'

Vue.use(VueRouter)

const News = () => import(/* webpackChunkName: 'news' */ '../views/News')

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
      component: () => import(/* webpackChunkName: 'topic' */ '../views/Topic')
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
      component: () => import(/* webpackChunkName: 'jobs' */ '../views/Jobs')
    },
    {
      path: '*',
      redirect: { name: 'topics' }
    }
  ],
  scrollBehavior: () => ({ y: 0 })
})

router.afterEach(({ name }) => {
  if (name !== 'topic') document.title = `Readhub - ${categories[name]}`
})

export default router
