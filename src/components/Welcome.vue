<template>
  <div >
    <div id="main" class="main"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
    };
  },
  mounted(){
    //折线图
    var myChart = echarts.init(document.getElementById('main'));
    var option = {
      title: {
        text: "2023年学习平台流量趋势",
        left: "center",
        textStyle:{
			    color:'#5beec2',
          fontSize:30,
		    },
      },
      grid:{
      left: '1%',
      right: '1%',
      bottom: '7%',
      top: '15%',
      containLabel: true
      },
      // 坐标指示器颜色
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          lineStyle:{
            color: '#b7cef1'
          }
        }
      },
      xAxis: {
        name:"月份",
        type: 'category',
        data: [],
        axisLabel: {
          fontSize:"18",
          textStyle: {
            color: '#6cad6c', //坐标轴字体颜色
          },
        },
        axisLine:{
          lineStyle:{
            color:"#97f097"
          }
        },
      },
      yAxis: {
        name:"访问人数",
        type: 'value',
        nameTextStyle:{
          color:'black',
          fontSize:16
        },
        splitLine: {
          show:true,
          lineStyle: {
            type: 'solid',
            color: '#97f097', //坐标轴线颜色
            width: '2',
          },
        },
        axisLabel: {
          textStyle: {
            color: 'black', //坐标轴字体颜色
            fontSize:16
          },
        },
      },
      series: [
        {
          data: [],
          type: 'line',
          smooth: true,
          symbol:"none",
          color:"#e095e7"
        }
      ]
    };

    this.$http.get("/countTime/getData").then((res) => {
      //console.log(res)
      option.xAxis.data = res.data.data.time;
      option.series[0].data = res.data.data.count;
      option && myChart.setOption(option);
    });


  }
};
</script>

<style lang="less" scoped>
.main{
  width: 900px;
  height: 600px;
  margin-left: 220px;
  padding-top: 30px;
}
</style>
