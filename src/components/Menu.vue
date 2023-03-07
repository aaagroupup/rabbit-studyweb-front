<template>
  <div>
    <!-- 面包屑导航 -->
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/goods'}">商品模块</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!--菜单列表主体 -->
    <el-card>
      <el-row :gutter="25"><!--间隙-->
        <el-col :span="10"> <!--列宽-->
          <!-- 搜索区域 -->
          <!-- 搜索添加 -->
          <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getMenuList" @keyup.enter.native="getMenuList">
            <el-button slot="append" icon="el-icon-search" @click="getMenuList"></el-button>
          </el-input>
        </el-col>
        <!-- 搜索按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">
            添加菜单
          </el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 border边框 stripe隔行变色 -->
      <el-table :data="menuList" border stripe>
        <el-table-column type="index"></el-table-column><!--索引列  -->
        <el-table-column label="标题" prop="title" ></el-table-column>
        <el-table-column label="路径" prop="path" ></el-table-column>
        <el-table-column label="父路径" prop="fpath" ></el-table-column>
        <el-table-column label="页面路径" prop="pagePath" ></el-table-column>
        <el-table-column label="图标">
          <template slot-scope="scope">
            <i :class="scope.row.icon" style="font-size: 20px;"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              <!-- 删除 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteMenu(scope.row.id)"></el-button>
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

      <!-- 新增菜单区域 -->
      <el-dialog title="添加路径" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <!-- 标题 -->
          <el-form-item label="标题" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <!-- 路径 -->
          <el-form-item label="路径" prop="path">
            <el-input v-model="addForm.path"></el-input>
          </el-form-item>
          <!-- 父路径 -->
          <el-form-item label="父路径" prop="fpath">
            <el-select clearable v-model="addForm.fpath" placeholder="请选择父路径" width="100%">
              <el-option v-for="item in fpathSelection" :value="item.path" :key="item.path">{{item.path}}  </el-option>
            </el-select>
          </el-form-item>
          <!-- 页面路径 -->
          <el-form-item label="页面路径" prop="pagePath">
            <el-input v-model="addForm.pagePath"></el-input>
          </el-form-item>
          <!-- 图标 -->
          <el-form-item label="图标" prop="icon">
            <el-select clearable v-model="addForm.icon" placeholder="请选择图标" width="100%">
              <el-option v-for="item in options" :label="item.name" :value="item.value" :key="item.name">
                <i :class="item.value"/>{{item.name}}
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible=false">取消</el-button>
          <el-button type="primary" @click="addMenu">确定</el-button>
        </span>
      </el-dialog>
      
      <!-- 修改对话框 -->
      <el-dialog title="修改路径信息" :visible.sync="updateDialogVisible" width="50%" @close="updateDialogClosed">
        <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="70px">
          <!-- 标题 -->
          <el-form-item label="标题" prop="title">
            <el-input v-model="updateForm.title"></el-input>
          </el-form-item>
          <!-- 路径 -->
          <el-form-item label="路径" prop="path">
            <el-input v-model="updateForm.path"></el-input>
          </el-form-item>
          <!-- 父路径 -->
          <el-form-item label="父路径" prop="fpath">
            <el-select clearable v-model="updateForm.fpath" placeholder="请选择父路径" width="100%">
              <el-option v-for="item in fpathSelection" :value="item.path" :key="item.path">{{item.path}}  </el-option>
            </el-select>
          </el-form-item>
          <!-- 页面路径 -->
          <el-form-item label="页面路径" prop="pagePath">
            <el-input v-model="updateForm.pagePath"></el-input>
          </el-form-item>
          <!-- 图标 -->
          <el-form-item label="图标" prop="icon">
            <el-select clearable v-model="updateForm.icon" placeholder="请选择图标" width="100%">
              <el-option v-for="item in options" :label="item.name" :value="item.value" :key="item.name">
                <i :class="item.value"/>{{item.name}}
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible=false">取消</el-button>
          <el-button type="primary" @click="updateMenuInfo">确定</el-button>
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
      menuList:[],//用户列表
      total:0,//总记录数
      addDialogVisible:false,//对话框状态
      addForm:{
        title:'',
        path:'',
        fpath:'',
        icon:'',
        pagePath:'',
      },
      options:[],
      fpathSelection:[],
      //添加表单验证
      addFormRules:{
        title:[
          {required:true,message:'请输入菜单名称',trigger:'blur'},
          {min:3,max:8,message:'长度在 3 到 8 个字符',trigger:'blur'}
        ],
        path:[
          {required:true,message:'请输入路径',trigger:'blur'},
          {min:5,max:20,message:'长度在 5 到 20 个字符',trigger:'blur'}
        ],
        fpath:[
          {required:true,message:'请输入父路径',trigger:'blur'},
          {min:3,max:20,message:'长度在 3 到 20 个字符',trigger:'blur'}
        ],
      },
      //修改路径信息
      updateForm:{},
      //显示和隐藏修改用户栏
      updateDialogVisible:false,
      //修改表单验证
      updateFormRules:{
        title:[
          {required:true,message:'请输入菜单名称',trigger:'blur'},
          {min:3,max:8,message:'长度在 3 到 8 个字符',trigger:'blur'}
        ],
        path:[
          {required:true,message:'请输入路径',trigger:'blur'},
          {min:5,max:20,message:'长度在 5 到 20 个字符',trigger:'blur'}
        ],
        fpath:[
          {required:true,message:'请输入父路径',trigger:'blur'},
          {min:3,max:20,message:'长度在 3 到 20 个字符',trigger:'blur'}
        ],
      }
    }
  },
  created(){
    this.getMenuList();
    this.getFPath();
  },
  methods:{
    // 获取所有菜单
    async getMenuList(){
      const {data:res} = await this.$http.get("menu",{params:this.queryInfo});

      //获取图标
      await this.$http.get("/menu/icons").then(res=>{
        this.options=res.data.data;
      })
      this.menuList=res.data;
      this.total=res.data2;
    },
    getFPath(){
      this.$http.get("/menu/getFPath").then(res=>{
        //console.log(res)
        this.fpathSelection=res.data.data;
      })
    },
    //最大数
    handleSizeChange(newSize){
        this.queryInfo.pageSize = newSize;
        this.getMenuList();
    },
    //currentPage的触发动作
    handleCurrentChange(newPage){
        this.queryInfo.currentPage=newPage;
        this.getMenuList();
    },
    //监听添加菜单
    addDialogClosed(){
      this.$refs.addFormRef.resetFields(); 
    },
    addMenu(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return ;
        const {data:res}= await this.$http.post("/menu/addMenu",this.addForm);
        if(res.flag!=200){
          return this.$message.error(res.data);
        }
        this.$message.success(res.data);
        this.addDialogVisible=false;
        this.getMenuList();
        //重新加载左侧菜单栏
        this.$emit('refreshMenu')
      });
    },
    //根据主键删除菜单
    async deleteMenu(id){
      const confirmResult = await this.$confirm('您确定要删除吗','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err=>err);
      if(confirmResult!="confirm"){
        return this.$message.info("已取消删除");
      }
      const {data:res} = await this.$http.delete("/menu/deleteMenu?id="+id);
      if(res.flag!=200){
        return this.$message.error(res.data);
      }
      this.$message.success(res.data);
      this.getMenuList();

      //重新加载左侧菜单栏
      this.$emit('refreshMenu')
    },
    //显示对话框
    async showEditDialog(id){
      const {data:res} = await this.$http.get("menu/getUpdate?id="+id);
      this.updateForm=res.data;//查询出用户信息反填到表单中
      this.updateDialogVisible=true;//开启编辑对话框
    },
    //关闭对话框
    updateDialogClosed(){
      this.$refs.updateFormRef.resetFields();//重置信息
    },
    // 确认修改
    updateMenuInfo(){
      this.$refs.updateFormRef.validate(async valid=>{
        if(!valid) return;
        //发起修改请求
        const {data:res} = await this.$http.put("menu/updateMenu",this.updateForm);
        if(res.flag!=200) return this.$message.error(res.data);
        this.$message.success(res.data);
        //隐藏修改对话框
        this.updateDialogVisible=false;
        this.getMenuList(); 
      })
    },

  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 17px;
}
</style>
