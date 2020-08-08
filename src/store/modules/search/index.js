import {getHotKeywords, getSearchData, getAttrsData} from "../../../api/search";
import Vue from 'vue';

export default {
    namespaced: true,
    state: {
        historyKeywords: localStorage['historyKeyrords'] ? JSON.parse(localStorage['historyKeyrords']) : [],
        hotKeywords: [],
        minPrice: '',
        maxPrice: '',
        priceData: {
            items: [
                {price1: 1, price2: 50, active: false},
                {price1: 51, price2: 99, active: false},
                {price1: 100, price2: 300, active: false},
                {price1: 301, price2: 1000, active: false},
                {price1: 10001, price2: 4000, active: false},
                {price1: 4001, price2: 9999, active: false}
            ]
        },
        attrs: [],
        searchData: [],
        cid: '',
        params: [],
        total: 0,
    },
    mutations: {
        //设置关键词
        ['SET_KEYWORDS'](state, payload) {
            state.historyKeywords = payload.historyKeywords;
            localStorage['historyKeyrords'] = JSON.stringify(state.historyKeywords);
        },
        //清楚搜索历史记录
        ['CLEAR_KWYEORDS'](state) {
            state.historyKeywords = [];
            localStorage.removeItem('historyKeyrords');
        },
        //设置热门搜索关键词
        ['SET_HOTKEYWORDS'](state, payload) {
            state.hotKeywords = payload.hotKeywords
        },
        //选择价格
        ['SELECT_PRICE'](state, payload) {
            for (let i = 0; i < state.priceData.items.length; i++) {
                if (i !== payload.index) {
                    if (state.priceData.items[i].active) {
                        state.priceData.items[i].active = false;
                        break;
                    }
                }
            }
            state.priceData.items[payload.index].active = !state.priceData.items[payload.index].active;
            var a = state.priceData.items[payload.index].active;
            Vue.set(state.priceData.items, payload.index, state.priceData.items[payload.index]);
            state.minPrice = a ? state.priceData.items[payload.index].price1 : '';
            state.maxPrice = a ? state.priceData.items[payload.index].price2 : '';
        },
        //设置最小价格
        ['SET_MINPRICE'](state, payload) {
            state.minPrice = payload.minPrice;
            state.minPrice = state.minPrice.replace(/[^\d|\.]/g, '');
            console.log(state.minPrice);
        },
        //设置最大价格
        ['SET_MAXPRICE'](state, payload) {
            state.maxPrice = payload.maxPrice;
            state.maxPrice = state.maxPrice.replace(/[^\d|\.]/g, '');
            console.log(state.maxPrice);
        },
        //显示隐藏属性
        ['HIDE_ADDRS'](state, payload) {
            state.attrs[payload.index].isHide = !state.attrs[payload.index].isHide;
            Vue.set(state.attrs, payload.index, state.attrs[payload.index]);
        },
        //选择属性
        ['SELECT_ATTR'](state, payload) {
            //多选
            state.attrs[payload.index].param[payload.index2].active = !state.attrs[payload.index].param[payload.index2].active;
            Vue.set(state.attrs[payload.index].param, payload.index2, state.attrs[payload.index].param[payload.index2]);
        },
        //获取搜索结果
        ['SET_SEARCH_DATA'](state, payload) {
            state.searchData = payload.searchData;
            state.total = payload.total;
        },
        //增加分页数据
        ['SET_SEARCH_DATA_PAGE'](state, payload) {
            if (payload.searchData.length > 0) {
                for (let i = 0; i < payload.searchData.length; i++) {
                    state.searchData.push(payload.searchData[i]);
                    Vue.set(state.searchData, i, state.searchData[i]);
                }
            }
        },
        //设置商品分类的cid
        ['SET_CID'](state, payload) {
            state.cid = payload.cid;
        },
        //设置商品的属性
        ['SET_ATTRS'](state, payload) {
            state.attrs = payload.attrs;
        },
        //设置属性的值
        ['SET_PARAMS'](state) {
            if (state.attrs.length > 0) {
                state.params = [];
                for (let i = 0; i < state.attrs.length; i++) {
                    for (let j = 0; j < state.attrs[i].param.length; j++) {
                        if (state.attrs[i].param[j].active) {
                            state.params.push(state.attrs[i].param[j].pid);
                        }
                    }
                }
            }
        },
        //清除筛选
        ['RESET_SEARCH'](state) {
            //重置分类
            state.cid = '';

            //重置价格
            if(state.priceData.items.length>0){
                for (let i = 0; i < state.priceData.items.length; i++) {
                    if (state.priceData.items[i].active) {
                        state.priceData.items[i].active = false;
                        break;
                    }
                }
            }
            state.minPrice = '';
            state.maxPrice = '';

            //重置属性
            if(state.attrs.length>0){
                for (let i = 0; i < state.attrs.length; i++) {
                    for (let j = 0; j < state.attrs[i].param.length; j++) {
                        if(state.attrs[i].param[j].active){
                            state.attrs[i].param[j].active = false;
                            Vue.set(state.attrs[i].param,j,state.attrs[i].param[j])
                        }
                    }
                }
            }
            state.params = [];
        }
    }

    ,
    actions: {
        getHotKeywordsData(conText) {
            getHotKeywords().then((res) => {
                if (res.code === 200) {
                    conText.commit("SET_HOTKEYWORDS", {"hotKeywords": res.data})
                }
            })
        },
        //选择分类
        selectClassify(conText, payload) {
            for (let i = 0; i < conText.rootState.goods.classify.length; i++) {
                if (i !== payload.index) {
                    if (conText.rootState.goods.classify[i].active) {
                        conText.rootState.goods.classify[i].active = false;
                        break;
                    }
                }
            }
            conText.rootState.goods.classify[payload.index].active = !conText.rootState.goods.classify[payload.index].active;
            Vue.set(conText.rootState.goods.classify, payload.index, conText.rootState.goods.classify[payload.index]);
            if (conText.rootState.goods.classify[payload.index].active) {
                conText.commit('SET_CID', {cid: conText.rootState.goods.classify[payload.index].cid});
            }
            else {
                conText.commit('SET_CID', {cid: ''});
            }
        },
        //获取商品搜索结果
        getSearch(conText, payload) {
            getSearchData(payload).then(res => {
                let pageNum = 0;
                if (res.code === 200) {
                    conText.commit('SET_SEARCH_DATA', {searchData: res.data, total: res.pageinfo.total});
                    pageNum = res.pageinfo.pagenum;
                }
                else {
                    conText.commit('SET_SEARCH_DATA', {searchData: [], total: 0});
                    pageNum = 0;
                }
                if (payload.success) {
                    payload.success(pageNum);
                }
            })
        },
        //按页获取搜素结果
        getSearchPage(conText, payload) {
            getSearchData(payload).then(res => {
                if (res.code === 200) {
                    conText.commit('SET_SEARCH_DATA_PAGE', {searchData: res.data});
                }
            })
        },
        //获取商品属性
        getAttrs(conText, payload) {
            getAttrsData(payload.keyword).then((res) => {
                if (res.code === 200) {
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].isHide = false;
                        for (let j = 0; j < res.data[i].length; j++) {
                            res.data[i].param[j].active = false;
                        }
                    }
                    conText.commit('SET_ATTRS', {attrs: res.data});
                    if (payload.success) {
                        payload.success();
                    }
                }
                else {
                    conText.commit('SET_ATTRS', {attrs: []});
                }
            })
        },
        //筛选面板重置
        resetSearch(conText, payload) {
            //重置分类
            for (let i = 0; i < conText.rootState.goods.classify.length; i++) {
                if (conText.rootState.goods.classify[i].active) {
                    conText.rootState.goods.classify[i].active = false;
                    break;
                }
            }
            conText.commit("RESET_SEARCH");
        }
    }
}