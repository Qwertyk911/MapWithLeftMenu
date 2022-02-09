import Vue from 'vue'
import App from './App.vue'
import L from 'leaflet';
import store from "./store/index"

Vue.config.productionTip = false
Vue.prototype.$store = store;

import 'devextreme/dist/css/dx.light.css';
import 'leaflet/dist/leaflet.css';



delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

new Vue({
  render: h => h(App),
  data:{
    store: store
  },
}).$mount('#app')
