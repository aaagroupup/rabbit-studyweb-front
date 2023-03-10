<template>
    <div class="detail">
      <div class="nav-bar">
        <div  class="pro-title">
            <el-breadcrumb separator=">" >
              <el-breadcrumb-item :to="{ path: '/front/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ course.title }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
      </div>
      <div class="wrapper">
        <div class="container clearfix">
          <img :src="this.downloadUrl+course.cover" style="width: 400px;height: 400px;"/>
          <div class="content">
            <h2 class="item-title">{{ course.title }}</h2>
            <div class="item-sub-title">{{ course.subTitle }}</div>
            <div class="item-teacher">授课老师：{{ course.teacherName }}</div>
            <div class="item-time">发布时间：{{ course.publishTime }}</div> 
            <div class="item-s">分类：{{ course.subjectParentTitle }}</div>
            <div class="item-price" v-if="course.price!=0">售价：{{ course.price }}元</div>
            <div class="item-sale" style="float: right;">已有&nbsp;{{ course.buyCount }}&nbsp;人参加</div>
            <div class="line"></div>
            <div class="btn-group" v-if="this.course.price!=0"> 
              <button class="btn change change1" style="margin-left: 30px;">
                <a href="javascript:;" @click="addShoppingCart">加入购物车</a>
              </button>
              <button class="btn change change1"  style="margin-left: 30px;">
                <a href="javascript:;" @click="pay()">立即购买</a>  
              </button> 
            </div>
            <div v-else class="btn-group">
              <button class="btn change change1" style="margin-left: 200px;">
                <a href="javascript:;" @click="addMyCourse">加入课程</a>
              </button>
            </div>
          </div> 
        </div>
      </div>
      <div style="padding-top: 30px;">
        <div>
          <span class="spn-course" ><a id="spn" @click="getCourseDesc">课程详情</a></span>
          <span class="spn-course"  style="margin-left: 40px;"><a id="spn2" @click="getCourseComment">课程评价</a></span>
          <hr style="margin-top: 10px;"/>
          <div style="margin-top: 30px;">
            
            <div v-if="isDesc" style="height:200px;color: rosybrown;border:1px solid #cee3e9;background:#f1f7f9">  
              <div style="padding-top: 30px;margin-left: 40px;font-size: 25px;">
                <span>{{ course.description }}</span>
              </div>
            </div>
            <div v-else>
              <Comment  v-bind:id="this.id"></Comment>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </template>
<script>
import Comment from "../components/Comment.vue"
  export default {
    name: "buyCourse",
    components:{
      Comment,
    },
    data() {
      return {
        id: this.$route.query.id, //获取课程ID
        downloadUrl:'https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/',
        course: {}, //课程信息
        isDesc:true,
        user:sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},
        form:{},//购物车信息
      };
    },
    created() {
      this.getCourseInfo();
    },
    methods: {
      getCourseInfo() {
        this.$http.get(`/course/detail/${this.id}`).then((res) => {         
          this.course=res.data.data;
          this.course.teacherName=this.course.param.teacherName;
          this.course.subjectParentTitle=this.course.param.subjectParentTitle
        });
      },
      addShoppingCart(){
        if(this.user.username==undefined){
          return alert("请您先登录")
        }
        this.form.image=this.course.cover;
        this.form.goodsname=this.course.title;
        this.form.amount=this.course.price;
        this.form.userId=this.user.id;
        this.form.goodsId=this.id;
        this.form.number=1;
        this.$http.post("/shoppingCart",this.form).then(res=>{
          //console.log(res)
          if(res.data.flag!=200){
            return this.$message.error(res.data.msg)
            }
          this.$message.success(res.data.data)
        })
      },
      getCourseDesc(){
        this.isDesc=true;
      },
      getCourseComment(){
        this.isDesc=false;
      },
      pay(){
        this.$http.get("/order/createOrder/"+this.id).then(res=>{
          //console.log(res)
          if(res.data.flag==200){
            this.$message.success(res.data.data)
            this.$router.push("/front/order")
          }else{
            this.$message.error("订单创建失败!")
          }
        }) 
      },
      addMyCourse(){
        this.$http.get(`/userCourse/find/${this.user.id}/${this.id}`).then(res=>{
          if(res.data.flag==400){
            this.$http.put(`/course/addFreeCourse/${this.user.id}/${this.id}`).then(res=>{
              if(res.data.flag==200){
                this.$message.success(res.data.data)
              }else{
                this.$message.error("添加失败!")
              }
            })
          }else{
            this.$message.warning(res.data.data)
          }
        })
      },
    },
  };
  </script>
<style lang="scss">
  @import "./../assets/scss/config.scss";
  @import "./../assets/scss/mixin.scss";
  .detail {
    .wrapper {
      .content {
        float: right;
        width: 584px;
        height: auto;
        .item-title {
          font-size: 34px;
          padding-top: 30px;
          padding-bottom: 16px;
          height: 66px;
        }
        .item-sub-title {
          font-size: 25px;
          padding-top: 20px;
        }
        .item-info {
          font-size: 20px;
          height: 36px;
          padding-top: 16px;
        }
        .item-teacher,.item-s{
          font-size: 17px;
          height: 36px;
          padding-top: 13px;
        }
        .item-time{
          font-size: 17px;
          height: 36px;
          padding-top: 15px;
        }
        .item-price {
          font-size: 20px;
          color: #ff6700;
          height: 19px;
          padding-top: 20px;
        }
        .btn-group {
          width: 100%;
          height: 53px;
          padding-top: 15px;
        }
        .line {
          height: 0;
          margin-top: 50px;
          margin-bottom: 28px;
          border-top: 1px solid #e5e5e5;
        }
      }
    }
  }
.btn{
	background-color:rgb(154, 224, 241);
	border:rgb(154, 224, 241) 1px solid;
	outline:none;  /*去除点击时的蓝色边框*/
	cursor:pointer;
	padding:14px 20px;
	color:rgba(255,255,255,1);
	text-align: center;
	font-size: 16px;
	margin:10px;
  width: 200px;
}
/*动态效果*/
.change{
	 transition: all 0.5s;
    -webkit-transition: all 0.5s; /* Safari */
}
.change1:hover{
	background-color:rgba(0,180,100,0.1);
	color:rgb(0,0,0);	
}
.nav-bar{
    height:70px;
    line-height:70px;
    border-top:1px solid $colorH;
    z-index:10;
    .pro-title{
      padding-top: 28px;
    }
  }
.spn-course{
  font-size: 20px;
  a{
    cursor:pointer;
  }
  a:hover{
    color: blue; /*鼠标移动到链接的颜色*/
  }

}
</style>