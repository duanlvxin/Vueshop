<template>
    <div class="page">
        <div class="tags-wrap">
            <div :class="{tags:true,active:status==='all'}" @click="$router.replace('/user/order?status=all')">全部订单</div>
            <div :class="{tags:true,active:status==='0'}" @click="$router.replace('/user/order?status=0')">待付款</div>
            <div :class="{tags:true,active:status==='1'}" @click="$router.replace('/user/order?status=1')">待收货</div>
            <div :class="{tags:true,active:status==='2'}" @click="$router.replace('/user/order/review?status=2')">待评价</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        props:{
            status:{
                type:String,
                default:'all'
            }
        }
    }
</script>

<style scoped>
    /*.page {width:100%;height: auto;}*/
    .page .tags-wrap{width:100%;height:0.8rem;display: flex;margin-top: 1rem;position: fixed;z-index:1;}
    .page .tags-wrap .tags{width:25%;height:100%;font-size:0.28rem;border-bottom: 1px solid #efefef;text-align: center;
        line-height: 0.8rem;background-color: white;}
    .page .tags-wrap .tags.active{border-bottom: 1px solid #e42321}
</style>