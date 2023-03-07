<template>
    <div>
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
              @clear="getTeacherList"
              @keyup.enter.native="getTeacherList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getTeacherList"
              ></el-button>
            </el-input>
          </el-col>
  
          <!-- 添加按钮 -->
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">
              添加讲师
            </el-button>
          </el-col>
        </el-row>
  
        <el-table :data="teacherList" border stripe>
          <el-table-column type="index"></el-table-column
          ><!--索引列  -->
          <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column prop="img" label="封面" align="center">
          <template slot-scope="{ row }">
            <el-image style="width: auto; height: 40px; border:none;cursor: pointer;" 
            :src="getImage(row.img)" 
            :preview-src-list="[ `https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/${row.img}` ]" >
            <div slot="error" class="image-slot">
              <img src="../assets/img/noImg.png"  style="width: auto; height: 40px; border:none;" >
            </div>  
          </el-image>
          </template>
        </el-table-column>
          <el-table-column label="等级" prop="level"></el-table-column>
          <el-table-column label="简介" prop="description"></el-table-column>
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
                @click="deleteTeacher(scope.row.id)"
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

        <!-- 新增区域 -->
        <el-dialog
          title="添加讲师"
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
            <!-- 名称 -->
            <el-form-item label="姓名" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <!-- 照片 -->
            <div class="addBrand-container contanier" style="margin-left:0">
                <el-form-item label="照片" prop="img" class="uploadImg">
                <el-upload class="avatar-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeUpload"
                    ref="upload">
                    <img v-if="addForm.img" :src="downloadUrl+this.addForm.img" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                </el-form-item>
            </div>
            <el-form-item label="等级" prop="level">
                <el-input v-model="addForm.level"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="description">
                <el-input v-model="addForm.description"></el-input>
            </el-form-item>
          </el-form>
          <!-- 内容底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addTeacher">确定</el-button>
          </span>
        </el-dialog>
  
        <!-- 修改对话框 -->
        <el-dialog
          title="修改讲师信息"
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
            <!-- 名称 -->
            <el-form-item label="姓名" prop="name">
              <el-input v-model="updateForm.name"></el-input>
            </el-form-item>
            
            <!-- 照片 -->
            <div class="addBrand-container contanier" style="margin-left:0">
                <el-form-item label="照片" prop="img" class="uploadImg">
                <el-upload class="avatar-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeUpload"
                    ref="upload">
                    <img v-if="updateForm.img" :src="downloadUrl+this.updateForm.img" class="avatar"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                </el-form-item>
            </div>
            <el-form-item label="等级" prop="level">
                <el-input v-model="updateForm.level"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="description">
                <el-input v-model="updateForm.description"></el-input>
            </el-form-item>
            
          </el-form>
          <!-- 内容底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="updateTeacherInfo">确定</el-button>
          </span>
        </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        uploadUrl:"http://localhost:9381/common/upload?name=",
        downloadUrl: 'https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/',
        //查询信息实体
        queryInfo: {
          query: "", //查询信息
          currentPage: 1, //当前页
          pageSize: 5, //页数
        },
        teacherList: [], 
        total: 0, //总记录数
        addDialogVisible: false, //对话框状态
        viewDialogVisible:false,
        addForm: {
            img:''
        },
        //添加表单验证
        addFormRules: {
          name: [
            { required: true, message: "请输入姓名", trigger: "blur" },
            
          ],
          level: [
            { required: true, message: "请输入等级", trigger: "blur" },
            
          ],
          description: [
            { required: true, message: "请输入简介", trigger: "blur" },
            { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" },
          ],
        },
        updateForm: {},
        //显示和隐藏修改商品栏
        updateDialogVisible: false,
        //修改表单验证
        updateFormRules: {
            name: [
            { required: true, message: "请输入姓名", trigger: "blur" },
            
          ],
          level: [
            { required: true, message: "请输入等级", trigger: "blur" },
            
          ],
          description: [
            { required: true, message: "请输入简介", trigger: "blur" },
            { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" },
          ],
        },
      };
    },
    created() {
      this.getTeacherList();
    },
    methods: {
      async getTeacherList() {
        const { data: res } = await this.$http.get("teacher/getTeacherList", {
          params: this.queryInfo,
        });
        this.teacherList = res.data;
        this.total = res.data2;
      },
      //最大数
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize;
        this.getTeacherList();
      },
      //currentPage的触发动作
      handleCurrentChange(newPage) {
        this.queryInfo.currentPage = newPage;
        this.getTeacherList();
      },
      addDialogClosed() {
        this.$refs.addFormRef.resetFields();
      },
      addTeacher() {
        this.$refs.addFormRef.validate(async (valid) => {
          if (!valid) return;
          const { data: res } = await this.$http.post("teacher/addTeacher", this.addForm);
          if (res.flag != 200) {
            return this.$message.error("添加失败!!!");
          }
          this.$message.success("添加成功!!!");
          this.addDialogVisible = false;
          this.getTeacherList();
        });
      },
      async deleteTeacher(id) {
        const confirmResult = await this.$confirm("您确定要删除吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).catch((err) => err);
        if (confirmResult != "confirm") {
          return this.$message.info("已取消删除");
        }
        const { data: res } = await this.$http.delete("teacher/deleteTeacher?id=" + id);
        if (res.flag != 200) {
          return this.$message.error("删除失败");
        }
        this.$message.success("删除成功");
        this.getTeacherList();
      },
      //显示对话框
      async showEditDialog(id) {
        const { data: res } = await this.$http.get("teacher/getUpdate2?id=" + id);
        this.updateForm = res.data; //查询出文章信息反填到表单中
        this.updateDialogVisible = true; //开启编辑对话框
      },
      //关闭对话框
      updateDialogClosed() {
        this.$refs.updateFormRef.resetFields(); //重置信息
      },
      // 确认修改
      updateTeacherInfo() {
        this.$refs.updateFormRef.validate(async (valid) => {
          if (!valid) return;
          //发起修改请求
          const { data: res } = await this.$http.put(
            "teacher/updateTeacher",
            this.updateForm
          );
          if (res.flag != 200) return this.$message.error("修改失败!!!");
          this.$message.success("修改成功!!!");
          //隐藏修改对话框
          this.updateDialogVisible = false;
          this.getTeacherList();
        });
      },
      handleAvatarSuccess (res) {
      this.addForm.img = res.data
      this.updateForm.img = res.data
     
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
    getImage (image) {
        return this.downloadUrl+image
    },
    },
  };
  </script>
  
  <style lang="less" scoped>
  
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
  