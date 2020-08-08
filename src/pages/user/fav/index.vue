<template>

    <div class="page">
        <sub-header title="我的收藏"></sub-header>
        <div class="main">
            <div class="goods-list" v-for="(item,index) in collections" :key="index">
                <div class="goods-image">
                    <img :data-echo="item.image" src="../../../assets/images/common/lazyImg.jpg">
                </div>
                <div class="title">{{item.title}}</div>
                <div class="price">￥{{item.price}}</div>
                <div class="btn-wrap">
                    <div class="btn" @click="$router.push('/goods/details?gid='+item.gid)">购买</div>
                    <div class="btn" @click="delCollection(index,item.fid)">删除</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import subHeader from '../../../components/sub-header';
    import {mapActions,mapState} from 'vuex';
    import UpRefresh from '../../../assets/js/libs/uprefresh';
    import {Dialog} from 'vant';
    export default {
        name: "index",
        components:{
            subHeader
        },
        computed:{
            ...mapState({
                collections:(state)=>state.user.collections,
            })
        },
        methods:{
            ...mapActions({
                getUserCollection:'user/getUserCollection',
                getUserCollectionPage:'user/getUserCollectionPage',
                asyncdelCollection:'user/deleteCollection'
            }),
            delCollection(index,fid){
                Dialog.confirm({
                    title:'',
                    message:"确认要删除吗？"
                }).then(()=>{
                    this.asyncdelCollection({index:index,fid:fid,success:()=>{
                            this.$nextTick(() => {
                                this.$utils.lazyImg();
                            })
                        }})
                }).catch(()=>{

                })
            }
        },
        created(){
            document.title = this.$route.meta.title;
            this.pullUp = new UpRefresh();
            this.getUserCollection({
                page:'1', success: (pageNum) => {
                    this.$nextTick(() => {
                        this.$utils.lazyImg();
                    })
                    this.pullUp.init({
                        'curPage': 1,
                        'maxPage': parseInt(pageNum),
                        'offsetBottom': 100
                    }, (page) => {
                        this.getUserCollectionPage({page: page,success:()=>{
                                this.$nextTick(() => {
                                    this.$utils.lazyImg();
                                })
                            }});
                    })
                }
            })
        }
    }
</script>

<style scoped>
    .page{width:100%;min-height:100vh;background-color: white;}
    .page .main{width:96%;height:auto;padding-top: 1rem;display: flex;flex-wrap: wrap;align-items: center;
    margin-left:2%;justify-content: space-between;}
    .page .main .goods-list{width:48%;height:5.9rem;margin-bottom: 0.3rem;overflow: hidden;}
    .page .main .goods-list .goods-image{width:3.36rem;height:3.34rem;}
    .page .main .goods-list .goods-image img{width: 100%;height: 100%;overflow: hidden}
    .page .main .goods-list .title{width:100%;height:0.8rem;font-size:0.28rem;margin-top: 0.2rem;overflow: hidden;}
    .page .main .goods-list .price{width:auto;height: auto;margin-top: 0.2rem;color:#f93036;font-size: 0.28rem;}
    .page .main .goods-list .btn-wrap{width:100%;height:0.56rem;display: flex;justify-content: space-between;
    align-items: center;margin-top: 0.1rem}
    .page .main .goods-list .btn-wrap .btn{width:1.08rem;height:100%;text-align: center;line-height: 0.56rem;font-size:0.28rem;color:#f93036;border-radius: 4px;border: 1px solid #f93036}
</style>