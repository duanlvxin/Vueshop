<template>
    <div class="page">
        <div class="order-list" v-for="(item,index) in orders" :key="index" @click="$router.push('/user/order/details?ordernum='+item.ordernum)">
            <div class="ordernum-wrap">
                <div class="text">订单编号: {{item.ordernum}}</div>
                <div class="text">{{item.status==='0'?'待付款':item.status==='1'?'待收货':'已收货'}}</div>
            </div>
            <div class="item-list" v-for="(item2,index2) in item.goods" :key="index2">
                <div class="goods-image">
                    <img :data-echo="item2.image" src="../../../assets/images/common/lazyImg.jpg">
                </div>
                <div class="title">{{item2.title}}</div>
                <div class="amount">x {{item2.amount}}</div>
            </div>
            <div class="total-wrap">
                <div class="text">实付金额:￥{{item.total}}</div>
                <div class="status-wrap">
                    <div class="btn" v-if="item.status==='0'" @click.stop="cancelOrder(index,item.ordernum)">取消订单</div>
                    <div class="btn" @click.stop="sureOrder(index,item)">{{item.status==='0'?'去付款':item.status==='1'?'确认收货':'已收货'}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions,mapState} from 'vuex';
    import UpRefresh from '../../../assets/js/libs/uprefresh';
    import {Dialog,Toast} from 'vant';
    export default {
        name: "order-list",
        data(){
            return{

            }
        },
        computed:{
            ...mapState({
                orders:(state)=>state.order.orders,
            })
        },
        methods:{
            ...mapActions({
                getMyOrder:'order/getMyOrder',
                getMyOrderPage:'order/getMyOrderPage',
                asynccancelOrder:'order/cancelOrder',
                asyncsureOrder:'order/sureOrder'
            }),
            cancelOrder(index,ordernum){
                Dialog.confirm({
                    title:'',
                    message:'确定要取消订单吗?'
                }).then(()=>{
                    this.asynccancelOrder({ordernum:ordernum,index:index,success:()=>{
                        Toast("成功取消订单~");
                    }});
                }).catch(()=>{

                })
            },
            getData(){
                this.getMyOrder({status:this.status,page:1,success: (pageNum) => {
                    this.$nextTick(() => {
                        this.$utils.lazyImg();
                    });
                    this.pullUp.init({
                        'curPage': 1,
                        'maxPage': parseInt(pageNum),
                        'offsetBottom': 100
                    }, (page) => {
                        this.getMyOrderPage({status:this.status, page: page});
                    })
                }});
            },
            //确认收货和取付款
            sureOrder(index,item){
                if(item.status!=='2'){
                    this.asyncsureOrder({index:index,ordernum:item.ordernum})
                }
            }
        },
        created(){
            this.pullUp = new UpRefresh();
            this.status = this.$route.query.status?this.$route.query.status:'all';
            this.getData();
        },
        beforeDestroy(){
            this.pullUp.uneventSrcoll();
        },
        beforeRouteUpdate(to,from,next){
            this.status = to.query.status;
            this.getData();
            next();
        }
    }
</script>

<style scoped>
    .page{width:100%;min-height:85vh;}
    .page .order-list{width:100%;height:auto;}
    .page .order-list .ordernum-wrap{width:100%;height:0.82rem;display: flex;align-items: center;justify-content: space-between;border-bottom: 1px solid #efefef;}
    .page .order-list .ordernum-wrap .text{width:auto;height: auto;font-size: 0.28rem;margin-left: 0.2rem;
    margin-right: 0.2rem;}
    .page .order-list .item-list{width:100%;height:1.6rem;display: flex;position: relative;border-bottom: 1px solid #efefef;}
    .page .order-list .item-list .goods-image{width:1.2rem;height: 1.2rem;margin-left: 0.2rem;margin-top: 0.2rem;}
    .page .order-list .item-list .goods-image img{width: 100%;height: 100%;}
    .page .order-list .item-list .title {width:5.2rem;max-height: 0.76rem;overflow: hidden;font-size:0.28rem;
    margin-left: 0.3rem;margin-top: 0.2rem;}
    .page .order-list .item-list .amount{width:0.4rem;height:0.32rem;font-size:0.24rem;position: absolute;
    bottom:0.2rem;right:0.1rem;color:#909090}
    .page .order-list .total-wrap{width:100%;height:0.8rem;align-items: center;display: flex;justify-content: space-between;
    border-bottom: 1px solid #f17f1f}
    .page .order-list .total-wrap .text{width:auto;height:100%;font-size:0.28rem;margin-left: 0.2rem;line-height: 0.8rem;}
    .page .order-list .total-wrap .status-wrap{width:auto;display: flex;justify-content: flex-end;margin-right: 0.2rem;}
    .page .order-list .total-wrap .status-wrap .btn{width:1.28rem;height:0.56rem;border: 1px solid #f15353;border-radius: 0.1rem;text-align: center;line-height: 0.56rem;font-size: 0.24rem;margin-left: 0.2rem;}
</style>