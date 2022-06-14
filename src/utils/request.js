//引入axios
import axios from 'axios'
//引入element-ui里面弹框提示
import { MessageBox, Message } from 'element-ui'
//引入仓库:获取仓库里面的token
import store from '@/store'
//本地存储获取token
import { getToken } from '@/utils/auth'
//利用axios.create创建一个新的axios实例
const service = axios.create({
  //请求基础路径
  //如果你目前开发环境是development【开发环境】，发请求基础路径/dev-api
  //上线环境基础路径 /prod-api
  baseURL: process.env.VUE_APP_BASE_API,
  //请求超时时间的设置
  timeout: 5000
})
//请求拦截器
service.interceptors.request.use(config => {
  //通过请求头给服务器携带公共参数:token
  if (store.getters.token) {
    config.headers['token'] = getToken()
  }
  return config
}, error => {
  return Promise.reject(error)
}
)
//相应拦截器
service.interceptors.response.use(response => {
  //获取服务器返回数据【简化:只需response.data,右侧字段的数据】
  const res = response.data;
  //潘家成mock数据：code==20000代表成功,不是20000代表失败
  //真实的接口code状态200或者20000都是代表成功
  //比如:状态201 失败
  //比如:状态码200
  //响应失败
  if (res.code !== 20000 && res.code != 200) {

    Message({
      message: res.message || 'Error',
      type: 'error',
      duration: 5 * 1000
    })

    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      // to re-login
      MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        confirmButtonText: 'Re-Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    return Promise.reject(new Error(res.message || 'Error'))
  } else {
    //相应成功的判断
    return res
  }
},
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
