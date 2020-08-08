<template>
    <div>
        <router-view></router-view>
        <div class="bottom-nav">
            <ul :class="{home:true,active:homeStyle}" @click="goPage('/index')">
                <li></li>
                <li>首页</li>
            </ul>
            <ul :class="{cart:true,active:cartStyle}" @click="goPage('/cart')">
                <li><div class="spot" v-show="$store.state.cart.cartData.length>0"></div></li>
                <li>购物车</li>
            </ul>
            <ul :class="{my:true,active:myStyle}" @click="goPage('/my')">
                <li></li>
                <li>我的</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
            return{
                homeStyle:true,
                cartStyle:false,
                myStyle:false
            }
        },
        methods:{
            goPage(url){
                console.log("跳转",url);
                this.$router.replace(url)
            },
            changeStyle(name){
                switch (name) {
                    case "index":this.homeStyle = true;this.cartStyle=false;this.myStyle=false;break;
                    case "cart":this.homeStyle = false;this.cartStyle=true;this.myStyle=false;break;
                    case "my":this.homeStyle = false;this.cartStyle=false;this.myStyle=true;break;
                    default:this.homeStyle = true;this.cartStyle=false;this.myStyle=false;
                }
            }
        },
        created(){
            document.title = this.$route.meta.title;
            this.changeStyle(this.$route.name);
        },
        beforeRouteUpdate(to,from,next){
            document.title = to.meta.title;
            console.log(to);
            this.changeStyle(to.name);
            next();
        },
        activated(){
            document.title = this.$route.meta.title;
            this.changeStyle(this.$route.name);
        }
    }
</script>

<style scoped>
    .bottom-nav{width:100%;height:1.2rem;background-color: white;-webkit-box-shadow:0 0 10px #efefef;
    position:fixed;z-index:10;bottom:0;left:0;display: flex;justify-content: space-between;align-items:center;
    padding:0 0.5rem;box-sizing: border-box}
    .bottom-nav ul{width:1rem;cursor: pointer;}
    .bottom-nav ul li:nth-child(1){width:0.6rem;height: 0.6rem;margin:0 auto}
    .bottom-nav ul li:nth-child(2){font-size:0.28rem;text-align:center}
    .bottom-nav ul.active li:nth-child(2){color:#eb1625}

    .bottom-nav ul.home li:nth-child(1){background-image: url("../../../../src/assets/images/home/main/home1.png");background-size:100%;background-repeat: no-repeat;background-position:center;}
    .bottom-nav ul.home.active li:nth-child(1){background-image: url("../../../../src/assets/images/home/main/home2.png");}

    .bottom-nav ul.cart li:nth-child(1){background-image: url("../../../../src/assets/images/home/main/cart1.png");background-size:100%;background-repeat: no-repeat;background-position:center;position: relative;}
    .bottom-nav ul.cart li:nth-child(1) .spot{width:0.2rem;height:0.2rem;background-color: #cc0004;border-radius:100%;position:absolute;z-index:1;top:0.01rem;right:-0.1rem;}
    .bottom-nav ul.cart.active li:nth-child(1){background-image: url("../../../../src/assets/images/home/main/cart2.png");}

    .bottom-nav ul.my li:nth-child(1){background-image: url("../../../../src/assets/images/home/main/my1.png");background-size:100%;background-repeat: no-repeat;background-position:center;}
    .bottom-nav ul.my.active li:nth-child(1){background-image: url("../../../../src/assets/images/home/main/my2.png");}
</style>