console.log('hello world content todo something~')

import Vue from 'vue'
import App from '../view/content.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueDarkMode from "@growthbunker/vuedarkmode";

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(VueDarkMode);
Vue.use(ElementUI);


new Vue({
    render: (h) => h(App)
}).$mount('#app')
