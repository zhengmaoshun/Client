import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

//引入三级分类组件定义为全局组件
// import Category from '@/components/Category';
// Vue.component(Category.name,Category);

import Category from "@/components/Category"
Vue.component('Category',Category)

//引入全部的请求函数[用对象包含全部的请求函数]
import ajax from '@/api'

new Vue({
  beforeCreate() {
    //将全部的请求函数，挂载到Vue.prototype上，好处VC组件实例都可以使用这些请求函数
    Vue.prototype.$API = ajax;
  },
  el: '#app',
  router,
  store,
  render: h => h(App)
})
