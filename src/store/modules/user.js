//引入相应请求函数:登录请求函数、退出登录请求函数、获取用户信心请求函数
import { login, logout, getInfo } from '@/api/user'
//cookie持久存储token封装好的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    //令牌:登录成功服务器会返回token[一定是要存储的vuex+本地存储]
    token: getToken(),
    //用户的名字
    name: '',
    //用户的头像
    avatar: ''
  }
}
//小仓库存储数据的地方
const state = getDefaultState()

//mutation
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

//actions
const actions = {
  //登录的action:发请求+用户名+密码
  async login({ commit }, userInfo) {
    //解构出用户名+密码数据
    const { username, password } = userInfo;
    //登录请求
    let result = await login({ username: username.trim(), password: password });
    if (result.code == 20000) {
      //vuex仓库储存一份token，并非持久化
      //本地存储持久化存储token[cookie]
      commit('SET_TOKEN', result.data.token);
      setToken(result.data.token);
      return 'ok'
    } else {
      return Promise.reject(new Error());
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  //仓库命名空间
  namespaced: true,
  state,
  mutations,
  actions
}


