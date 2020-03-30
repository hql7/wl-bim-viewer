import Vue from 'vue'
import App from './App.vue'

import wlBimViewer from "wl-bim-viewer";
import "wl-bim-viewer/lib/wl-bim-viewer.css"

Vue.use(wlBimViewer);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
