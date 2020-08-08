<template>
    <div class="page">
        <div class="order-list" v-for="(item,index) in reviewOrders" :key="index" @click="$router.push('/user/order/details?ordernum='+item.ordernum)">
            <div class="ordernum-wrap">
                <div class="text">订单编号: {{item.ordernum}}</div>
                <div class="text">已收货</div>
            </div>
            <div class="item-list" v-for="(item2,index2) in item.goods" :key="index2">
                <div class="goods-image">
                    <img :data-echo="item2.image" src="../../../assets/images/common/lazyImg.jpg">
                </div>
                <div class="title">{{item2.title}}</div>
                <div class="amount">x {{item2.amount}}</div>
                <div class="btn" @click.stop="$router.push('/user/order/add_review?gid='+item2.gid+'&ordernum='+item.ordernum)">{{item2.isreview==='0'?'评价':'追加评价'}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions,mapState} from 'vuex';
    import UpRefresh from '../../../assets/js/libs/uprefresh';
    export default {
        name: "review",
        methods:{
            ...mapActions({
                orderReview:'order/orderReview'
            })
        },
        computed:{
            ...mapState({
                reviewOrders:(state)=>state.order.reviewOrders
            })
        },
        created(){
            this.pullUp = new UpRefresh();
            this.$utils.safeUser(this);
            this.orderReview({page:1,success:(pageNum)=>{
                    this.$nextTick(() => {
                        this.$utils.lazyImg();
                    });
                    this.pullUp.init({
                        'curPage': 1,
                        'maxPage': parseInt(pageNum),
                        'offsetBottom': 100
                    }, (page) => {
                        this.orderReviewPage({page: page});
                    })
                }});
        },
        beforeDestroy(){
            this.pullUp.uneventSrcoll();
        },
    }
</script>

<style scoped>
    .page{width:100%;min-height:85vh;}
    .page .order-list{width:100%;height:auto;}
    .page .order-list .ordernum-wrap{width:100%;height:0.82rem;display: flex;align-items: center;justify-content: space-between;border-bottom: 1px solid #efefef;}
    .page .order-list .ordernum-wrap .text{width:auto;height: auto;font-size: 0.28rem;margin-left: 0.2rem;
        margin-right: 0.2rem;}
    .page .order-list .item-list{width:100%;height:2.42rem;display: flex;position: relative;border-bottom: 1px solid #efefef;}
    .page .order-list .item-list .goods-image{width:1.2rem;height: 1.2rem;margin-left: 0.2rem;margin-top: 0.2rem;}
    .page .order-list .item-list .goods-image img{width: 100%;height: 100%;}
    .page .order-list .item-list .title {width:5.2rem;max-height: 0.76rem;overflow: hidden;font-size:0.28rem;
        margin-left: 0.3rem;margin-top: 0.2rem;}
    .page .order-list .item-list .amount{width:0.4rem;height:0.32rem;font-size:0.24rem;position: absolute;
        bottom:1rem;right:0.2rem;color:#909090}
    .page .order-list .item-list .btn{width:1.28rem;height:0.56rem;border: 1px solid #f15353;text-align: center;
    line-height: 0.56rem;position:absolute;bottom: 0.2rem;right: 0.2rem;border-radius: 0.1rem;font-size: 0.24rem;}
</style>