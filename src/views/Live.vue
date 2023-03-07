<template>
    <div>
        <div style="padding-top: 30px;padding-bottom: 20px;font-size: 20px;">
            <span>最近直播</span>
        </div>
        <hr/>
        <div style="padding-top: 20px;" class="good-box">
      <div class="box-content"> 
        
        <div class="goods-item brick-item" style="margin-left: 20px;display:table;padding-top: 30px;" v-for="i in liveList" :key="i.id">
            <div style="padding-bottom: 30px;background-color: cadetblue;border-radius: 3%;width: 220px;height: 200px;">
              <a @click="play(i.id)">
                <div>
                  <img :src="i.cover" class="live-img" style="border-radius:3%;">
                </div>
                <div>
                    <!-- 讲师头像 -->
                    <img :src="i.teacher.img" class="teacher-img">
                </div>
                <div class="item-span">
                    <div>
                        <span class="span-course">{{ i.courseName }}</span>
                    </div>
                    <div>
                        <span  class="span-teacher">{{i.teacher.name}}</span>
                        <span  class="span-date">{{ i.dateTime }}</span>                          
                    </div>
                    <div> 
                        <span class="span-time">{{ i.time }}</span>                                      
                    </div>
                    
                </div>
              </a>
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
            liveList:[],//直播列表
        }
    },
    created(){
        this.init()
    },
    methods:{
        play(id) {
            this.$http.get("/live/liveCourse/getPlayAuth/"+id).then(res => {
                //console.log(res.data);
                var token=res.data.data.access_token
                window.location = "../../live.html?token="+token   
         });
        },
        init(){
            this.$http.get("/live/liveCourse/findLatelyList").then(res=>{
                //console.log(res)
                this.liveList=res.data.data
                for(let i=0;i<this.liveList.length;i++){
                    this.liveList[i].cover=this.downloadUrl+this.liveList[i].cover
                    this.liveList[i].teacher.img=this.downloadUrl+this.liveList[i].teacher.img
                    var dateTime = this.dateFormat(this.liveList[i].startTime)
                    this.liveList[i].dateTime=dateTime[0]
                    this.liveList[i].time=dateTime[1]
                }
            })
        },
        //日期格式化
        dateFormat(dateStr){
            var dateSplit=dateStr.split(" ");//分割为日期和时间 "2023-03-09 00:00:00"
            var date=dateSplit[0].split("-");//获取日期部分
            var time=dateSplit[1].split(":")//获取时间部分
            var newDate=date[1]+"月"+date[2]+"日"
            var newTime=time[0]+":"+time[1]
            return new Array(newDate,newTime)
        },

    }
}
</script>
<style lang="less" scoped>
.live-img{
    width:218px;
    height:130px;
    margin-left: 1px;
    margin-top: 1px

}
.teacher-img{
    float: left;
    border-radius: 50%;
    width: 60px;
    height:60px;
    margin-left: 5px;
}
.item-span{
    float: right;
    margin-right: 35px;
}
.span-course{
    font-size: 18x;
    color: aqua;
}
.span-teacher,
.span-date{
    font-size: 15px;
    color: bisque;

}
.span-date{
    margin-left: 5px;
}
.span-time{
    font-size: 13px;
    color: aquamarine;
}
</style>