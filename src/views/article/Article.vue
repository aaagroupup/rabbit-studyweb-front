<template>
    <div style="color #666">
      <!--文章列表主体 -->
      <el-card>
        <el-row :gutter="25" style="padding-bottom: 20px;"
          ><!--间隙-->
          <el-col :span="6">
            <div>
              <span class="spn-article" ><a @click="getArticleHot">最热</a></span>
              <span class="spn-article"  style="margin-left: 20px;"><a  @click="getArticleNew">最新</a></span>
              <span class="spn-article"  style="margin-left: 20px;"><a  @click="getAdv">公告</a></span>
            </div>
          </el-col>
          <el-col :span="14">
            <!--列宽-->
            <!-- 搜索区域 -->
            <!-- 搜索添加 -->
            
            <el-input
              placeholder="请输入搜索内容"
              v-model="queryInfo.query"
              suffix-icon="el-icon-search" 
              style="width: 200px;margin-left: 300px;"
              clearable
              @clear="getArticleList"
              @keyup.enter.native="getArticleList"
            >
            </el-input>
            
          </el-col>

          <el-col :span="2">
            <el-button icon="el-icon-edit" type="danger" @click="addDialogVisible = true">
              发布话题
            </el-button>
          </el-col>
        </el-row>
        <hr/>
        <!-- 文章列表 border边框 stripe隔行变色 -->
        <div style="padding-top: 20px;">
          <div style="margin:10px 0">
            <div class="brick-item2" v-for="item in articleList" :key="item.id">
              <div class="item-div" @click="$router.push('/front/articleDetail?id='+item.id)">
                <div class="pd-10">{{item.name}}</div>
                <div style="font-size: 14px;margin-top: 10px;">
                  <i class="el-icon-user-solid"></i><span>{{item.nickname}}</span>
                  <i class="el-icon-time" style="margin-left: 10px;"></i><span>{{item.time}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 分页组件 size-change 每页最大变化 current-change 当前最大变化 layout功能组件-->
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.currentPage"
            :page-sizes="[1,3,5,10]"
            :page-size="queryInfo.pageSize"
            layout="total, prev, pager, next "
            :total="total"
          >
          </el-pagination>
        </div>
      </el-card>
      
      <!-- 新增文章区域 -->
      <el-dialog
          title="发布话题"
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
              <mavon-editor ref='md' v-model="addForm.content" :ishljs="true" @imgAdd="$imgAdd"></mavon-editor>
            </el-form-item>
          </el-form>
          <!-- 内容底部区域 -->
          <div slot="footer" style="padding-bottom: 60px;">
            <button class="btn" @click="addDialogVisible = false">取消</button>
            <button class="btn" type="primary" @click="addArticle">确定</button>
          </div>
        </el-dialog>
      
    </div>
  </template>
  
  <script>
import axios from 'axios';


  export default {
    data() {
      return {
        downloadUrl:"https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/",
        //查询信息实体
        queryInfo: {
          query: "", //查询信息
          currentPage: 1, //当前页
          pageSize: 5, //页数
        },
        articleList: [], //文章列表
        total: 0, //总记录数
        addDialogVisible: false, //对话框状态
        addForm: {
          name: "",
          content:''
        },
        //添加表单验证
        addFormRules: {
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
      $imgAdd(pos,$file){
        //第一步，将图片上传到服务器
        var formData=new FormData();
        formData.append('file',$file)
        //必须使用原生axios
        let instance= axios.create({
          baseURL: 'http://121.199.32.66:9381',
          data: formData,        
          headers: { 'Content-Type': 'multipart/form-data'}
        })
        instance.post('/common/upload',formData).then(res=>{
          this.$refs.md.$img2Url(pos,this.downloadUrl+res.data.data)
        })
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
      //最热
      getArticleHot(){
        this.$http.get("article/getArticleByHot",{params:this.queryInfo}).then(res=>{
          this.articleList=res.data.data;
          this.total = res.data.data2;
        })
      },
      //最新
      getArticleNew(){
        this.$http.get("article/getArticleByTime",{params:this.queryInfo}).then(res=>{
          this.articleList=res.data.data;
          this.total = res.data.data2;
        })
      },
      //公告
      getAdv(){
        this.queryInfo.query="公告"
        this.$http.get("article/getAdv",{params:this.queryInfo}).then(res=>{
          this.articleList=res.data.data;
          this.total = res.data.data2;
        })
      },
    },
  };
  </script>
  
<style lang="less" scoped>
// 改变input里的字体颜色
/deep/input::-webkit-input-placeholder {
  color: #86d4df;
  font-size: 15px;
}

// 改变input框背景颜色
/deep/.el-input__inner {
  background-color: transparent !important;
  border: 1px solid #58bbe2;
}
/deep/button::-webkit-button-placeholder {
  color: #1e1a35;
  font-size: 15px;
}
.el-button--danger{
  color: #fff;
    background-color: #919bf7;
    border-color: #919bf7;
    border-radius: 43%;
    font-size: 14px;

}
  .brick-item2 {
    padding: 10px 0;
    border-bottom: 1px dashed #ccc;
    transition: all .2s linear;
    &:hover {
      transform: translate3d(0, -2px, 0);
      box-shadow: 0 15px 30px rgba(0, 0, 0, .1);
    }
  }
  .item-div{
    height:100px;
    background-color:beige;
  }
  .pd-10{
    font-size:20px;
    color: #3f5efb;
    cursor: pointer;
  }
  .spn-article{
  font-size: 18px;
  a{
    cursor:pointer;
  }
  a:hover{
    color: blue; /*鼠标移动到链接的颜色*/
  }

}

//回复按钮
.btn {
 background-image: linear-gradient(45deg, #b5f1da 0%, #a2f8f1  51%, #f7f19c  100%)
}

.btn {
  float: right;
  width: 100px;
  height: 45px;
 margin: 10px;
 padding: 1px 30px;
 text-align: center;
 text-transform: uppercase;
 transition: 0.5s;
 background-size: 200% auto;
 color: rgb(22, 21, 21);
 border-radius: 10px;
 display: block;
 border: 0px;
 font-weight: 700;
 box-shadow: 0px 0px 14px -7px #f5cc92;
}

.btn:hover {
 background-position: right center;
 /* change the direction of the change here */
 color: #fff;
 text-decoration: none;
}

.btn:active {
 transform: scale(0.95);
}
</style>
  