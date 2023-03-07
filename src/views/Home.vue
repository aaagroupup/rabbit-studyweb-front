<template>
  <div>
    <div >
        <menu-banner></menu-banner>
        <div >
            <course-list></course-list>
        </div>
    </div>
    
    <!-- 尾部 start-->
    <home-footer></home-footer>
  </div>
</template>

<script>
import MenuBanner from '../components/MenuBanner.vue'
import CourseList from '../components/CourseList.vue'
import HomeFooter from '../components/HomeFooter.vue'
export default {
name:'FrontHome',
    components: { 
        MenuBanner, 
        CourseList,
        HomeFooter,
    },
    data(){
        return{
            form:{},
            user:sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {},
        }
    },
    created(){
        //this.getAllGoods()
    },
    methods:{
        addShoppingCart(id,image,goodsname,price){
            this.form.image=image;
            this.form.goodsname=goodsname;
            this.form.amount=price;
            this.form.userId=this.user.id;
            this.form.goodsId=id;
            this.form.number=1;
            if(this.user.username==undefined){
                return alert("请您先登录")
            }
            this.$http.post("/shoppingCart",this.form).then(res=>{
                //console.log(res)
                if(res.data.flag!=200){
                    return this.$message.error(res.data.msg)
                }
                this.$message.success(res.data.data)
            })
        },
    }
}
</script>

<style lang="less">

</style>