import Vue from 'vue';
export default {
    namespaced:true,
    state:{
        cartData:JSON.parse(localStorage.getItem('cartData'))?JSON.parse(localStorage.getItem('cartData')):[],
    },
    mutations:{
        //添加购物车商品
        ['ADD_ITEM'](state,payload){
            let isSame = false;
            if(state.cartData.length>0){
                for(let i=0;i<state.cartData.length;i++){
                    if(payload.cartData.gid===state.cartData[i].gid && (JSON.stringify(state.cartData[i].attrs)===
                    JSON.stringify(payload.cartData.attrs))){
                        isSame = true;
                        state.cartData[i].amount = state.cartData[i].amount + parseInt(payload.cartData.amount);
                        break
                    }
                }
            }
            if(!isSame){
                state.cartData.push(payload.cartData);
            }
            localStorage.setItem('cartData',JSON.stringify(state.cartData));
        },
        ['DELETE_ITEMS'](state,payload){
            state.cartData.splice(payload.index,1);
            localStorage.setItem('cartData',JSON.stringify(state.cartData));
        },
        //更改数量
        ['SET_AMOUNT'](state,payload){
            state.cartData[payload.index].amount = payload.amount;
            state.cartData[payload.index].amount = parseInt(state.cartData[payload.index].amount.replace(/^\d/g,""));
            if(!state.cartData[payload.index].amount || parseInt(state.cartData[payload.index].amount)<0){
                state.cartData[payload.index].amount = 1;
            }
            localStorage.setItem('cartData',JSON.stringify(state.cartData));
        },
        //减少数量
        ['DEC_AMOUNT'](state,payload){
            if(state.cartData[payload.index].amount>1){
                state.cartData[payload.index].amount--;
                localStorage.setItem('cartData',JSON.stringify(state.cartData));
            }
        },
        //增加数量
        ['ADD_AMOUNT'](state,payload){
            state.cartData[payload.index].amount++;
            localStorage.setItem('cartData',JSON.stringify(state.cartData));
        },
        //选择商品
        ['SELECT_ITEM'](state,payload){
            state.cartData[payload.index].checked = !state.cartData[payload.index].checked;
            Vue.set(state.cartData,payload.index,state.cartData[payload.index]);
            localStorage.setItem('cartData',JSON.stringify(state.cartData));
        },
        //全选反选
        ['ALL_SELECT_ITEM'](state,payload){
            if(state.cartData.length>0){
                for(let i=0;i<state.cartData.length;i++){
                    state.cartData[i].checked = payload.isSelectAll;
                    Vue.set(state.cartData,i,state.cartData[i]);
                }
            }
            localStorage.setItem('cartData',JSON.stringify(state.cartData));
        }
    },
    getters:{
        //计算总金额
        total(state){
            if(state.cartData.length>0){
                let total = 0;
                for(let i=0;i<state.cartData.length;i++){
                    if(state.cartData[i].checked){
                        total += state.cartData[i].price*state.cartData[i].amount;
                    }
                }
                return parseFloat(total.toFixed(2));
            }
            else{
                return 0;
            }
        },
        //计算运费
        freight(state){
            if(state.cartData.length>0){
                let freights = {};
                let freight = 0;
                for(let i=0;i<state.cartData.length;i++){
                    if(state.cartData[i].checked){
                        freights[state.cartData[i].gid] = state.cartData[i].freight;
                    }
                }
                for(var key in freights){
                    freight += freights[key];
                }
                return freight;
            }
            else{
                return 0;
            }
        }
    }
}