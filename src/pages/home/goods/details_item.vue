<template>
    <div class="page">
        <div class="banner-wrap">
            <div class="swiper-container" ref="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in details.images" :key="index">
                        <img :src="item">
                    </div>
                </div>
                <div class="swiper-pagination" ref="swiper-pagination"></div>
            </div>
        </div>
        <div class="goods-main">
            <div class="goods-title">{{details.title}}</div>
            <div class="goods-price">￥{{details.price}}</div>
            <ul class="goods-sales-wrap">
                <li>快递：{{details.freight}}元</li>
                <li>月销量{{details.sales}}件</li>
            </ul>
        </div>
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
                    <div class="review-more">
                        <button type="button" @click="$router.replace('/goods/details/review?gid='+$route.query.gid)">查看更多评价</button>
                    </div>
                </div>
            </div>
            <div class="no-data" v-show="review.length<=0">暂无评价!</div>
        </div>
        <div class="footer">
            <button class="button collect" type="button" @click="theGetCollection">收藏</button>
            <button class="button cart" type="button" @click="isScreen=true">加入购物车</button>
        </div>

        <div class="mask" v-show="isScreen" @click="hidePanel()"></div>
        <div ref="screen" :class="isScreen?'screen move':'screen unmove'">
            <div ref='goods-info' class="goods-info">
                <div ref="goods-image" class="goods-image">
                    <img :src="details.images&&details.images[0]">
                </div>
                <div class="goods-wrap">
                    <div class="goods-header">
                        <div class="goods-title">{{details.title}}</div>
                        <div class="close-panel" v-show="isScreen">
                            <div class="spot"></div>
                            <div class="line"></div>
                            <div class="close" @click="hidePanel()"></div>
                        </div>
                    </div>
                    <div class="goods-price-wrap">
                        <div class="goods-price">￥{{details.price}}</div>
                        <div class="goods-code">商品编码:{{$route.query.gid}}</div>
                    </div>
                </div>
            </div>
            <div class="attr-wrap">
                <div class="attr-list" v-for="(item,index) in attrs" :key="index">
                    <div class="attr-name">{{item.title}}</div>
                    <div class="attr-val-wrap">
                        <div :class="{'attr-val':true,active:item2.active}" v-for="(item2,index2) in item.values"
                             :key="index2" @click="setAttrs({'index':index,'index2':index2})">{{item2.value}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="amount-wrap">
                <div class="text">购买数量</div>
                <div class="counter">
                    <div :class="{btn:true,dec:true,noactive:!(this.amount>1)}" @click="amount>1?amount--:0">-</div>
                    <div class="btn">
                        <input type="text" :value="amount" @input="setAmount($event)">
                    </div>
                    <div class="btn add" @click="amount++">+</div>
                </div>
            </div>
            <button type="button" @click="sureSubmit">确定</button>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Swiper from '../../../assets/js/libs/swiper-3.4.2.min';
    import TweenMax from '../../../assets/js/libs/TweenMax.min';
    import {Toast} from 'vant'
    import {mapState, mapMutations, mapActions} from 'vuex';

    Vue.use(Toast);
    export default {
        name: "details_item",
        data() {
            return {
                isScreen: false,
                amount: 1,
                gid:this.$route.query.gid?this.$route.query.gid:''
            }
        },
        computed: {
            ...mapState({
                attrs: (state) => state.goods.spec,
                details: (state) => state.goods.details,
                review: (state) => state.goodsReview.review,
                total: (state) => state.goodsReview.total,
                isLogin:(state)=>state.user.isLogin,
            }),
        },
        methods: {
            ...mapMutations({
                setAttrs: 'goods/SET_ATTRS',
                ADD_ITEM:'cart/ADD_ITEM',
            }),
            ...mapActions({
                getDetails: 'goods/getDetails',
                getSpec: 'goods/getSpec',
                getReview: 'goodsReview/getReview',
                getCollection:'goods/getCollection'
            }),
            setAmount(e) {
                this.amount = e.target.value;
                this.amount = this.amount.replace(/[^\d]/g, '');
                if (!this.amount || this.amount === "0") {
                    this.amount = 1;
                }
            },
            //隐藏选择面板
            hidePanel() {
                if (this.isMove) {
                    this.isScreen = false;
                }
            },
            //确认提交
            sureSubmit() {
                if (this.attrs.length > 0) {
                    let isActive = false;
                    for (let i = 0; i < this.attrs.length; i++) {
                        isActive = false;
                        for (let j = 0; j < this.attrs[i].values.length; j++) {
                            if (this.attrs[i].values[j].active) {
                                isActive = true;
                                break;
                            }
                        }
                        if (!isActive) {
                            Toast('请选择' + this.attrs[i].title);
                            return;
                        }
                    }
                }
                this.addCart();
            },
            //加到购物车
            addCart() {
                if (this.isMove) {
                    this.isMove = false;
                    let goodsImg = this.$refs['goods-image'], goodsInfo = this.$refs['goods-info'];
                    let cloneImg = goodsImg.cloneNode(true);//深度克隆
                    goodsInfo.appendChild(cloneImg);
                    cloneImg.style.cssText =
                        "position:absolute;z-index:10;left:0.2rem;top:0.2rem;width:0.4rem;height:0.4rem;";
                    let cartIcon = document.getElementById('cart-icon');
                    let cartTop = window.innerHeight - this.$refs['screen'].offsetHeight;
                    TweenMax.to(cloneImg, 2, {
                        bezier: [{x: cloneImg.offsetLeft, y: -100}, {x: cartIcon.offsetLeft, y: -cartTop}],
                        onComplete: () => {
                            cloneImg.remove();
                            this.isMove = true;
                            let attrs = [],param=[];
                            if(this.attrs.length>0){
                                for(let i=0;i<this.attrs.length;i++){
                                    param = [];
                                    for(let j=0;j<this.attrs[i].values.length;j++){
                                        if(this.attrs[i].values[j].active){
                                            param.push({paramid:this.attrs[i].values[j].vid,
                                            title:this.attrs[i].values[j].value})
                                        }
                                    }
                                    attrs.push(
                                        {
                                            'attrid':this.attrs[i].attrid,
                                            'title':this.attrs[i].title,
                                            'param':param,
                                        },
                                    )
                                }
                            }
                            let cartData={
                                gid:this.gid,
                                title:this.details.title,
                                amount:this.amount,
                                price:this.details.price,
                                img:this.details.images[0],
                                checked:true,
                                freight:this.details.freight,
                                attrs:attrs,
                            }
                            this.ADD_ITEM({'cartData':cartData});
                        }
                    });
                    TweenMax.to(cloneImg, 0.2, {rotation: 360, repeat: -1});
                }
            },
            //收藏
            theGetCollection(){
                if(!this.isLogin){
                    Toast("请先登录!");
                    return;
                }

                // this.$utils.safeUser(this);

                this.getCollection({gid:this.gid,success:(res)=>{
                    if(res.code===200){
                        Toast("收藏成功");
                    }
                    else{
                        Toast(res.data);
                    }
                }})
            }
        },
        created() {
            this.isMove = true;
            this.getDetails({
                'gid': this.$route.query.gid, success: () => {
                    this.$nextTick(() => {
                        new Swiper(this.$refs['swiper-container'], {
                            autoplay: 3000,//可选选项，自动滑动
                            pagination: this.$refs['swiper-pagination'],
                            paginationClickable: true,
                            autoplayDisableOnInteraction: false
                        });
                    })
                }
            });
            this.getSpec({
                'gid': this.$route.query.gid, success: () => {
                    this.$nextTick(() => {
                        this.$utils.lazyImg();
                    })
                }
            });

            this.getReview({
                'gid': this.$route.query.gid,success: () => {
                    this.$nextTick(() => {
                        this.$utils.lazyImg();
                    })
                }
            });
        },
        beforeRouteUpdate() {
            this.getSwiper({
                'gid': this.$route.query.gid, success: () => {
                    this.$nextTick(() => {
                        new Swiper(this.$refs['swiper-container'], {
                            autoplay: 3000,//可选选项，自动滑动
                            pagination: this.$refs['swiper-pagination'],
                            paginationClickable: true,
                            autoplayDisableOnInteraction: false
                        });
                    })
                }
            });
        },
        mounted() {
        }
    }
</script>

<style scoped>
    @import "../../../assets/css/common/swiper-3.4.2.min.css";

    .page {
        width: 100%;
        height: auto;
        margin-top: 1.2rem;
        margin-bottom: 1.2rem;
    }

    .page .banner-wrap {
        width: 7.5rem;
        height: 7rem;
        overflow: hidden;
    }

    .page .banner-wrap .swiper-container .swiper-wrap .swiper-slide img {
        width: 100%;
    }

    .page .banner-wrap .swiper-container .swiper-pagination {
        bottom: 1.6rem;
    }

    .page .goods-main {
        width: 100%;
        height: auto;
        background-color: white;
        margin: 0 auto;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    .page .goods-main .goods-title {
        width: 90%;
        height: auto;
        font-size: 0.28rem;
        margin: 0 auto;
    }

    .page .goods-main .goods-price {
        width: 90%;
        height: auto;
        color: #f93036;
        margin: 0.2rem auto;
    }

    .page .goods-main .goods-sales-wrap {
        width: 90%;
        justify-content: space-between;
        display: flex;
        margin: 0 auto;
    }

    .page .goods-main .goods-sales-wrap li {
        font-size: 0.24rem;
        color: #969696;
    }

    .page .review-main {
        width: 100%;
        height: auto;
        background-color: white;
        margin: 0.3rem auto;
        padding-bottom: 0.5rem
    }

    .page .review-main .review-title {
        width: 90%;
        height: 0.4rem;
        font-size: 0.32rem;
        color: #7b7f82;
        padding-top: 0.2rem;
        padding-left: 0.4rem;
    }

    ..page .review-main .no-data{
        width:100%;
        height:2rem;
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

    .page .review-main .review-wrap .review-more {
        width: 100%;
        height: 0.6rem;
        margin-top: 0.4rem;
        text-align: center;
    }

    .page .review-main .review-wrap .review-more button {
        width: 2.44rem;
        height: 0.56rem;
        font-size: 0.28rem;
        background-color: white;
        border: 1px solid #d50a17;
        border-radius: 0.1rem;
        text-align: center;
        margin-bottom: 0;
        line-height: 0.56rem;
    }

    .page .footer {
        width: 100%;
        height: 1.2rem;
        display: flex;
        position: fixed;
        bottom: 0;
    }

    .page .footer .button {
        width: 50%;
        text-align: center;
        font-size: 0.36rem;
        color: white;
    }

    .page .footer .button.collect {
        background-color: #fcb40a;
    }

    .page .footer .button.cart {
        background-color: #cc0004;
    }

    .mask {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 99;
        background-color: rgba(0, 0, 0, .3)
    }

    .screen {
        width: 100%;
        height: 8rem;
        background-color: #ffffff;
        position: fixed;
        bottom: 0;
        z-index: 100;
        transform: translateY(100%);
    }

    .screen.move {
        transition: transform 0.3s;
        transform: translateY(0%);
    }

    .screen.unmove {
        transition: transform 0.3s;
        transform: translateY(100%);
    }

    .screen .goods-info {
        width: 100%;
        height: 1.24rem;
        display: flex;
        border-bottom: 1px solid #efefef;
        position: relative;
    }

    .screen .goods-info .goods-image {
        margin: auto auto auto 0.2rem;
        width: 0.8rem;
        height: 0.8rem;
    }

    .screen .goods-info .goods-image img {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .screen .goods-info .goods-wrap {
        width: 5.88rem;
        height: 100%;
        align-items: left;
        margin-top: 0.1rem;
    }

    .screen .goods-info .goods-wrap .goods-header {
        width: 100%;
        height: 0.7rem;
        overflow: hidden;
        justify-content: space-between;
        display: flex;
    }

    .screen .goods-info .goods-wrap .goods-header .goods-title {
        font-size: 0.24rem;
    }

    .screen .goods-info .goods-wrap .goods-header .close-panel {
        width: 0.6rem;
        height: 1.2rem;
        position: absolute;
        right: -0.2rem;
        top: -1rem;
        z-index: 2;
    }

    .screen .goods-info .goods-wrap .goods-header .close-panel .spot {
        width: 0.12rem;
        height: 0.12rem;
        background-color: black;
        position: absolute;
        z-index: 1;
        bottom: 0;
        left: 0;
    }

    .screen .goods-info .goods-wrap .goods-header .close-panel .line {
        width: 1px;
        height: 0.72rem;
        background-color: #fff;
        position: absolute;
        z-index: 1;
        left: 0.05rem;
        bottom: 0.05rem;
    }

    .screen .goods-info .goods-wrap .goods-header .close-panel .close {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url('../../../assets/images/home/goods/x.png');
        background-color: rgba(0, 0, 0, 0);
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        position: absolute;
        z-index: 0;
        left: -0.14rem;
        top: 0.1rem;
    }

    .screen .goods-info .goods-wrap .goods-price-wrap {
        width: 100%;
        height: auto;
        align-items: center;
        display: flex;
        justify-content: space-between;
    }

    .screen .goods-info .goods-wrap .goods-price-wrap .goods-price {
        font-size: 0.24rem;
        color: #f93036;
    }

    .screen .goods-info .goods-wrap .goods-price-wrap .goods-code {
        font-size: 0.24rem;
        color: #888;
        margin-right: 0.2rem;
    }

    .screen .attr-wrap {
        width: 100%;
        max-height: 3.5rem;
        padding-left: 0.2rem;
        overflow-y: scroll;
    }

    .screen .attr-wrap .attr-list {
        width: 100%;
        height: auto;
        margin-top: 0.2rem;
    }

    .screen .attr-wrap .attr-list .attr-name {
        width: auto;
        font-size: 0.32rem;
    }

    .screen .attr-wrap .attr-list .attr-val-wrap {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 0.2rem;
    }

    .screen .attr-wrap .attr-list .attr-val {
        width: 1.04rem;
        height: 0.6rem;
        background-color: #efefef;
        font-size: 0.32rem;
        border-radius: 0.1rem;
        margin-right: 0.2rem;
        line-height: 0.6rem;
        text-align: center;
        color: black;
    }

    .screen .attr-wrap .attr-list .attr-val.active {
        background-color: #fda208;
        color: white;
    }

    .screen .amount-wrap {
        width: 100%;
        height: 1.14rem;
        justify-content: space-between;
        align-items: center;
        display: flex;
    }

    .screen .amount-wrap .text {
        width: auto;
        font-size: 0.32rem;
        margin-left: 0.2rem;
        margin-top: 0.2rem;
    }

    .screen .amount-wrap .counter {
        width: 2rem;
        height: 0.68rem;
        margin-right: 0.2rem;
        border: 1px solid black;
        border-radius: 0.1rem;
        display: flex;
    }

    .screen .amount-wrap .counter .btn {
        width: 33%;
        height: 0.4rem;
        text-align: center;
        line-height: 0.4rem;
        margin: auto auto;
    }

    .screen .amount-wrap .counter .btn.dec {
        border-right: 1px solid black;
    }

    .screen .amount-wrap .counter .btn.dec.noactive {
        color: #b5b5b5
    }

    .screen .amount-wrap .counter .btn.add {
        border-left: 1px solid black;
    }

    .screen .amount-wrap .counter .btn input {
        width: 95%;
        height: 100%;
        text-align: center;
    }

    .screen button {
        width: 100%;
        height: 0.8rem;
        background-color: #cf0005;
        position: absolute;
        bottom: 0;
        font-size: 0.28rem;
        color: white;
    }
</style>