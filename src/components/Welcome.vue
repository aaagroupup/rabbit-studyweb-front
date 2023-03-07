<template>
  <div class="welcome">
    <h2 style="color: red;padding-top:20px;padding-left: 20px;">欢迎您,{{username}}</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username:"",
    };
  },
  methods: {
    getUsername(){
      const user=window.sessionStorage.getItem("user");
      const u=JSON.parse(user);
      this.username=u.username;
    },
  },
  created() {
    this.getUsername(); 
  },
};
</script>

<style lang="less" scoped>
.welcome {
  background: url("../assets/img/background.png");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}
</style>
