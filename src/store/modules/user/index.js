import {loginData,safeUserData,safeOutLoginData,checkVcodeData,isRegData,regUserData,getUserInfoData,
    uploadAvaterService,updateUserInfoData,updateCellphoneData,updatePasswordData,getUserCollectionData,delCollectionData} from "../../../api/user";
import config from "../../../assets/js/conf/config";
let modules={
    namespaced:true,
    state:{
        users:[
            {name:"张三",age:8},
            {name:"李四",age:18},
            {name:"王五",age:28},
            {name:"赵六",age:38}
        ],
        uid:localStorage['uid']?localStorage['uid']:"",
        nickname:localStorage['nickname']?localStorage['nickname']:"",
        isLogin:localStorage['isLogin']?Boolean(localStorage['isLogin']):false,
        authToken:localStorage["authToken"]?localStorage["authToken"]:"",
        userInfo:localStorage["userInfo"]?JSON.parse(localStorage["userInfo"]):{},
        collections:[]
    },
    getters:{//有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数
        getUsers(state){
            // console.log(state);
            let aUser=state.users.filter((item)=>{
                return item.age>=18
            })
            // console.log(aUser);
            return aUser;
        }
    },
    mutations:{
        ["SET_LOGIN"](state,payload){
            state.uid=payload.uid;
            state.nickname=payload.nickname;
            state.isLogin=payload.isLogin;
            state.authToken=payload.authToken;
            localStorage["uid"]=payload.uid;
            localStorage['nickname']=payload.nickname;
            localStorage['isLogin']=payload.isLogin;
            localStorage["authToken"]=payload.authToken;
        },
        ["OUT_LOGIN"](state){
            state.uid="";
            state.nickname="";
            state.isLogin=false;
            state.authToken="";
            state.userInfo = {};
            localStorage.removeItem("uid");
            localStorage.removeItem("nickname");
            localStorage.removeItem("isLogin");
            localStorage.removeItem("authToken");
            localStorage.removeItem("cartData");
            localStorage.removeItem('userInfo');
        },
        //获取用户信息
        ['SET_USERINFO'](state,payload){
            state.userInfo = payload.userInfo;
            localStorage['userInfo'] = JSON.stringify(state.userInfo);
        },
        //获取用户的收藏
        ['SET_COLLECTIONS'](state,payload){
            state.collections = payload.collections;
        },
        //分页获取用户收藏
        ["SET_COLLECTIONS_PAGE"](state,payload){
            state.collections.push(...payload.collections);
        },
        //删除收藏
        ['DELETE_COLLECTION'](state,payload){
            state.collections.splice(payload.index,1)
        }
    },
    actions:{
        //会员登录
        login(conText,payload){
            loginData(payload).then(res=>{
                if (res.code===200){
                    conText.commit("SET_LOGIN",{uid:res.data.uid,nickname:res.data.nickname,isLogin:true,authToken:res.data.auth_token});
                }
                if (payload.success) {
                    payload.success(res)
                }
            })
        },
        //安全退出
        outLogin(conText){
            safeOutLoginData({uid:conText.state.uid}).then(res=>{
                // console.log(res);
            });
            console.log(conText);
            conText.rootState.cart.cartData=[];
            conText.commit("OUT_LOGIN");
        },
        //会员安全认证
        safeUser(conText,payload){
            // console.log(conText.state.uid);
            safeUserData({uid:conText.state.uid,auth_token:conText.state.authToken}).then(res=>{
                if (res.code!==200){
                    conText.commit("OUT_LOGIN");
                }
                if (payload.success){
                    payload.success(res)
                }
            });
        },
        //检测图文验证码
       checkVcode(conText,payload){
            return checkVcodeData(payload.vcode).then(res=>{
                return res;
            })
        },
        //是否注册会员
        isReg(conText,payload){
            return isRegData(payload.username).then(res=>{
                return res;
            })
        },
        //注册会员
        regUser(conText,payload){
            regUserData(payload.data).then(res=>{
                if(payload.success){
                    payload.success(res);
                }
            })
        },
        //获取会员信息
        getUserInfo(conText,payload){
            getUserInfoData(payload.uid).then(res=>{
                if(res.code===200){
                    conText.commit("SET_USERINFO",{userInfo:res.data});
                    if(payload.success){
                        payload.success(res.data);
                    }
                }
            })
        },
        //上传头像
        uploadAvater(conText,payload){
            uploadAvaterService(payload.headfile).then(res=>{
                if(res.code===200){
                    if(payload.success){
                        payload.success(res.data);
                    }
                }
            })
        },
        //修改会员信息
        updateUserInfo(conText,payload){
            updateUserInfoData({uid:conText.state.uid,...payload}).then((res)=>{
                if(payload.success){
                    payload.success(res);
                }
            })
        },
        //修改手机号
        updateCellphone(conText,payload){
            updateCellphoneData({uid:conText.state.uid,...payload}).then((res)=>{
                console.log(res);
                if(payload.success){
                    payload.success(res);
                }
            })
        },
        //修改密码
        updatePassword(conText,payload){
            updatePasswordData({uid:conText.state.uid,password:payload.password}).then((res)=>{
                if(payload.success){
                    payload.success(res);
                }
            })
        },
        //我的收藏
        getUserCollection(conText,payload){
            getUserCollectionData({uid:conText.state.uid,page:payload.page}).then((res)=>{
                let pagenum = 0;
                if(res.code===200){
                    conText.commit("SET_COLLECTIONS",{collections:res.data});
                    pagenum = res.pageinfo.pagenum;
                }
                else{
                    pagenum = 0;
                    conText.commit("SET_COLLECTIONS",{collections:[]});
                }
                if(payload.success){
                    payload.success(pagenum);
                }
            })
        },
        //我的收藏分页
        getUserCollectionPage(conText,payload){
            getUserCollectionData({uid:conText.state.uid,page:payload.page}).then((res)=>{
                if(res.code===200){
                    conText.commit("SET_COLLECTIONS_PAGE",{collections:res.data});
                }
                if(payload.success){
                    payload.success();
                }
            })
        },
        //删除收藏
        deleteCollection(conText,payload){
            delCollectionData({uid:conText.state.uid,fid:payload.fid}).then((res)=>{
                if(res.code===200){
                    conText.commit('DELETE_COLLECTION',{index:payload.index});
                    if(payload.success){
                        payload.success();
                    }
                }
            })
        }
    }
}
export default modules;