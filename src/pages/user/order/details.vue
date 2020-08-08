<template>
    <div class="page">
        <sub-header title="订单详情"></sub-header>
        <div class="ordernum">订单编号: {{detail.ordernum}} </div>
        <div class="skew-wrap">
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
        </div>
        <div class="address-wrap">
            <div class="person">
                <div class="name">
                    <img src="../../../assets/images/home/main/my2.png">
                    <span>{{detail.name}}</span>
                </div>
                <div class="cellphone">
                    <img src="../../../assets/images/common/cellphone.png">
                    <span>{{detail.cellphone}}</span>
                </div>
            </div>
            <div class="address">{{detail.province}}{{detail.city}}{{detail.area}}{{detail.address}}</div>
        </div>
        <div class="skew-wrap">
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
            <div class="skew"></div>
        </div>
        <div class="title">购买的宝贝</div>
        <div class="order-list">
            <div class="goods-list" v-for="(item,index) in detail.goods" :key="index">
                <div class="image">
                    <img :src="item.image">
                </div>
                <div class="detail-wrap">
                    <div class="goods-title">{{item.title}}</div>
                    <div class="attrs-wrap">
                        <div class="amount">x {{item.amount}}</div>
                        <div class="attrs" v-for="(item2,index2) in item.param" :key="index2">
                            <div class="attr">{{item2.title}}:{{item2.param[0].title}}</div>
                        </div>
                    </div>
                </div>
                <span>￥{{item.price}}</span>
            </div>
            <div class="item">
                <span>支付状态</span>
                <span>{{detail.status==='0'?'待付款':detail.status==='1'?'待收货':detail.status==='2'?'已收货':'取消订单'}}</span>
            </div>
            <div class="item">
                <span>商品总额</span>
                <div class="active">￥{{detail.total}}</div>
            </div>
            <div class="item">
                <span>+运费</span>
                <div class="active">￥{{detail.freight}}</div>
            </div>
        </div>
        <div class="total-price">实付金额：<span>￥{{detail.truetotal}}</span></div>
        <div class="order-time">下单时间:{{detail.ordertime}}</div>
    </div>

</template>

<script>
    import subHeader from '../../../components/sub-header';
    import {mapActions} from 'vuex';
    export default {
        name: "order-details",
        components:{
            subHeader
        },
        data(){
          return {
              detail:{}
          }
        },
        methods:{
            ...mapActions({
                orderDetails:'order/orderDetails'
            })
        },
        mounted(){
          document.title = this.$route.meta.title;
          this.$utils.safeUser(this);
        },
        async created(){
            this.ordernum = this.$route.query.ordernum?this.$route.query.ordernum:"";
            let result = await this.orderDetails({ordernum:this.ordernum});
            this.detail = result;
        }
    }
</script>

<style scoped>
    .page{width:100%;min-height:100vh;background-color: white;overflow-x: hidden;}
    .page .ordernum{width:100%;height:0.6rem;margin-left: 0.2rem;padding-top: 1.2rem;font-size: 0.28rem;}
    .page .skew-wrap{width:100%;height:auto;display: flex;justify-content: space-between;}
    .page .skew-wrap .skew{width:0.44rem;height:0.08rem;background-color:#a2dafb;transform: skew(-40deg,0deg);}
    .page .address-wrap{width:100%;height:2rem;background-color: #fffaf0;}
    .page .address-wrap .person{width:100%;height:50%;display: flex;align-items: center;position:relative;}
    .page .address-wrap .person .name{width:auto;height:auto;margin-left: 0.2rem;align-items: center;display: flex;}
    .page .address-wrap .person .name img{width:0.4rem;height:0.4rem;}
    .page .address-wrap .person .name span{font-size:0.28rem;}
    .page .address-wrap .person .cellphone{width:auto;height:auto;position: absolute;right:0.8rem;align-items: center;display: flex;}
    .page .address-wrap .person .cellphone img{width:0.4rem;height:0.4rem;}
    .page .address-wrap .person .cellphone span{font-size:0.28rem;}
    .page .address-wrap .address{width:100%;height:50%;margin-left: 0.2rem;font-size: 0.28rem;line-height: 1rem;}
    .page .title{width:100%;height:0.8rem;margin-left: 0.2rem;font-size: 0.28rem;line-height: 0.8rem;}

    .page .order-list{width:100%;height:auto;border-top:1px solid #efefef;align-items: center;}
    .page .order-list .goods-list{width:96%;margin: 0 auto;height:1.6rem;display: flex;border-bottom: 1px solid #efefef;}
    .page .order-list .goods-list .image{width:1.2rem;height:1.2rem;margin-top: 0.2rem;}
    .page .order-list .goods-list .image img{width:100%;height:100%;}
    .page .order-list .goods-list .detail-wrap{width:4.68rem;height:95%;margin-top: 0.2rem;margin-left: 0.4rem}
    .page .order-list .goods-list .detail-wrap .goods-title{width:100%;max-height: 0.8rem;overflow: hidden;
    font-size: 0.28rem;}
    .page .order-list .goods-list .detail-wrap .attrs-wrap{width:100%;max-height: 0.32rem;display: flex;margin-top: 0.2rem;}
    .page .order-list .goods-list .detail-wrap .attrs-wrap .amount{color:#848689;font-size: 0.24rem;margin-top: 0.03rem;}
    .page .order-list .goods-list .detail-wrap .attrs-wrap .attrs{display: flex;margin-left: 0.2rem;}
    .page .order-list .goods-list .detail-wrap .attrs-wrap .attr{width:auto;height:auto;font-size: 0.24rem;
    margin-left: 0.2rem;}
    .page .order-list .goods-list span{width:auto;height:0.4rem;font-size:0.28rem;margin: auto 0.05rem;}
    .page .order-list .item{width:96%;height:0.8rem;display: flex;justify-content: space-between;margin: 0 auto;
    align-items: center;border-bottom: 1px solid #efefef;}
    .page .order-list .item .active{color:#f15353}
    .page .total-price{font-size: 0.28rem;;width:auto;padding-right: 0.2rem;height: auto;text-align: right;margin-top: 0.2rem;}
    .page .total-price span{color:#f15353}
    .page .order-time{font-size: 0.24rem;width:auto;padding-right: 0.2rem;text-align: right;margin-top: 0.1rem}
</style>