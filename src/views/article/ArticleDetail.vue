<template>
    <div style="color #666">
      <div style="float: left;padding-top:30px;margin-left:20px">
        <span><a style="cursor: pointer;" href="/front/article">返回</a></span>
      </div>
      <div style="margin: 20px 0;">
        <div class="pd-10" style="font-size:40px;color: #3f5efb;text-align: center;">{{article.name}}</div>
        <div style="font-size: 20px;margin-top: 10px;text-align: center;">
          <span>发布人：{{article.nickname}}</span>
        </div>
      </div>
      <div style="margin: 20px 0;">
        <mavon-editor 
        class="md" 
        :value="article.content" 
        :subfield="false" 
        :defaultOpen="'preview'" 
        :toolbarsFlag="false" 
        :editable="false" 
        :scrollStyle="true" 
        :ishljs="true"
      />
      </div>

      <!-- 时间 和评分-->
      <div style="margin: 20px 0;">
        <span style="float: left;">我的评分:&nbsp;&nbsp;</span>
        <el-rate  v-model="score" :colors="colors" @change="change(score)"></el-rate>
        <div style="font-size:22px;float: right;">发布时间：{{article.time}}</div>
      </div>
      
      <div style="margin: 30px 0;">
        <div style="margin: 10px 0; padding-top: 20px;">
          <div style="border-bottom: 1px solid orangered;padding: 10px 0;font-size: 22px;">评论</div>
          <div style="padding-top: 20px;">
            <el-input id="input" type="textarea" v-model="commentForm.content"  placeholder="发一条友善的评论" style="width:880px;height: 60px;"></el-input>
            <button class="c-btn change change1" type="primary" @click="saveComment">评论</button> 
            <VEmojiPicker v-show="showEmojiDialog" @select="selectEmoji"/>
          </div>
          <el-button type="text" style="float: left; margin-left: 10px;" size="mini" @click="showEmojiDialog = !showEmojiDialog">😃</el-button>
        </div>

        <!-- 评论列表 -->
        <div v-if="comments.length!=0" style="padding-top: 40px;">
          <div v-for="item in comments" :key="item.id" style="border-bottom: 1px solid #ccc;padding: 10px 0;">
            <div style="display: flex;">
              <!--头像-->
              <div style="width:100px;text-align: center;">
                <el-image :src="item.avatar" style="width:50px;height: 50px;border-radius: 50%;"></el-image>
              </div>
              <!--内容-->
              <div style="flex:1;font-size: 14px;padding: 5px 0;line-height: 25px;">
                <b>{{item.nickname}}:</b>
                <span>{{item.content}}</span>
                <div style="display: flex;line-height: 20px;margin-top: 5px;">
                  <div style="width: 200px;padding-top: 10px;">
                    <i class="el-icon-time"></i><span style="margin-left: 5px;">{{item.time}}</span>
                  </div>
                  <div style="text-align: right;flex: 1;">
                    <el-button type="text" style="margin-left: 5px;" @click="handelReply(item.id)">回复</el-button>
                    <el-button type="text" style="color: red;" @click="delComment(item.id)" v-if="user.id===item.userId">删除</el-button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="item.children.length" style="padding-left: 50px;">
              <div v-for="subItem in item.children" :key="subItem.id" style="padding: 5px 10px;">
                <!-- 回复列表 -->
                <div style="font-size: 14px;padding: 5px 0;line-height: 25px;">
                  <div style="width:100px;text-align: center; float: left;">
                    <el-image :src="subItem.avatar" style="width:50px;height: 50px;border-radius: 50%;"></el-image>
                  </div>
                  <div style="padding-left: 5px;">
                    回复 <b style="color:#3a8ee6" v-if="subItem.pnickname">@{{subItem.pnickname}}</b>
                  </div>
                  <div style="padding-left: 5px;">
                    <b>{{subItem.nickname}}:</b>
                    <span>{{subItem.content}}</span>
                  </div>
                  <div style="display: flex;line-height: 20px;margin-top: 5px;padding-left: 5px;">
                    <div style="width: 200px;padding-top: 10px;">
                      <i class="el-icon-time"></i><span style="margin-left: 5px;">{{subItem.time}}</span>
                    </div>
                    <div style="text-align: right;flex: 1;">
                      <el-button type="text" style="margin-left: 5px;" @click="handelReply(subItem.id)">回复</el-button>
                      <el-button type="text" style="color: red;" @click="delComment(subItem.id)" v-if="user.id===subItem.userId">删除</el-button>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>

          </div>
        </div>
        <div v-else>
        <div class="no-comment">
          <span>暂时没有人评论，快来占领沙发吧~</span>     
        </div>
      </div>
      </div>

      <el-dialog title="回复" :visible.sync="viewDialogVisible" width="50%">
        <el-form label-width="80px" size="small">
          <el-form-item label="回复内容">
            <el-button type="text" style="float: right; margin-right: 10px;" class="btn" size="mini" @click="showEmojiDialogReply = !showEmojiDialogReply">😃</el-button>
            <el-input type="textarea" id="reply" v-model="commentForm.contentReply" autocomplete="off"  placeholder="善于结善缘，恶语伤人心"></el-input>
            <VEmojiPicker v-show="showEmojiDialogReply" @select="selectEmojiReply"/>
          </el-form-item>
        </el-form>
        <div slot="footer" style="padding-bottom: 60px;">
          <button class="btn2" @click="saveComment">确定</button>
          <button class="btn2" @click="viewDialogVisible=false" >取消</button>
        </div>
      </el-dialog>

    </div>
  </template>
  
  <script>
  import {VEmojiPicker} from 'v-emoji-picker'
  export default {
    components: {
      VEmojiPicker
    },
    data() {
      return {
        score:null,
        article:{},
        content:'',
        comments:[],
        commentForm:{},
        id:this.$route.query.id,
        user:sessionStorage.getItem("user")? JSON.parse(sessionStorage.getItem("user")):{},
        viewDialogVisible:false,
        showEmojiDialog:false,
        showEmojiDialogReply:false,
        colors: ['red', '#F7BA2A', '#FF9900'] ,//评分颜色
      };
    },
    created(){
    this.getArticle()
    this.getComment()
    this.getScore()
    },
    methods: {
      selectEmoji(emoji) {// 选择emoji后调用的函数
        let input = document.getElementById("input")
        let startPos = input.selectionStart
        let endPos = input.selectionEnd
        let resultText = input.value.substring(0, startPos) + emoji.data + input.value.substring(endPos)
        input.value = resultText
        input.focus()
        input.selectionStart = startPos + emoji.data.length
        input.selectionEnd = startPos + emoji.data.length
        this.commentForm.content = resultText
      },
      selectEmojiReply(emoji) {// 选择emoji后调用的函数
        let input = document.getElementById("reply")
        let startPos = input.selectionStart
        let endPos = input.selectionEnd
        let resultText = input.value.substring(0, startPos) + emoji.data + input.value.substring(endPos)
        input.value = resultText
        input.focus()
        input.selectionStart = startPos + emoji.data.length
        input.selectionEnd = startPos + emoji.data.length
        this.commentForm.contentReply = resultText
      },
      // 获取所有文章
      getArticle() {
        this.$http.get("article/"+this.id).then(res=>{
          this.article = res.data;
        })
      },
      getComment(){
        this.$http.get("comment/tree/"+this.id).then(res=>{
          this.comments = res.data.data;
        }) 
      },
      saveComment(){
        if(!this.user){
          this.$message.warning("请您先登录")
          return;
        }
        if(this.commentForm.contentReply){//如果有回复的内容的话，把回复的内容赋给content
          this.commentForm.content=this.commentForm.contentReply
        }

        this.commentForm.articleId=this.id
        this.$http.post("/comment",this.commentForm).then(res=>{
          if(res.data.flag===200){
            this.$message.success(res.data.data)
            this.commentForm={}//初始化评论内容
            this.getComment()
            this.viewDialogVisible=false
          }else{
            this.$message.error(res.data.msg)
          }
        })
      },
      async delComment(id){
        const confirmResult = await this.$confirm("您确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        }).catch((err) => err);
        if (confirmResult != "confirm") {
          return this.$message.info("已取消删除");
        }
        this.$http.delete("/comment/"+id).then(res=>{
          
          if(res.status==200){
            this.$message.success("删除成功")
            this.getComment()
          }else{
            this.$message.error("删除失败!!!")
          }
        })
      },
      handelReply(pid){
        this.commentForm={pid:pid,originId:pid},
        this.viewDialogVisible=true;
      },
      //评分
      change(val){
        this.$http.put(`article/addScore/${this.id}/${val}`).then(res=>{
          if(res.data.flag==200){
            this.$message.success(res.data.data)
          }else{
            this.$message.error("评分出错了!")
          }
        })
      },
      getScore(){
        this.$http.get("/userArticleScore/getScore?articleId="+this.id).then(res=>
          this.score=res.data.data
        )
      }
    },
  };
  </script>
  
<style lang="less" scoped>
/deep/textarea::-webkit-input-placeholder {
  color: #86d4df;
  font-size: 15px;
}
  // 改变input框背景颜色
/deep/.el-textarea__inner {
  background-color: transparent !important;
  border: 1px solid #bae7c9;
}
.c-btn{
	background-color:rgb(154, 224, 241);
	border:rgb(154, 224, 241) 1px solid;
    border-radius: 5%;
	outline:none;  /*去除点击时的蓝色边框*/
	cursor:pointer;
	color:rgba(255,255,255,1);
	text-align: center;
	font-size: 16px;
	margin:10px;
  width: 100px;
  height: 50px;
}
.change{
	 transition: all 0.5s;
    -webkit-transition: all 0.5s; /* Safari */
}
.change1:hover{
	background-color:rgba(0,180,100,0.1);
	color:rgb(0,0,0);	
}


//回复按钮
.btn2 {
 background-image: linear-gradient(45deg, #b5f1da 0%, #a2f8f1  51%, #f7f19c  100%)
}

.btn2 {
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

.btn2:hover {
 background-position: right center;
 /* change the direction of the change here */
 color: #fff;
 text-decoration: none;
}

.btn2:active {
 transform: scale(0.95);
}
.no-comment{
  padding-top: 100px;
  text-align: center;
  color:aqua;
  padding-bottom: 200px;
  font-size: 40px;
}
</style>
  