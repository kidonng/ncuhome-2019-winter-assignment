import Vue from 'vue'
import './plugins/composition-api'
import './plugins/filters'
import './plugins/analytics'
import router from './plugins/router'
import App from './App.vue'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
