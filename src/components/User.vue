<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/role'}">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/menu'}">菜单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: ''}">用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--用户列表主体 -->
    <el-card>
      <el-row :gutter="25"><!--间隙-->
        <el-col :span="10"> <!--列宽-->
          <!-- 搜索区域 -->
          <!-- 搜索添加 -->
          <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="queryInfo.query" clearable @clear="getUserList" @keyup.enter.native="getUserList">
          </el-input>
        </el-col>
        <!-- 搜索按钮 -->
        <el-col :span="4">
          <el-button type="warning" @click="addDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 border边框 stripe隔行变色 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="编号"></el-table-column><!--索引列  -->
        <el-table-column label="用户名" prop="username" ></el-table-column>
        <el-table-column label="邮箱" prop="email" ></el-table-column>
        <el-table-column label="手机号" prop="telephone" ></el-table-column>
        <el-table-column label="昵称" prop="nickname" ></el-table-column>
        <el-table-column label="角色" prop="roleName">
        </el-table-column>
        <el-table-column label="状态" prop="state" >
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- {{scope.row}}每一行封存的数据 -->
            <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改 -->
              <!-- 信息提示 -->
              <el-tooltip effect="dark" content="修改" placement="top-start" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              </el-tooltip>
              <!-- 删除 -->
              <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
              </el-tooltip>
            </template> 
        </el-table-column>
      </el-table>

      <!-- 分页组件 size-change 每页最大变化 current-change 当前最大变化 layout功能组件-->
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.currentPage"
          :page-sizes="[1, 3, 5, 10]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>

      <!-- 新增用户区域 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item label="手机号" prop="telephone">
            <el-input v-model="addForm.telephone"></el-input>
          </el-form-item>
          <!-- 昵称 -->
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="addForm.nickname"></el-input>
          </el-form-item>
          <!-- 角色 -->
          <el-form-item label="角色">
            <el-select clearable v-model="addForm.roleId" placeholder="请选择角色">
              <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="info" @click="addDialogVisible=false">取消</el-button>
          <el-button type="success" @click="addUser">确定</el-button>
        </span>
      </el-dialog>
      
      <!-- 修改对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="updateDialogVisible" width="50%" @close="updateDialogClosed">
        <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="70px">
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="updateForm.username" disabled></el-input>
          </el-form-item> 
          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="updateForm.email"></el-input>
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item label="手机号" prop="telephone">
            <el-input v-model="updateForm.telephone"></el-input>
          </el-form-item>
          <!-- 昵称 -->
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="updateForm.nickname"></el-input>
          </el-form-item>
          <!-- 角色 -->
          <el-form-item label="角色">
            <el-select clearable v-model="updateForm.roleId" placeholder="请选择角色">
              <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="info" @click="updateDialogVisible=false">取消</el-button>
          <el-button type="success" @click="updateUserInfo">确定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      //查询信息实体
      queryInfo:{
        query:"",//查询信息
        currentPage:1,//当前页
        pageSize:5//页数
      },
      userList:[],//用户列表
      total:0,//总记录数
      addDialogVisible:false,//对话框状态
      roles:[],
      addForm:{
        username:'',
        password:'',
        email:'',
        telephone:'',
        nickname:''
      },
      //添加表单验证
      addFormRules:{
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
        telephone:[
          {required:true,message:'请输入手机号',trigger:'blur'},
          {pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message:'请输入正确的手机号',trigger:'blur'}
        ],
      },
      //修改用户信息
      updateForm:{},
      //显示和隐藏修改用户栏
      updateDialogVisible:false,
      //修改表单验证
      updateFormRules:{
        password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {pattern: /^(?![0-9]+$)(?!a-zA-Z]+$)[0-9A-Za-z]{6,15}$/,message:"长度为6~15,包括数字和字母",trigger:'blur'}
        ],
        email:[
          {required:true,message:'请输入邮箱',trigger:'blur'},
          {type:'email',message:'请输入正确的邮箱地址',trigger:'blur'}
        ],
        telephone:[
          {required:true,message:'请输入手机号',trigger:'blur'},
          {pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,message:'请输入正确的手机号',trigger:'blur'},
        ],
      }
    }
  },
  created(){
    this.getUserList();
  },
  methods:{
    // 获取所有用户
    async getUserList(){
      const{data:res} = await this.$http.get("/user",{params:this.queryInfo})
        this.userList=res.data;
        this.total=res.data2;
      
      this.$http.get("/role/roles").then(res=>{
        this.roles=res.data.data;
      })
    },
    //最大数
    handleSizeChange(newSize){
        this.queryInfo.pageSize = newSize;
        this.getUserList();
    },
    //currentPage的触发动作
    handleCurrentChange(newPage){
        this.queryInfo.currentPage=newPage;
        this.getUserList();
    },
    //修改用户状态
    async userStateChanged(userInfo){
        const {data:res} = await this. $http.put(`/user/userState?id=${userInfo.id}&state=${userInfo.state}`);
        if(res.flag!=200){
          userInfo.id=!userInfo.id;
          return this.$message.error(res.msg);
        }
        this.$message.success(res.data);
    },
    //监听添加用户
    addDialogClosed(){
        this.$refs.addFormRef.resetFields();
    },
    addUser(){
      this.$refs.addFormRef.validate(valid=>{
        if(!valid) return ;
        //添加用户前判断用户名是否存在
        this.$http.get("/user/isExistUsername?username="+this.addForm.username).then(res=>{
          if(res.data.flag==200){
            this.$message.warning(res.data.data)
            return;
          }
          else{
            this.$http.post("/user/addUser",this.addForm).then(res=>{
              if(res.data.flag!=200){
                return this.$message.error(res.data.msg);
              }
              this.$message.success(res.data.data);
              this.addDialogVisible=false;
              this.getUserList();
            })
            
          }
        })
       
      });
    },
    //根据主键删除用户
    async deleteUser(id){
      const confirmResult = await this.$confirm('您确定要删除吗','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err=>err);
      if(confirmResult!="confirm"){
        return this.$message.info("已取消删除");
      }
      const {data:res} = await this.$http.delete("/user/deleteUser?id="+id);
      if(res.flag!=200){
        return this.$message.error(res.data);
      }
      this.$message.success(res.data);
      this.getUserList();
    },
    //显示对话框
    async showEditDialog(id){
      const {data:res} = await this.$http.get("/user/getUpdate?id="+id);
      this.updateForm=res.data;//查询出用户信息反填到表单中
      this.updateDialogVisible=true;//开启编辑对话框
    },
    //关闭对话框
    updateDialogClosed(){
      this.$refs.updateFormRef.resetFields();//重置信息
    },
    // 确认修改
    updateUserInfo(){
      this.$refs.updateFormRef.validate( valid=>{
        if(!valid) return;
        //发起修改请求
        this.$http.put("/user/updateUser",this.updateForm).then(res=>{
          if(res.data.flag!=200) return this.$message.error(res.data.msg);
          this.$message.success(res.data.data);
          //隐藏修改对话框
          this.updateDialogVisible=false;
          this.getUserList(); 
        })
      })
    },

  }
};
</script>

<style lang="less" scoped>
/deep/.el-button.el-button--warning{
  background:#84d3eb !important;
  border-color:#84d3eb;
}

/deep/.el-button.el-button--info{
  background:#817278 !important;
  border-color:#817278;
}

/deep/.el-button.el-button--success{
  background:#b7f082 !important;
  border-color:#b7f082;
}

.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 17px;
}

</style>
