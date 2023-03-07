<template>
  <!-- 引入布局 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header style="height: 70px;">
      <div>
        <img src="../assets/img/logo.png" alt  style="width: 200px;height: 150px;"/>
      </div>
      <span style="padding-left: 30%;">欢迎使用运动健康服务平台后端系统</span>
      <span><router-link to="/front/home" style="color: red;">点我前往前台页面</router-link></span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体部分 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-Button" @click="toggleCollapase">|||</div>
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409eff" 
        unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
           <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="i.path" v-for="i in item.subMenuList" :key="i.id" @click="savaNavState(i.path)">
              <template slot="title">
              <i :class="i.icon"></i>
              <span>{{i.title}}</span>
            </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容 -->
      <el-main>
        <router-view  @refreshMenu="getMenuList"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      //菜单列表
      menuList:[],
      isCollapse:false,//伸缩
      activePath:'/welcome',//默认路径
    }
  },
  created(){
    //查询menuList
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath');//取出session里的path动态修改activepath
  },
  methods: {
    logout() {
      this.$http.get("login/exit").then(res=>{//请求退出接口
        this.$message.success(res.data.data);
      })
      window.sessionStorage.removeItem("user"); 
      window.sessionStorage.clear();//清除所有session
      this.$router.push("/login"); //回到首页
    },
    //获取导航菜单方法
    getMenuList(){
      this.$http.get("menu/menus").then(res=>{
        //console.log(res)
        if(res.data.flag!=200) return this.$message.error(res.data.msg);//访问失败的错误信息
        this.menuList=res.data.data;//访问成功 数据回填
      })
      
    },
    //控制伸缩
    toggleCollapase(){
      this.isCollapse=!this.isCollapse;
    },
    savaNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);//存放在session里
      this.activePath=activePath;
    },

  },
  
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

// 头部样式
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; //左右贴边
  padding-left: 0%; //左边界
  color: #fff;
  align-items: center;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
// 侧边栏样式
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right:none;
  }
}
// 主体样式
.el-main {
  background-color: #eaedf1;
}
img {
  width: 55px;
  height: 55px;
}
.toggle-Button{
  background-color: #4A5064;
  font-size:10px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;//显示小手
}
</style>
