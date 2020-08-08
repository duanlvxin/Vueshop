import Vue from 'vue';
import {getClassifyData, getGoodsItems,getDetailsData,getSpecData,getCollectionData} from "../../../api/goods";

export default {
    namespaced: true,
    state: {
        classify: [],
        items: [],
        spec:[],
        details:[],
    },
    mutations: {
        ['SET_CLASSIFY'](state, payload) {
            state.classify = payload.classify;
        },
        ['SELECT_ITEM'](state, payload) {
            for (let i = 0; i < state.classify.length; i++) {
                if (state.classify[i].active === true) {
                    state.classify[i].active = false;
                    Vue.set(state.classify, i, state.classify[i]);
                    break;
                }
            }
            state.classify[payload.index].active = true;
            Vue.set(state.classify, payload.index, state.classify[payload.index]);
        },
        ['SET_ITEMS'](state, payload) {
            state.items = payload.items;
        },
        ['SET_ATTRS'](state, payload) {
            if (state.spec[payload.index].values.length > 0) {
                for (let i = 0; i < state.spec[payload.index].values.length; i++) {
                    if (state.spec[payload.index].values[i].active === true) {
                        state.spec[payload.index].values[i].active = false;
                        Vue.set(state.spec[payload.index].values, i, state.spec[payload.index].values[i]);
                        break;
                    }
                }
            }
            state.spec[payload.index].values[payload.index2].active = !state.spec[payload.index].values[payload.index2].active;
            Vue.set(state.spec[payload.index].values, payload.index2, state.spec[payload.index].values[payload.index2]);
        },
        ['SET_DETAILS'](state,payload){
            state.details = payload.details;
        },
        ['SET_SPEC'](state, payload){
            state.spec = payload.spec;
        },
    },
    actions: {
        getClassify(conText, payload) {
            getClassifyData().then(res => {
                if (res.code === 200) {
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].active = false;
                    }
                    conText.commit("SET_CLASSIFY", {'classify': res.data})
                }
                if (payload && payload.success) {
                    payload.success();
                }
            })
        },
        getGoodsItems(conText, payload) {
            getGoodsItems(payload.cid).then(res => {
                if (res.code === 200) {
                    conText.commit("SET_ITEMS", {'items': res.data})
                }
                else {
                    conText.commit("SET_ITEMS", {'items': []})
                }
                if (payload.success) {
                    payload.success();
                }
            })
        },
        //商品详情
        getDetails(conText, payload){
            getDetailsData(payload.gid).then(res=>{
                if(res.code===200){
                    conText.commit('SET_DETAILS',{'details':res.data});
                    if(payload.success){
                        payload.success();
                    }
                }
            })
        },
        //获取商品规格
        getSpec(conText, payload){
            getSpecData(payload.gid).then(res=>{
                if(res.code===200){
                    for(let i=0;i<res.data.length;i++){
                        for(let j=0;j<res.data[i].values.length;j++){
                            res.data[i].values[j].active = false;
                        }
                    }
                    conText.commit('SET_SPEC',{'spec':res.data});
                    if(payload.success){
                        payload.success();
                    }
                }
            })
        },
        //加入收藏
        getCollection(conText,payload){
            getCollectionData({uid:conText.rootState.user.uid,gid:payload.gid}).then((res)=>{
                console.log(res);
                if(payload.success){
                    payload.success(res);
                }
            })
        }

    }
}