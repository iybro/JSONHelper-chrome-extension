import Vue from 'vue'
import App from '../view/popup.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueDarkMode from "@growthbunker/vuedarkmode";
Vue.config.productionTip = false


Vue.use(ElementUI);
Vue.use(VueDarkMode);

new Vue({
  render: (h) => h(App)
}).$mount('#app')


//openBtn
const button = document.getElementById("openBtn");
button.addEventListener("click", async () => {
  console.log("This is a button!")
  document.body.style.backgroundColor = 'orange';
  // chrome.tabs.create({
  //   url: 'content.html'
  // });
  chrome.windows.create({
    url: 'content.html',
    state:"fullscreen"
  });
  // chrome.windows.create(
  //     createData: ,
  //     callback: function,
  // )
});