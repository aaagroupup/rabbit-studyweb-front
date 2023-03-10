<template>
    <div class="menu-banner">
        <div class="menu-container" @mouseleave="bannerMenuHide()">
            <!-- 循环所有分类 -->
            <ul class="menu-list">
                <li 
                    class="list-item"
                    v-for="item in menus"
                    :key="item.id"
                    @mouseenter="bannerMenuShow(item.type)"
                >
                    <a :href="item.url">{{ item.value }}</a>
                    <i class="fa fa-angle-right"></i>
                </li>
            </ul>
        </div>
        <div
            class="menu-info"
            v-show="bannerMenuFlag"
            @mouseleave="bannerMenuHide()"
            @mouseenter="bannerMenuShow()"
        >
            <ul
                class="menu-info-list"
                v-for="list in menuListMatch"
                :key="list.id"
                :value="list.id"
            >
                <li
                    class="info-list-item"
                    v-for="item in list"
                    :key="item.id"
                    :value="item.id"
                >
                    <a :href="'/front/course/buyCourse?id='+item.id">
                        <img :src="item.cover" :alt="item.title"/>
                        <span>{{ item.title }}</span>
                    </a>
                    
                </li>
            </ul>
        </div>
        <!-- 走马灯 -->
        <div style="margin: 10px; 0">
        <el-carousel height="450px" :interval="3000">
            <el-carousel-item v-for="item in banners" :key="item.id">
              <a :href="item.url">
                <img :src="item.src" alt="" style="width: 100%;height: 100%;"/>
              </a>
            </el-carousel-item>
        </el-carousel>
    </div>
    </div>
</template> 

<script>    
export default {
    data(){
        return{
            downloadUrl:'https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/',
            bannerMenuFlag:false,
            menuTimer: "",
            listInfoData: [],   
            menus:[],
            banners:[],
            courses:{},
            user: sessionStorage.getItem("user")?JSON.parse(sessionStorage.getItem("user")) : {},
        }
    },
    created(){
        this.init()
    },
    methods:{
      init(){
        this.$http.get("/home/getMenusAndBanner").then((res) => { 
          // 处理类型
          //console.log(res)
          let homeMenusList= res.data.data.homeMenusList;
          for (let i = 0; i < homeMenusList.length; i++) {
            const course = homeMenusList[i];
            this.menus.push({   
              value:course.title,
              type:course.id,
              url:''
            });
            //处理图片路径
            for(let i=0;i<course.courseList.length;i++){
              course.courseList[i].cover=this.downloadUrl+course.courseList[i].cover
            } 
            // 处理课程
            this.courses[course.id]= course.courseList 
          } 

          // banner
          let homeAdvertisesList= res.data.data.advertiseList;
          for (let index = 0; index < homeAdvertisesList.length; index++) {
            const adver = homeAdvertisesList[index];
            this.banners.push({
              src:this.downloadUrl+adver.cover,
              url:"/front/course/buyCourse?id="+adver.id
            })
          }
        });
      },
      bannerMenuHide() {
        this.menuTimer = setTimeout(() => {
          this.bannerMenuFlag = false;
        }, 300);
      },
      bannerMenuShow(type) {   
        if (type) {
          this.listInfoData = this.courses[type]; 
        }
        this.bannerMenuFlag = true;
        clearTimeout(this.menuTimer);
      },
    },
    computed: {
        menuListMatch() {
        const matchData = [];
        if (this.listInfoData && this.listInfoData.length) {
            for (let i = 0; i < this.listInfoData.length; i += 6) {
            matchData.push(this.listInfoData.slice(i, i + 6));
            }
        }
        return matchData;
        
        },
  },
}
</script>

<style lang="less">
.menu-banner {
  position: relative;
  width: 1226px;
  height: auto;
  margin: 0 auto;
  .menu-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 235px;
    height: auto;
    background: rgba(0, 0, 0, 0.199);
    z-index: 10;
  }
}

.menu-list {
  padding: 20px 0;
  height: 420px;
  .list-item {
    display: flex;
    padding-left: 30px;
    &:hover {
      background-color: #ff6700;
    }

    a {
      position: relative;
      display: inline-block;
      width: 170px;
      height: 42px;
      line-height: 42px;
      color: #fff;
      text-align: left;
      background-color: transparent;
    }

    i {
      font-size: 22px;
      color: #e0e0e0;
      line-height: 42px;
    }
  }
}

.menu-info {
  position: absolute;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  left: 235px;
  top: 0;
  z-index: 11;
 
  box-shadow: 3px 8px 16px rgba(0, 0, 0, 0.18);
  .menu-info-list {
    width: 248px;
    height: 458px;
    margin: 0;
    padding: 0;
    list-style: none;
    background: rgba(226, 219, 219, 0.3);
    a {
      display: flex;
      padding: 18px 20px;
      line-height: 40px;
      color: #333;
      img {
        width: 40px;
        height: 40px;
        margin-right: 12px;
        vertical-align: middle;
      }

      span {
        width: 172px;
        line-height: 40px;
        font-size: 14px;
        text-align: start;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      &:hover {
        span {
          color: #ff6700;
        }
      }
    }
  }
}
</style>