import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import './plugins/filters'
import router from './plugins/router'
import App from './App.vue'

Vue.use(VueCompositionApi)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
