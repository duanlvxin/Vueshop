<template>
    <div class="search-component" v-show="show.show">
        <div class="search-header">
            <div class="search-close" @click="show.show=false"></div>
            <div class="search-wrap">
                <input type="text" placeholder="请输入宝贝名称" v-model="keyword">
                <button type="button" @click="goSearch()"></button>
            </div>
        </div>
        <div class="search-main">
            <div v-if="keywords.length>0">
                <div class="search-title">最近搜索
                    <div class="bin" @click="clearHistoryKeywords"></div>
                </div>
                <div class="search-content">
                    <div class="keywords" v-for="(item,index) in keywords" :key="index" @click="goSearch(item)">
                        {{item}}
                    </div>
                </div>
            </div>
            <div class="search-title">热门搜索</div>
            <div class="search-content">
                <div class="keywords" v-for="(item,index) in hotKeywords" :key="index" @click="goSearch(item.title)">
                    {{item.title}}
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapMutations, mapState, mapActions} from 'vuex'
    import {Dialog} from 'vant'

    export default {
        name: "index",
        data() {
            return {
                keyword: ''
            }
        },
        created() {
            this.getHotKeywordsData();
        },
        mounted(){
            document.title = this.$route.meta.title;
        },
        computed: {
            ...mapState({
                keywords: (state) => state.search.historyKeywords,
                hotKeywords: (state) => state.search.hotKeywords,
            })
        },
        props: {
            show: {
                type: Object,
                default: false,
            },
            isLocal:{
                type:Boolean,
                default: false,
            }
        },
        methods: {
            ...mapMutations({
                setHistoryKeywords: 'search/SET_KEYWORDS',
                clearHistory: 'search/CLEAR_KWYEORDS'
            }),
            ...mapActions({
                getHotKeywordsData: 'search/getHotKeywordsData'
            }),
            goSearch(keyword) {
                console.log(this.keyword);
                let tempKeyword = keyword || this.keyword || "";
                console.log(keyword);
                if (!tempKeyword.match(/^\s*$/)) {
                    if (this.keywords.length > 0) {
                        for (let i = 0; i < this.keywords.length; i++) {
                            if (this.keywords[i] === tempKeyword) {
                                this.keywords.splice(i--, 1);
                            }
                        }
                    }
                    this.keywords.unshift(tempKeyword);
                    this.setHistoryKeywords({historyKeywords: this.keywords});
                }
                this.show.show = false;
                if(this.isLocal)
                {
                    this.$router.replace("/goods/search?keyword=" + tempKeyword);
                }
                else{
                    this.$router.push("/goods/search?keyword=" + tempKeyword);
                }
            },
            clearHistoryKeywords() {
                Dialog.confirm({
                    title: '',
                    message: '确认要删除吗?',
                })
                    .then(() => {
                        // on confirm
                        if (this.keywords.length > 0) {
                            this.clearHistory();
                        }
                    })
                    .catch(() => {
                        // on cancel
                    });
            }
        }
    }
</script>

<style scoped>
    .search-component {
        width: 100%;
        height: 100%;
        background-color: white;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 99;
    }

    .search-header {
        width: 100%;
        height: 1rem;
        align-items: center;
        display: flex;
        border-bottom: 1px solid #efefef;
    }

    .search-header .search-close {
        width: 0.5rem;
        height: 0.5rem;
        background-image: url("../../assets/images/common/search_x.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        margin-left: 0.2rem;
        margin-right: 0.2rem;
    }

    .search-header .search-wrap {
        width: 78%;
        height: 0.68rem;
        border-radius: 4px;
        display: flex;
        border: 1px solid #b2b2b2;
        align-items: center;
    }

    .search-header .search-wrap input {
        width: 82%;
        height: 90%;
        font-size: 0.28rem;
        line-height: 0.68rem;
        border-right: 1px solid #b2b2b2;
        padding-left: 0.2rem
    }

    .search-header .search-wrap button {
        width: 0.5rem;
        height: 0.5rem;
        background-color: white;
        background-image: url("../../assets/images/common/search_icon.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        margin-left: 0.15rem;
    }

    .search-main {
        width: 100%;
        height: 4px;
    }

    .search-main .search-title {
        width: auto;
        height: 0.4rem;
        padding-top: 0.4rem;
        padding-left: 0.4rem;
        padding-right: 0.4rem;
        font-size: 0.28rem;
        display: flex;
        justify-content: space-between;
    }

    .search-main .search-title .bin {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url("../../assets/images/common/bin.png");
        background-repeat: no-repeat;
        background-color: white;
        background-position: center;
        background-size: 100%;
    }

    .search-main .search-content {
        width: auto;
        margin-top: 0.3rem;
        padding-left: 0.4rem;
        padding-right: 0.4rem;
        display: flex;
        -webkit-flex-wrap: wrap;
        justify-content: flex-start;
    }

    .search-main .search-content .keywords {
        width: 28%;
        height: 0.6rem;
        font-size: 0.28rem;
        color: #717376;
        border: 1px solid #efefef;
        border-radius: 10px;
        text-align: center;
        overflow: hidden;
        line-height: 0.6rem;
        margin-left: 0.1rem;
        margin-right: 0.1rem;
        margin-bottom: 0.2rem;
        padding-left: 0.05rem;
        padding-right: 0.05rem;
    }
</style>