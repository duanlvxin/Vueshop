<template>
    <div class="page">
       <div :class="{header:true,scroll:isScrollTop}">
           <div class="classify-icon" @click="goPage('/goods/classify')"></div>
           <div class="search-wrap" @click="isSearchShow.show=true">
               <div class="search-icon"></div>
               <div class="text">请输入宝贝名称</div>
           </div>
           <div class="login" @click="$router.push('/login')" v-if="!$store.state.user.isLogin">登录</div>
           <div class="icon" v-else @click="$router.push('/my')"></div>
       </div>
        <div class="banner-wrap">
            <div class="swiper-container" ref="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in swipers" :key="index">
                        <img :src="item.image">
                    </div>
                </div>
                <div class="swiper-pagination" ref="swiper-pagination"></div>
            </div>
        </div>
        <div class="quick-nav">
            <ul class="item" v-for="(item,index) in navs" :key="index"
                @click="$router.push('/goods/classify/item?cid='+item.cid)">
                <li>
                    <img src="../../../assets/images/common/lazyImg.jpg" alt="" :data-echo="item.image">
                </li>
                <li>{{item.title}}</li>
            </ul>
        </div>
        <template v-for="(item,index) in goods">
            <div class="goods-main" :key="index" v-if="(index+1)%2!==0">
                <div :class="'classify-name color-'+index">—— {{item.title}} ——</div>
                <div class="goods-row-1">
                    <div class="goods-column" @click="$router.push('/goods/details?gid='+(item.items&&item.items[0].gid))">
                        <div class="goods-title">{{item.items && item.items[0].title}}</div>
                        <div class="goods-tip">精品打折</div>
                        <div :class="'goods-price bg-color-'+index">￥{{item.items?item.items[0].price:''}}</div>
                        <div class="goods-image">
                            <img :data-echo="item.items&&item.items[0].image" src="../../../assets/images/common/lazyImg.jpg">
                        </div>
                    </div>
                    <div class="goods-column" >
                        <div class="goods-list" v-for="(item2,index2) in item.items.slice(1,3)" :key="index2" @click="$router.push('/goods/details?gid='+(item2.gid))">
                            <div class="goods-title">{{item2.title}}</div>
                            <div class="goods-tip">品质精挑</div>
                            <div class="goods-list-image">
                                <img :data-echo="item2.image" src="../../../assets/images/common/lazyImg.jpg">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="goods-row-2">
                    <div class="goods-list" v-for="(item3,index3) in item.items.slice(3,7)" :key="index3" @click="$router.push('/goods/details?gid='+(item3.gid))">
                        <div class="goods-title">
                            {{item3.title}}
                        </div>
                        <div class="goods-image">
                            <img :data-echo="item3.image" src="../../../assets/images/common/lazyImg.jpg">
                        </div>
                        <div class="goods-price">¥{{item3.price}}</div>
                        <div class="goods-price line">¥{{item3.price*2}}</div>
                    </div>
                </div>
            </div>
            <div class="goods-main" v-else>
                <div :class="'classify-name color-'+index">—— {{item.title}} ——</div>
                <div class="goods-row-1" >
                    <div class="goods-column-2" v-for="(item2,index2) in item.items.slice(0,2)" :key="index2" @click="$router.push('/goods/details?gid='+(item2.gid))">
                        <div class="goods-title">{{item2.title}}</div>
                        <div class="goods-tip">火爆开售</div>
                        <div class="goods-image">
                            <img :data-echo="item2.image" src="../../../assets/images/common/lazyImg.jpg">
                        </div>
                    </div>
                </div>

                <div class="goods-row-2" >
                    <div class="goods-list" v-for="(item3,index3) in item.items.slice(2,6)" :key="index3" @click="$router.push('/goods/details?gid='+(item3.gid))">
                        <div class="goods-title">
                            {{item3.title}}
                        </div>
                        <div class="goods-image">
                            <img :data-echo="item3.image" src="../../../assets/images/common/lazyImg.jpg">
                        </div>
                        <div class="goods-price">¥{{item3.price}}</div>
                        <div class="goods-price line">¥{{item3.price*2}}</div>
                    </div>
                </div>
            </div>
        </template>


        <div class="goods-recom-nav">
            <div class="line"></div>
            <div class="recom-wrap">
                <div class="icon"></div>
                <div class="text">为您推荐</div>
            </div>
            <div class="line"></div>
        </div>
        <div class="goods-recom">
            <div class="goods-list" v-for="(item,index) in recoms" :key="index" @click="$router.push('/goods/details?gid='+item.gid)">
                <div class="goods-image">
                    <img :data-echo="item.image" src="../../../assets/images/common/lazyImg.jpg">
                </div>
                <div class="goods-title">{{item.title}}</div>
                <div class="goods-price">￥{{item.price}}元</div>
            </div>
        </div>
        <div class="footer"></div>
        <my-search :show="isSearchShow"></my-search>
    </div>
</template>

<script>
    import Swiper from '../../../assets/js/libs/swiper-3.4.2.min';
    import {mapActions,mapState} from 'vuex';
    import mySearch from '../../../components/search'
    export default {
        name: "index",
        data(){
            return {
                isScrollTop:false,
                isSearchShow:{show:false}
            }
        },
        components:{
            mySearch
        },
        created(){
            this.isScroll = true;
            window.addEventListener("scroll",this.eventScrollTop);
            this.getSwiper({success:()=>{
                this.$nextTick(()=>{
                    new Swiper(this.$refs['swiper-container'], {
                        autoplay: 3000,//可选选项，自动滑动
                        pagination: this.$refs['swiper-pagination'],
                        paginationClickable :true,
                        autoplayDisableOnInteraction : false
                    });
                })
            }});
            this.getNavs({success:()=>{
                    this.$nextTick(()=> {
                        this.$utils.lazyImg();
                    })
            }});
            this.getGoods({success:()=>{
                    this.$nextTick(()=> {
                        this.$utils.lazyImg();
                    })
                }});
            this.getRecoms({success:()=>{
                    this.$nextTick(()=> {
                        this.$utils.lazyImg();
                    })
                }});
        },
        mounted(){
        },
        computed:{
            ...mapState({
                swipers:(state)=>state.index.swiperData,
                navs:(state)=>state.index.navs,
                goods:(state)=>state.index.goods,
                recoms:(state)=>state.index.recom,
            })
        },
        methods: {
            ...mapActions({
                getSwiper:'index/getSwiper',
                getNavs:'index/getNavs',
                getGoods:'index/getGoods',
                getRecoms:'index/getRecom',
            }),
            eventScrollTop() {
                let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                if (scrollTop >= 150) {
                    if (this.isScroll) {
                        this.isScrollTop = true;
                        this.isScroll = false;
                    }
                }
                else {
                    this.isScrollTop = false;
                    this.isScroll = true;
                }
            },
            goPage(url){
                this.$router.push(url);
            }
        },
        //卸载监听事件
        destroyed(){
            window.removeEventListener("scroll",this.eventScrollTop);
        },
        //keep-alive离开时触发
        deactivated(){
            window.removeEventListener("scroll",this.eventScrollTop);
        },
        //keep-alive进入时触发
        activated(){
            window.addEventListener("scroll",this.eventScrollTop)
        }
    }
</script>

<style scoped>
    @import "../../../assets/css/common/swiper-3.4.2.min.css";
    .page{width:100%;min-height:100%;margin-bottom:1.5rem;}
    .header{width:100%;height:1rem;position:fixed;z-index:10;left:0;top:0;
    background:linear-gradient(rgba(1,1,1,0.2),hsla(0,0%,100%,0));display: flex;
    justify-content: space-between;align-items:center;padding:0 0.2rem;box-sizing: border-box}
    .header.scroll{background:linear-gradient(#eb1625,hsla(0,0%,100%,0));}
    .header .classify-icon{width:0.6rem;height:0.6rem;background-image: url("../../../assets/images/common/class.png");
    background-size:100%;background-repeat: no-repeat;background-position: center;}
    .header .search-wrap{width:5.26rem;height: 0.52rem;background-color: rgba(255,255,255,0.5);
    border-radius:4px;display: flex;align-items:center;}
    .header .search-wrap .search-icon{width:0.44rem;height:0.44rem;background-image: url("../../../assets/images/common/search.png");background-size:100%;background-repeat: no-repeat;
    margin-left:0.2rem;margin-right:0.2rem;}
    .header .search-wrap .text{font-size:16px;color: white;}
    .header .login{width:0.7rem;height:0.44rem;font-size:0.32rem;color:white;}
    .header .icon{width: 0.6rem;height: 0.6rem;background-size: 100%;background-position: center;background-repeat: no-repeat;background-image: url("../../../assets/images/home/index/my.png");}

    .banner-wrap{width:100%;height: 3.66rem;}
    .banner-wrap img{width: 100%;height: 100%;}

    .quick-nav{width:100%;height:1.6rem;margin-top: 0.2rem;background-color: white;display: flex;align-items: center;
    justify-content: space-between;padding:0 0.2rem;box-sizing: border-box;}
    .quick-nav .item{width:1.4rem;}
    .quick-nav .item li:nth-child(1){width:0.8rem;height:0.8rem;margin: 0 auto;}
    .quick-nav .item li:nth-child(1) img{width: 100%;height:100%;}
    .quick-nav .item li:nth-child(2) {font-size:0.28rem;color:#7b7f82;text-align: center;margin-top: 0.15rem;}

    .goods-main {width: 100%; height:7.68rem;background-color: white;margin-top: 0.2rem;}
    .goods-main .classify-name {width: 100%;height: 0.64rem;border-bottom: 1px solid #EFEFEF;font-size:0.32rem;text-align: center;line-height: 0.64rem;}
    .goods-main .classify-name.color-0{color:#f73b61;}
    .goods-main .classify-name.color-1{color:#fe6719;}
    .goods-main .classify-name.color-2{color:#5fc600;}
    .goods-main .goods-row-1{width:100%; height: 3.5rem; border-bottom:1px solid #efefef;display: flex;overflow:hidden;}
    .goods-main .goods-row-1 .goods-column{width: 50%;height: 100%;border-right: 1px solid #efefef;position:relative;}
    .goods-main .goods-row-1 .goods-column .goods-title{width:95%; height:0.32rem; font-size: 0.28rem; font-weight: bold;
    overflow: hidden;position:absolute;left:0.2rem;top:0.2rem;}
    .goods-main .goods-row-1 .goods-column .goods-tip{width:auto; height:0.32rem;font-size:0.28rem;color:#cb385d;
    position:absolute;left:0.2rem;top:0.6rem;}
    .goods-main .goods-row-1 .goods-column .goods-price{width: auto;height: 0.4rem;border-radius:10px; position:absolute;right:1rem;top:0.6rem;color:white;font-size:0.28rem;}
    .goods-main .goods-row-1 .goods-column .goods-price.bg-color-0{background-color: #f21d4f;}
    .goods-main .goods-row-1 .goods-column .goods-price.bg-color-2{background-color: #5fc600;}
    .goods-main .goods-row-1 .goods-column .goods-image{width: 3rem;height: 2rem; position: absolute; left:0.4rem;bottom:0.3rem;}
    .goods-main .goods-row-1 .goods-column .goods-image img{width: 100%;height: 100%;}
    .goods-main .goods-row-1 .goods-column .goods-list {width: 100%; height: 50%;border-bottom: 1px solid #efefef;
    position:relative;}
    .goods-main .goods-row-1 .goods-column .goods-list .goods-title{width: 55%;height: 0.32rem;overflow:hidden;
    font-size:0.28rem;font-weight: bold;position:absolute;z-index:1;left:0.2rem;top:0.2rem;}
    .goods-main .goods-row-1 .goods-column .goods-list .goods-tip{width:auto;height: auto;font-size:0.28rem;
    color:#7b7f82; position:absolute;left:0.2rem;top:0.6rem;}
    .goods-main .goods-row-1 .goods-column .goods-list .goods-list-image{width:1.2rem;height:1.2rem;position:absolute;
    right:0.2rem;top:0.2rem;}
    .goods-main .goods-row-1 .goods-column .goods-list .goods-list-image img{width:100%;height:100%;}


    .goods-main .goods-row-1 .goods-column-2{width: 50%;height: 100%;border-right: 1px solid #efefef;}
    .goods-main .goods-row-1 .goods-column-2 .goods-title{width:95%; height:0.32rem; font-size: 0.28rem; font-weight: bold;
        overflow: hidden;margin:0.2rem auto;}
    .goods-main .goods-row-1 .goods-column-2 .goods-tip{width:auto; height:0.32rem;font-size:0.28rem;color:#7b7f82;
        margin: 0.2rem auto;text-align: center;}
    .goods-main .goods-row-1 .goods-column-2 .goods-image{width: 1.8rem;height: 2rem; text-align: center;margin: 0.2rem auto;}
    .goods-main .goods-row-1 .goods-column-2 .goods-image img{width: 100%;height: 100%;}


    .goods-main .goods-row-2 {width: 100%; height:3.2rem;background-color: white;display: flex;}
    .goods-main .goods-row-2 .goods-list{width: 25%;border-right: 1px solid #efefef;}
    .goods-main .goods-row-2 .goods-list .goods-title{width:100%;height: 0.37rem;font-size:0.28rem;font-weight:bold;text-align: center;margin: 0.2rem 0;overflow: hidden;}
    .goods-main .goods-row-2 .goods-list .goods-image{width: 1.5rem;height: 1.5rem;margin: 0.2rem auto;}
    .goods-main .goods-row-2 .goods-list .goods-image img{width: 100%;height: 100%;}
    .goods-main .goods-row-2 .goods-list .goods-price{width:100%;height: auto;text-align: center;font-size:0.28rem;
    color:#d32a4e;margin-top: 0.2rem;}
    .goods-main .goods-row-2 .goods-list .goods-price.line{margin-top: 0;color:#7b7f82;text-decoration: line-through;}

    .goods-recom-nav {width:100%; height: 1rem; background-color:#f5f5f9;display: flex;justify-content: space-between;
    align-items: center;}
    .goods-recom-nav .line{width:35%; background-color: #d4d4d4;height: 1px;}
    .goods-recom-nav .recom-wrap{width: 2.34rem; height:0.44rem;display: flex;justify-content: center;align-items: center;}
    .goods-recom-nav .recom-wrap .icon{width:0.4rem; height:0.4rem;background-image:url("../../../assets/images/home/index/recom.png");background-size:100%;background-repeat: no-repeat;background-position: center;}
    .goods-recom-nav .recom-wrap .text{width: auto;height: auto;font-size: 0.32rem;font-weight: bold;}

    .goods-recom {width: 100%;height:auto;display: flex;justify-content:space-between;padding:0 0.2rem;
        box-sizing:border-box;flex-wrap:wrap;}
    .goods-recom .goods-list{width:48%; height:100%;background-color: white;margin-top:0.2rem;}
    .goods-recom .goods-list .goods-image{width:2.8rem;height:2.8rem;margin:0.2rem auto;}
    .goods-recom .goods-list .goods-image img{width:100%;height:100%;overflow: hidden;}
    .goods-recom .goods-list .goods-title{height:0.7rem;font-size:0.28rem;margin-left: 0.1rem;overflow: hidden;}
    .goods-recom .goods-list .goods-price{color:#d32a4e;font-size:0.28rem;overflow: hidden;}
</style>