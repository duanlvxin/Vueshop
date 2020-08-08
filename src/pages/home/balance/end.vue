<template>
    
    <div class="page">
        <sub-header title="订单结束"></sub-header>
        <div class="content">
            <div class="text color-0">订购成功!</div>
            <div class="text color-1">订单编号：{{$store.state.order.ordernum}}</div>
            <div class="text color-2" @click="$router.push('/user/order')">查看订单</div>
            <div class="btn">去付款</div>
        </div>
    </div>
</template>

<script>
    import subHeader from '../../../components/sub-header';
    import {mapState,mapActions} from 'vuex';
    export default {
        name: "end",
        components:{
            subHeader
        },
        methods:{
            ...mapActions({
                getLastOrdernum:'order/getLastOrdernum',
            })
        },
        created(){
            this.$utils.safeUser(this);
            this.getLastOrdernum();
        }
    }
</script>

<style scoped>
    .page {width:100%;height:100vh;background-color: white;overflow-y: hidden;}
    .page .content{width:100%;padding-top: 1.4rem;}
    .page .content .text{width:100%;height:0.42rem;font-size:0.32rem;line-height: 0.42rem;margin-bottom: 0.2rem;
    text-align: center;}
    .page .content .text.color-0{color:#e51b19;}
    .page .content .text.color-1{color:#f17f1f;}
    .page .content .text.color-2{color:black;}
    .page .content .btn{width:3.2rem;height:0.6rem;background-color: #0a8ddf;color:white;text-align: center;line-height: 0.6rem;margin: 0 auto;border-radius: 0.1rem;font-size:0.28rem;}
</style>