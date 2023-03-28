import Vue from "vue";
import VueRouter from "vue-router";
//引入login组件
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import Err from "../components/Error/404.vue";
import axios from "axios";
import FrontHome from "../views/Home.vue"
import Front from '../views/Front.vue'
import ShoppingCart from '@/views/ShoppingCart'
import Order from '@/views/Order'
//引入alert
import { Message } from 'element-ui';


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name:'登录',
    component: Login,
  },
  {
    path: "/register",
    name:'用户注册',
    component: ()=>import("../components/Register.vue"),
  },
  {
    path: "/updatePassword",
    name:'修改密码',
    component: ()=>import("../components/UpdatePassword.vue"),
  },
  {
    path:'*',
    name:'404',  
    component:Err
  },
  {
    path:"/front",
    name:'Front',
    component:Front,
    redirect:FrontHome,
    children:[
      {
        path:'home',
        name:'FrontHome',  
        component: FrontHome,
      },
      {
        path:'article',
        name:'FrontArticle',  
        component: ()=>import('../views/article/Article.vue'),
      },
      {
        path:'articleDetail',
        name:'ArticleDetail',  
        component: ()=>import('../views/article/ArticleDetail.vue'),
      },
      {
        path:'person',
        name:'PersonDetail',
        component:()=>import('../views/Person.vue')
      },
      {
        path:'password',
        name:'Password',
        component:()=>import('../views/Password.vue')
      },
      {
        path:'shoppingCart',
        name:'购物车',
        component:ShoppingCart
      },
      {
        path:'order',
        name:'订单管理',
        component:Order
      },
      {
        path:'live',
        name:'直播',
        component:()=>import('../views/Live.vue')
      },
      {
        path:'course',
        name:"已购买的课程",
        component:()=>import('../views/Course.vue')
      },
      {
        path:"course/course_detail",
        name:"课程详情",
        component:()=>import('../views/CourseDetail.vue')
      },
      {
        path:'course/buyCourse',
        name:"购买课程",
        component:()=>import('../views/BuyCourse.vue')
      },
    ]
  }
];


//刷新页面会导致页面路由重置
export const setRoutes = () => {
  const storeMenus = sessionStorage.getItem("menus");
  //console.log(storeMenus);
  if (storeMenus) {
    //拼装动态路由
    const manageRoute = {path: "/home",name:'Manage',component: Home, redirect: "/back",children: [{ path: "/back", component: Welcome }],};
    const menus = JSON.parse(storeMenus);
    menus.forEach((item) => {
      let itemMenu = {path: item.path,name: item.name,component: () => import("../components/" + item.pagePath + ".vue"),children:[]};
      manageRoute.children.push(itemMenu)
    });

    //获取当前的路由对象名称数组
    const currentRouteNames=router.getRoutes().map(v=>v.name)
    if(!currentRouteNames.includes('Manage')){
      //动态添加现在的路由对象
    router.addRoute(manageRoute);
    }
    
  }
};




const router = new VueRouter({
  mode:'history',
  routes,
});
setRoutes()
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to访问到哪
  //from从哪访问
  //next 接着干 next(url) 重定向到url上 next()继续访问to路径
  
  if (to.path == "/login") return next();//访问登录页面直接放行
  if (to.path == "/updatePassword") return next();//访问修改密码页面直接放行
  if (to.path == "/register") return next();//访问注册页面直接放行
  if (to.path == "/front/home")return next();//访问前台页面直接放行
    
  //获取user
  const userFlag = window.sessionStorage.getItem("user"); //取出当前用户
  if (!userFlag){
    //无值,返回登录页
    Message.warning("请您先登录!")
    return next("/login"); 
  }
  next(); //符合要求，放行
});

axios.interceptors.request.use((config) => {
  config.headers["Content-type"] = "application/json;charset=utf-8";
  let user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  if (user) {
    config.headers["token"] = user.token; //设置请求头
  }
  return config;
}); 
export default router;
