<template>
  <div class="password_container" :style="backgroundDiv">
    <!-- 登录块 -->
    <div class="password_box">
      <!-- 标题 -->
      <div class="login_title">
        <span>修改密码</span>
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="passwordFormRef"
        :rules="passwordRules"
        :model="form"
        class="password_form"
      >
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
            class="item-code"
          ></el-input>
          <el-button @click="getCode" class="sms-code custom-btn btn-7">获取验证码</el-button>
        </el-form-item>
        <el-form-item>
          <!-- 新密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="iconfont icon-mima"
            type="password"
            placeholder="请输入新密码"
            show-password
            class="item-form"
          ></el-input>
        </el-form-item>
          
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item > 
          <el-button class="custom-btn btn-7" @click="update" style="width: 400px;margin-left: 90px;">确认修改</el-button>
        </el-form-item>
        
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
        backgroundImage: 'url(' + require('@/assets/img/bg_update.jpg') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      //表单数据对象
      form: {
        telephone: "",
        code:'',
        password:'',
      },
      //验证对象
      passwordRules: {
        //校验手机号
        telephone: [
          {required:true,message:'请输入手机号',trigger:'blur'},
          {pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message:'请输入正确的手机号',trigger:'blur'},
        ],
        code:[
          {required:true,message:"请输入验证码",triger:'blur'},
        ],
         //校验密码
         password: [
          { required: true, message: "请输入新密码", trigger: "blur" }, //必填项验证
          {
            pattern: /^(?![0-9]+$)(?!a-zA-Z]+$)[0-9A-Za-z]{6,15}$/,
            message: "长度为6~15,包括数字和字母",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //登录方法
    update() {
      //验证校验规则
      this.$refs.passwordFormRef.validate(async (valid) => {
        if (!valid) return; //验证失败
        const { data: res } = await this.$http.post("user/updatePassword",this.form); //访问后台
        if(res.flag!=200){
          return this.$message.error(res.msg)
        }
        this.$message.success(res.data)
      })
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
  color: #86d4df;
  font-size: 15px;
}

// 改变input框背景颜色
/deep/.el-input__inner {
  background-color: transparent !important;
  border: 1px solid #b3b4b9;
}
// 根节点样式
.password_container {
  background-color: #7ed8df;
  height: 100%;
}
.item-form{
  width:400px;
  margin-left: 90px;
}
.item-code{
  width:250px;
  margin-left: 90px;
}
.sms-code{
  width:120px;
  float: right;
  margin-right: 90px;
}
.password_box {
  width: 600px;
  height: 400px;
  background-color:rgba(0, 0, 0, 0.658);
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login_title{
    text-align: center;
    padding-top: 40px;
    font-size: 30px;
    color: rgb(220, 236, 160);
}
.password_form {
  position: absolute;
  bottom: 0%;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  padding-bottom: 20px;
}
/* 7 */
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
.btn-7 {
            background: linear-gradient(0deg, rgba(255, 151, 0, 1) 0%, rgba(251, 75, 2, 1) 100%);
            line-height: 42px;
            padding: 0;
            border: none;
        }
        
        .btn-7 span {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
        }
        
        .btn-7:before,
        .btn-7:after {
            position: absolute;
            content: "";
            right: 0;
            bottom: 0;
            background: rgba(251, 75, 2, 1);
            box-shadow: -7px -7px 20px 0px rgba(255, 255, 255, .9), -4px -4px 5px 0px rgba(255, 255, 255, .9), 7px 7px 20px 0px rgba(0, 0, 0, .2), 4px 4px 5px 0px rgba(0, 0, 0, .3);
            transition: all 0.3s ease;
        }
        
        .btn-7:before {
            height: 0%;
            width: 2px;
        }
        
        .btn-7:after {
            width: 0%;
            height: 2px;
        }
        
        .btn-7:hover {
            color: rgba(251, 75, 2, 1);
            background: transparent;
        }
        
        .btn-7:hover:before {
            height: 100%;
        }
        
        .btn-7:hover:after {
            width: 100%;
        }
        
        .btn-7 span:before,
        .btn-7 span:after {
            position: absolute;
            content: "";
            left: 0;
            top: 0;
            background: rgba(251, 75, 2, 1);
            box-shadow: -7px -7px 20px 0px rgba(255, 255, 255, .9), -4px -4px 5px 0px rgba(255, 255, 255, .9), 7px 7px 20px 0px rgba(0, 0, 0, .2), 4px 4px 5px 0px rgba(0, 0, 0, .3);
            transition: all 0.3s ease;
        }
        
        .btn-7 span:before {
            width: 2px;
            height: 0%;
        }
        
        .btn-7 span:after {
            height: 2px;
            width: 0%;
        }
        
        .btn-7 span:hover:before {
            height: 100%;
        }
        
        .btn-7 span:hover:after {
            width: 100%;
        }
</style>
