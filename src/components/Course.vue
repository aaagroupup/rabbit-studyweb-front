<template>
  <div>
    <el-card>
      <el-row :gutter="25"
        ><!--间隙-->
        <el-form :inline="true" :model="searchData" class="demo-form-inline">
          <el-form-item label="课程类别">
            <!-- 一级分类 -->
            <el-select style="width: 220px;" v-model="searchData.subjectPId" @change="subjectLevelOneChanged" placeholder="请选择" >
              <el-option v-for="subject in subjectList" :key="subject.id" :label="subject.title" :value="subject.id"></el-option>
            </el-select>
            <!-- 二级分类 -->
            <el-select style="width: 220px;" v-model="searchData.subjectId" placeholder="请选择" >
              <el-option v-for="subject in subjectLevelTwoList" :key="subject.id" :label="subject.title" :value="subject.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="searchData.title" placeholder="请选择" style="width: 220px;"></el-input>
          </el-form-item>
          <el-form-item label="讲师">
            <el-select v-model="searchData.teacherId" placeholder="请选择" style="width: 220px;">
              <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name" :value="teacher.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button style="margin-left: 20px;" type="primary" icon="el-icon-search" @click="getCourseList()">查询</el-button>
            <el-button  style="margin-left: 20px;" type="default" @click="resetData()">清空</el-button> 
          </el-form-item> 
          <el-button style="float: right;margin-right: 20px;" type="primary" @click="addDialogVisible = true"> 添加课程 </el-button> 
          <el-button style="float: left;margin-left: 10px;" type="primary" @click="batchRemove()"> 删除选中 </el-button>
        </el-form>
      </el-row>

      <!-- 课程列表 border边框 stripe隔行变色 -->
      <el-table :data="courseList" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column
        ><!--索引列  -->
        <el-table-column label="课程名称" prop="title" width="130px"></el-table-column>
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
        <el-table-column label="副标题" prop="subTitle" width="150"></el-table-column>
        <el-table-column label="讲师" prop="param.teacherName" width="150px"></el-table-column>
        <el-table-column label="课程简介" prop="description"></el-table-column>
        <el-table-column label="课程价格(单位元)" prop="price" width="150px"></el-table-column>
        <el-table-column label="发布时间" prop="publishTime" width="170px" sortable></el-table-column>
        <!-- <el-table-column label="课程描述" prop="description"></el-table-column> -->
        <el-table-column label="课程状态" prop="status" width="130px" sortable>
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- {{scope.row}}每一行封存的数据 -->
            <el-switch
              v-model="scope.row.status"
              @change="courseStatusChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320px">
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
              @click="deleteCourse(scope.row.id)"
            ></el-button>
             <!-- 添加视频 -->
             <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showAddVideoDialog(scope.row.id)"
            >添加视频</el-button>
             <!-- 详情页面 -->
             <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="showDetailDialog(scope.row.id)"
            >详情</el-button>
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

        <!-- 新增课程区域 -->
        <el-dialog
        title="添加课程"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="80px"
        >
          <!-- 课程名称 -->
          <el-form-item label="课程标题" prop="title">
            <el-input v-model="addForm.title"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="title">
            <el-input v-model="addForm.subTitle"></el-input>
          </el-form-item>
          <el-form-item label="讲师" prop="teacherId">
            <el-select v-model="addForm.teacherId" placeholder="请选择" >
              <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name" :value="teacher.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程类别">
            <!-- 一级分类 -->
            <el-select v-model="addForm.subjectPid" @change="subjectLevelOneChanged" placeholder="请选择" >
              <el-option v-for="subject in subjectList" :key="subject.id" :label="subject.title" :value="subject.id"></el-option>
            </el-select>
            <!-- 二级分类 -->
            <el-select v-model="addForm.subjectId" placeholder="请选择" >
              <el-option v-for="subject in subjectLevelTwoList" :key="subject.id" :label="subject.title" :value="subject.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- 课程封面 -->
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

          <!-- 课程价格 -->
          <el-form-item label="课程价格" prop="price">
            <el-input v-model.number="addForm.price"></el-input>
          </el-form-item>
          <!-- 课程简介 -->
          <el-form-item label="课程简介" prop="description">
            <el-input v-model="addForm.description"></el-input>
          </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addCourse">确定</el-button>
        </span>
      </el-dialog>

      <!-- 修改对话框 -->
      <el-dialog
        title="修改课程信息"
        :visible.sync="updateDialogVisible"
        width="50%"
        @close="updateDialogClosed"
      >
        <el-form
          :model="updateForm"
          :rules="updateFormRules"
          ref="updateFormRef"
          label-width="80px"
        >
          <!-- 课程标题 -->
          <el-form-item label="课程标题" prop="title">
            <el-input v-model="updateForm.title"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="title">
            <el-input v-model="updateForm.subTitle"></el-input>
          </el-form-item>
          <!-- 封面 -->
          <div class="addBrand-container contanier" style="margin-left:0">
            <el-form-item label="课程封面" prop="cover" class="uploadImg">
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
         <!-- 课程价格 -->
         <el-form-item label="课程价格" prop="price">
            <el-input v-model.number="updateForm.price"></el-input>
          </el-form-item>
          <!-- 课程简介 -->
          <el-form-item label="课程简介" prop="description">
            <el-input v-model="updateForm.description"></el-input>
          </el-form-item>
        </el-form>
        <!-- 内容底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="updateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateCourseInfo">确定</el-button>
        </span>
      </el-dialog>
      <!-- 上传视频 -->
      <el-dialog :visible="addVideoVisible" title="添加视频" @close="close()">
        <el-form :model="video" label-width="120px">
          <el-form-item label="视频标题">
            <el-input v-model="video.title"/>
          </el-form-item>
          <el-form-item label="上传视频">
            <el-upload
              ref="upload"
              :auto-upload="false"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :on-exceed="handlerUploadExceed"
              :file-list="fileList"
              :limit="1"
              :before-remove="handleBeforeRemove"
              :on-remove="handleOnRemove"
              :action="this.baseUrl+'vod/vod/upload'"
            >
            <el-button slot="trigger" size="small" type="primary">选择视频</el-button>
            <el-button 
              :disabled="uploadBtnDisabled"
              style="margin-left:10px"
              size="small"
              type="success"
              @click="submitUpload()"
            >上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close()">取消</el-button>
            <el-button type="primary" @click="saveOrUpdate()">确定</el-button>
          </div>
      </el-dialog>
      <!-- 详情页面 -->
      <el-dialog
        title="详情页面"
        :visible.sync="detailDialogVisible"
        width="50%"
      >
        <el-form :inline="true" :model="addForm" class="demo-form-inline">
          <el-form-item>
            <el-date-picker
              v-model="startDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="endDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择截止日期">
            </el-date-picker>
          </el-form-item>
          <el-button
            :disabled="btnDisabled"
            type="primary"
            icon="el-icon-search"
            @click="showDetail()"
          >
            查询
          </el-button>
        </el-form>
        <div id="chart" class="chart" style="height:500px"></div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  data() {
    return {
      baseUrl:"http://localhost:9381/",
      multipleSelection:[],//多选框
      teacherList:[],
      subjectList:[],
      subjectLevelTwoList:[],
      searchData:{
        subjectId:'',//解决查询表单无法选择第二级别
      },
      uploadUrl:this.baseUrl+"common/upload?name=",
      downloadUrl: 'https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/',
      imageUrl:'',
      courseList: [], //课程列表
      total: 0, //总记录数
      currentPage:1,//页码
      pageSize:8,//页大小
      courseInfo:{
      },
      addDialogVisible:false,
      addForm: {
        cover:'',
        subjectId:null,
      },
      updateForm:{
        cover:"",
      },
      updateDialogVisible: false,
      video:{
        videoSourceId:''
      },
      addVideoVisible:false,
      fileList:[],//上传文件列表
      uploadBtnDisabled:false,
      detailDialogVisible:false,//打开详情页面
      startDate:'',//开始时间
      endDate:'',//结束时间
      courseId:'',//课程id
      btnDisabled:false,//是否禁用按钮
      //添加表单验证
      addFormRules: {
        title: [
          { required: true, message: "请输入课程标题", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" },
        ],
        subTitle: [
          { required: true, message: "请输入课程副标题", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 5 到 15 个字符", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入课程价格", trigger: "blur" },
          { type: 'number', message: '价格必须为数字值'}
        ],
        description: [
          { required: true, message: "请输入课程简介", trigger: "blur" },
          { min: 1, max: 50, message: "描述内容过多", trigger: "blur" },
        ],
      },
      //修改表单验证
      updateFormRules: {
        title: [
          { required: true, message: "请输入课程标题", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 1 到 15 个字符", trigger: "blur" },
        ],
        subTitle: [
          { required: true, message: "请输入课程副标题", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 5 到 15 个字符", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入课程价格", trigger: "blur" },
          { type: 'number', message: '价格必须为数字值'}
        ],
        description: [
          { required: true, message: "请输入课程简介", trigger: "blur" },
          { min: 1, max: 50, message: "描述内容过多", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCourseList();
    this.getTeacherList();
    this.getSubjectList();

    //初始化最近十天数据
    let currentDate=new Date()
    this.startDate=this.dateFormat(new Date(currentDate.getTime()-7*24*3600*1000))
    this.endDate=this.dateFormat(currentDate)
  },
  methods: {
    getCourseList(){
      this.$http.get("/course/"+this.currentPage+"/"+this.pageSize,{params: this.searchData})
      .then(res=>{
        //console.log(res.data)
        this.courseList=res.data.data.courseList
        this.total=res.data.data.total
      })
    },
    getTeacherList(){
      this.$http.get("/teacher/getAllTeachers").then(res=>{
        this.teacherList = res.data.data;
      })
    },
    getSubjectList(){
      this.$http.get("subject/getChildrenSubject/0").then(res=>{
          this.subjectList = res.data.data;
      })
    },
    subjectLevelOneChanged(value){
      this.$http.get("subject/getChildrenSubject/"+value).then(res=>{
          this.subjectLevelTwoList = res.data.data;
          this.searchData.subjectId=''
      })
    },
    resetData(){
      this.searchData={}
      this.subjectLevelTwoList=[]
      this.getCourseList()
    },
    //最大数
    handleSizeChange(newSize) {
      
      this.pageSize = newSize;
      this.getCourseList();
    },
    //currentPage的触发动作
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getCourseList();
    },
    //修改课程状态
    courseStatusChanged(courseInfo) {
      this.$http.put(`course/updateStatus?id=${courseInfo.id}&status=${courseInfo.status}`)
      .then(res=>{
        //console.log(res)
        if (res.data.flag != 200) {
          return this.$message.error(res.msg);
        }
        this.$message.success(res.data.data);
      })
      
    },
    //监听添加课程
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addCourse() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        this.$http.post("course/addCourse", this.addForm).then(res=>{
          //console.log(res)
          if (res.data.flag != 200) {
            return this.$message.error("添加失败!!!");
          }
          this.$message.success("添加成功!!!");
          this.addDialogVisible = false;
          this.getCourseList();
          this.addForm={}
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
      const { data: res } = await this.$http.delete("course/deleteCourse?id=" + id);
      //console.log(res)
      if (res.flag != 200) {
        return this.$message.error("删除失败!!!");
      }
      this.$message.success(res.data);
      this.getCourseList();
    },
    //显示对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("course/getUpdate2?id=" + id);
      this.updateForm = res.data; //查询出 你 信息反填到表单中
      this.updateDialogVisible = true; //开启编辑对话框
    },
    //关闭对话框
    updateDialogClosed() {
      this.$refs.updateFormRef.resetFields(); //重置信息
    },
    // 确认修改
    updateCourseInfo() {
      this.$refs.updateFormRef.validate(async (valid) => {
        if (!valid) return;
        //发起修改请求
        const { data: res } = await this.$http.put(
          "course/updateCourse",
          this.updateForm
        );
        //console.log(res)
        if (res.flag != 200) return this.$message.error("修改失败!!!");
        this.$message.success("修改成功!!!");
        //隐藏修改对话框
        this.updateDialogVisible = false;
        this.getCourseList();
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
        return `https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/${image}`
    },
    showAddVideoDialog(id){
      this.addVideoVisible=true
      this.video.courseId=id
    },
    close(){
      this.addVideoVisible=false
      this.video={}
      this.fileList=[]
    },
    saveOrUpdate(){
      //先拿到courseId,根据courseId查询是否有该课程对应的视频记录，如果有则修改，否则新增
      this.$http.get("/vod/video/getVideo?courseId="+this.video.courseId).then(res=>{
        //console.log(res)
        if(res.data.flag==400){
          this.save()
        }else{
          this.update()
        }
      })
    },
    save(){
      this.$http.post("/vod/video/saveVideo",this.video).then(res=>{
        if(res.data.flag==200){
        this.$message.success(res.data.data)
        //关闭组件
        this.close()
        this.getCourseList()
        }else{
          return this.$message.error(res.data.msg)
        }
      })
    },
    update(){
      this.$http.put("/vod/video/updateVideo",this.video).then(res=>{
        //console.log(res)
        if(res.data.flag==200){
          this.$message.success(res.data.data)
          //关闭组件
          this.close()
          this.getCourseList()
        }else{
          return this.$message.error(res.data.msg);
        }
      })
    },
    //上传多于一个视频
    handlerUploadExceed(files,fileList){
      this.$message.warning("请不要多次上传视频")
    },
    //上传
    submitUpload(){
      this.uploadBtnDisabled=true
      this.$refs.upload.submit()//提交上传请求  
    },
    //视频上传成功的回调
    handleUploadSuccess(res,file,fileList){
      this.uploadBtnDisabled=false
      this.video.videoSourceId=res.data
      this.video.videoOriginalName=file.name
    },
    //失败回调
    handleUploadError(){
      this.uploadBtnDisabled=false
      this.$message.error("上传失败!")
    },
    //删除视频文件确认
    handleBeforeRemove(file,fileList){
      return this.$confirm(`确定移除${file.name}?`)
    },
    //执行视频文件的删除
    handleOnRemove(file,fileList){
      if(!this.video.videoSourceId){
        return
      }
      //删除云端视频
      this.$http.delete("/vod/vod/delete/"+this.video.videoSourceId).then(res=>{
        this.video.videoSourceId=''
        this.video.videoOriginalName=''
        this.$message.success(res.data.data)
      })
    },
    //打开详情页面
    showDetailDialog(courseId){
      this.detailDialogVisible=true
      this.courseId=courseId
    },
    showDetail(){
      this.$http.get(`/vod/videoVisitor/findCount/${this.courseId}/${this.startDate}/${this.endDate}`).then(res=>{
        //console.log(res)
        if(res.data.data.code=="400"){
          return this.$message.warning("该时间段没有人观看")
        }else{
          this.setChartData(res.data.data)
        }
      })
    },
    //设置表格数据
    setChartData(data){
      var myChart = echarts.init(document.getElementById('chart'));
      var option;

      option = {
        title:{
          text:'观看课程人数统计',
          left: "center",
        },
        xAxis: {
          type: 'category',
          data: data.xData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: data.yData,
          type: 'bar'
        }]
      };
      option && myChart.setOption(option);
    },
    //日期格式化
    dateFormat(date){
      let fmt="YYYY-mm-dd"
      let ret;
      const opt={
        "Y+": date.getFullYear().toString(),    //年
        "m+": (date.getMonth()+1).toString(),   //月
        "d+": date.getDate().toString(),        //日
        "H+": date.getHours().toString(),       //时
        "M+": date.getMinutes().toString(),     //分
        "S+": date.getSeconds().toString()      //秒
      }
      for(let k in opt){
        ret=new RegExp("("+k+")").exec(fmt)
        if(ret){
          fmt=fmt.replace(ret[1],(ret[1].length==1)?(opt[k]):(opt[k].padStart(ret[1].length,"0")))
        }
      }
      return fmt;
    },
    //获得选中
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    //批量删除
    async batchRemove(){
        //非空判断
        if(this.multipleSelection.length===0){
          this.$message.warning('请选择要删除的课程！')
          return
        }
        const confirmResult = await this.$confirm("您确定要删除吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).catch((err) => err);
        if (confirmResult != "confirm") {
          return this.$message.info("已取消删除");
        }
        var idList=[]
        //遍历数组
        for(var i=0;i<this.multipleSelection.length;i++){
          var obj=this.multipleSelection[i]
          var id=obj.id
          //放到数组里
          idList.push(id)
        }
        //console.log(idList)
        const { data: res } = await this.$http.delete("course/del/batch",  {data:idList,type:1});
        //console.log(res)
        if (res.flag != 200) {
          return this.$message.error("删除失败");
        }
        this.$message.success("删除成功");
        this.getCourseList();
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
