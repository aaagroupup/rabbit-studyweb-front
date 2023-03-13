<template>
  <div>
    <!--角色列表主体 -->
    <el-card>
      <el-row :gutter="25"><!--间隙-->
        <el-col :span="10"> <!--列宽-->
          <!-- 搜索区域 -->
          <!-- 搜索添加 -->
          <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="queryInfo.query" clearable @clear="getRoleList" @keyup.enter.native="getRoleList">
          </el-input>
        </el-col>
        <!-- 搜索按钮 -->
        <el-col :span="4">
          <el-button type="warning" @click="addDialogVisible = true">
            添加角色
          </el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 border边框 stripe隔行变色 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="index"></el-table-column><!--索引列  -->
        <el-table-column label="名称" prop="name" ></el-table-column>
        <el-table-column label="描述" prop="description" ></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 分配菜单 -->
              <el-button type="info" icon="el-icon-menu" size="mini" @click="selectMenu(scope.row.id)"></el-button>
              <!-- 修改 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              <!-- 删除 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)"></el-button>
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

      <!-- 新增角色区域 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <!-- 名称 -->
          <el-form-item label="名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="描述" prop="description">
            <el-input v-model="addForm.description"></el-input>
          </el-form-item>
          
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible=false">取消</el-button>
          <el-button type="success" @click="addRole">确定</el-button>
        </span>
      </el-dialog>
      
      <!-- 修改对话框 -->
      <el-dialog title="修改角色信息" :visible.sync="updateDialogVisible" width="50%" @close="updateDialogClosed">
        <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="70px">
          <!-- 角色 -->
          <el-form-item label="角色" prop="name">
            <el-input v-model="updateForm.name"></el-input>
          </el-form-item>
          <!-- 描述 -->
          <el-form-item label="描述" prop="description">
            <el-input v-model="updateForm.description"></el-input>
          </el-form-item>
          
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible=false">取消</el-button>
          <el-button type="success" @click="updateRoleInfo">确定</el-button>
        </span>
      </el-dialog>

      <!-- 菜单分配 -->
      <el-dialog title="菜单分配" :visible.sync="menuDialogVisible" width="50%">
        <el-tree
          :props="props"
          :data="menuData"
          show-checkbox
          node-key="id"
          ref="tree"
          :default-expanded-keys="expends"
          :default-checked-keys="checks"
          >
          <span class="custom-tree-node" slot-scope="{data}">
        <span><i :class="data.icon"></i>{{ data.title }}</span></span>  
        </el-tree>

        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="menuDialogVisible=false">取消</el-button>
          <el-button type="success" @click="saveRoleMenu">确定</el-button>
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
      roleList:[],//用户列表
      total:0,//总记录数
      addDialogVisible:false,//新增对话框状态
      menuDialogVisible:false,//菜单对话框状态
      menuData: [],
      expends:[],
      checks:[],
      roleId:0,
      props:{
        children:"subMenuList"
      },
      addForm:{
        name:'',
        description:'',
      },
      //添加表单验证
      addFormRules:{
        name:[
          {required:true,message:'请输入角色',trigger:'blur'},
          {min:3,max:8,message:'长度在 3 到 8 个字符',trigger:'blur'}
        ],
        description:[
          {required:true,message:'请输入描述',trigger:'blur'},
          {min:1,max:20,message:'长度在 1 到 20 个字符',trigger:'blur'}
        ],
      },
      //修改角色信息
      updateForm:{},
      //显示和隐藏修改用户栏
      updateDialogVisible:false,
      //修改表单验证
      updateFormRules:{
        description:[
          {required:true,message:'请输入描述',trigger:'blur'},
          {min:1,max:20,message:'长度在 1 到 20 个字符',trigger:'blur'}
        ],
      }
    }
  },
  created(){
    this.getRoleList();
  },
  methods:{
    // 获取所有角色
    async getRoleList(){
      const {data:res} = await this.$http.get("role",{params:this.queryInfo});
      this.roleList=res.data;
      this.total=res.data2;
    },
    //最大数
    handleSizeChange(newSize){
        this.queryInfo.pageSize = newSize;
        this.getRoleList();
    },
    //currentPage的触发动作
    handleCurrentChange(newPage){
        this.queryInfo.currentPage=newPage;
        this.getRoleList();
    },
    //监听添加用户
    addDialogClosed(){
        this.$refs.addFormRef.resetFields();
    },
    addRole(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return ;
        const {data:res}= await this.$http.post("/role/addRole",this.addForm);
        if(res.flag!=200){
          return this.$message.error(res.data);
        }
        this.$message.success(res.data);
        this.addDialogVisible=false;
        this.getRoleList();
      });
    },
    //根据主键删除用户
    async deleteRole(id){
      const confirmResult = await this.$confirm('您确定要删除吗','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err=>err);
      if(confirmResult!="confirm"){
        return this.$message.info("已取消删除");
      }
      const {data:res} = await this.$http.delete("/role/deleteRole?id="+id);
      if(res.flag!=200){
        return this.$message.error(res.data);
      }
      this.$message.success(res.data);
      this.getRoleList();
    },
    //显示对话框
    async showEditDialog(id){
      const {data:res} = await this.$http.get("role/getUpdate?id="+id);
      this.updateForm=res.data;//查询出用户信息反填到表单中
      this.updateDialogVisible=true;//开启编辑对话框
    },
    //关闭对话框
    updateDialogClosed(){
      this.$refs.updateFormRef.resetFields();//重置信息
    },
    // 确认修改
    updateRoleInfo(){
      this.$refs.updateFormRef.validate(async valid=>{
        if(!valid) return;
        //发起修改请求
        const {data:res} = await this.$http.put("role/updateRole",this.updateForm);
        if(res.flag!=200) return this.$message.error(res.data);
        this.$message.success(res.data);
        //隐藏修改对话框
        this.updateDialogVisible=false;
        this.getRoleList(); 
      })
    },
    selectMenu(roleId){
      this.roleId=roleId;
      this.menuDialogVisible=true
      //请求菜单数据
      this.$http.get("/menu/menus").then(res=>{
        this.menuData=res.data.data;
        //把后台返回的菜单数据处理成 id数组
        this.expends = this.menuData.map(v=>v.id)
      })

      this.$http.get("role/roleMenu/"+roleId).then(res=>{
        this.checks =res.data.data
      })
    },
    saveRoleMenu(){
      this.$http.post("/role/roleMenu/"+this.roleId,this.$refs.tree.getCheckedKeys()).then(res=>{
        if(res.data.flag==200){
          this.$message.success(res.data.data)
          this.menuDialogVisible=false
        }else{
          this.$message.success(res.data.data)
        }
      })
    }

  }
};
</script>

<style lang="less" scoped>
/deep/.el-button.el-button--warning{
  background:#84d3eb !important;
  border-color:#84d3eb;
}
/deep/.el-button.el-button--success{
  background:#b7f082 !important;
  border-color:#b7f082;
}
</style>
