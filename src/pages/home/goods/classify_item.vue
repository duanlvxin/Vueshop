<template>
    <div class="goods-content-main" ref="goods-content-main">
        <div v-show="items.length>0">
            <div class="goods-wrap" v-for="(item,index) in items" :key="index">
                <div class="classify-name">{{item.title}}</div>
                <div class="goods-items-wrap">
                    <ul v-for="(item2,index2) in item.goods" :key="index2" @click="$router.push('/goods/details?gid='+item2.gid)">
                        <li><img src='../../../assets/images/common/lazyImg.jpg' :data-echo="item2.image"></li>
                        <li>{{item2.title}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-show="items.length<=0" class="no-data">
            没有相关商品
        </div>
    </div>
</template>

<script>
    import IScroll from '../../../assets/js/libs/iscroll'
    import {mapActions,mapState} from 'vuex'
    export default {
        name: "classify_item",
        methods:{
            //卸载
            scrollPreventDefault(e){
                e.preventDefault();
            },
            ...mapActions({
                getGoodsItems:'goods/getGoodsItems'
            }),
            init(cid)
            {
                this.getGoodsItems({'cid':this.cid,success:()=>{
                        this.$nextTick(()=>{
                            this.myScroll.refresh();
                            this.$utils.lazyImg();
                        })
                    }});
            }
        },
        computed:{
            ...mapState({
                items:(state)=>state.goods.items,
            })
        },
        created(){
            this.cid = this.$route.query.cid?this.$route.query.cid:'';
            this.init(this.cid);
        },
        beforeRouteUpdate(to,from,next){
            this.cid = to.query.cid?to.query.cid:'';
            this.init(this.cid);
            next();
        },
        mounted(){
            this.$refs['goods-content-main'].addEventListener('touchmove',this.scrollPreventDefault);
            this.myScroll = new IScroll(this.$refs['goods-content-main'],{
                scrollX:false,
                scrollY:true,
                preventDefault:false,
            });
            this.myScroll.on("scrollEnd",()=>{
                this.$utils.lazyImg();
            })
        },
        beforeDestroy(){
            this.$refs['goods-content-main'].removeEventListener("touchmove",this.scrollPreventDefault);
        },
    }
</script>

<style scoped>
    .goods-content-main{width:100%;height:100%;overflow:hidden;position:relative;z-index:1;}
    .goods-wrap{width:100%;height:auto;}
    .goods-wrap .classify-name{font-size:0.28rem;width:100%;height:0.6rem;line-height:0.6rem;overflow:hidden;}
    .goods-wrap .goods-items-wrap{width:100%;height:auto;background-color:#FFFFFF;padding-top:0.2rem;overflow: hidden;}
    .goods-wrap .goods-items-wrap ul{width:32%;height:auto;float:left;margin-left:0.5%;margin-right:0.5%;margin-bottom:0.2rem;}
    .goods-wrap .goods-items-wrap ul li:nth-child(1){width:1.5rem;height:1.5rem;overflow: hidden;margin: 0 auto;text-align:center}
    .goods-wrap .goods-items-wrap ul li:nth-child(1) img{width:auto;height:auto;max-width:100%;max-height:100%;}
    .goods-wrap .goods-items-wrap ul li:nth-child(2){width:90%;height:0.8rem;font-size:0.24rem;overflow:hidden;text-align:center;margin:0 auto;white-space: nowrap;text-overflow: ellipsis;margin-top:0.2rem;}
</style>

