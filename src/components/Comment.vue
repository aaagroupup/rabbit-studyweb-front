<template>
  <div>
    <!-- 评论 -->
    <div style="margin: 30px 0;">
      <div>
        <div>
          <el-input  @focus="updateIsShowEmoji"  style="width: 880px;height: 60px;" id="input" type="textarea" v-model="commentForm.content"  placeholder="善语结善缘，恶语伤人心"></el-input>    
          <button class="c-btn change change1" type="primary" @click="saveComment">评论</button>  
          <VEmojiPicker v-show="showEmojiDialog" @select="selectEmoji"/>          
        </div>
        <el-button v-show="showEmoji" type="text" style="float: left;margin-left: 10px;" size="mini" @click="showEmojiDialog=!showEmojiDialog">😃</el-button>
      </div>

      <!-- 评论列表 -->
      <div v-if="comments.length!=0">
        <div v-for="item in comments" :key="item.id" style="border-bottom: 1px solid #ccc;padding: 50px 0;">
          <div style="display: flex;">
            <!--头像-->
            <div style="width:100px;text-align: center;">
              <el-image :src="item.avatar" style="width:50px;height: 50px;border-radius: 50%;"></el-image>
            </div>
            <!--内容-->
            <div style="flex:1;font-size: 14px;padding: 5px 0;line-height: 25px;">
              <b>{{item.nickname}}:</b><br/>
              <span style="font-size: 18px;">{{item.content}}</span>
              <div style="display: flex;line-height: 20px;margin-top: 5px;">
                <div style="width: 200px;">
                  <i class="el-icon-time"></i><span style="margin-left: 5px;">{{item.time}}</span>
                </div>
                <div style="text-align: right;flex: 1;">
                  <el-button type="text" style="margin-left: 5px;" @click="handelReply(item.id)">回复</el-button>
                  <el-button type="text" style="color: red;" @click="delComment(item.id)" v-if="user.id===item.userId">删除</el-button>
                </div>
              </div>
            </div>
          </div>
          <!-- 评论的回复 -->
          <div v-if="item.children.length" style="padding-left: 50px;">
            <div v-for="subItem in item.children" :key="subItem.id" style="padding: 5px 10px;">
              <!-- 回复列表 -->
              <div style="font-size: 14px;padding: 5px 0;line-height: 25px;">
                 <!--头像-->
                 <div style="width:100px;text-align: center; float: left;">
                  <el-image :src="item.avatar" style="width:50px;height: 50px;border-radius: 50%;"></el-image>
                </div>
                <div style="padding-left: 5px;">
                  回复 <b style="color:#3a8ee6" v-if="subItem.pnickname">@{{subItem.pnickname}}</b>
                </div>
                <div style="padding-left: 5px;">
                  <b>{{subItem.nickname}}:</b>
                  <span>{{subItem.content}}</span>
                </div>
                <div style="display: flex;line-height: 20px;margin-top: 5px;padding-left: 5px;">
                  <div style="width: 200px;">
                    <i class="el-icon-time"></i><span style="margin-left: 5px;font-size: 15px;">{{subItem.time}}</span>
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
          <el-button type="text" style="float: right; margin-right: 10px;" size="mini" @click="showEmojiDialogReply = !showEmojiDialogReply">😃</el-button>
          <el-input type="textarea" id="reply" v-model="commentForm.contentReply" autocomplete="off"  placeholder="善于结善缘，恶语伤人心"></el-input>
          <VEmojiPicker v-show="showEmojiDialogReply" @select="selectEmojiReply"/>
        </el-form-item>
      </el-form>
      <div slot="footer" style="padding-bottom: 60px;">
        <button class="btn" @click="saveComment">确定</button>
        <button class="btn" @click="viewDialogVisible=false">取消</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {VEmojiPicker} from 'v-emoji-picker'
export default{
    components: {
      VEmojiPicker
    },
    props:{
      id:String
    },
    data(){
        return{
          content:'',
          comments:[],
          commentForm:{},
          showEmoji:false,
          showEmojiDialog:false,
          showEmojiDialogReply:false,
          viewDialogVisible:false,
          user:sessionStorage.getItem("user")? JSON.parse(sessionStorage.getItem("user")):{},
        }
    },
    created(){
      this.getComment()
    },
    methods:{
        updateIsShowEmoji(){
            this.showEmoji=true
        },
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
      getComment(){
        this.$http.get("comment/tree/getComment/"+this.id).then(res=>{
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

        this.commentForm.courseId=this.id
        this.$http.post("/comment",this.commentForm).then(res=>{
          if(res.data.flag===200){
            this.$message.success(res.data.data)
            this.commentForm={}//初始化评论内容
            this.viewDialogVisible=false
            this.getComment()
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
    }
}
</script>

<style lang="less" scoped>
/deep/textarea::-webkit-input-placeholder {
  color: #86d4df;
  font-size: 15px;
  
}

// 改变input框背景颜色
/deep/.el-textarea__inner {
  background-color: transparent !important;
  border: 1px solid #b3b9b5;
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

.c-btn{
	background-color:rgb(154, 224, 241);
	border:rgb(154, 224, 241) 1px solid;
    border-radius: 5%;
	outline:none;  /*去除点击时的蓝色边框*/
	cursor:pointer;
	padding:14px 20px;
	color:rgb(58, 2, 2);
	text-align: center;
	font-size: 16px;
	margin:10px;
  width: 100px;
  height: 50px;
}
.no-comment{
  padding-top: 100px;
  text-align: center;
  color:aqua;
  padding-bottom: 200px;
  font-size: 40px;
}
</style>