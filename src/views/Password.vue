<template>
    <div style="padding-top: 10%;">
      <el-card style="widows: 500px;padding-top: 40px;">
        <el-form label-width="120px" :model="form" :rules="updateFormRules" ref="updateFormRef">
            <el-form-item label="原密码" prop="password">
                <el-input v-model="form.password" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="form.newPassword" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" autocomplete="off" show-password></el-input>
            </el-form-item>
            
        </el-form>
        <div style="text-align: center">
            <el-button type="primary" @click="cancelUpdate">取消修改</el-button>
            <el-button type="primary" @click="updatePassword">确定修改</el-button>
        </div>
      </el-card>
    </div>
</template>
<script>
export default{
    data(){
        return{
            form:{},
            user:sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},
            updateFormRules:{
                password:[
                    {required:true,message:'请输入原密码',trigger:'blur'},
                    {pattern: /^(?![0-9]+$)(?!a-zA-Z]+$)[0-9A-Za-z]{6,15}$/,message:"长度为6~15,包括数字和字母",trigger:'blur'}
                ],
                newPassword:[
                    {required:true,message:'请输入新密码',trigger:'blur'},
                    {pattern: /^(?![0-9]+$)(?!a-zA-Z]+$)[0-9A-Za-z]{6,15}$/,message:"长度为6~15,包括数字和字母",trigger:'blur'}
                ],
                confirmPassword:[
                    {required:true,message:'请再次输入密码',trigger:'blur'},
                    
                ],
            }
        }
    },
    created(){
        this.form.username=this.user.username
    },
    methods:{
        updatePassword(){
            this.$refs.updateFormRef.validate(valid=>{
                if(!valid)return;
                if(this.form.newPassword !==this.form.confirmPassword){
                    this.$message.error("两次输入的新密码不一致")
                    return false
                }
                this.$http.post("user/password",this.form).then(res=>{
                    if(res.data.flag==200){
                        alert(res.data.data+',请您重新登录')
                        sessionStorage.removeItem("user")
                        sessionStorage.removeItem("menus")
                        this.$router.push("/login")
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        cancelUpdate(){
          this.$router.push("/front/home");
        },
    }
}
</script>

<style>
.avatar-uploader{
    text-align: center;
    padding-bottom: 10px;
}
.avatar-uploader .el-upload{
    border: 1px dashed #d9d9d9;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon{
    font-size: 28px;
    color: #8c939d;
    width: 138px;
    height: 138px;
    line-height: 138px;
    text-align: center;
}
.avatar{
    width: 138px;
    height: 138px;
    display: block;
}
</style>