<template>
    <div class="page">
        <!--<div class="goods-content" v-html="details.bodys">-->
        <!--</div>-->
        <div class="goods-content" v-html="$store.state.goods.details.bodys">
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    export default {
        name: "details_content",
        computed:{
            ...mapState({
                details:(state)=>state.goods.details
            })
        }
    }
</script>

<style scoped>
    .page{width:100%;height:auto;margin-top:1rem;margin-bottom: 0.4rem;}
</style>