<template>
  <div style="color #666">
    <el-table
      :data="shoppingCart"
      @selection-change="handleSelectionChange"
      :row-style="{height:'120px'}"
      style="width: 100%;font-size:20px">
      <el-table-column type="selection" width="55" ></el-table-column>
      <el-table-column prop="image" label="商品信息" width="180">
        <template slot-scope="{ row }">
            <el-image style="width: 100px; height: 100px; border:none;cursor: pointer;" 
            :src="getImage(row.image)" 
            :preview-src-list="[ this.downloadUrl+row.image ]" >
            <div slot="error" class="image-slot">
              <img src="../assets/img/noImg.png"  style="width: auto; height: 40px; border:none;" >
            </div>  
          </el-image>
          </template>
      </el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="number" label="数量" width="180" text-align="center">
        <template slot-scope="{ row }">
          <el-input-number size="small" @click="" v-model="row.number" @change="updateNumber($event,row,row.id)" :min="1" :max="10"/>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="单价(单位：元)"></el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-card v-if="shoppingCart.length!=0" class="btn-group">
      <div class="item-div">
        <el-checkbox  @change="selectAll">全选</el-checkbox>
        <a class="item-a" @click="batchRemove()"> 删除选中 </a>
      </div>
      <button  class="btn change change1" style="margin-bottom: 25px;" @click="submit">去结算</button> 
    </el-card>
    
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      multipleSelection:[],//多选框
      shoppingCart: [], //购物车列表
      downloadUrl:"http://localhost:9382/common/download?name="
    };
  },
  created() {
    this.getShoppingCart();
  },
  methods: {
    // 获取购物车内容
    async getShoppingCart() {
      const { data: res } = await this.$http.get("shoppingCart");
      //console.log(res)
      this.shoppingCart = res.data;
    },
    getImage(image){
      return this.downloadUrl+image
    },
    //根据主键删除商品
    async deleteGoods(id) {
      const confirmResult = await this.$confirm("您确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("shoppingCart/" + id);
      //console.log(res)
      if (res.flag != 200) {
        return this.$message.error("删除失败");
      }else{
        this.$message.success("删除成功");
        this.getShoppingCart();
      }
    },
    submit(){
      this.$http.post("/order/submit").then(res=>{
        if(res.data.flag!=200){
          this.$message.error(res.data.msg)
        }else{
          this.$message.success(res.data.data)
          this.getShoppingCart()
          this.$router.push("/front/order")
        }
      })
    },
    updateNumber(val,row,id){
      this.$http.put(`/shoppingCart/updateNumber/${id}/${val}`).then(res=>{
        //console.log(res)
        if(res.data.flag==200){
          return this.$message.success(res.data.data)
        }
        this.$message.error("数量修改失败！")
      })
    },
    //获得选中
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    async batchRemove(){
        //非空判断
        if(this.multipleSelection.length===0){
          this.$message.warning('请选择要删除的商品！')
          return
        }
        const confirmResult = await this.$confirm("您确定要删除吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).catch((err) => err);
        if (confirmResult != "confirm") {
          return this.$message.info("已取消删除");
        }
        var idList=[]
        //遍历数组
        for(var i=0;i<this.multipleSelection.length;i++){
          var obj=this.multipleSelection[i]
          var id=obj.id
          //放到数组里
          idList.push(id)
        }
        //console.log(idList)
        const { data: res } = await this.$http.delete("shoppingCart/del/batch",  {data:idList,type:1});
        //console.log(res)
        if (res.flag == 200) {
          this.$message.success(res.data);
        }else{
          this.$message.error("删除失败!");
        }
        this.getShoppingCart();
    },
    //全选
    selectAll(val){
      if(val==true){
        this.$http.get("shoppingCart/getShoppingCart").then(res=>{
          this.multipleSelection=res.data.data
        })
      }else{
        this.multipleSelection=[]
      }
    }
  },
};
</script>

<style lang="less" scoped>
.btn-group{
  margin-top: 20px;
  background-color: aliceblue;
}
.item-div{
  float: left;
  padding-top: 14px;
  .item-a{
    cursor: pointer;
    margin-left: 10px;
  }
  a:hover{
    color: rgb(98, 181, 236); /*鼠标移动到链接的颜色*/
  }
 
}
.btn{
	background-color:rgb(227, 233, 141);
	border:rgb(227, 233, 141) 1px solid;
	outline:none;  /*去除点击时的蓝色边框*/
	cursor:pointer;
	padding:14px 20px;
	color:rgba(255,255,255,1);
	text-align: center;
	font-size: 16px;
	margin:10px;
  width: 200px;
  border-radius: 4%;
  float: right;
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
</style>
