//引入Vue
import Vue from 'vue'
//引入vue-router插件:配置路由
import Router from 'vue-router'
//使用vue-router插件
Vue.use(Router)


//潘家成帮我们已经搭建好的组件，最大的一级路由组件[骨架组件]
import Layout from '@/layout'
import VueRouter from 'vue-router'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */


export const constantRoutes = [
  //登录的路由
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  //404路由
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  //首页路由
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      //路由元信息:设置侧边栏标题，与icon图标
      meta: {
        title: '首页',
        icon: 'dashboard'
      }
    }]
  },
  //商品管理路由配置
  {
    path: '/product',
    component: Layout,
    meta: {
      title: '商品管理',
      icon: 'el-icon-zoom-in'
    },
    //不关一级路由还是二级路由都需要命名，命名名字必须和老师一模一样的[菜单权限，通过name进行匹配的]
    name: 'Product',
    //二级路由
    children: [{
        //一定要注意,路径path单词都是小写的
        path: 'trademark',
        component: () => import('@/views/product/trademark'),
        meta: {
          title: '品牌管理',
          icon: 'el-icon-camera'
        },
        name: 'Trademark'
      },
      {
        path: 'attr',
        component: () => import('@/views/product/attr'),
        meta: {
          title: '平台属性管理',
          icon: 'el-icon-s-operation'
        },
        name: 'Attr'
      },
      {
        path: 'spu',
        component: () => import('@/views/product/spu'),
        meta: {
          title: 'spu管理',
          icon: 'el-icon-s-marketing'
        },
        name: 'Spu'
      },
      {
        path: 'sku',
        component: () => import('@/views/product/sku'),
        meta: {
          title: 'sku管理',
          icon: 'el-icon-view'
        },
        name: 'Sku'
      },
      {
        path: 'test',
        component: () => import('@/views/product/test'),
        meta: {
          title: '测试管理',
          icon: 'el-icon-view'
        },
        name: 'ceshi'
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

//进行路由配置
const createRouter = () => new Router({
  //滚动条的滚动行为
  scrollBehavior: () => ({
    y: 0
  }),
  //配置路由信息
  routes: constantRoutes
})

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
