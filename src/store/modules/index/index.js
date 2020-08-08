import {getNavsData,getSwiperData,getGoodsData,getRecomData} from "../../../api/index";

export default {
    namespaced:true,
    state:{
        navs:[],
        swiperData:[],
        goods:[],
        recom:[],
    },
    mutations:{
        ["SET_NAVS"](state,payload){
            state.navs=payload.navs;
            // console.log(state.navs);
        },
        ["SET_SWIPER"](state,payload){
            state.swiperData=payload.swiper;
        },
        ['SET_GOODS'](state,payload){
            state.goods=payload.goods;
        },
        ['SET_RECOM'](state,payload){
            state.recom=payload.recom;
        }
    },
    actions:{
        getNavs(conText,payload){
            getNavsData().then(res=>{
                if (res.code===200){
                    conText.commit("SET_NAVS",{navs:res.data});
                    if(payload.success) {
                        payload.success();
                    }
                }
            })
        },
        getSwiper(conText,payload){
            getSwiperData().then(res=>{
                console.log(res);
                if (res.code===200){
                    conText.commit("SET_SWIPER",{swiper:res.data});
                    if(payload.success)
                    {
                        payload.success();
                    }
                }
            })
        },
        getGoods(conText,payload){
            getGoodsData().then(res=>{
                if(res.code===200){
                    conText.commit("SET_GOODS",{goods:res.data});
                    if(payload.success)
                    {
                        payload.success();
                    }
                }
            })
        },
        getRecom(conText,payload){
            getRecomData().then(res=>{
                if(res.code===200){
                    console.log(res.data);
                    conText.commit("SET_RECOM",{recom:res.data});
                    if(payload.success)
                    {
                        payload.success();
                    }
                }
            })
        }
    }
}