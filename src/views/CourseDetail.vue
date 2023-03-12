<template>
    <div>
        <div>
            <div style="padding-top: 28px;">
                <div >
                <a href="/front/course" cursor:pointer style="font-size: 17px;"><span style="color: black;">返回</span></a>
                </div>
            </div>
            <div >
                <div>
                    <div id="dplayer" class="dplayer"></div>
                </div>
                <div>
                    <Comment v-bind:id="this.id"></Comment>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Comment from '../components/Comment.vue'
import DPlayer from 'dplayer';
export default{
    components:{
        Comment,
    },
    data(){
        return{
            id: this.$route.query.id,
            dp:null,
        }
    },
    mounted(){
        if(this.id==undefined){
          this.$router.push({path:'/front/course/course_detail/404',component:()=>import("../components/Error/404.vue")})
        }
        this.$http.get("/vod/video/getVideoCoverAndUrl/"+this.id).then(res=>{
            const video=res.data.data
            //console.log(res)
            const pic=video.coverUrl
            const url=video.playUrl
            //初始化视频播放组件
            this.dp=new DPlayer({
                container: document.getElementById('dplayer'),
                theme: "#b7daff", // 风格颜色，例如播放条，音量条的颜色
                loop: false, // 是否自动循环
                lang: "zh-cn", // 语言，'en', 'zh-cn', 'zh-tw'
                // screenshot: true, // 是否允许截图（按钮），点击可以自动将截图下载到本地
                hotkey: true, // 是否支持热键，调节音量，播放，暂停等
                preload: "auto", // 自动预加载
                volume: 0.7, // 初始化音量
                playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2, 3], //可选的播放速度，可自定义
                video: {
                    url: url,
                    pic: pic,
                    thumbnails: '',
                    quality: [
                        // 设置多个质量的视频
                        {
                        name: "高清",
                        url: url,
                        type: "auto", // 'auto', 'hls', 'flv', 'dash', 'webtorrent', 'normal' 或 其他自定义类型
                        },
                        {
                        name: "标准",
                        url:url,
                        type: "normal",
                        },
                    ],
                    defaultQuality: 0, // 默认是高清
                },
                contextmenu: [
                    //  自定义上下文菜单
                    // 右键菜单
                    {
                        text: "了解更多",
                        link: "https://dplayer.diygod.dev/",
                    },
                ],
                highlight: [
                //进度条上的自定义时间标记
                // 进度条时间点高亮
                    {
                        text: "10M",
                        time: 6,
                    },
                    {
                        text: "20M",
                        time: 12,
                    },
                ],
            })   
        })
        
    },
    created(){
        //this.init()
    },   
    methods:{
        
    }
}
</script>

<style lang="less" scoped>
/deep/ .dplayer-full {
    .dplayer-full-in-icon {
    display: none !important;
    }
}
.dplayer{
    width: 900px;
    height:500px;
    margin-left: 40px;
    margin-top: 60px;
}
</style>