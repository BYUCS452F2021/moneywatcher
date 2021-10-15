import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import VueFlexLayout from '@jporto/vue-flex-layout'

Vue.config.productionTip = false;
Vue.use(VueFlexLayout)

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
