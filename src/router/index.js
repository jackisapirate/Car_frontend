import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'
import axios from "axios";
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Home,
    children: [
      {
        path: '/index',
        name: 'Index',
        mete: {
          title: "Home"
        },
        component: Index
      },
      {
        path: '/userCenter',
        name: 'UserCenter',
        meta: {
          title: "User Center"
        },
        component: () => import('../views/sys/UserCenter.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

// 路由前的判断
router.beforeEach((to, from, next) => {
  // 查看是否已经获得路由
  let hasRoute = store.state.menus.hasRoute;

  let token = localStorage.getItem("token")
  if(to.path == '/login'){
    next()
  } else if(!token){
    next({path: '/login'})
  } else if(token && !hasRoute){
    axios.get("/sys/menu/nav", {
      headers:{
        Authorization: localStorage.getItem("token")
      }
    }).then(res=>{
      // 拿到menuList
      store.commit("setMenuList", res.data.data.nav)

      // 拿到用户权限
      store.commit("setPermList", res.data.data.authorities)

      // 动态绑定路由
      let newRoutes = router.options.routes;
      res.data.data.nav.forEach(menu => {
        if (menu.children) {
          menu.children.forEach(e=>{
            // 转成路由
            let route = menuToRoute(e)
            // 把路由添加到路由管理中
            if(route) {
              newRoutes[0].children.push(route);
            }
          })
        }
      })
      router.addRoutes(newRoutes);
      store.commit("changeRouteStatus", true);
    })
  }

  next();
})

const menuToRoute = (menu) =>{
  if(!menu.component){
    // 如果component为空就返回null
    return null;
  }
  let route = {
    name: menu.name,
    path: menu.path,
    meta: {
      icon: menu.icon,
      title: menu.title
    }
  }
  route.component = ()=> import('@/views/' + menu.component + '.vue')

  return route;
}
export default router



