<template>
  <div>
    <div style="padding-top: 30px;padding-bottom: 20px;font-size: 20px;">
      <span>已买课程</span>
      <el-input style="width:300px;float: right;margin-right: 20px;" placeholder="请输入搜索内容" @clean="init" v-model="query" clearable  @keyup.enter.native="searchCourse" icon="el-icon-search"/>
    </div>
    <hr/>
    <div style="padding-top: 20px;" class="good-box">
      <div class="box-content"> 
        
        <div class="goods-item brick-item" style="margin-left: 20px;display:table;padding-top: 30px;" v-for="i in courseList" :key="i.id">
            <div style="padding-bottom: 30px;background-color: cadetblue;border-radius: 3%;width: 240px;height: 250px;">
              <a @click="jumpCourseDetail(i.id)">
                <div>
                  <img :src="i.cover" class="item-img">
                </div>
                <div class="item-span">
                  <span style="font-size: 18px;color: aqua;">[{{ i.title }}]</span>
                </div>
                <div class="item-span"> 
                  <span style="font-size: 15px;color: aquamarine;">{{ i.subTitle }}</span>                    
                </div>
                <div class="item-span">
                  <span style="font-size: 15px;color: bisque;">{{i.param.teacherName}}</span>    
                </div>
              </a>
            </div>
        </div>
      </div>
    </div>
    <div style="padding-top: 50px;padding-bottom: 20px;font-size: 20px;">
      <span>免费课程</span>
    </div>
    <hr/> 
    <div>
      <div style="padding-top: 20px;" class="good-box">
          <div class="box-content"> 
          <div class="goods-item brick-item" style="margin-left: 20px;display:table;padding-top: 30px;" v-for="i in freeCourseList" :key="i.id">
            <div style="padding-bottom: 30px;background-color: cadetblue;border-radius: 3%;width: 240px;height: 250px;">
              <a @click="jumpCourseDetail(i.id)">
                <div>
                  <img :src="i.cover" class="item-img">
                </div>
                <div class="item-span">
                  <span style="font-size: 18px;color: aqua;">[{{ i.title }}]</span>
                </div>
                <div class="item-span"> 
                  <span style="font-size: 15px;color: aquamarine;">{{ i.subTitle }}</span>                    
                </div>
                <div class="item-span">
                  <span style="font-size: 15px;color: bisque;">{{i.param.teacherName}}</span>    
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  data(){
    return{
      downloadUrl:'https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/',
      courseList:[],//已买的课程列表
      query:'',//搜索条件
      freeCourseList:[],
      user:sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},
    }
  },
  created(){
    this.init()
  },
  methods:{
    init () {
      this.$http.get("/course/getPurchasedCourseList").then((res) => { 
        // 处理类型 
        //console.log(res.data)
        this.courseList= res.data.data.courseList;
        for (let i = 0; i < this.courseList.length; i++) {
          const course = this.courseList[i];
          //处理图片路径
          
          course.cover=this.downloadUrl+course.cover
        }
        this.freeCourseList=res.data.data.freeCourseList;     
      });
    },
    searchCourse(){
      this.$http.get("/course/getCourseListByQuery?searchText="+this.query).then(res=>{
        //console.log(res)
        this.courseList=res.data.data
        for (let i = 0; i < this.courseList.length; i++) {
          const course = this.courseList[i];
          //处理图片路径
          course.cover=this.downloadUrl+course.cover
        }     
      }) 
    },
    jumpCourseDetail(id){
      this.$router.push({path:"/front/course/course_detail",query:{id:id},component:()=>import("../views/CourseDetail.vue")})
    },
  }
}
</script>
<style lang="less" scoped>
.item-span{
  padding-top: 10px;
  margin-left: 10px;
}

.item-img{
  display:table-cell;
  text-align:center;
  vertical-align:middle;
  width:230px;
  height:120px;
  margin-left: 5px;
  padding-top: 2px;
}
</style>
