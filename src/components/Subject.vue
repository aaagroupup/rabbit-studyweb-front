<template>
    <div>
      <el-card>
        <el-row :gutter="25">
            <el-col :span="10">
                <el-button type="text" @click="exportData"><i class="fa fa-plus">导出</i></el-button>
                <el-button type="text" @click="importData"><i class="fa fa-plus">导入</i></el-button>
            </el-col>
        </el-row>
  
        <!-- 课程列表 border边框 stripe隔行变色 -->
        <el-table :data="subjectList" border lazy
        row-key="id" :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column label="名称" prop="title"></el-table-column>
          <el-table-column label="创建时间" prop="createTime"></el-table-column>
          <el-table-column label="更新时间" prop="updateTime"></el-table-column>
          
        </el-table>
  

      </el-card>
      <el-dialog title="导入" :visible.sync="dialogImportVisible" width="480px">
        <el-form label-position="right" label-width="170px">
            <el-form-item label="文件">
                <el-upload :multiple="false"
                    :on-success="onUploadSuccess"
                    :action="importUrl"
                >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogImportVisible=false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
       dialogImportVisible:false,
        subjectList: [], //课程列表
        baseUrl:"http://localhost:9381/",
        importUrl:"http://localhost:9381/subject/importData"
      };
    },
    created() {
      this.getSubjectList(0);
    },
    methods: {
        
      // 获取所有课程
      getSubjectList(id) {
        this.$http.get("subject/getChildrenSubject/"+id).then(res=>{
          //console.log(res)
          this.subjectList = res.data.data;
        })
      },
      load(tree,treeNode,resolve){
        this.$http.get("subject/getChildrenSubject/"+tree.id).then(res=>{
            resolve(res.data.data)
        })
      } ,
      exportData(){
        window.open(this.baseUrl+"subject/exportData")
    },
    importData(){
        this.dialogImportVisible=true;
    },
    onUploadSuccess(){
        this.$message.info("上传成功")
        this.dialogImportVisible=false
        this.getSubjectList(0)
    },
    },

    }
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
  