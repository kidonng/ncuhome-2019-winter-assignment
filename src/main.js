import Vue from 'vue'
import router from './plugins/router'
import App from './App'
import ky from 'ky'
import pangu from 'pangu'
import NProgress from 'nprogress'

Vue.config.productionTip = false
NProgress.configure({ showSpinner: false })

Vue.prototype.api = ky.extend({
  prefixUrl: 'https://api.readhub.cn/',
  hooks: {
    beforeRequest: [() => NProgress.start()],
    afterResponse: [() => NProgress.done()]
  }
}).get
Vue.prototype.categories = {
  topics: '热门',
  news: '科技',
  technews: '开发',
  blockchain: '区块',
  jobs: '招聘'
}

Vue.filter('spacing', text => pangu.spacing(text))
Vue.filter('post', post =>
  pangu
    .spacing(post.content)
    .split(post.jobTitle)
    .join(`“${post.jobTitle}”`)
)
Vue.filter('format', time => {
  time = new Date(time)
  let now = new Date()
  let today = new Date()
  today.setHours(0, 0, 0, 0)
  const seconds = Math.floor((now - time) / 1000)

  if (seconds < 60) return '刚刚'
  else if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`
  else if (time >= today) return `${Math.floor(seconds / 3600)} 小时前`
  else if (time >= today.setDate(today.getDate() - 1)) return '昨天'
  else if (time >= today.setDate(today.getDate() - 1)) return '前天'
  else if (time.getFullYear() === now.getFullYear())
    return `${time.getMonth() + 1} 月 ${time.getDate()} 日`
  else
    return `${time.getFullYear()} 年 ${time.getMonth() +
      1} 月 ${time.getDate()} 日`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
