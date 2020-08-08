import {addOrderData,getLastOrdernumData,getMyOrderData,getMyOrderPageData
,cancelOrderData,sureOrderData,orderDetailsData,orderReviewData,postReviewService,
    getReviewService} from "../../../api/order";

export default ({
    namespaced:true,
    state:{
        ordernum:'',
        orders:[],
        reviewOrders:[],
        reviewService:[]
    },
    mutations:{
        ['SET_ORDERNUM'](state,payload){
            state.ordernum = payload.ordernum;
        },
        //获取我的订单
        ['SET_MYORDER'](state,payload){
            state.orders = payload.orders;
        },
        //我的订单分页
        ['SET_MYORDER_PAGE'](state,payload){
            state.orders.push(...payload.orders);
        },
        //删除订单
        ['DELETE_ORDER'](state,payload){
            state.orders.splice(payload.index,1);
        },
        //改变订单状态
        ['CHANGE_STATUS'](state,payload){
            state.orders[payload.index].status = payload.status;
        },
        //待评价订单
        ['SET_REVIEW_ORDERS'](state,payload){
            state.reviewOrders = payload.reviewOrders;
        },
        //待评价订单分页
        ['SET_REVIEW_ORDERS_PAGE'](state,payload){
            state.reviewOrders.push(...payload.reviewOrders);
        },
        //设置评价服务选项
        ['SET_REVIEW_SERVICE'](state,payload){
            state.reviewService = payload.reviewService;
        },
        //设置评价分数
        ['SET_REVIEW_SCORE'](state,payload){
            state.reviewService[payload.index].score = payload.score;
            for(let i=0;i<=payload.index2;i++){
                state.reviewService[payload.index].scores[i].active = true;
            }
            for(let i=payload.index2+1;i<5;i++){
                state.reviewService[payload.index].scores[i].active = false;
            }
        }
    },
    actions:{
        //提交订单
        addOrder(conText,payload){
            addOrderData({uid:conText.rootState.user.uid,...payload}).then((res)=>{
                if(res.code===200){
                    if(payload.success){
                        payload.success();
                    }
                }
            })
        },
        //获取最后的订单编号
        getLastOrdernum(conText){
            getLastOrdernumData(conText.rootState.user.uid).then((res)=>{
                if(res.code===200){
                    conText.commit("SET_ORDERNUM",{'ordernum':res.data.ordernum})
                }
            })
        },
        //我的订单
        getMyOrder(conText,payload){
            getMyOrderData({uid:conText.rootState.user.uid,...payload}).then((res)=>{
                let pagenum = 0;
                if(res.code===200){
                    pagenum = res.pageinfo.pagenum;
                    conText.commit('SET_MYORDER',{orders:res.data});
                }
                else{
                    pagenum = 0;
                    conText.commit('SET_MYORDER',{orders:[]});
                }
                if(payload.success){
                    payload.success(pagenum);
                }
            })
        },
        //我的订单页面
        getMyOrderPage(conText,payload){
            getMyOrderPageData({uid:conText.rootState.user.uid,...payload}).then((res)=>{
                if(res.code===200){
                    conText.commit('SET_MYORDER_PAGE',{orders:res.data});
                }
            })
        },
        //取消订单
        cancelOrder(conText,payload){
            cancelOrderData({uid:conText.rootState.user.uid,...payload}).then((res)=>{
                if(res.code===200){
                    conText.commit('DELETE_ORDER',{index:payload.index});
                    if(payload.success){
                        payload.success();
                    }
                }
            })
        },
        //确认收货
        sureOrder(conText,payload){
            sureOrderData({uid:conText.rootState.user.uid,...payload}).then((res)=>{
                console.log(res);
                if(res.code===200){
                    conText.commit('CHANGE_STATUS',{status:'2'});
                }
            })
        },
        //订单详情
        orderDetails(conText,payload){
            return orderDetailsData({uid:conText.rootState.user.uid,...payload}).then((res)=>{
                if(res.code===200){
                    return res.data;
                }
            })
        },
        //待评价订单
        orderReview(conText,payload){
           orderReviewData(({uid:conText.rootState.user.uid,page:payload.page})).then((res)=>{
                if(res.code===200){
                    conText.commit('SET_REVIEW_ORDERS',{reviewOrders:res.data});
                    if(payload.success){
                        payload.success(res.pageinfo.pagenum);
                    }
                }
            })
        },
        //待评价订单分页
        orderReviewPage(conText,payload){
            orderReviewData(({uid:conText.rootState.user.uid,page:payload.page})).then((res)=>{
                if(res.code===200){
                    conText.commit('SET_REVIEW_ORDERS_PAGE',{reviewOrders:res.data});
                }
            })
        },
        //评价项目选项
        getReview(conText){
            getReviewService().then((res)=>{
                if(res.code===200){
                    for(let i=0;i<res.data.length;i++){
                        res.data[i].score = 5;
                        res.data[i].scores = [
                            {
                                value:1,
                                active:true,
                            },
                            {
                                value:2,
                                active:true,
                            },
                            {
                                value:3,
                                active:true,
                            },
                            {
                                value:4,
                                active:true,
                            },
                            {
                                value:5,
                                active:true,
                            },
                        ]
                    }
                    conText.commit('SET_REVIEW_SERVICE',{'reviewService':res.data});
                }
            })
        },
        //提交商品评价
        postReview(conText,payload){
            postReviewService({uid:conText.rootState.user.uid,...payload.data}).then((res)=>{
                if(res.code===200){
                    if(payload.success){
                        payload.success(res);
                    }
                }
            })
        }
    }
})