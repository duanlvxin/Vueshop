<template>
    <div class="search-page">
        <div class="search-header">
            <div class="back" @click="$router.go(-1)"></div>
            <div class="search-input" @click="isSearchShow.show=true">
                <div class="search-icon"></div>
                <div class="search-text">{{keyword}}</div>
            </div>
            <button type="button" class="search-filter" @click="isScreen=true">筛选</button>
        </div>
        <div class="search-nav">
            <div :class="{'order-item':true,active:isPriceOrder}" @click="selectPrice">
                <div class="order-text">综合</div>
                <div class="order-icon"></div>
                <div class="order-menu" v-show="isPriceOrder">
                    <li :class="{active:item.active}" v-for="(item,index) in priceOrderList" :key="index"
                        @click="selectPriceOrder(index)">{{item.title}}
                    </li>
                </div>
            </div>
            <div :class="{'order-item':true,active:isSale}" @click="selectSale">
                <div class="order-text">销量</div>
            </div>
        </div>
        <div class="no-goods" v-if="searchData.length===0">没有相关商品!</div>
        <div class="goods-main" v-else>
            <div class="search-goods" v-for="(item,index) in searchData" :key="index" @click="$router.push('/goods/details?gid='+item.gid)">
                <div class="goods-image">
                    <img :data-echo="item.image" src="../../../assets/images/common/lazyImg.jpg">
                </div>
                <div class="goods-detail">
                    <div class="goods-title">{{item.title}}</div>
                    <div class="goods-price">￥{{item.price}}</div>
                    <div class="goods-sellNum">销量<span>{{item.sales}}</span>件</div>
                </div>
            </div>
        </div>
        <div ref="mask" class="mask" v-show="isScreen" @click="isScreen=false"></div>
        <div ref="screen" :class="isScreen?'screen move':'screen unmove'">
            <div>
                <div class="attr-wrap">
                    <div class="title-wrap" @click="isClassify=!isClassify">
                        <div class="title">分类</div>
                        <div :class="{'icon':true,up:!isClassify,down:isClassify}"></div>
                    </div>
                    <div class="item-wrap" v-show="isClassify">
                        <div :class="{item:true,active:classify[index].active}" v-for="(item,index) in classify"
                             :key="index" @click="selectClassify({index:index})">{{item.title}}
                        </div>
                    </div>
                </div>
                <div style="width:100%;height:0.3rem;background-color: #efefef;"></div>
                <div class="attr-wrap">
                    <div class="title-wrap" @click="isPrice=!isPrice">
                        <div class="title">价格区间</div>
                        <div class="input-text" @click.stop>
                            <input placeholder="最低价" style="background-color: white" :value="minPrice"
                                   @input="setMinPrice({minPrice:$event.target.value})">
                            <div class="price-line"></div>
                            <input placeholder="最高价" style="background-color: white" :value="maxPrice"
                                   @input="setMaxPrice({maxPrice:$event.target.value})">
                        </div>
                        <div :class="{icon:true,down:isPrice,up:!isPrice}"></div>
                    </div>
                    <div class="item-wrap" v-show="isPrice">
                        <div :class="{item:true,active:item.active}" v-for="(item,index) in priceData.items"
                             :key="index" @click="mySelectPriceRange(index)">{{item.price1}}-{{item.price2}}
                        </div>
                    </div>
                </div>
                <div class="attr-wrap" v-for="(item,index) in attrs" :key="index">
                    <div class="title-wrap" @click="hideAttrs({index:index})">
                        <div class="title">{{item.title}}</div>
                        <div :class="{icon:true,up:item.isHide,down:!item.isHide}"></div>
                    </div>
                    <div class="item-wrap">
                        <div :class="{item:true,active:item2.active}" v-for="(item2,index2) in item.param" :key="index2"
                             v-show="!item.isHide" @click="selectAttr({index:index,index2:index2})">{{item2.title}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="item color-0">共<span>{{total}}</span>件</div>
                <div class="item color-1" @click="resetSearch">全部重置</div>
                <div class="item color-2" @click="sureSubmit">确定</div>
            </div>
        </div>
        <my-search :show="isSearchShow" :isLocal="true"></my-search>
    </div>
</template>

<script>
    import IScroll from '../../../assets/js/libs/iscroll'
    import mySearch from '../../../components/search'
    import {mapState, mapActions, mapMutations} from 'vuex'
    import UpRefresh from '../../../assets/js/libs/uprefresh'

    export default {
        name: "search",
        data() {
            return {
                keyword: this.$route.query.keyword,
                isSearchShow: {show: false},
                isPriceOrder: false,
                isSale: false,
                priceOrderList: [
                    {otype: 'all', title: '综合', active: true},
                    {otype: 'up', title: '价格从低到高', active: false},
                    {otype: 'down', title: '价格从高到低', active: false}
                ],
                isScreen: false,
                isClassify: true,
                isPrice: true,
            }
        },
        computed: {
            ...mapState({
                classify: (state) => state.goods.classify,
                priceData: (state) => state.search.priceData,
                minPrice: (state) => state.search.minPrice,
                maxPrice: (state) => state.search.maxPrice,
                attrs: (state) => state.search.attrs,
                searchData: (state) => state.search.searchData,
                cid: (state) => state.search.cid,
                price1: (state) => (state).search.price1,
                price2: (state) => (state).search.price2,
                params:(state)=>(state).search.params,
                total:(state)=>(state).search.total,
            })
        },
        components: {
            mySearch
        },
        created() {
            this.otype = 'all';
            this.pullUp = new UpRefresh();
            this.getClassify({
                success: () => {
                    this.$nextTick(() => {
                        this.myScroll.refresh();
                    })
                }
            });
            this.resetSearch();
            this.init();
            this.getAttrs({
                keyword: this.keyword, success: () => {
                    this.$nextTick(() => {
                        this.myScroll.refresh();
                    });
                }
            });
        },
        mounted() {
            document.title = this.$route.meta.title;
            this.$refs['screen'].addEventListener('touchmove', this.scrollPreventDefault);
            this.myScroll = new IScroll(this.$refs['screen'], {
                scrollX: false,
                scrollY: true,
                preventDefault: false,
            });
        },
        methods: {
            ...mapActions({
                getClassify: 'goods/getClassify',
                selectClassify: 'search/selectClassify',
                getSearch: 'search/getSearch',
                getSearchPage: 'search/getSearchPage',
                getAttrs: 'search/getAttrs',
                resetSearch:'search/resetSearch'
            }),
            ...mapMutations({
                selectPriceRange: 'search/SELECT_PRICE',
                setMinPrice: 'search/SET_MINPRICE',
                setMaxPrice: 'search/SET_MAXPRICE',
                hideAttrs: 'search/HIDE_ADDRS',
                selectAttr: 'search/SELECT_ATTR',
                setParams:'search/SET_PARAMS',
            }),
            //选择综合
            selectPrice() {
                this.isPriceOrder = !this.isPriceOrder;
                this.isSale = false;
            },
            //选择销量
            selectSale() {
                this.isSale = !this.isSale;
                this.isPriceOrder = false;
                for (let i = 0; i < this.priceOrderList.length; i++) {
                    if (this.priceOrderList[i].active) {
                        this.priceOrderList[i].active = false;
                        break;
                    }
                }
                this.priceOrderList[0].active = true;
                this.otype = 'sales';
                this.init();
            },
            //选择价格排序
            selectPriceOrder(index) {
                for (let i = 0; i < this.priceOrderList.length; i++) {
                    if (this.priceOrderList[i].active) {
                        this.priceOrderList[i].active = false;
                        break;
                    }
                }
                this.priceOrderList[index].active = true;
                this.$set(this.priceOrderList, index, this.priceOrderList[index]);
                this.otype = this.priceOrderList[index].otype;
                this.init();
            },
            //禁用touchmove事件
            scrollPreventDefault(e) {
                e.preventDefault();
            },
            //选择价格区间
            mySelectPriceRange(index) {
                this.selectPriceRange({index: index});
            },
            //获取搜索结果（分页)
            init() {
                let params = {
                    keyword: this.keyword,
                    otype: this.otype,
                    cid: this.cid,
                    page:1,
                    price1: this.minPrice,
                    price2: this.maxPrice,
                    param:JSON.stringify(this.params)
                };
                this.getSearch({
                    ...params, success: (pageNum) => {
                        this.$nextTick(() => {
                            this.$utils.lazyImg();
                        });
                        this.pullUp.init({
                            'curPage': 1,
                            'maxPage': parseInt(pageNum),
                            'offsetBottom': 100
                        }, (page) => {
                            console.log(page);
                            this.getSearchPage({...params, page: page});
                        })
                    }
                });
            },
            //确认搜索
            sureSubmit() {
                this.setParams();
                this.init();
                this.isScreen = false;
            }
        },
        beforeRouteUpdate(to, from, next) {
            this.keyword = to.query.keyword;
            this.otype = "all";
            this.resetSearch();
            this.init();
            this.isPriceOrder = false;
            if (this.priceOrderList.length > 0) {
                for (let i = 0; i < this.priceOrderList.length; i++) {
                    if (this.priceOrderList[i].active) {
                        this.priceOrderList[i].active = false;
                    }
                }
            }
            this.priceOrderList[0].active = true;
            this.isSale = false;
            this.getAttrs({
                keyword: this.keyword, success: () => {
                    this.$nextTick(() => {
                        this.myScroll.refresh();
                    });
                }
            });
            next();
        },
        beforeDestroy() {
            this.$refs['screen'].removeEventListener('touchmove', this.scrollPreventDefault);
            this.pullUp.uneventSrcoll();
        }
    }
</script>

<style scoped>
    .search-page {
        width: 100%;
        height: auto;
        overflow: hidden;
    }

    .search-header {
        width: 100%;
        height: 0.8rem;
        background-color: white;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #efefef;
        position:fixed;
        z-index:10;
        top:0;
    }

    .search-header .back {
        width: 0.8rem;
        height: 0.8rem;
        background-image: url("../../../assets/images/home/goods/back.png");
        background-color: white;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
    }

    .search-header .search-input {
        width: 5.6rem;
        height: 85%;
        background-color: #eaeaea;
        border-radius: 4px;
        display: flex;
    }

    .search-header .search-input .search-icon {
        width: 0.48rem;
        height: 0.72rem;
        margin-left: 0.1rem;
        background-image: url("../../../assets/images/common/search.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
    }

    .search-header .search-input .search-text {
        margin-left: 0.3rem;
        font-size: 0.32rem;
        line-height: 0.72rem;
    }

    .search-header button {
        width: auto;
        height: 100%;
        background-color: white;
        font-size: 0.32rem;
    }

    .search-nav {
        width: 100%;
        height: 0.8rem;
        background-color: white;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #efefef;
        position:fixed;
        z-index:10;
        margin-top: 0.72rem;
    }

    .search-nav .order-item {
        width: auto;
        height: 100%;
        margin-left: 0.4rem;
        font-size: 0.32rem;
        line-height: 0.8rem;
        display: flex;
        align-items: center;
        position: relative;
    }

    .search-nav .order-item.active {
        color: #fda208;
    }

    .search-nav .order-item .order-text {
        width: auto;
        height: auto;
        font-size: 0.32rem;
        line-height: 0.8rem;
    }

    .search-nav .order-item .order-icon {
        width: 0.35rem;
        height: 0.35rem;
        background-image: url("../../../assets/images/home/goods/down.png");
        background-color: white;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
        margin-left: 0.05rem;
    }

    .search-nav .order-item.active .order-icon {
        background-image: url("../../../assets/images/home/goods/up.png");
    }

    .search-nav .order-item .order-menu {
        width: 10rem;
        height: auto;
        background-color: #ffffff;
        position: absolute;
        z-index: 1;
        left: -40%;
        top: 0.8rem;
    }

    .search-nav .order-item .order-menu li {
        width: 100%;
        height: 0.8rem;
        font-size: 0.28rem;
        line-height: 0.8rem;
        border-bottom: 1px solid #efefef;
        border-top: 1px solid #efefef;
        padding-left: 0.4rem;
        color: #000000;
    }

    .search-nav .order-item .order-menu li.active {
        color: #fda208;
    }

    .goods-main {
        width: 100%;
        height: auto;
        position:absolute;
        z-index:0;
        margin-top:1.5rem;
        background-color: #ffffff;
    }

    .no-goods{
        width:100%;
        height:1rem;
        position:absolute;
        z-index:10;
        margin-top:1.5rem;
        background-color: white;
        text-align: center;
        font-size:0.28rem;
        line-height: 1rem;
    }

    .search-goods {
        width: 100%;
        height: 2rem;
        background-color: #ffffff;
        text-align: center;
        display: flex;
        margin-bottom: 0.4rem;
    }

    .search-goods .goods-image {
        width: 2rem;
        height: 2rem;
        margin-left: 0.1rem;
    }

    .search-goods .goods-image img {
        width: 100%;
        height: 100%;
    }

    .search-goods .goods-detail {
        width: 67%;
        height: 98%;
        margin-left: 0.2rem;
        border-bottom: 1px solid #ccc;
        text-align: left;
    }

    .search-goods .goods-detail .goods-title {
        width: 98%;
        height: 0.8rem;
        overflow: hidden;
        font-size: 0.32rem;
    }

    .search-goods .goods-detail .goods-price {
        width: auto;
        height: auto;
        font-size: 0.32rem;
        color: #f93036;
        margin-top: 0.2rem;
    }

    .search-goods .goods-detail .goods-sellNum {
        width: auto;
        height: auto;
        font-size: 0.28rem;
        margin-left: 0.1rem;
    }

    .search-goods .goods-detail .goods-sellNum span {
        color: #fda208;
    }

    .mask {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        z-index: 99;
        background-color: rgba(0, 0, 0, .3)
    }

    .screen {
        width: 80%;
        height: 100%;
        z-index: 100;
        position: fixed;
        top: 0;
        right: 0;
        background-color: #fff;
        overflow: hidden;
        transform: translateX(100%);
        -webkit-transform: translateX(100%);
    }

    .screen.move {
        transition: transform 0.3s;
        transform: translateX(0%);
    }

    .screen.unmove {
        transition: transform 0.3s;
        transform: translateX(100%);
    }

    .attr-wrap {
        width: 100%;
    }

    .attr-wrap .title-wrap {
        width: auto;
        height: 0.8rem;
        margin-left: 0.2rem;
        margin-right: 0.2rem;
        justify-content: space-between;
        align-items: center;
        display: flex;
    }

    .attr-wrap .title-wrap .title {
        width: auto;
        height: 100%;
        font-size: 0.32rem;
        line-height: 0.8rem;
    }

    .attr-wrap .title-wrap .input-text {
        width: auto;
        height: auto;
        display: flex;
        align-items: center;
        margin-left: 0.8rem;
    }

    .attr-wrap .title-wrap input {
        width: 1rem;
        height: 0.36rem;
        font-size: 0.28rem;
        line-height: 0.36rem;
        border: 1px solid #efefef;
        border-radius: 4px;
    }

    .attr-wrap .title-wrap .price-line {
        width: 0.4rem;
        height: 1px;
        color: #efefef;
        margin-left: 0.1rem;
        margin-right: 0.1rem;
    }

    .attr-wrap .title-wrap .icon {
        width: 0.4rem;
        height: 0.4rem;
        background-color: white;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
        margin-left: 0.05rem;
    }

    .attr-wrap .icon.down {
        background-image: url("../../../assets/images/home/goods/down.png");
    }

    .attr-wrap .icon.up {
        background-image: url("../../../assets/images/home/goods/up.png");
    }

    .item-wrap {
        width: 100%;
        height: auto;
        display: flex;
        flex-wrap: wrap;
    }

    .item-wrap .item {
        width: 30%;
        height: 0.64rem;
        background-color: #efefef;
        font-size: 0.28rem;
        text-align: center;
        border-radius: 0.1rem;
        margin-left: 2%;
        margin-right: 1%;
        margin-bottom: 0.2rem;
        line-height: 0.64rem;
    }

    .item-wrap .item.active {
        background-color: #fda208;
        color: white;
    }

    .footer {
        width: 100%;
        height: 1rem;
        align-items: center;
        display: flex;
        position: absolute;
        left: 0;
        bottom: 0;
    }

    .footer .item {
        width: 33%;
        height: 100%;
        font-size: 0.28rem;
        text-align: center;
        line-height: 1rem;
        border: 1px solid #efefef;
    }

    .footer .item.color-0 {
        background-color: white;
    }

    .footer .item span {
        color: #fda208;
    }

    .footer .item.color-1 {
        background-color: #efefef;
    }

    .footer .item.color-2 {
        background-color: #fda208;
    }
</style>