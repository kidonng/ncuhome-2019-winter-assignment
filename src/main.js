import Vue from 'vue'
import './plugins/function-api'
import './plugins/filters'
import './plugins/analytics'
import router from './plugins/router'
import App from './App'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
