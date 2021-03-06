import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let router=new Router({
    mode:"hash",//1、hash哈希：有#号。2、history历史：没有#号
    base:process.env.BASE_URL, //自动获取根目录路径
    scrollBehavior:(to,from,position)=>{
        if(position){
            return position
        }else{
            return {x:0,y:0}
        }
    },
    routes:[
        {
            path:"/",
            name:"main",
            component:()=>import("./pages/home/main"),//路由懒加载解决首屏加载慢，性能优化
            meta:{keepAlive:false},
            //重定向
            redirect:"/index",
            children:[
                {
                    path:"index",
                    name:"index",
                    component:()=>import("./pages/home/index"),
                    meta:{keepAlive:true,title:"首页"},
                },
                {
                    path:"cart",
                    name:"cart",
                    component:()=>import("./pages/home/cart"),
                    meta:{keepAlive:false,title:"购物车"},
                },
                {
                    path:"my",
                    name:"my",
                    component:()=>import("./pages/user/ucenter"),
                    meta:{keepAlive:false,title:"我的"},
                }
            ],
        },
        {
            path:"/login",
            name:"login",
            component:()=>import("./pages/home/login"),
            meta:{keepAlive:false,title:'登录'}
        },
        {
            path:"/reg",
            name:"reg",
            component:()=>import("./pages/home/reg"),
            meta:{keepAlive:false}
        },
        {
            path:"/ucenter",
            name:"ucenter",
            component:()=>import("./pages/user/ucenter"),
            meta:{auth:true}
        },
        {
            path:"/classify",
            name:"classify",
            component:()=>import("./pages/home/classify")
        },
        {
            path:"/skip",
            name:"skip",
            component:()=>import("./pages/skip")
        },
        {
            path:"/goods/classify",
            name:"goods-classify",
            component:()=>import("./pages/home/goods/classify"),
            redirect:"/goods/classify/item",
            children:[
                {
                    path:"item",
                    name:"goods-classify-item",
                    component:()=>import("./pages/home/goods/classify_item"),
                    meta:{title:"商品分类"}
                }
            ]
        },
        {
            path:"/goods/search",
            name:"goods-search",
            component:()=>import("./pages/home/goods/search"),
            meta:{title:"商品查找"}
        },
        {
            path:'/goods/details',
            name:'goods-details',
            component:()=>import('./pages/home/goods/details'),
            redirect:'/goods/details/item',
            children:[
                {
                    path:'content',
                    name:'details-content',
                    component:()=>import('./pages/home/goods/details_content')
                },
                {
                    path:'item',
                    name:'details-item',
                    component:()=>import('./pages/home/goods/details_item')
                },
                {
                    path:'review',
                    name:"details-review",
                    component:()=>import('./pages/home/goods/details_review')
                }
            ]
        },
        {
            path:"/order",
            name:"order",
            component:()=>import("./pages/home/order"),
            meta:{auth:true,title:"确认订单"}
        },
        {
            path:"/address/index",
            name:"address",
            component:()=>import("./pages/home/address/index"),
            meta:{auth:true,title:"选择收货地址"}
        },
        {
            path:"/address/add",
            name:"address-add",
            component:()=>import("./pages/home/address/add"),
            meta:{auth:true,title:"增加收货地址"}
        },
        {
            path:"/address/mod",
            name:"address-mod",
            component:()=>import("./pages/home/address/mod"),
            meta:{auth:true,title:"修改收货地址"}
        },
        {
            path:"/balance/end",
            name:"balance-end",
            component:()=>import("./pages/home/balance/end"),
            meta:{auth:true}
        },
        {
            path:"/user/order",
            name:"user-order",
            component:()=>import("./pages/user/order"),
            meta:{auth:true},
            redirect:"/user/order/list",
            children:[
                {
                    path:'list',
                    name:'order-list',
                    component:()=>import("./pages/user/order/list"),
                    meta:{auth:true},
                },
                {
                    path:'review',
                    name:'order-review',
                    component:()=>import("./pages/user/order/review"),
                    meta:{auth:true},
                }
            ]
        },
        {
            path:"/user/order/details",
            name:"user-order-details",
            component:()=>import("./pages/user/order/details"),
            meta:{auth:true,title:'订单详情'},
        },
        {
            path:"/user/order/add_review",
            name:"user-order-addreview",
            component:()=>import("./pages/user/order/add_review"),
            meta:{auth:true,title:'评价'},
        },
        {
            path:"/user/profile",
            name:"user-profile",
            component:()=>import("./pages/user/profile"),
            meta:{auth:true,title:'个人资料'},
        },
        {
            path:"/user/address",
            name:"user-address",
            component:()=>import("./pages/user/address"),
            meta:{auth:true,title:'收货地址'},
        },
        {
            path:"/user/bind_cellphone",
            name:"bind-cellphone",
            component:()=>import("./pages/user/bind_cellphone"),
            meta:{auth:true,title:'绑定手机'},
        },
        {
            path:"/user/mod_password",
            name:"mod-password",
            component:()=>import("./pages/user/mod_password"),
            meta:{auth:true,title:'修改密码'},
        },
        {
            path:"/user/fav",
            name:"fav",
            component:()=>import("./pages/user/fav"),
            meta:{auth:true,title:'我的收藏'},
        },
        {
            path:"/test",
            name:"test",
            component:()=>import("./pages/test/index")
        }
    ]
});
router.beforeEach((to,from,next)=>{
    if (to.meta.auth){
        if (Boolean(localStorage['isLogin'])){
            next();
        } else {
            next("/login");
        }
    } else {
        next();
    }
});
export default router;