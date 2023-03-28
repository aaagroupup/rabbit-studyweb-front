<template>
  <div :style="backgroundDiv">
    <!-- 头部 -->
    <div class="container_head">
        <div class="head_left">
            <div style="width: 60px;">
               
            </div>
            <div style="flex: 1;"></div>
        </div>
        <div style="flex:1">
        <!-- 导航菜单 -->
        <el-menu :default-active="'1'" mode="horizontal" router >
            <el-menu-item index="/front/home"  class="iconfont icon-shouyefill">首页</el-menu-item>
            <el-menu-item index="/front/article" class="iconfont icon-huati">话题</el-menu-item>
            <el-menu-item index="/front/live" class="iconfont icon-15">直播</el-menu-item>
            <el-submenu index="2">
                <template slot="title">个人中心</template>
                <el-menu-item index="/front/course">我的课程</el-menu-item>
                <el-menu-item index="/front/order">我的订单</el-menu-item>
            </el-submenu>
            <el-menu-item index="/front/shoppingCart" class="iconfont icon-gouwuche" style="float: right;margin-right: 20px;">购物车</el-menu-item>
        </el-menu>
        </div>
        <div style="width: 240px;">
            <div v-if="!user.username" style="text-align:right;padding-right: 30px;">
                <button class="btn" @click="$router.push('/login')" style="float: left;"><span>登录</span></button>
                <button class="btn"  @click="$router.push('/register')" style="float: right;"><span>注册</span></button>
            </div>
            <div v-else>
                <el-dropdown class="dropdown">
                    <div style="display:inline-block;">
                        <img :src="url+user.avatarUrl" class="dropdown_img"/>
                        <span>{{user.nickname}}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
                        <el-dropdown-item style="font-size:14px; padding: 5px 0;">
                            <router-link style="text-decoration: none;color: back;" to="/front/person">个人信息</router-link>   
                        </el-dropdown-item>
                        <el-dropdown-item style="font-size:14px; padding: 5px 0;">
                            <router-link style="text-decoration: none;color: back;" to="/front/Password">修改密码</router-link>   
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div class="logout">
                    <a style="cursor: pointer;font-size: 14px;" @click="logout">退出</a>
                </div>
            </div>
        </div>
    </div>
    
    <div style="width: 1000px; margin: 0 auto;">
        <router-view @refreshUser='getUser'/>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            url:"https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/",
            user: sessionStorage.getItem("user")?JSON.parse(sessionStorage.getItem("user")) : {},
            username: sessionStorage.getItem("user")?JSON.parse(sessionStorage.getItem("user")).username : "",
            backgroundDiv: {
                backgroundImage: "url(" + require("@/assets/img/home-background.png") + ")",
            },
        }
    },
    created(){
        this.getUser()
    },
    methods:{
        logout(){
            window.sessionStorage.removeItem("user")
            window.sessionStorage.clear();//清除所有session
            this.$router.go(0); //回到首页
        },
        getUser(){
            if(this.username){
                //从后台获取数据
                this.$http.get("/user/username/"+this.username).then(res=>{
                    // console.log(res)
                    this.user=res.data.data
                })
            }
        },
    }
}
</script>

<style>
.container_head{
    display: flex;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #eee;
}
.head_left{
    width: 600px;
    display: flex;
    padding-left: 30px;
}
.dropdown{
    widows: 150px;
    cursor: pointer;
    text-align: right;
}
.dropdown_img{
    width: 30px;
    border-radius: 50%;
    position: relative;
    top: 10px;
    right: 5px;
}
.item{
    display: inline-block;
    width: 100px;
    color: #1e90ff;
    text-align: center;
    cursor: pointer;
}
.item a{
   color:#1e90ff;
}
.item:hover{
    background-color: lightcoral;
}
.logout{
    float: right;
    margin-right: 90px;
    
}
a:hover{
        color:red;
    }
/* From www.lingdaima.com */
.btn {
 display: inline-block;
 border-radius: 4px;
 background-color: #a49ff0;
 border: none;
 color: #FFFFFF;
 text-align: center;
 font-size: 17px;
 padding: 16px;
 width: 90px;
 transition: all 0.5s;
 cursor: pointer;
 margin: 5px;
 height: 50px;
}

.btn span {
 cursor: pointer;
 display: inline-block;
 position: relative;
 transition: 0.5s;
}

.btn span:after {
 content: '»';
 position: absolute;
 opacity: 0;
 top: 0;
 right: -15px;
 transition: 0.5s;
}

.btn:hover span {
 padding-right: 15px;
}

.btn:hover span:after {
 opacity: 1;
 right: 0;
}    
</style>