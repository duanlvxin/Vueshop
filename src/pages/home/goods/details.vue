<template>
    <div>
        <div class="header">
            <div class="back" @click="$router.go(-1)"></div>
            <div :class="{'goods-details':true,active:itemStyle}" @click="$router.replace('/goods/details/item?gid='+gid)">商品</div>
            <div :class="{'goods-details':true,active:contentStyle}" @click="$router.replace('/goods/details/content?gid='+gid)">详情</div>
            <div :class="{'goods-details':true,active:reviewStyle}" @click="$router.replace('/goods/details/review?gid='+gid)">评价</div>
            <div id='cart-icon' class="cart" @click="$router.push('/cart?from=goods_details')">
                <div class="spot" v-show="$store.state.cart.cartData.length>0"></div>
            </div>
        </div>
        <div class="sub-page">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    export default {
        name: "goods-details",
        data(){
            return{
                gid:this.$route.query.gid?this.$route.query.gid:'',
                itemStyle:true,
                contentStyle:false,
                reviewStyle:false
            }
        },
        computed:{
            ...mapState({
                cartNum:(state)=>state.goods.cartNum,
            }),
        },
        methods:{
            //路由中的name
            changeTabStyle(name){
                switch (name) {
                    case "details-item":this.itemStyle=true;this.contentStyle=false;this.reviewStyle=false;break;
                    case "details-content":this.itemStyle=false;this.contentStyle=true;this.reviewStyle=false;break;
                    case "details-review":this.itemStyle=false;this.contentStyle=false;this.reviewStyle=true;break;
                    default:this.itemStyle=true;this.contentStyle=false;this.reviewStyle=false;break;
                }
            }
        },
        created(){
            this.changeTabStyle(this.$route.name);
        },
        beforeRouteUpdate(to,from,next){
            this.changeTabStyle(to.name);
            next();
        }
    }
</script>

<style scoped>
    .header{width:100%;height:1rem;background-color:white;justify-content: space-between;display: flex;align-items: center;
    position:fixed;top:0;z-index:10;}
    .header .back{width:0.8rem;height:0.8rem;background-image: url("../../../assets/images/home/goods/back.png");background-color: white;background-position: center;background-size: 100%;background-repeat: no-repeat;}
    .header .goods-details{width:auto;height:100%;font-size:0.36rem;line-height: 1rem;text-align: center;margin-left:0.5rem;margin-right:0.5rem;}
    .header .goods-details.active{border-bottom: 2px solid #fda208;}
    .header .cart{width:0.8rem;height:0.8rem;background-image: url("../../../assets/images/home/goods/cart.png");background-color: white;background-position: center;background-size: 100%;background-repeat: no-repeat;margin-right: 0.2rem;
    position:relative;}
    .header .cart .spot{width:0.2rem;height:0.2rem;background-color: #cc0004;border-radius:100%;position:absolute;
    z-index:1;top:0.14rem;right:-0.001rem;}
</style>