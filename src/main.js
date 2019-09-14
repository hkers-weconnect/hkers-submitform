import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins'
import vuetify from './plugins/vuetify'
import { sync } from 'vuex-router-sync'
import { firestorePlugin } from 'vuefire'
import VModal from 'vue-js-modal'
import PortalVue from 'portal-vue'
import "./styles/main.scss";

sync(store, router)
Vue.use(firestorePlugin);
Vue.config.productionTip = false
Vue.use(require('vue-moment'));
Vue.use(VModal)
Vue.use(PortalVue)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
