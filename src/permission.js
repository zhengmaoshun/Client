
//第一问:vue-router守卫有几种?
//路由独享守卫(1) beforeEnter
//全局守卫(2):beforeEach前置守卫、afterEach后置守卫
//组件内守卫(3)：beforeRouteEnter beforeRouteUpdate beforeRouteLeave
//引入路由器
import router from './router'
//引入仓库:判断token[能决定用户是否登录] name[能决定用户信息有没有]
import store from './store'
//引入消息框:element-ui里面组件
import { Message } from 'element-ui'
//引入进度条
import NProgress from 'nprogress' 
import 'nprogress/nprogress.css' 
NProgress.configure({ showSpinner: false })
//获取持久化存储的token
import { getToken } from '@/utils/auth'
//目前分析不出来
import getPageTitle from '@/utils/get-page-title'

//常量存储数组,数组里面存储Login组件的路由K
const whiteList = ['/login'];

//全局前置守卫:路由跳转之前会进行拦截
router.beforeEach(async(to, from, next) => {
  //守卫检测到路由变化进度条就开始动
  NProgress.start();
  //设置网页标题,将每一个路由对象的元信息title的参数设置为网页标题
  document.title = getPageTitle(to.meta.title);
  //获取持久化token:能判断用户有没有登录成功。
  //用户登录成功以后，才会有token，用户登录失败是没有token！！！
  const hasToken = getToken();
  //获取仓库里面的用户名[用户信息]
  const hasGetUserInfo = store.getters.name;
  //用户登录
  if (hasToken) {
    //登陆了还想去login，人家不让你去，停留在首页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      //用户登录了，但是去的不是login,如果有用户信息直接放行
      if (hasGetUserInfo) {
        next()
      } else {
        //用户登录了,但是去的不是login,如果没有用户信息
        try {
          //通知vuex发请求获取用户信息
          await store.dispatch('user/getInfo');
          //有了用户信息在放行
          next()
        } catch (error) {
          //token过期获取不到用户信息，清空数据，让用户重新登录，获取新的token
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
      //未登录  whiteList = ['/login']
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      //可以跳转到你曾经想去而没有去成那个地方
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})
//全局后置守卫:路由跳转完毕会执行
router.afterEach(() => {
  //路由跳转完毕精度条结束
  NProgress.done();
})
