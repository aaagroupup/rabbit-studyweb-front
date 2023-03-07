import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import "./plugins/element.js";
//添加全局样式
import './assets/css/global.css'
import "./assets/font/iconfont.css"
//导入axios
import axios from "axios"
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import './plugins/element.js' 

//挂载axios
Vue.prototype.$http=axios
//设置访问根路径
axios.defaults.baseURL="http://localhost:9381"

Vue.use(mavonEditor)


Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
