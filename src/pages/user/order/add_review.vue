<template>
    <div class="page">
        <sub-header title="评价"></sub-header>
        <div class="content">
            <div class="item" v-for="(item,index) in reviewService" :key="index">
                <div class="text">{{item.title}}</div>
                <div class="stars" >
                    <div :class="{star:true,active:item2.active}" v-for="(item2,index2) in item.scores" :key="index2"
                    @click=" SET_REVIEW_SCORE({index:index,index2:index2,score:item2.value})"></div>
                </div>
            </div>
            <div class="content-wrap">
                <textarea placeholder="来分享你的消费感受吧!" v-model="content"></textarea>
            </div>
            <div class="btn" @click="submit">提交</div>
        </div>

    </div>
</template>

<script>
    import subHeader from '../../../components/sub-header';
    import {mapActions,mapState,mapMutations} from 'vuex';
    import {Toast} from 'vant'
    export default {
        name: "add_review",
        components:{
            subHeader
        },
        methods:{
            ...mapActions({
                getReview:'order/getReview',
                postReview:'order/postReview',
            }),
            ...mapMutations({
                SET_REVIEW_SCORE:'order/SET_REVIEW_SCORE'
            }),
            submit(){
                if(this.isSubmit){
                    this.isSubmit = false;
                    if(this.content.match(/^\s*$/)){
                        Toast("请输入评价内容");
                        return;
                    }
                    let rsdata = [];
                    if(this.reviewService.length>0){
                        for(let i=0;i<this.reviewService.length;i++){
                            rsdata.push({
                                gid:this.gid,
                                myid:this.uid,
                                rsid:this.reviewService[i].rsid,
                                score:this.reviewService[i].score,
                            })
                        }
                    }

                    let data = {
                        gid:this.gid,
                        ordernum:this.ordernum,
                        content:this.content,
                        rsdata:JSON.stringify(rsdata),
                    };

                    this.postReview({data:data,success:(res)=>{
                            Toast({
                                message:res.data,
                                duration:2000,
                                onClose:()=> {
                                    this.isSubmit = true;
                                    this.$router.go(-1)
                                }
                            });
                    }});
                }
            }
        },
        computed:{
            ...mapState({
                reviewService:(state)=>state.order.reviewService,
                uid:(state)=>state.user.uid
            })
        },
        data(){
            return{
                gid:'',
                ordernum:'',
                content:''
            }
        },
        mounted(){
            document.title=this.$route.meta.title;
        },
        created(){
            this.gid = this.$route.query.gid?this.$route.query.gid:'';
            this.ordernum = this.$route.query.ordernum?this.$route.query.ordernum:'';
            this.getReview();
            this.isSubmit = true;
        }
    }
</script>

<style scoped>
    .page{width:100%;height:100vh;background-color: white;}
    .page .content{width:100%;height:auto;padding-top: 1rem;}
    .page .content .item{width:100%;height:1.02rem;display: flex;align-items: center;border-bottom: 1px solid #efefef;}
    .page .content .item .text{font-size: 0.32rem;margin-left: 0.2rem;}
    .page .content .item .stars{width:auto;height:auto;margin-left: 1.2rem;display: flex;}
    .page .content .item .stars .star{width:0.4rem;height: 0.4rem;margin-right:0.3rem;background-image: url("../../../assets/images/user/orders/stars1.png");background-size: 100%;background-repeat: no-repeat;background-position: center;}
    .page .content .item .stars .star.active{background-image: url("../../../assets/images/user/orders/stars2.png");}
    .page .content .content-wrap{width:100%;height: 4rem;overflow: hidden;margin-top: 0.3rem;}
    .page .content .content-wrap textarea{width:95%;height: 90%;font-size:0.32rem;outline: none;border: 0;resize: none;
    overflow: auto;margin-left: 2.5%;font-family: sans-serif;}
    .page .content .btn{width:90%;height:0.8rem;background-color: #e51b19;text-align: center;line-height: 0.8rem;
    color:white;margin: 0.2rem auto;border-radius: 0.1rem;}
</style>