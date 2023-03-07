<template>
  <div>
    <div v-for="item in this.homeMenusList" :key="item.id">
        <div style="padding-top: 13px;padding-bottom: 30px;">
            <span style="font-size: 20px;">{{ item.title }}</span>
            <hr/>
        </div>
        <!-- 课程栏目 -->
        <div class="good-box">
            <div class="box-content"> 
                <div class="goods-content">
                    <div class="goods-one">
                    <div class="goods-item brick-item" style="display:table;background-color: #f1e9e9ec;"
                        v-for="i in item.courseList"
                        :key="i.id">

                        <a @click="jumpBuyCourse(i.id)">
                            <img :src="i.cover" style="display:table-cell;text-align:center; vertical-align:middle;">
                            
                            <span class="desc ellipsis">{{i.title}}</span>
                            <div>
                              <span class="desc ellipsis">{{i.subTitle}}</span>
                            </div>
                            <div>
                              <div class="price">
                                <span v-if="i.price==0">免费</span>
                                <span  v-else>{{i.price}}元</span>
                                <span style="float: right;margin-right: 30px;" v-if="i.price!=0">已售&nbsp;{{ i.buyCount }}</span>
                              </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>


    <div style="padding-top: 13px;padding-bottom: 30px;">
      <span style="font-size: 20px;">免费专区</span>
      <hr/>
    </div>
    <!-- 免费专区 -->
    <div class="good-box">
      <div class="box-content"> 
        <div class="goods-content">
          <div class="goods-one">
            <div class="goods-item brick-item" style="display:table;background-color:#f1e9e9ec" v-for="i in freeCourseList" :key="i.id">          
              <a @click="jumpBuyCourse(i.id)">
                <img :src="i.cover" style="display:table-cell;text-align:center; vertical-align:middle;"/>
                <span class="desc ellipsis">{{i.title}}</span>
                <div>
                  <span class="desc ellipsis">{{i.subTitle}}</span>
                </div>
                <div>
                  <div class="price">
                    <span style="margin-left: 10px;">免费</span>
                  </div>
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
export default {
  data () {
    return {
      downloadUrl:'https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/',
      courses:{},
      homeMenusList:[],
      freeCourseList:[],//免费课程
    }
  },
  methods: {
    init () {
      this.$http.get("/home/getMenusAndBanner").then((res) => { 
        // 处理类型 
        this.homeMenusList= res.data.data.homeMenusList;
        this.freeCourseList=res.data.data.freeCourseList;
        for (let i = 0; i < this.homeMenusList.length; i++) {
          const course = this.homeMenusList[i];
          //处理图片路径
          for(let i=0;i<course.courseList.length;i++){
            course.courseList[i].cover=this.downloadUrl+course.courseList[i].cover
          } 
          // 处理课程 
          this.courses[course.id]= course.courseList 
          console.log(this.freeCourseList)
        }     
      });
    },
    jumpBuyCourse(id){
      this.$router.push({path:"/front/course/buyCourse",query:{id:id},component:()=>import("../views/BuyCourse.vue")})
    },
  },
  created() {
    this.init();
  }
}
</script>

<style lang="less">
.index-page {
    .gray-page {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: auto;
      background-color: #f1e9e9ec;
    }
  }
.good-box {
    position: relative;
    width: 1226px;
    height: auto;
    margin: 0 auto;
}
.box-content {
    display: flex; 
    .goods-content .goods-one {
      width: 1240px;
      display: flex;
      flex-wrap: wrap;
      .goods-item {
        background: #fff;
        height: 300px;
        padding: 20px 0;
        width: 234px;
        margin-left: 14px;
        margin-bottom: 14px;
      }
    }

    .goods-content {
      a {
        display: block;
        img {
          width: 160px;
          height: 160px;
          margin: 0 auto 18px;
        }

        .name {
          font-size: 14px;
          font-weight: 400;
          color: #333;
          margin: 0 10px 2px;
        }

        .desc {
          display: block;
          margin: 0 10px 10px;
          height: 18px;
          font-size: 12px;
          color: #b0b0b0;
        }

        .price {
          margin: 0 10px 14px;
          font-size: 14px;
          color: #ff7300;
          del {
            color: #b0b0b0;
            margin-left: 8px;
          }
        }
      }
    }
  }
  .brick-item {
    transition: all .2s linear;
    &:hover {
      transform: translate3d(0, -2px, 0);
      box-shadow: 0 15px 30px rgba(0, 0, 0, .1);
    }
  }
</style>