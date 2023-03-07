<template>
  <div class="register_container" :style="backgroundDiv">
    <!-- 登录块 -->
    <div class="register_box">
      <div class="register_title">
        <span>欢迎注册</span>
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="registerFormRef"
        :rules="registerRules"
        :model="form"
        class="register_form"
      >
        <!--用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            prefix-icon="iconfont icon-denglu"
            placeholder="请输入用户名"
            class="item-form"
          ></el-input>
        </el-form-item>
        <!--密码 -->
        <el-form-item prop="password">
          <el-input
            class="item-form"
            v-model="form.password"
            prefix-icon="iconfont icon-mima"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <!--昵称 -->
        <el-form-item prop="nickname">
          <el-input
            class="item-form"
            v-model="form.nickname"
            prefix-icon="iconfont icon-nicheng"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <!--邮箱 -->
        <el-form-item prop="email">
          <el-input
            class="item-form"
            v-model="form.email"
            prefix-icon="iconfont icon-youxiang"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <!--手机号 -->
        <el-form-item prop="telephone">
          <el-input
            v-model="form.telephone"
            prefix-icon="iconfont icon-iconfontphone"
            placeholder="请输入手机号"
            class="item-form"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code">
          <el-input
            v-model="form.code"
            prefix-icon="iconfont icon-yanzhengma"
            placeholder="请输入验证码"
           style="width:420px;margin-left: 90px;"></el-input>
          <el-button style="width:150px;float: right;margin-right: 92px;" class="custom-btn btn-11" @click="getCode">获取验证码</el-button>
        </el-form-item>
        <el-form-item>
          
        </el-form-item>
        <!-- 按钮 -->
        
        <el-form-item> 
          <el-button class="custom-btn btn-11" @click="register" style="width: 600px;margin-left: 90px;">注册</el-button>
        </el-form-item>
        <router-link to="/login" class="login">已有用户?点我登录</router-link>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //背景图片
      backgroundDiv:{
        backgroundImage: 'url(' + require('@/assets/img/bg_register.jpg') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      //表单数据对象
      form: {
        username:'',
        password:'',
        nickname:'',
        email:'',
        telephone: "",
        code:''
      },
      //验证对象
      registerRules: {
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:5,max:13,message:'长度在 5 到 13 个字符',trigger:'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {pattern: /^(?![0-9]+$)(?!a-zA-Z]+$)[0-9A-Za-z]{6,15}$/,message:"长度为6~15,包括数字和字母",trigger:'blur'}
        ],
        email:[
          {required:true,message:'请输入邮箱',trigger:'blur'},
          {type:'email',message:'请输入正确的邮箱',trigger:'blur'}
        ],
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
    //登录方法
    register() {
      //验证校验规则
      this.$refs.registerFormRef.validate(async (valid) => {
        if (!valid) return; //验证失败
        const { data: res } = await this.$http.post("login/register",this.form); //访问后台
        //console.log(res)
        if (res.flag == 200) {
          this.$message.success(res.data)
        }else{
          this.$message.error(res.msg)
        }
      });
    },
    getCode(){
      this.$http.get("/login/sendMsg?phone="+this.form.telephone).then(res=>{
        if(res.data.flag!=200){
          return this.$message.error(res.data.msg)
        }
        this.$message.success(res.data.msg)
      })
    },
  },


};

</script>
<style lang="less" scoped>
// 改变input里的字体颜色
/deep/input::-webkit-input-placeholder {
  color: #ce889f;
  font-size: 15px;
}

// 改变input框背景颜色
/deep/.el-input__inner {
  background-color: transparent !important;
  border: 1px solid #b3b4b9;
}
.item-form{
  width: 600px;
  margin-left: 90px;
}
// 根节点样式
.register_container {
  height: 100%;
}
.register_title{
    text-align: center;
    padding-top: 40px;
    font-size: 30px;
    color: rgb(224, 161, 211);
}
.register_box {
  width: 800px;
  height: 600px;
  background-color:rgba(0, 0, 0, 0.555);
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.register_form {
  position: absolute;
  bottom: 0%;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  padding-bottom: 20px;
}
.login{
  color: #fff;
  float:left;
  padding-top: 10px;
  padding-left: 5px;
}
/* 11 */
.custom-btn {
            width: 130px;
            height: 40px;
            color: #fff;
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
        }      
.btn-11 {
            border: none;
            background: rgb(251, 33, 117);
            background: linear-gradient(0deg, rgba(251, 33, 117, 1) 0%, rgba(234, 76, 137, 1) 100%);
            color: #fff;
            overflow: hidden;
        }
        
        .btn-11:hover {
            text-decoration: none;
            color: #fff;
        }
        
        .btn-11:before {
            position: absolute;
            content: '';
            display: inline-block;
            top: -180px;
            left: 0;
            width: 30px;
            height: 100%;
            background-color: #fff;
            animation: shiny-btn1 3s ease-in-out infinite;
        }
        
        .btn-11:hover {
            opacity: .7;
        }
        
        .btn-11:active {
            box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, .3), -4px -4px 6px 0 rgba(116, 125, 136, .2), inset -4px -4px 6px 0 rgba(255, 255, 255, .2), inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
        }
        
        @-webkit-keyframes shiny-btn1 {
            0% {
                -webkit-transform: scale(0) rotate(45deg);
                opacity: 0;
            }
            80% {
                -webkit-transform: scale(0) rotate(45deg);
                opacity: 0.5;
            }
            81% {
                -webkit-transform: scale(4) rotate(45deg);
                opacity: 1;
            }
            100% {
                -webkit-transform: scale(50) rotate(45deg);
                opacity: 0;
            }
        }
</style>
