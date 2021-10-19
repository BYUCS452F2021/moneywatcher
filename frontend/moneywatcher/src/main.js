import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import VueFlexLayout from '@jporto/vue-flex-layout'
import VueAutosuggest from "vue-autosuggest";

import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import VueVirtualScroller from "vue-virtual-scroller";
Vue.component("RecycleScroller", VueVirtualScroller.RecycleScroller);

Vue.config.productionTip = false;
Vue.use(VueFlexLayout)
Vue.use(VueAutosuggest);
Vue.use(VueVirtualScroller);

import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-type": "application/json"
  },
  configureWebpack: {
    devServer: {
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  }
});

import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-type": "application/json"
  },
  configureWebpack: {
    devServer: {
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  }
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");