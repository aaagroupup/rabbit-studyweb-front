<template>
  <div :style="backgroundDiv">
    <!-- 头部 -->
    <div style="display: flex;height: 60px;line-height: 60px;border-bottom: 1px solid #eee;">
        <div style="width: 300px;display: flex;padding-left: 30px;">
            <div style="width: 60px;">
                <img src="../assets/img/卖萌.gif" style="width: 50px;position: relative;top:5px"/>
            </div>
            
            <div style="flex: 1;">好好学习平台</div>
        </div>
        <div style="flex:1">
        <!-- 导航菜单 -->
        <el-menu :default-active="'1'"  mode="horizontal" router >
            <el-menu-item index="/front/home">首页</el-menu-item>
            <el-menu-item index="/front/article">话题</el-menu-item>
            <el-submenu index="2">
                <template slot="title">个人中心</template>
                <el-menu-item index="/front/course">我的课程</el-menu-item>
                <el-menu-item index="/front/order">我的订单</el-menu-item>

            </el-submenu>

            <el-menu-item index="/front/live">直播</el-menu-item>
            <el-menu-item index="/front/shoppingCart">购物车</el-menu-item>
        </el-menu>
        </div>
        <div style="width: 200px;">
            <div v-if="!user.username" style="text-align:right;padding-right: 30px;">
                <el-button @click="$router.push('/login')">登录</el-button>
                <el-button @click="$router.push('/register')">注册</el-button>
            </div>
            <div v-else>
                <el-dropdown style="widows: 150px;cursor: pointer;text-align: right;">
                    <div style="display:inline-block;">
                        <img :src="url+user.avatarUrl" style="width: 30px;border-radius: 50%;position: relative;top: 10px;right: 5px;"/>
                        <span>{{user.nickname}}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
                        <el-dropdown-item style="font-size:14px; padding: 5px 0;">
                            <router-link style="text-decoration: none;color: back;" to="/front/person">修改个人信息</router-link>   
                        </el-dropdown-item>
                        <el-dropdown-item style="font-size:14px; padding: 5px 0;">
                            <router-link style="text-decoration: none;color: back;" to="/front/Password">修改密码</router-link>   
                        </el-dropdown-item>
                        <el-dropdown-item style="font-size:14px;padding: 5px 0;">
                            <span style="text-decoration: none;" @click="logout">退出</span>
                        </el-dropdown-item>  
                    </el-dropdown-menu>
                </el-dropdown>
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
            url:'http://localhost:9382/common/download?name=',
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
            this.$router.push("/login"); //回到首页
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
</style>