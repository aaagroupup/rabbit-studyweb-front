<template>
  <div style="color #666">
    <el-table
      :data="orderData"
      
      :row-style="{height:'150px'}"
      style="width: 100%;font-size:20px">
      <el-table-column prop="number" label="订单编号"></el-table-column>
      <el-table-column prop="amount" label="总价格"></el-table-column>
      <el-table-column prop="orderTime" label="下单时间"></el-table-column>
      <el-table-column prop="status" label="订单状态"></el-table-column>
      <el-table-column prop="payTime" label="支付时间" ></el-table-column>
      <el-table-column prop="param.titles" label="订单详情" ></el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 支付 -->
            <el-button type="primary" size="mini" @click="pay(scope.row)" :disabled="scope.row.status=='已支付'">支付</el-button>
            <!-- 删除 -->
            <el-button  type="danger" size="mini" @click="deleteOrder(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderData: [], //订单列表
      user:sessionStorage.getItem("user")?JSON.parse(sessionStorage.getItem("user")):{},
    };
  },
  created() {
    this.getOrders();
  },
  methods: {
    // 获取订单内容
    async getOrders() {
      const { data: res } = await this.$http.get("order/getOrders?userId="+this.user.id);
      //console.log(res)
      this.orderData = res.data;
    },
    //根据主键删除订单
    async deleteOrder(id) {
      const confirmResult = await this.$confirm("您确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("order/" + id);
      if (res.flag != 200) {
        return this.$message.error("删除失败");
      }else{
        this.$message.success("删除成功");
        this.getOrders();
      }
    },
    pay(row){
      window.open("http://localhost:9382/aliPay/pay?subject="+row.id+"&traceNo="+row.number+"&totalAmount="+row.amount)
    },
  },
};
</script>

<style lang="less">

</style>
