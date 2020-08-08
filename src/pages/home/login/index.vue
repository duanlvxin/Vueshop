<template>
    <div class="page">
        <sub-header title="会员登录"></sub-header>
        <div class="main">
            <div class="input-wrap">
                <input type="tel" placeholder="手机号" v-model="cellphone">
            </div>
            <div class="input-wrap">
                <div class="input-area">
                    <input :type="checked?'text':'password'" placeholder="密码" v-model="password">
                    <div class="switch">
                        <van-switch v-model="checked"  active-color="#eb1625" inactive-color="#ffffff"/>
                    </div>
                </div>
            </div>
            <button type="button" @click="doLogin()">登录</button>
            <div class="fastreg-wrap">
                <div class="forget-passwd-wrap">
                    <div class="passwd-icon"><img src="../../../assets/images/home/index/forget.png"></div>
                    <div class="text">忘记密码</div>
                </div>
                <div class="fastreg">
                    <div class="fastreg-icon"><img src="../../../assets/images/home/index/reg.png"></div>
                    <div class="text" @click="$router.push('/reg')">快速注册</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import subHeader from '../../../components/sub-header';
    import {mapActions} from "vuex";
    import Vue from 'vue';
    import { Switch,Toast } from 'vant';

    Vue.use(Switch);
    Vue.use(Toast);
    export default {
        name: "login",
        data(){
            return {
                cellphone:"",
                password:"",
                checked: true,
            }
        },
        created(){
            document.title = this.$route.meta.title;
        },
        components:{
            subHeader
        },
        methods:{
            ...mapActions({
                login:"user/login"
            }),
            doLogin(){
                if (this.cellphone.match(/^\s*$/)){
                    Toast("请输入手机号");
                    return;
                }
                if(!this.cellphone.match(/^1[0-9][0-9]\d{8}$/)){
                    Toast("您输入的手机号不正确");
                    return;
                }
                if (this.password.match(/^\s*$/)){
                    Toast("请输入密码");
                    return;
                }
                this.login({cellphone: this.cellphone,password: this.password,success:(res)=>{
                    if(res.code===200){
                        if(this.$route.query.from==='reg'){
                            this.$router.go(-3);
                        }
                        else{
                            this.$router.go(-1);
                        }
                    }
                    else{
                        Toast(res.data);
                    }
                }});
            }
        }
    }
</script>

<style scoped>
    .page{width:100%;height:100vh;background-color: white;}
    .page .main{width:100vw;height:auto;padding-top: 1rem;overflow-x: hidden;}
    .page .main .input-wrap{width:100%;height:0.88rem;padding-top: 0.5rem;}
    .page .main .input-wrap input{width:90%;height:100%;margin: 0 5%;padding-left: 0.2rem;border: 1px solid #efefef;}
    .page .main .input-wrap .input-area{width:90%;height:100%;margin: 0 5%;border: 1px solid #efefef;display: flex;}
    .page .main .input-wrap .input-area input{width:80%;height: 100%;margin-left: 0;border-left:rgba(255,255,255,0);
        border-right:rgba(255,255,255,0);}
    .page .main .input-wrap  .input-area .switch{width:auto;height:100%;margin: 0.12rem 0.2rem;}
    .page .main button{width:6.36rem;height:0.8rem;background-color: #eb1625;font-size: 0.36rem;color:white;
    margin: 0.4rem 0.56rem;border-radius: 0.1rem;}
    .page .main .fastreg-wrap{width:100%;height:0.36rem;display: flex;justify-content: space-between;}
    .page .main .fastreg-wrap .forget-passwd-wrap{margin-left: 0.5rem;line-height: 0.36rem;font-size: 0.24rem;display: flex;}
    .page .main .fastreg-wrap .forget-passwd-wrap .passwd-icon{width:0.32rem;height: 0.32rem;}
    .page .main .fastreg-wrap .forget-passwd-wrap .passwd-icon img{width: 100%;height:100%;}
    .page .main .fastreg-wrap .fastreg-passed-wrap .text{line-height: 0.36rem;font-size: 0.24rem;}
    .page .main .fastreg-wrap .fastreg{margin-right: 0.5rem;display: flex;}
    .page .main .fastreg-wrap .fastreg .text{line-height: 0.36rem;font-size: 0.24rem;}
    .page .main .fastreg-wrap .fastreg .fastreg-icon{width:0.32rem;height: 0.32rem;}
    .page .main .fastreg-wrap .fastreg .fastreg-icon img{width: 100%;height:100%;}
</style>