<template>
    <div>
      <!--文章列表主体 -->
      <el-card>
        <el-row :gutter="25"
          ><!--间隙-->
          <el-col :span="10">
            <!--列宽-->
            <!-- 搜索区域 -->
            <!-- 搜索添加 -->
            <el-input
              placeholder="请输入搜索内容"
              v-model="queryInfo.query"
              clearable
              @clear="getArticleList"
              @keyup.enter.native="getArticleList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getArticleList"
              ></el-button>
            </el-input>
          </el-col>
  
          <!-- 添加按钮 -->
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">
              添加文章
            </el-button>
          </el-col>
        </el-row>
  
        <!-- 文章列表 border边框 stripe隔行变色 -->
        <el-table :data="articleList" border stripe>
          <el-table-column type="index"></el-table-column
          ><!--索引列  -->
          <el-table-column label="文章名称" prop="name"></el-table-column>
          
          <el-table-column label="文章内容" prop="content">
            <template slot-scope="scope">
              <el-button @click="view(scope.row.content)" type="primary">查看内容</el-button>
            </template>
          </el-table-column>
          <el-table-column label="用户昵称" prop="nickname"></el-table-column>
          <el-table-column label="发布时间" prop="time"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
              <!-- 删除 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteArticle(scope.row.id)"
              ></el-button>
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
            :total="total"
          >
          </el-pagination>
        </div>
      </el-card>

        <!-- 新增文章区域 -->
        <el-dialog
          title="添加文章"
          :visible.sync="addDialogVisible"
          width="60%"
          @close="addDialogClosed"
        >
          <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="80px"
          >
            <!-- 文章名称 -->
            <el-form-item label="文章名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
  
            <!-- 文章内容 -->
            <el-form-item label="文章内容" prop="content">
              <mavon-editor ref='md' v-model="addForm.content" :ishljs="true" @imgAdd="imgAdd"></mavon-editor>
            </el-form-item>
          </el-form>
          <!-- 内容底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addArticle">确定</el-button>
          </span>
        </el-dialog>
  
        <!-- 修改对话框 -->
        <el-dialog
          title="修改文章信息"
          :visible.sync="updateDialogVisible"
          width="60%"
          @close="updateDialogClosed"
        >
          <el-form
            :model="updateForm"
            :rules="updateFormRules"
            ref="updateFormRef"
            label-width="80px"
          >
            <!-- 文章名称 -->
            <el-form-item label="文章名称" prop="name">
              <el-input v-model="updateForm.name"></el-input>
            </el-form-item>
            
            <!-- 文章内容 -->
            <el-form-item label="文章内容" prop="content">
              <mavon-editor ref='md' v-model="updateForm.content" :ishljs="true" @imgAdd="imgAdd"></mavon-editor>
            </el-form-item>
            
          </el-form>
          <!-- 内容底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="updateArticleInfo">确定</el-button>
          </span>
        </el-dialog>

      <el-dialog title="文章信息" :visible.sync="viewDialogVisible" width="60%">
        <el-card>
          <div>
            <mavon-editor 
              class="md" 
              :value="content" 
              :subfield="false" 
              :defaultOpen="'preview'" 
              :toolbarsFlag="false" 
              :editable="false" 
              :scrollStyle="true" 
              :ishljs="true"
            />
          </div>
        </el-card>
      </el-dialog>
      
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        content:'',
        imageUrl: '',
        downloadUrl:"http://localhost:9383/common/download?name=",
        //查询信息实体
        queryInfo: {
          query: "", //查询信息
          currentPage: 1, //当前页
          pageSize: 5, //页数
        },
        articleList: [], //商品列表
        total: 0, //总记录数
        addDialogVisible: false, //对话框状态
        viewDialogVisible:false,
        addForm: {
          name: "",
          content:''
        },
        //添加表单验证
        addFormRules: {
          name: [
            { required: true, message: "请输入文章标题", trigger: "blur" },
            { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" },
          ],
          content: [
            { required: true, message: "请输入文章内容", trigger: "blur" },
          ],
        },
        //修改商品信息
        updateForm: {
          name: "",
          content:''
        },
        //显示和隐藏修改商品栏
        updateDialogVisible: false,
        //修改表单验证
        updateFormRules: {
          name: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
            { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
          ],
          content: [
            { required: true, message: "请输入文章内容", trigger: "blur" },
          ],
        },
      };
    },
    created() {
      this.getArticleList();
    },
    methods: {
      view(content){
        this.content=content
        this.viewDialogVisible=true
      },
        imgAdd(pos,$file){
            let $vm=this.$refs.md
            //第一步，将图片上传到服务器
            const formData = new FormData();
            const url=this.downloadUrl
            formData.append("file",$file);
            this.$http.post("/common/upload",formData,{headers:{'Content-Type':'multipart/form-data'}}).then(res=>{
                //第二步，将返回的url替换到文本的原位置
                $vm.$img2Url(pos,url+res.data.data)//拼接地址，在右侧展示图片
            })
        },
      // 获取所有文章
      async getArticleList() {
        const { data: res } = await this.$http.get("article/articles", {
          params: this.queryInfo,
        });
        this.articleList = res.data;
        this.total = res.data2;
      },
      //最大数
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getArticleList();
      },
      //currentPage的触发动作
      handleCurrentChange(newPage) {
        this.queryInfo.currentPage = newPage;
        this.getArticleList();
      },
      
      //监听添加文章
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
      },
      addArticle() {
        this.$refs.addFormRef.validate(async (valid) => {
          if (!valid) return;
          const { data: res } = await this.$http.post("article/addArticle", this.addForm);
          if (res.flag != 200) {
            return this.$message.error("添加失败!!!");
          }
          this.$message.success("添加成功!!!");
          this.addDialogVisible = false;
          this.getArticleList();
        });
      },
      //根据主键删除文章
      async deleteArticle(id) {
        const confirmResult = await this.$confirm("您确定要删除吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).catch((err) => err);
        if (confirmResult != "confirm") {
          return this.$message.info("已取消删除");
        }
        const { data: res } = await this.$http.delete("article/deleteArticle?id=" + id);
        if (res.flag != 200) {
          return this.$message.error("删除失败");
        }
        this.$message.success("删除成功");
        this.getArticleList();
      },
      //显示对话框
      async showEditDialog(id) {
        const { data: res } = await this.$http.get("article/getUpdate2?id=" + id);
        this.updateForm = res.data; //查询出文章信息反填到表单中
        this.updateDialogVisible = true; //开启编辑对话框
      },
      //关闭对话框
      updateDialogClosed() {
        this.$refs.updateFormRef.resetFields(); //重置信息
      },
      // 确认修改
      updateArticleInfo() {
        this.$refs.updateFormRef.validate(async (valid) => {
          if (!valid) return;
          //发起修改请求
          const { data: res } = await this.$http.put(
            "article/updateArticle",
            this.updateForm
          );
          if (res.flag != 200) return this.$message.error("修改失败!!!");
          this.$message.success("修改成功!!!");
          //隐藏修改对话框
          this.updateDialogVisible = false;
          this.getArticleList();
        });
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
    },
  };
  </script>
  
  <style lang="less" scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 17px;
  }
  
  /* 添加 */
  .addBrand-container .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .addBrand-container .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .addBrand-container .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 160px;
    line-height: 160px;
    text-align: center;
  }
  .addBrand-container .avatar {
    width: 160px;
    height: 160px;
    display: block;
  }
  .addBrand-container .el-form--inline .el-form-item__content {
    width: 293px;
  }
  .addBrand-container .el-input {
    width: 293px;
  }
  
  .addBrand-container {
    margin: 30px;
  }
  .addBrand-container .container {
    position: relative;
    z-index: 1;
    background: #fff;
    padding: 30px;
    border-radius: 4px;
    min-height: 500px;
  }
  .addBrand-container .container .subBox {
    padding-top: 30px;
    text-align: center;
    border-top: solid 1px #f3f4f7;
  }
  </style>
  