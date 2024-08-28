import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let router=new Router({
    mode:"history",//1、hash哈希：有#号。2、history历史：没有#号
    base:process.env.BASE_URL, //自动获取根目录路径
    routes:[
        {
            path:"/",
            name:"index",
            component:()=>import("./pages/index")
        }
    ]
});
export default router;