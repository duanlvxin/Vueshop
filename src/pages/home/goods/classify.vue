<template>
    <div class="page">
        <div class="search-header">
            <div class="Back" @click="goBack"></div>
            <div class="search" @click="isSearchShow.show=true">请输入宝贝名称</div>
        </div>
        <div class="goods-main">
            <div class="classify-wrap" ref="scroll-classify">
                <div>
                    <div :class="{'classify-item':true,active:item.active}" ref="item" v-for="(item,index) in classify" :key="index"
                    @click="replaceUrl('/goods/classify/item?cid='+item.cid,index)">{{item.title}}</div>
                </div>
            </div>
            <div class="goods-content" ref="goods-content">
                <router-view></router-view>
            </div>
        </div>

        <my-search :show="isSearchShow"></my-search>
    </div>
</template>

<script>
    import IScroll from '../../../assets/js/libs/iscroll'
    import {mapActions,mapState,mapMutations} from 'vuex'
    import mySearch from '../../../components/search'
    export default {
        name: "classify",
        data(){
            return {
                isSearchShow: {show:false}
            }
        },
        components:{
            mySearch
        },
        methods:{
            ...mapActions({
               getClassify:'goods/getClassify',
            }),
            ...mapMutations({
               selectItem:'goods/SELECT_ITEM'
            }),
            goBack(){
                this.$router.go(-1);
            },
            //卸载
            scrollPreventDefault(e){
                e.preventDefault();
            },
            mySelectItem(index){
                let height = parseInt(this.$refs['scroll-classify'].offsetHeight/3);
                let topHeight = this.$refs['item'][0].offsetHeight*index;
                let bottomHeight = parseInt(this.$refs['scroll-classify'].scrollHeight-topHeight);
                if(topHeight>height && bottomHeight>this.$refs['scroll-classify'].offsetHeight)
                {
                    this.myScroll.scrollTo(0,-topHeight,1000,IScroll.utils.ease.elastic);
                }
                this.selectItem({'index':index});
            },
            replaceUrl(url,index)
            {
                this.$router.replace(url);
                this.mySelectItem(index);
            }
        },
        computed:{
            ...mapState({
                classify:(state)=>state.goods.classify,
            })
        },
        created(){
            this.cid = this.$route.query.cid?this.$route.query.cid:'';
            this.getClassify({success:()=>{
                this.$nextTick(()=>{
                    this.myScroll.refresh();
                    if(this.classify.length>0)
                    {
                        let index = 0;
                        for(;index<this.classify.length&&this.cid;index++)
                        {
                            if(this.classify[index].cid===this.cid)
                            {
                                break;
                            }
                        }
                        this.cid = this.classify[index].cid;
                        this.replaceUrl('/goods/classify/item?cid='+this.cid,index)
                    }
                })
            }});

        },
        mounted(){
            document.title = this.$route.meta.title;
            this.$refs['scroll-classify'].addEventListener('touchmove',this.scrollPreventDefault);
            this.myScroll = new IScroll(this.$refs['scroll-classify'],{
                scrollX:false,
                scrollY:true,
                preventDefault:false,
            });
        },
        beforeDestroy(){
            this.$refs['scroll-classify'].removeEventListener("touchmove",this.scrollPreventDefault);
        },
        destroyed(){
            console.log("leave~");
        }
    }
</script>

<style scoped>
    .page{width:100%;height:100vh;overflow: hidden}

    .search-header{width:100%;height:1rem;background-color: white;align-items:center;display: flex;border-bottom: 1px solid #EFEFEF;}
    .search-header .Back{width:0.88rem;height:0.88rem;background-image: url("../../../assets/images/home/goods/back.png");
        background-size:100%;background-repeat: no-repeat;background-position: center;}
    .search-header .search{width:80%;height:0.8rem;border:1px solid #b2b2b2;border-radius:0.1rem;font-size:0.28rem;
        color:#626262;line-height: 0.8rem;padding-left: 0.2rem;}

    .goods-main{width:100%;height:90vh;margin-top:0.05rem;display:flex;}
    .goods-main .classify-wrap{width:1.72rem;height:auto;overflow: hidden;position:relative;z-index:1;}
    .goods-main .classify-wrap .classify-item{width:100%;height:0.8rem;text-align: center;line-height:0.9rem;
        border-bottom:1px solid #efefef;font-size:0.28rem;overflow: hidden;background-color: white;}
    .goods-main .classify-wrap .classify-item.active{color:red;}
    .goods-content{width:71%;height:auto;margin-left:0.2rem;overflow: hidden;}

</style>