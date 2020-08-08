<template>
    <div class="page">
        <sub-header title="会员中心" :isBack="false"></sub-header>
        <div class="user-info-wrap">
            <div class="user-info-header"></div>
            <div class="content">
                <div class="avater">
                    <img :src="userInfo&&userInfo.head?userInfo.head:require('../../../assets/images/user/my/default-head.png')">
                </div>
                <div class="user-info">
                    <div class="nickname">{{userInfo&&userInfo.nickname?userInfo.nickname:'昵称'}}</div>
                    <div class="points">我的积分：{{userInfo&&userInfo.points?userInfo.points:0}}</div>
                </div>
            </div>
        </div>
        <div class="order-name-wrap">
            <div class="order-all">全部订单</div>
            <div class="see-order-all" @click="$router.push('/user/order')">查看全部订单></div>
        </div>
        <div class="order-status-wrap">
            <div class="item">
                <div class="icon"><img src="../../../assets/images/user/my/pay.png"></div>
                <div class="status">待支付</div>
            </div>
            <div class="item">
                <div class="icon"><img src="../../../assets/images/user/my/shouhuo.png"></div>
                <div class="status">待收货</div>
            </div>
            <div class="item">
                <div class="icon"><img src="../../../assets/images/user/my/comment.png"></div>
                <div class="status">待评价</div>
            </div>
        </div>
        <div class="menu-wrap">
            <ul @click="$router.push('/user/profile')">
                <li>个人资料</li>
                <li></li>
            </ul>
            <ul @click="$router.push('/user/address')">
                <li>收货地址</li>
                <li></li>
            </ul>
            <ul @click="$router.push('/user/bind_cellphone')">
                <li>绑定手机</li>
                <li></li>
            </ul>
            <ul @click="$router.push('/user/mod_password')">
                <li>修改密码</li>
                <li></li>
            </ul>
            <ul @click="$router.push('/user/fav')">
                <li>我的收藏</li>
                <li></li>
            </ul>
            <div class="btn"><button type="button" @click="isLogin?outLogin():$router.push('/login')">{{isLogin?'安全退出':'登录/注册'}}</button></div>
        </div>
    </div>
</template>

<script>
    import subHeader from "../../../components/sub-header";
    import {mapState,mapActions} from 'vuex';
    import {Dialog} from 'vant';
    export default {
        name: "ucenter",
        data(){
            return {

            }
        },
        components:{
            subHeader
        },
        computed:{
            ...mapState({
                isLogin:(state)=>state.user.isLogin,
                uid:(state)=>state.user.uid,
                userInfo:(state)=>state.user.userInfo,
            })
        },
        methods:{
            ...mapActions({
                safeOutLogin:"user/outLogin",
                getUserInfo:"user/getUserInfo"
            }),
          outLogin(){
              Dialog.confirm({
                  title: '',
                  message: '确认要退出吗',
              })
                  .then(() => {
                      // on confirm
                      this.safeOutLogin();
                  })
                  .catch(() => {
                      // on cancel
                  });
          }
        },
        created(){
            this.getUserInfo({uid:this.uid})
        }
    }
</script>

<style scoped>
    .page{width:100%;height:auto;}
    .page .user-info-wrap{width:100%;height:2.8rem;position:relative;z-index:0;background-image: url("../../../assets/images/user/my/mybg.png");background-position: center;background-size: 100%;background-repeat: no-repeat;
    margin-top: 1rem;}
    .page .user-info-wrap .user-info-header{width:100%;height:0.4rem;background:linear-gradient(rgba(1,1,1,0.2),hsla(0,0%,100%,0));}
    .page .user-info-wrap .content{width:100%;height:1.5rem;display: flex;align-items:center;position:absolute;bottom:10%;}
    .page .user-info-wrap .content .avater{width:1.2rem;height: 1.2rem;margin-left: 0.4rem;}
    .page .user-info-wrap .content .avater img{width:100%;height:100%;border-radius: 100%;}
    .page .user-info-wrap .content .user-info{width:auto;height:auto;margin-left: 0.4rem;margin-bottom:0.05rem;font-size:0.24rem;
    color:white;}
    .page .user-info-wrap .content .user-info .points{margin-top: 0.1rem;}
    .page .order-name-wrap{width:100%;height:0.8rem;display: flex;justify-content: space-between;background-color: white;}
    .page .order-name-wrap .order-all{width:auto;height: 100%;line-height: 0.8rem;font-size: 0.28rem;margin-left: 0.2rem;
    text-align: center;}
    .page .order-name-wrap .see-order-all{width:auto;height: 100%;line-height: 0.8rem;font-size: 0.24rem;margin-right: 0.2rem;
        text-align: center;}
    .page .order-status-wrap{width:100%;height: 1.4rem;padding-left: 10%;padding-right: 10%;background-color: white;
    display: flex;justify-content: space-between;box-sizing: border-box;}
    .page .order-status-wrap .item{width:1rem;height:0.82rem;align-items: center;margin: auto 0;}
    .page .order-status-wrap .item .icon{width:0.5rem;height: 0.5rem;margin:0 auto;}
    .page .order-status-wrap .item .icon img{width:100%;height: 100%;}
    .page .order-status-wrap .item .status{width:auto;font-size:0.24rem;text-align: center;}
    .page .menu-wrap{width:100%;height:7rem;background-color: white;margin-top: 0.2rem;}
    .page .menu-wrap ul{width:100%;height:0.8rem;display: flex;justify-content: space-between;align-items: center;
        padding-left: 0.75rem;padding-right:0.22rem;box-sizing: border-box;}
    .page .menu-wrap ul li:nth-child(1){font-size:0.32rem;line-height: 0.8rem;}
    .page .menu-wrap ul li:nth-child(2){width:0.4rem;height: 0.4rem;background-image: url("../../../assets/images/common/right_arrow.png");background-repeat: no-repeat;background-position: center;background-size: 100%;}
    .page .menu-wrap .btn{width:100%;height:1.2rem;}
    .page .menu-wrap .btn button{width:70%;height:0.8rem;margin:0.4rem 1.12rem 0;background-color: #e51b19;font-size:0.32rem;color:white;text-align: center;line-height: 0.8rem;border-radius: 0.1rem;}
</style>