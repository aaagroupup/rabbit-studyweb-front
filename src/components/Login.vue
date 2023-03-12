<template>
  <div class="login_container" :style="backgroundDiv">
    <!-- 登录块 -->
    <div class="login_box">
      <p class="login_title">
        <span :class="isActiveIndex === 0 ? 'isActiveTitle' : ''" @click="accountLogin">账号登录</span><!-- 利用三元运算符判定点击了哪个登录,从而绑定样式 -->
        <span :class="isActiveIndex === 1 ? 'isActiveTitle' : ''" @click="smsLogin">短信登录</span>
      </p>
      <div style="padding-top: 20px; float: right; padding-right: 10px"></div>
      <!-- 账户登录 -->
      <el-form
        v-if ="isActive"
        ref="loginFormRef"
        :rules="loginRules"
        :model="loginForm"
        class="login_form"
      >
        <!--用户名 -->
        <el-form-item prop="username">
          <el-input class="form-item" clearable v-model="loginForm.username" prefix-icon="iconfont icon-denglu" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input class="form-item" clearable v-model="loginForm.password" prefix-icon="iconfont icon-mima" type="password" placeholder="请输入密码" show-password ></el-input>
        </el-form-item>
        <el-form-item></el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button class="custom-btn btn-15 ac_login" @click="login">立即登录</el-button>
        </el-form-item>
        <router-link to="/updatePassword" class="update_password">忘记密码？</router-link>
        <router-link to="/register" class="regist">没有用户？点我注册</router-link>
      </el-form>

      <!-- 手机号登录 -->
      <el-form
        v-else
        ref="telLoginFormRef"
        :rules="telLoginRules"
        :model="telForm"
        class="login_form"
      >
        <!--手机号 -->
        <el-form-item prop="telephone">
          <el-input v-model="telForm.telephone" prefix-icon="iconfont icon-iconfontphone" placeholder="请输入手机号" class="form-item"></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code">
          <el-input v-model="telForm.code" prefix-icon="iconfont icon-yanzhengma" placeholder="请输入验证码" class="form-code"></el-input>
          <el-button style="width:120px;float: right;margin-right: 128px;" @click="getCode" class="custom-btn btn-4">获取验证码</el-button>
        </el-form-item>
        <el-form-item>
          
        </el-form-item>
        <!-- 按钮 -->
        
        <el-form-item> 
          <el-button class="custom-btn btn-4 tel_login" @click="telLogin">立即登录</el-button>
        </el-form-item>
        <router-link to="/updatePassword" class="update_password">忘记密码？</router-link>
        <router-link to="/register" class="regist">没有用户？点我注册</router-link>
        
      </el-form>
    </div>
  </div>
</template>
<script>
import { setRoutes } from "@/router";
export default {
  data() {
    return {
      isActive: true, // 用于实现切换登录，作为判断
      isActiveIndex:0,
      //背景图片
      backgroundDiv: {
        backgroundImage: "url(" + require("@/assets/img/login.gif") + ")",
      },
      //表单数据对象
      loginForm: {
        username: "admin001",
        password: "12345a",
      },
      telForm:{
        telephone:'',
        code:""
      },
      //验证对象
      loginRules: {
        //校验用户名
        username: [
          { required: true, message: "请输入用户名", trigger: "blur"}, //必填项验证
          {min: 5,max: 13,message: "长度在 5 到 13 个字符", trigger: "blur",},
        ],
        //校验密码
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }, //必填项验证
          {
            pattern: /^(?![0-9]+$)(?!a-zA-Z]+$)[0-9A-Za-z]{6,15}$/,
            message: "长度为6~15,包括数字和字母",trigger: "blur",
          },
        ],
      },
      //手机号登录验证对象
      telLoginRules: {
        //校验手机号
        telephone: [
          {required:true,message:'请输入手机号',trigger:'blur'},
          {pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message:'请输入正确的手机号',trigger:'blur'},
        ],
        code:[
          {required:true,message:"请输入验证码",triger:'blur'},
        ]
      },
    };  
  },
  methods: {
    accountLogin() { // 账号登录
      this.isActive = true
      this.isActiveIndex = 0
    },
    smsLogin() { // 短信登录
      this.isActive = false
      this.isActiveIndex = 1
    },
    //重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    //z账户登录方法
    login() {
      //验证校验规则
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return; //验证失败
        const { data: res } = await this.$http.post("/login/accountLogin", this.loginForm); //访问后台
        if (res.flag == 200) {
          window.sessionStorage.setItem("user", JSON.stringify(res.data)); //存储user对象
          window.sessionStorage.setItem(
            "menus",
            JSON.stringify(res.data.menus)
          ); //存储菜单
          //动态设置当前用户路由
          setRoutes();
          //console.log(res.data)
          if (res.data.roleId === 5) {
            //console.log("跳转成功")
            this.$router.push({ path: "/front/home" }); //页面路由跳转
          } else {
            this.$router.push({ path: "/home" }); //页面路由跳转
          }

          this.$message.success(res.msg); //信息提示
        } else {
          this.$message.error(res.msg); //错误提示
        }
      });
    },
    //获取验证码
    getCode(){
      this.$http.get("/login/sendMsg?phone="+this.telForm.telephone).then(res=>{
        if(res.data.flag!=200){
          return this.$message.error("短信发送失败！")
        }
        this.$message.success(res.data.msg)
      })
    },
    //手机号登录方法
    telLogin() {
      //验证校验规则
      this.$refs.telLoginFormRef.validate(async (valid) => {
        if (!valid) return; //验证失败
        const { data: res } = await this.$http.post("login/telLogin",this.telForm); //访问后台
        // console.log(res)
        if (res.flag == 200) {
          window.sessionStorage.setItem("user",JSON.stringify(res.data));//存储user对象
          window.sessionStorage.setItem("menus",JSON.stringify(res.data.menus));//存储菜单
          //动态设置当前用户路由
          setRoutes()
          // console.log(res.data)
          if(res.data.role==='普通用户'){
            this.$router.push({ path: "/front/home" }); //页面路由跳转
          }else{
            this.$router.push({ path: "/home" }); //页面路由跳转
          }
          this.$message.success(res.msg); //信息提示
        } else {
          this.$message.error(res.msg); //错误提示
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
// 改变input里的字体颜色
/deep/input::-webkit-input-placeholder {
  color: #bbebb1e5;
  font-size: 15px;
}

// 改变input框背景颜色
/deep/.el-input__inner {
  background-color: transparent !important;
  border: 1px solid #8ef7f1;
}
//改变校验样式
/deep/ .el-form-item__error{
  margin-left: 130px;
}
.login_title{
    text-align: center;
    padding-top: 80px;
    font-size: 30px;
    color: rgb(161, 158, 158);
}
.login_title span{
    margin: 0 20px 0 20px;
    cursor: pointer;
}
.login_title span:hover{
    color: rgb(189, 223, 216);
    font-weight: bolder;
}
.isActiveTitle{
    color: rgb(248, 248, 246);
    font-weight: bolder;
}
.regist{
  float: left;
  padding-top: 10px;
  padding-left: 5px;
  color: #fff;
  font-size: 15px;
}
.update_password{
  float: right;
  padding-right: 5px;
  color: #fff;
  font-size: 15px;
}
// 根节点样式
.login_container {
  height: 100%;
}

.login_box {
  width: 670px;
  height: 430px;
  background-color: rgba(0, 0, 0, 0.637);
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.form-item{
  width: 400px;
  margin-left: 124px;
}
.form-code{
  width:260px;
  margin-left: 124px;
}

.login_form {
  position: absolute;
  bottom: 0%;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  padding-bottom: 20px;
}
/* 15 */
.tel_login,
.ac_login{
  margin-left: 124px;
}

.custom-btn {
  width: 400px;
  height: 40px;
  color: #fff;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: "Lato", sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  outline: none;
}

.btn-4 {
            background-color: #ec8b93;
            background-image: linear-gradient(315deg, #ec8b93 0%, #ec8b93 74%);
            line-height: 42px;
            padding: 0;
            border: none;
        }
        
        .btn-4:hover {
            background-color: #e6b1b5;
            background-image: linear-gradient(315deg, #e6b1b5 0%, #e6b1b5 74%);
        }
        
        .btn-4 span {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
        }
        
        .btn-4:before,
        .btn-4:after {
            position: absolute;
            content: "";
            right: 0;
            top: 0;
            box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, .9), -4px -4px 6px 0 rgba(116, 125, 136, .2), inset -4px -4px 6px 0 rgba(255, 255, 255, .9), inset 4px 4px 6px 0 rgba(116, 125, 136, .3);
            transition: all 0.3s ease;
        }
        
        .btn-4:before {
            height: 0%;
            width: .1px;
        }
        
        .btn-4:after {
            width: 0%;
            height: .1px;
        }
        
        .btn-4:hover:before {
            height: 100%;
        }
        
        .btn-4:hover:after {
            width: 100%;
        }
        
        .btn-4 span:before,
        .btn-4 span:after {
            position: absolute;
            content: "";
            left: 0;
            bottom: 0;
            box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, .9), -4px -4px 6px 0 rgba(116, 125, 136, .2), inset -4px -4px 6px 0 rgba(255, 255, 255, .9), inset 4px 4px 6px 0 rgba(116, 125, 136, .3);
            transition: all 0.3s ease;
        }
        
        .btn-4 span:before {
            width: .1px;
            height: 0%;
        }
        
        .btn-4 span:after {
            width: 0%;
            height: .1px;
        }
        
        .btn-4 span:hover:before {
            height: 100%;
        }
        
        .btn-4 span:hover:after {
            width: 100%;
        }
// 15
.btn-15 {
  background: #98cef3;
  border: none;
  z-index: 1;
}

.btn-15:after {
  position: absolute;
  content: "";
  width: 0;
  height: 100%;
  top: 0;
  right: 0;
  z-index: -1;
  background-color: #f38ae5;
  border-radius: 5px;
  box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    7px 7px 20px 0px rgba(0, 0, 0, 0.1), 4px 4px 5px 0px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.btn-15:hover {
  color: #fff;
}

.btn-15:hover:after {
  left: 0;
  width: 100%;
}

.btn-15:active {
  top: 2px;
}
</style>
