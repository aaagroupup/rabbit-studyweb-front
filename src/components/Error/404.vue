<template>
  <div :style="backgroundDiv">
    <div style="overflow: hidden;height: 100vh;">
      <h1 style="text-align: center;font-size: 40px;color:#c7ddf0;padding-top: 30px;">您访问的页面不存在</h1>  
    </div>
  </div>

</template>

<script>
export default {
    data(){
      return{
        backgroundDiv:{
          backgroundImage: "url(" + require("@/assets/img/404.jpeg") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }
        
      }
    }
}
</script>

<style>

</style>