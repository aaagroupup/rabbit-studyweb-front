<template>
  <!-- 引入布局 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header style="height: 70px;">
      <div>
        <img src="../assets/img/logo.png" alt  style="width: 200px;height: 150px;"/>
      </div>
      <span style="padding-left: 30%;">欢迎使用在线学习平台</span>
      <span><router-link to="/front/home" style="color: red;">点我前往前台页面</router-link></span>
      <button class="custom-btn btn-6" @click="logout">退出</button>
    </el-header>
    <!-- 主体部分 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-Button" @click="toggleCollapase">|||</div>
        <el-menu background-color="#acf7e0" text-color="back" active-text-color="#e8b8ee" 
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
  background-color: #b7f1ec;
  display: flex;
  justify-content: space-between; //左右贴边
  padding-left: 0%; //左边界
  color: back;
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
  background-color: #b7d4f1;
  .el-menu{
    border-right:none;
  }
}
// 主体样式
.el-main {
  background-color: #ccf3ca;
}
img {
  width: 55px;
  height: 55px;
}
.toggle-Button{
  background-color: #b7d4f1;
  font-size:10px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;//显示小手
}
/* 6 */
.custom-btn {
            width: 82px;
            height: 45px;
            color: rgb(255, 255, 255);
            border-radius: 5px;
            padding: 10px 25px;
            font-family: 'Lato', sans-serif;
            font-weight: 500;
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            display: inline-block;
            box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, .5), 7px 7px 20px 0px rgba(0, 0, 0, .1), 4px 4px 5px 0px rgba(0, 0, 0, .1);
            outline: none;
            margin-right: 20px;
        }     
.btn-6 {
            background: rgb(186, 236, 186);
            background: radial-gradient(circle, rgba(186, 236, 186) 0%, rgb(182, 164, 233) 100%);
            line-height: 42px;
            padding: 0;
            border: none;
        }
        
        .btn-6 span {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
        }
        
        .btn-6:before,
        .btn-6:after {
            position: absolute;
            content: "";
            height: 0%;
            width: 1px;
            box-shadow: -1px -1px 20px 0px rgb(204, 103, 103), -4px -4px 5px 0px rgba(204, 103, 103), 7px 7px 20px 0px rgba(0, 0, 0, .4), 4px 4px 5px 0px rgba(0, 0, 0, .3);
        }
        
        .btn-6:before {
            right: 0;
            top: 0;
            transition: all 500ms ease;
        }
        
        .btn-6:after {
            left: 0;
            bottom: 0;
            transition: all 500ms ease;
        }
        
        .btn-6:hover {
            background: transparent;
            color: #070113;
            box-shadow: none;
        }
        
        .btn-6:hover:before {
            transition: all 500ms ease;
            height: 100%;
        }
        
        .btn-6:hover:after {
            transition: all 500ms ease;
            height: 100%;
        }
        
        .btn-6 span:before,
        .btn-6 span:after {
            position: absolute;
            content: "";
            box-shadow: -1px -1px 20px 0px rgb(241, 225, 178), -4px -4px 5px 0px rgba(241, 225, 178), 7px 7px 20px 0px rgba(0, 0, 0, .4), 4px 4px 5px 0px rgba(0, 0, 0, .3);
        }
        
        .btn-6 span:before {
            left: 0;
            top: 0;
            width: 0%;
            height: .5px;
            transition: all 500ms ease;
        }
        
        .btn-6 span:after {
            right: 0;
            bottom: 0;
            width: 0%;
            height: .5px;
            transition: all 500ms ease;
        }
        
        .btn-6 span:hover:before {
            width: 100%;
        }
        
        .btn-6 span:hover:after {
            width: 100%;
        }
</style>
