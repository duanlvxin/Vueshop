<template>
    <div class="page">
        <div class="review-main">
            <div class="review-title">商品评价（{{total}}）</div>
            <div v-show="review.length>0">
                <div class="review-wrap">
                    <div class="review-list" v-for="(item,index) in review" :key="index">
                        <div class="uinfo">
                            <div class="avater"><img :data-echo="item.head"
                                                     src="../../../assets/images/common/lazyImg.jpg"></div>
                            <div class="nickname">{{item.nickname}}</div>
                        </div>
                        <div class="review-content" v-html="item.content"></div>
                        <div class="review-date">{{item.titmes}}</div>
                    </div>
                </div>
            </div>
            <div class="no-data" v-show="review.length<=0">暂无评价!</div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import UpRefresh from '../../../assets/js/libs/uprefresh'

    export default {
        name: "details_review",
        data() {
            return {
                gid: this.$route.query.gid ? this.$route.query.gid : ''
            }
        },
        computed: {
            ...mapState({
                review: (state) => state.goodsReview.review,
                total: (state) => state.goodsReview.total,
            }),
        },
        methods: {
            ...mapActions({
                getReview: 'goodsReview/getReview',
                getReviewPage:'goodsReview/getReviewPage'
            }),
        },
        created() {
            this.pullUp = new UpRefresh();
            this.getReview({
                'gid': this.gid, success: (pageNum) => {
                    this.$nextTick(() => {
                        this.$utils.lazyImg();
                    })
                    this.pullUp.init({
                        'curPage': 1,
                        'maxPage': parseInt(pageNum),
                        'offsetBottom': 100
                    }, (page) => {
                        console.log(page);
                        this.getReviewPage({gid: this.gid, page: page});
                    })
                }
            })
        },
        beforeRouteUpdate() {
            this.pullUp = new UpRefresh();
            this.getReview({
                'gid': this.gid, success: (pageNum) => {
                    this.$nextTick(() => {
                        this.$utils.lazyImg();
                    })
                    this.pullUp.init({
                        'curPage': 1,
                        'maxPage': parseInt(pageNum),
                        'offsetBottom': 100
                    }, (page) => {
                        console.log(page);
                        this.getReviewPage({gid: this.gid, page: page,success:()=>{
                                this.$nextTick(() => {
                                    this.$utils.lazyImg();
                                })
                        }});
                    })
                }
            })
        },
        beforeDestroy() {
            this.pullUp.uneventSrcoll();
        }
    }
</script>

<style scoped>
    .page {
        width: 100%;
        height: 100%;
    }

    .page .review-main {
        width: 100%;
        height: 100%;
        margin-top: 1.2rem;
        overflow-y: scroll;
        background-color: white;
    }

    .page .review-main .review-title {
        width: 90%;
        height: 0.4rem;
        font-size: 0.32rem;
        color: #7b7f82;
        padding-top: 0.2rem;
        padding-left: 0.4rem;
    }

    .page .review-main .no-data {
        width: 100%;
        height: 2rem;
        text-align: center;
        line-height: 2rem;
    }

    .page .review-main .review-wrap {
        width: 90%;
        height: auto;
        margin: 0 auto;
    }

    .page .review-main .review-wrap .review-list {
        width: 100%;
        margin-top: 0.4rem;
        border-bottom: 1px solid #efefef;
    }

    .page .review-main .review-wrap .review-list .uinfo {
        width: 100%;
        height: 0.6rem;
        display: flex;
    }

    .page .review-main .review-wrap .review-list .uinfo .avater {
        width: 0.6rem;
        height: 0.6rem;
    }

    .page .review-main .review-wrap .review-list .uinfo .avater img {
        width: 100%;
        height: 100%;
    }

    .page .review-main .review-wrap .review-list .uinfo .nickname {
        width: auto;
        line-height: 0.6rem;
        font-size: 0.28rem;
        margin-left: 0.2rem;
    }

    .page .review-main .review-wrap .review-list .review-content {
        width: 100%;
        height: auto;
        font-size: 0.28rem;
        margin-top: 0.2rem;
    }

    .page .review-main .review-wrap .review-list .review-date {
        width: 100%;
        height: auto;
        font-size: 0.28rem;
        margin-top: 0.2rem;
        margin-bottom: 0.1rem;
        color: #7b7f82
    }

</style>