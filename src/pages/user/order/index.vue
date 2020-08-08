<template>
    <div class="page">
        <sub-header :title="headerTitle"></sub-header>
        <order-tags :status="status"></order-tags>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import subHeader from '../../../components/sub-header'
    import orderTags from '../../../components/order-tags'
    export default {
        name: "index",
        data(){
            return{
                status:this.$route.query.status?this.$route.query.status:'all',
                headerTitle : "全部订单"
            }
        },
        methods:{
            getTitle(){
                switch (this.status) {
                    case 'all':
                        this.headerTitle="全部订单";
                        document.title=this.headerTitle;
                        break;
                    case '0':
                        this.headerTitle="待付款";
                        document.title=this.headerTitle;
                        break;
                    case '1':
                        this.headerTitle="待收货";
                        document.title=this.headerTitle;
                        break;
                    case '2':
                        this.headerTitle="待评价";
                        document.title=this.headerTitle;
                        break;
                    default:
                        this.headerTitle="全部订单";
                        document.title=this.headerTitle;
                        break;
                }
            }
        },
        components:{
            subHeader,
            orderTags
        },
        mounted(){
            this.getTitle();
        },
        beforeRouteUpdate(to,from,next){
            this.status = to.query.status;
            this.getTitle();
            next();
        },
        created(){
            this.$utils.safeUser(this);
        }
    }
</script>

<style scoped>
    .page{width: 100%;min-height: 100vh;background-color: white;position: relative}
    .page .main{width:100%;position: absolute;top:1.9rem;}
</style>