import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'

//潘家成:vuex进行模块式开发，分为三个小仓库
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters
})

export default store
