<template>
  <div>
    <!--订单列表主体 -->
    <el-card>
      <el-row :gutter="25"
        ><!--间隙-->

        <el-form :inline="true" :model="searchData" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input v-model="searchData.number" placeholder="请输入订单号" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchData.telephone" placeholder="请输入手机号" style="width: 180px;"></el-input>
          </el-form-item>

          <el-form-item label="时间">
            <el-date-picker
              style="width: 180px;"
              v-model="searchData.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              style="width: 180px;"
              v-model="searchData.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择截止日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select style="width:180px" v-model="searchData.status" placeholder="请选择订单状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button style="margin-left: 20px;" type="warning" icon="el-icon-search" @click="getOrderList()">查询</el-button>
            <el-button type="default" @click="resetData()">清空</el-button> 
          </el-form-item> 
          <el-button style="margin-left: 10px;" type="info" @click="batchRemove()">删除选中</el-button>
        </el-form>
      </el-row>

      <!-- 订单列表 border边框 stripe隔行变色 -->
      <el-table :data="orderList" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column
        ><!--索引列  -->
        <el-table-column label="订单号" prop="number"></el-table-column>
        <el-table-column prop="username" label="下单人" align="center"></el-table-column>
        <el-table-column label="下单时间" prop="orderTime" width="150px"  sortable></el-table-column>
        <el-table-column label="订单详情" prop="param.titles"></el-table-column>
        <el-table-column label="电话号" prop="telephone"></el-table-column>
        <el-table-column label="总金额" prop="amount"></el-table-column>
        <el-table-column label="支付时间" prop="payTime" width="150px" sortable></el-table-column>
        <el-table-column label="订单状态" prop="status" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteOrder(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 size-change 每页最大变化 current-change 当前最大变化 layout功能组件-->
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-sizes="[1, 3, 5, 10]"
          :page-size="this.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>


    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1, //当前页
      pageSize: 5, //页数
      orderList: [], //订单列表
      total: 0, //总记录数
      searchData:{
      },
      //订单状态
      options: [{
          value: '已支付',
          label: '已支付'
        }, 
        {
          value: '待支付',
          label: '待支付'
        }
      ],
      multipleSelection:[], 
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    // 获取所有订单
    getOrderList() {
      this.$http.get(`order/${this.currentPage}/${this.pageSize}`,{params: this.searchData}).then(res=>{
        //console.log(res)
        this.orderList = res.data.data.orderList;
        this.total = res.data.data.total;
      })
    },
    //最大数
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getOrderList();
    },
    //currentPage的触发动作
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getOrderList();
    },
    
    //根据主键删除
    async deleteOrder(id) {
      const confirmResult = await this.$confirm("您确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      //console.log(id)
      const { data: res } = await this.$http.delete("order/" + id);
      //console.log(res)
      if (res.flag != 200) {
        return this.$message.error(res.msg);
      }else{
        this.$message.success(res.data);
        this.getOrderList();
      }
    },
    //重置
    resetData(){
      this.searchData={}
      this.getOrderList()
    },
    //获得选中
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    //批量删除
    async batchRemove(){
        //非空判断
        if(this.multipleSelection.length===0){
          this.$message.warning('请选择要删除的订单！')
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
        const { data: res } = await this.$http.delete("order/del/batch",  {data:idList,type:1});
        //console.log(res)
        if (res.flag != 200) {
          return this.$message.error(res.msg);
        }
        this.$message.success(res.data);
        this.getOrderList();
    },
  },
  
};
</script>

<style lang="less" scoped>

/deep/.el-button.el-button--warning{
  background:#84d3eb !important;
  border-color:#84d3eb;
}

/deep/.el-button.el-button--info{
  background:#817278 !important;
  border-color:#817278;
}

/* 添加 */
.addBrand-container .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.addBrand-container .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.addBrand-container .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 160px;
  line-height: 160px;
  text-align: center;
}
.addBrand-container .avatar {
  width: 160px;
  height: 160px;
  display: block;
}
.addBrand-container .el-form--inline .el-form-item__content {
  width: 293px;
}
.addBrand-container .el-input {
  width: 293px;
}

.addBrand-container {
  margin: 30px;
}
.addBrand-container .container {
  position: relative;
  z-index: 1;
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  min-height: 500px;
}
.addBrand-container .container .subBox {
  padding-top: 30px;
  text-align: center;
  border-top: solid 1px #f3f4f7;
}
</style>
