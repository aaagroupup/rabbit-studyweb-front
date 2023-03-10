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
            <button class="custom-btn btn-2" @click="cancelUpdate">取消</button>
          <button class="custom-btn btn-2" style="margin-left: 20px;" @click="updatePassword">修改</button>
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
/* 2 */
        
.btn-2 {
            background: rgb(194, 178, 219);
            background: linear-gradient(0deg, rgb(151, 128, 189) 0%, rgba(151, 128, 189) 100%);
            border: none;
        }
        
        .btn-2:before {
            height: 0%;
            width: 2px;
        }
        
        .btn-2:hover {
            box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, .5), -4px -4px 6px 0 rgba(116, 125, 136, .5), inset -4px -4px 6px 0 rgba(255, 255, 255, .2), inset 4px 4px 6px 0 rgba(0, 0, 0, .4);
        }        
</style>