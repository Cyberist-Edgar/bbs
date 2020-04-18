import Vue from 'vue'
import App from './App.vue'
import Andt from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import router from "./router/index.js"


Vue.use(Andt)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
