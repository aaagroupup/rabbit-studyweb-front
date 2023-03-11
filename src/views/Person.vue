<template>
  <div>
    <el-card style="widows: 600px;">
        <el-form ref="updateFormRef" :rules="updateFormRules" :model="form"  label-width="80px">
            <div style="text-align: center;margin:10px 0">
              <el-form-item prop="avatarUrl">
                <el-upload 
                :action="uploadUrl" 
                class="avatar-uploader"
                :show-file-list="false"
                :on-success="handlerAvatarSuccess"
                :before-upload="beforeUpload"
                ref="upload">
                <img v-if="form.avatarUrl" :src="downloadUrl+this.form.avatarUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload> 
              </el-form-item>
              
            </div>
          <el-form-item label="用户名">
            <el-input v-model="form.username" disabled autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"  prop="email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话"  prop="telephone">
            <el-input v-model="form.telephone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <button class="custom-btn btn-11" @click="cancelUpdate">取消</button>
          <button class="custom-btn btn-11" style="margin-left: 20px;" @click="updateUser">修改</button>
        </div>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
          uploadUrl:'http://localhost:9381/common/upload?name=',
          downloadUrl:"https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/",
          form:{},
          user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},
          //修改表单验证
          updateFormRules: {
            email:[
              {required:true,message:'请输入正确的邮箱地址',trigger:'blur'},
              {type:'email',message:'请输入正确邮箱地址',trigger:'blur'}
            ],
            telephone:[
              {required:true,message:'请输入手机号',trigger:'blur'},
              {pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message:'请输入正确的手机号',trigger:'blur'},
            ],
          },
        }
    },
    created(){
        this.load()
    },
    methods:{
        load(){
          const username=this.user.username
          if(!username){
            this.$message.warning("请您先登录!")
            return
          }
          this.$http.get("/user/username/"+username).then(res=>{
            // console.log(res)
            this.form=res.data.data
          })
        },
        handlerAvatarSuccess(res){
            //res是文件的路径
            this.form.avatarUrl=res.data
        },
        beforeUpload (file) {
        if(file){
          const suffix = file.name.split('.')[1]
          const size = file.size / 1024 / 1024 < 2
          if(['png','jpeg','jpg'].indexOf(suffix) < 0){
            this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
            this.$refs.upload.clearFiles()
            return false
          }
          if(!size){
            this.$message.error('上传文件大小不能超过 2MB!')
            return false
          }
          return file
        }
    },
        updateUser(){
          this.$refs.updateFormRef.validate(async valid=>{
            if (!valid) return;
            await this.$http.put("/user/updateUser",this.form).then(res=>{
              if(res.data.flag==200){
                this.$message.success(res.data.data)
                this.dialogFormVisible=false
                this.load()
                this.$emit('refreshUser')
              }else{
                this.$message.error(res.data.msg)
              }
            })
          })
        },
        cancelUpdate(){
          this.$router.push("/front/home");
        }
    },
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .custom-btn {
            width: 110px;
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
        /* 11 */
        
        .btn-11 {
            border: none;
            background: rgb(226, 169, 191);
            background: linear-gradient(0deg, rgba(226, 169, 191) 0%, rgb(196, 173, 182) 100%);
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