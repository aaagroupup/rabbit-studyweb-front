<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/live' }">直播列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/live/config' }">直播配置</el-breadcrumb-item>
    </el-breadcrumb>
  <el-card>
    <div class="app-container">
      
        <el-form label-width="120px" size="small">
          <div style="background-color: #e0e0e0;width: 100%;padding: 1px 10px;margin: 10px 0;">
            <span style="font-size:20px;color: black;">功能设置&nbsp;&nbsp;&nbsp;</span>
          </div>

          <el-form-item label="界面模式">
            <el-radio-group v-model="liveCourseConfigVo.pageViewMode">
              <el-radio :label="1">全屏模式</el-radio>
              <el-radio :label="0">二分屏</el-radio>
              <el-radio :label="2">课件模式</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="观看人数开关">
            <el-radio-group v-model="liveCourseConfigVo.numberEnable">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="商城开关">
            <el-radio-group v-model="liveCourseConfigVo.storeEnable">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <div style="background-color: #e0e0e0;width: 100%;padding: 1px 10px;margin: 10px 0;">
            <span style="font-size:20px;color: black;">商品列表&nbsp;&nbsp;&nbsp;
              <el-button size="small"  @click="addGoods()">添加</el-button>
            </span>
          </div>

          <el-table
           v-loading="listLoading"
           :data="liveCourseConfigVo.liveCourseGoodsList"
           stripe
           border
           style="width: 100%;margin-top: 10px;">
           <el-table-column type="index" label="序号" width="200" align="center"></el-table-column>
           <el-table-column prop="cover" label="商品图片" width="240" align="center">
              <template slot-scope="{ row }">
                <el-image style="width: auto; height: 40px; border:none;cursor: pointer;" 
                  :src="getImage(row.cover)" 
                  :preview-src-list="[ `https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/${row.cover}` ]" >
                  <div slot="error" class="image-slot">
                    <img src="../assets/img/noImg.png"  style="width: auto; height: 40px; border:none;" >
                  </div>  
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="title" width="240" label="名称"></el-table-column>
            <el-table-column prop="price" width="400" label="价格"></el-table-column>
            <el-table-column width="220" align="center" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text"  @click="removeGoodsById(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog title="添加商品" :visible.sync="dialogVisable" width="50%">
            <el-form :inline="true" label-width="150px" size="small" style="padding-right: 40px;">
              <el-table
              :data="courseList"
              stripe
              border
              style="width:100%;margin-top: 10px;"
              @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column label="分类">
                  <template slot-scope="scope">
                    {{ scope.row.param.subjectParentTitle }} > {{ scope.row.param.subjectTitle }}
                  </template>
                </el-table-column>
                <el-table-column prop="title" width="150" label="课程名称"></el-table-column>
                <el-table-column prop="param.teacherName" label="讲师"></el-table-column>
              </el-table>

              <el-form-item style="margin-top: 10px;">
                <el-button @click="dialogVisable=false">取消</el-button>
                <el-button @click="selectGoods()">保存</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <br/><br/>
          <el-form-item style="margin-left: 400px;">
            <el-button type="primary" @click="saveOrUpdate()">保存</el-button>
            <el-button @click="back()">返回</el-button>
          </el-form-item>
        </el-form>
    </div>
  </el-card>
</div>
</template>
<script>

export default{
    data(){
        return{
          liveCourseId:this.$route.query.id,
            listLoading:false,//数据是否正在加载
            liveCourseConfigVo:{
                liveCourseId:this.$route.query.id,
                pageViewMode:1,
                numberEnable:1,
                storeEnable:1,
                storeType:1,
                liveCourseGoodsList:[]
            },
            saveBtnDisable:false,
            dialogVisable:false,
            courseList:[],
            multipleSelection:[],
            goodsIdList:[],//商品id数组
        }
    },
    created(){
      this.init()
      //this.getSelectGoods()
    },
    methods:{
      addGoods(){
        this.dialogVisable=true
        this.$http.get("course/findAll").then(res=>{
          //console.log(res)
          this.courseList=res.data.data
        })
      },
      handleSelectionChange(val){
        this.multipleSelection=val;
      },
      selectGoods(){
        //非空判断
        if(this.multipleSelection.length===0){
          this.$message.warning('请选择要添加的商品！')
          return
        }
        //遍历数组
        for(var i=0;i<this.multipleSelection.length;i++){
          var obj=this.multipleSelection[i]
          var id=obj.id
          //放到数组里
          this.goodsIdList.push(id)
          this.dialogVisable=false
          this.getSelectGoods()
        }
      },
      saveOrUpdate(){
        this.$http.put("/live/liveCourse/updateConfig",this.liveCourseConfigVo)
        this.$message.success("保存成功")
      },
      getSelectGoods(){
        this.$http.delete("course/saveOrUpdate",{data:this.goodsIdList,type:1}).then(res=>{
          //console.log(res)
          this.liveCourseConfigVo.liveCourseGoodsList=res.data.data
          for(var i=0;i<this.liveCourseConfigVo.liveCourseGoodsList.length;i++){
            this.liveCourseConfigVo.liveCourseGoodsList[i].img=this.liveCourseConfigVo.liveCourseGoodsList[i].cover
            this.liveCourseConfigVo.liveCourseGoodsList[i].goodsId=this.liveCourseConfigVo.liveCourseGoodsList[i].id
            this.liveCourseConfigVo.liveCourseGoodsList[i].id=null;
            this.liveCourseConfigVo.liveCourseGoodsList[i].liveCourseId=this.liveCourseConfigVo.liveCourseId
          }
          console.log(this.liveCourseConfigVo.liveCourseGoodsList)
        })
      },
      init(){
        this.$http.get("/live/liveCourse/getCourseConfig/"+this.liveCourseId).then(res=>{
          //console.log(res)
          this.liveCourseConfigVo=res.data.data
        })
      },
      removeGoodsById(id){    
        this.goodsIdList = this.goodsIdList.filter(item => item != id)
        this.getSelectGoods()
      },
      back(){
        this.$router.push('/live') 
      },
      getImage (image) {
        return `https://rabbit-studyweb.oss-cn-hangzhou.aliyuncs.com/${image}`
      },

    }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 17px;
}
</style>