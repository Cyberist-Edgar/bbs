import Vue from 'vue'
import App from './App.vue'
import Andt from 'ant-design-vue'
import router from "./router/index.js"
import axios from 'axios'
// import '../mock/'
import store from './store'
import i18n from "./i18n"

Vue.prototype.$axios = axios;
axios.defaults.withCredentials=true;

Vue.use(Andt);

Vue.config.productionTip = false;

new Vue({
  i18n,
  store,
  router,
  render: h => h(App),

}).$mount('#app')
