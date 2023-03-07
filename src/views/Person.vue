<template>
  <div>
    <el-card style="widows: 600px;">
        <el-form ref="updateFormRef" :rules="updateFormRules" :model="form"  label-width="80px">
            <div style="text-align: center;margin:10px 0">
              <el-upload 
                :action="uploadUrl" 
                class="avatar-uploader"
                :show-file-list="false"
                :on-success="handlerAvatarSuccess">
                <img v-if="form.avatarUrl" :src="downloadUrl+this.form.avatarUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload> 
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
            <el-button type="primary" @click="cancelUpdate">取消修改</el-button>
            <el-button type="primary" @click="updateUser">确定修改</el-button>
        </div>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
          baseUrl:'http://localhost:9382/common/',
          uploadUrl:this.baseUrl+'upload?name=',
          downloadUrl:this.baseUrl+'download?name=',
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
            this.$message.warning("请您先登录")
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
</style>