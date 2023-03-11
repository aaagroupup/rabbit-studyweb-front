<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/live' }">直播列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="25"
        ><!--间隙-->
        <el-button style="float: right;margin-right: 80px;" type="primary" @click="showAddDialog()"> 添加直播课程 </el-button>
      </el-row>

      <!-- 课程列表 border边框 stripe隔行变色 -->
      <el-table :data="liveList" border stripe >
        <el-table-column type="index" label="序号"></el-table-column
        ><!--索引列  -->
        <el-table-column label="直播名称" prop="courseName"></el-table-column>
        <el-table-column prop="cover" label="封面" align="center">
          <template slot-scope="{ row }">
            <el-image style="width: auto; height: 40px; border:none;cursor: pointer;" 
            :src="getImage(row.cover)" 
            :preview-src-list="[ `https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/${row.cover}` ]" >
            <div slot="error" class="image-slot">
              <img src="../assets/img/noImg.png"  style="width: auto; height: 40px; border:none;" >
            </div>  
          </el-image>
          </template>
        </el-table-column>
        <el-table-column label="直播时间" prop="startTime"></el-table-column>
        
        <el-table-column label="直播结束时间" prop="endTime"></el-table-column>
        <el-table-column label="直播老师" prop="param.teacherName"></el-table-column>
        <el-table-column label="所属课程" prop="param.subjectName"  ></el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <div>
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >修改</el-button>
            <!-- 查看主播详情 -->
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="showZhuboConfig(scope.row)"
            >主播详情</el-button>
            
          </div>
          <div style="padding-top: 10px;">
             <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteCourse(scope.row.id)"
            >删除</el-button>
            <!-- 配置 -->
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="showConfig(scope.row.id)"
            >修改直播配置</el-button>
          </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 size-change 每页最大变化 current-change 当前最大变化 layout功能组件-->
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5, 8]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>

        <!-- 新增直播区域 -->
        <el-dialog
        title="添加直播"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >

          <!-- 直播名称 -->
          <el-form-item label="直播名称" prop="courseName">
            <el-input v-model="addForm.courseName"></el-input>
          </el-form-item>

          <!-- 直播开始时间 -->
          <el-form-item label="直播开始时间" prop="startTime">
            <el-date-picker
              v-model="addForm.startTime"
              type="datetime"
              align="right"
              :picker-options="pickerOptions"
              placeholder="选择开始日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              >
            </el-date-picker>
          </el-form-item>
          <!-- 直播结束时间 -->
          <el-form-item label="直播结束时间" prop="endTime">
            <el-date-picker
              v-model="addForm.endTime"
              type="datetime"
              align="right"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择结束日期时间">
            </el-date-picker>
          </el-form-item>
         
          <!-- 直播封面 -->
          <div class="addBrand-container contanier" style="margin-left:0">
            <el-form-item label="课程封面" prop="cover" class="uploadImg">
              <el-upload class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeUpload"
                ref="upload">
                <img v-if="addForm.cover" :src="downloadUrl+this.addForm.cover" class="avatar"/>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </div>

          <!-- 所属课程 -->
          <el-form-item label="所属课程" prop="subjectId">
            <el-select v-model="addForm.subjectId" placeholder="请选择" >
              <el-option v-for="subject in subjectList" :key="subject.id" :label="subject.title" :value="subject.id"></el-option>
            </el-select>
          </el-form-item>

          <!-- 直播讲师 -->
          <el-form-item label="直播讲师" prop="teacherId">
            <el-select v-model="addForm.teacherId" placeholder="请选择" >
              <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name" :value="teacher.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- 讲师登录密码 -->
          <el-form-item label="讲师登录密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <!-- 直播详情 -->
          <el-form-item label="直播详情" prop="description">
            <el-input v-model="addForm.description"></el-input>
          </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addLive">确定</el-button>
        </span>
      </el-dialog>

      <!-- 修改对话框 -->
      <el-dialog
        title="修改直播信息"
        :visible.sync="updateDialogVisible"
        width="60%"
        @close="updateDialogClosed"
      >
        <el-form
          :model="updateForm"
          :rules="updateFormRules"
          ref="updateFormRef"
          label-width="100px"
        >
          <!-- 直播名称 -->
          <el-form-item label="直播名称" prop="courseName">
            <el-input v-model="updateForm.courseName"></el-input>
          </el-form-item>
          <!-- 直播开始时间 -->
          <el-form-item label="直播开始时间" prop="startTime">
            <el-date-picker
              v-model="updateForm.startTime"
              type="datetime"
              align="right"
              :picker-options="pickerOptions"
              placeholder="选择开始日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              >
            </el-date-picker>
          </el-form-item>
          <!-- 直播结束时间 -->
          <el-form-item label="直播结束时间" prop="endTime">
            <el-date-picker
              v-model="updateForm.endTime"
              type="datetime"
              align="right"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择结束日期时间">
            </el-date-picker>
          </el-form-item>
          <!-- 封面 -->
          <div class="addBrand-container contanier" style="margin-left:0">
            <el-form-item label="直播封面" prop="cover" class="uploadImg">
              <el-upload class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeUpload"
                ref="upload">
                <img v-if="updateForm.cover" :src="downloadUrl+this.updateForm.cover" class="avatar"/>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </div>

          <!-- 所属课程 -->
          <el-form-item label="所属课程" prop="subjectId">
            <el-select v-model="updateForm.subjectId" placeholder="请选择" >
              <el-option v-for="subject in subjectList" :key="subject.id" :label="subject.title" :value="subject.id"></el-option>
            </el-select>
          </el-form-item>
         <!-- 直播讲师 -->
         <el-form-item label="直播讲师" prop="teacherId">
            <el-select v-model="updateForm.teacherId" placeholder="请选择" >
              <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name" :value="teacher.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- 讲师登录密码 -->
          <el-form-item label="讲师登录密码" prop="password">
            <el-input v-model="updateForm.password"></el-input>
          </el-form-item>
          <!-- 直播详情 -->
          <el-form-item label="直播详情" prop="description">
            <el-input v-model="updateForm.description"></el-input>
          </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateLiveInfo">确定</el-button>
        </span>
      </el-dialog>

      <!-- 主播详情页面 -->
      <el-dialog
        title="查看账号"
        :visible.sync="detailDialogVisible"
        width="60%"
      >
      <el-form size="small" style="padding-right: 40px;" label-width="150px">
        <div style="margin-left: 40px;">
          <h4>主播帮助信息</h4>
          <el-row style="height:35px;">
            <el-col>
              <span>主播登录链接：</span>
              <span>https://live.zhibodun.com/live/courseLogin.php?course_id={{ liveCourseAccount.courseId }}&role=admin</span>
            </el-col>
          </el-row>
          <!-- <el-row style="height:35px;">
            <el-col >
              <span>主播登录密码：{{ liveCourseAccount.zhuboKey }}</span>
            </el-col>
          </el-row> -->
        </div>
        <div style="margin-left: 40px;">
          <h4>主播客户端账号信息</h4>
          <el-row style="height:35px;">
            <el-col >
              <span>主播登录账户：{{ liveCourseAccount.zhuboAccount }}</span>
            </el-col>
          </el-row>
          <el-row style="height:35px;">
            <el-col >
              <span>主播登录密码：{{ liveCourseAccount.zhuboPassword }}</span>
            </el-col>
          </el-row>
        </div>
        <div style="margin-left: 40px;">
          <h4>助教信息</h4>
          <el-row style="height:35px;">
            <el-col>
              <span>助教登录连接：</span>
              <span>https://live.zhibodun.com/live/courseLogin.php?course_id={{ liveCourseAccount.courseId }}&role=admin</span>
            </el-col>
          </el-row>
          <el-row style="height:35px;">
            <el-col>
              <span>助教登录密码：{{ liveCourseAccount.adminKey }}</span>
            </el-col>
          </el-row>
        </div>
        <div style="margin-left: 40px;">
          <h4>学生观看信息</h4>
          <el-row style="height:35px;">
            <el-col >
              <span>观看连接：</span>
              <span>https://live.zhibodun.com/live/courseLogin.php?course_id={{ liveCourseAccount.courseId }}</span>
            </el-col>
          </el-row>
          <el-row style="height:100px;">
            <el-col>
              <span>观看二维码：<img src="@/assets/img/qrcode.png" style="margin-left: 30px;" width="80px"/></span>
            </el-col>
          </el-row>
        </div>
        </el-form>
      </el-dialog>


    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadUrl:"http://localhost:9381/common/upload?name=",
      downloadUrl: 'https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/',
      teacherList:[],
      subjectList:[],
      liveList: [], //课程列表
      total: 0, //总记录数
      currentPage:1,//页码
      pageSize:8,//页大小
      courseInfo:{
      },
      addDialogVisible:false,
      addForm: {
        cover:'',
      },
      updateForm:{
        cover:"",
        startTime:null,
        endTime:null,
      },
      updateDialogVisible: false,
      video:{
        videoSourceId:''
      },
      addVideoVisible:false,
      uploadBtnDisabled:false,
      detailDialogVisible:false,
      liveCourseAccount: {
        courseId: ''
      },
      //添加表单验证
      addFormRules: {
        courseName: [
          { required: true, message: "请输入直播名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入课程价格", trigger: "blur" }],
        description: [
          { required: true, message: "请输入课程简介", trigger: "blur" },
          { min: 1, max: 28, message: "描述内容过多", trigger: "blur" },
        ],
      },
      //修改表单验证
      updateFormRules: {
        courseName: [
          { required: true, message: "请输入直播名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入课程价格", trigger: "blur" }],
        description: [
          { required: true, message: "请输入课程简介", trigger: "blur" },
          { min: 1, max: 28, message: "描述内容过多", trigger: "blur" },
        ],
      },
      pickerOptions: {//日期时间
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
    };
  },
  created() {
    this.getLiveList();
  },
  methods: {
    getLiveList(){
      this.$http.get("/live/liveCourse/"+this.currentPage+"/"+this.pageSize)
      .then(res=>{
      //console.log(res.data)
        this.liveList=res.data.data.records
        this.total=res.data.data.total
      })
    },
    //最大数
    handleSizeChange(newSize) {    
      this.pageSize = newSize;
      this.getLiveList();
    },
    //currentPage的触发动作
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getLiveList();
    },
    //打开增加对话框
    showAddDialog(){
      this.addDialogVisible = true
      this.getTeacherList()
      this.getSubjectList()
    },
    //监听添加直播
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addLive() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        this.$http.post("live/liveCourse/save", this.addForm).then(res=>{
          //console.log(res)
          if (res.data.flag != 200) {
            return this.$message.error("添加失败!!!");
          }
          this.$message.success("添加成功!!!");
          this.addDialogVisible = false;
          this.getLiveList();
        })
      });
    },
    //根据主键删除课程
    async deleteCourse(id) {
      const confirmResult = await this.$confirm("您确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("live/liveCourse/delete/" + id);
      //console.log(res)
      if (res.flag != 200) {
        return this.$message.error("删除失败!!!");
      }
      this.$message.success("删除成功");
      this.getLiveList();
    },
    //显示对话框
    async showEditDialog(id) {
      this.getTeacherList()
      this.getSubjectList()
      const { data: res } = await this.$http.get("live/liveCourse/getInfo/" + id);
      //console.log(res)
      this.updateForm = res.data; //查询出信息反填到表单中
      this.updateDialogVisible = true; //开启编辑对话框
    },
    //关闭对话框
    updateDialogClosed() {
      this.$refs.updateFormRef.resetFields(); //重置信息
    },
    // 确认修改
    updateLiveInfo() {
      this.$refs.updateFormRef.validate(async (valid) => {
        if (!valid) return;
        //发起修改请求
        const { data: res } = await this.$http.put(
          "live/liveCourse/update",
          this.updateForm
        );
        //console.log(res)
        if (res.flag != 200) return this.$message.error("修改失败!!!");
        this.$message.success("修改成功");
        //隐藏修改对话框
        this.updateDialogVisible = false;
        this.getLiveList();
      });
    },
    //文件下载
    handleAvatarSuccess (res) {
      this.addForm.cover = res.data
      this.updateForm.cover = res.data
     
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
    close(){
      this.addVideoVisible=false
      this.video={}
      this.fileList=[]
    },
    getTeacherList(){
      this.$http.get("/teacher/getAllTeachers").then(res=>{
        this.teacherList = res.data.data;
      })
    },
    getSubjectList(){
      this.$http.get("/subject/getSubjectList").then(res=>{
        this.subjectList=res.data.data;
      })
    },
    showConfig(id){
      this.$router.push({path:'/live/config',query:{id:id},component: ()=>import("../components/LiveConfig.vue")}) 
    },
    showZhuboConfig(row){
      this.detailDialogVisible=true
      this.$http.get(`/live/liveCourse/getLiveCourseAccount/${row.id}`).then(res=>{
        //console.log(res)
        this.liveCourseAccount=res.data.data
        this.liveCourseAccount.courseId =row.courseId
      })
    }



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
