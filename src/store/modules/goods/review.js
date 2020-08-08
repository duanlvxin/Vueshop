import {getReviewData} from "../../../api/review";

export default {
    namespaced:true,
    state:{
        review:[],
        total:0,
    },
    mutations:{
      ['SET_REVIEW'](state,payload){
          state.review = payload.review;
          state.total = payload.total;
      },
        ['SET_REVIEW_PAGE'](state,payload){
            state.review.push(...payload.review);
        }
    },
    actions: {
        getReview(conText, payload) {
            getReviewData(payload.gid).then(res => {
                let pageNum = 0;
                if(res.code===200){
                    conText.commit('SET_REVIEW',{review:res.data,total:res.pageinfo.total});
                    pageNum = res.pageinfo.pagenum;
                }
                else{
                    conText.commit('SET_REVIEW',{review:[],total:0})
                }
                if(payload.success){
                    payload.success(pageNum);
                }
            })
        },
        getReviewPage(conText,payload){
            getReviewData(payload.gid, payload.page).then(res => {
                if(res.code===200){
                    conText.commit('SET_REVIEW_PAGE',{review:res.data});
                }
            })
        }
    }
}
