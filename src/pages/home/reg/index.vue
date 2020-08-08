<template>
    <div class="page">
        <sub-header title="会员注册"></sub-header>
        <div class="content">
            <div class="item-wrap">
                <input class="vcode" type="text" placeholder="验证码" v-model="inputVcode">
                <div class="vcode-img">
                    <img :src="vcode" @click="getVcode">
                </div>
            </div>
            <div class="item-wrap2">
                <input class="tel" type="tel" placeholder="请输入手机号" v-model="inputTel" @input="checkTel($event)">
                <button type="button" :class="{'msg-code':true,active:isSend}" @click="getMsgCode">{{msgCodeText}}</button>
            </div>
            <div class="item-wrap">
                <input class="code" type="password" placeholder="请输入短信验证码" v-model="inputMsgCode">
            </div>
            <div class="item-wrap">
                <input class="passwd" :type="checked?'text':'password'" placeholder="请输入密码" v-model="inputPasswd">
                <div class="switch">
                    <van-switch v-model="checked"  active-color="#eb1625" inactive-color="#ffffff"/>
                </div>
            </div>
            <div class="sure-btn" @click="submit">注册</div>
        </div>
    </div>
</template>

<script>
    import subHeader from "../../../components/sub-header"
    import {Toast,Switch} from 'vant'
    import {mapActions} from 'vuex'
    import Vue from 'vue'

    Vue.use(Switch);
    export default {
        name: "index",
        data(){
            return {
                vcode:this.$config.baseApi + "/vcode/chkcode?token=" + this.$config.token+"&random=" + new Date().getTime(),
                inputVcode:"",
                inputTel:"",
                inputMsgCode:"",
                inputPasswd:"",
                checked:false,
                isSend:false,
                msgCodeText:"获取短信验证码"
            }
        },
        methods:{
            ...mapActions({
               checkVcode:'user/checkVcode',
                isReg:'user/isReg',
                regUser:'user/regUser'
            }),
            //重新获取图片验证码
            getVcode(){
                this.vcode = this.$config.baseApi + "/vcode/chkcode?token=" + this.$config.token +
                        "&random=" + new Date().getTime();
            },
            //注册
            async submit(){
                if(this.inputVcode.match(/^\s*$/)){
                    Toast("请输入图文验证码");
                    return;
                }
                let vcodeData = await this.checkVcode({vcode:this.inputVcode});
                if(vcodeData.code!==200){
                    Toast("您输入的图文验证码不正确");
                    return;
                }
                if(this.inputTel.match(/^\s*$/)){
                    Toast("请输入手机号");
                    return;
                }
                if(!this.inputTel.match(/^1[0-9][0-9]\d{8}$/)){
                    Toast("您输入的手机号格式不正确");
                    return;
                }
                let regData = await this.isReg({username:this.inputTel});
                if(regData.data.isreg==='1'){
                    Toast("该手机号已经注册过了~");
                    return;
                }
                if(this.inputPasswd.match(/^\s*$/)){
                    Toast("请输入密码");
                    return;
                }

                let data={"vcode":this.inputVcode,"cellphone":this.inputTel,"password":this.inputPasswd};
                if(this.isSubmit){
                    this.isSubmit = false;
                    this.regUser({data:data,success:(res)=>{
                            if(res.code===200){
                                Toast("注册成功!");
                                this.$router.push('/login?from=reg');
                            }
                            else{
                                Toast(res.data);
                            }
                    }});
                }
            },
            //获取短信验证码
            async getMsgCode(){
                if(this.isSend){
                    if(this.inputVcode.match(/^\s*$/)){
                        Toast("请输入图文验证码");
                        return;
                    }
                    let vcodeData = await this.checkVcode({vcode:this.inputVcode});
                    if(vcodeData.code!==200){
                        Toast("您输入的图文验证码不正确");
                        return;
                    }
                    if(this.inputTel.match(/^\s*$/)){
                        Toast("请输入手机号");
                        return;
                    }
                    if(!this.inputTel.match(/^1[0-9][0-9]\d{8}$/)){
                        Toast("您输入的手机号格式不正确");
                        return;
                    }
                    let regData = await this.isReg({username:this.inputTel});
                    if(regData.data.isreg==='1'){
                        Toast("该手机号已经注册过了~");
                        return;
                    }
                    this.isSend = false;
                    let time=10;
                    this.msgCodeText = "重新获取("+time+"s)";
                    this.timer = setInterval(()=>{
                        if(time>0){
                            time--;
                            this.msgCodeText = "重新获取("+time+"s)";
                        }
                        else{
                            clearInterval(this.timer);
                            this.msgCodeText="获取短信验证码";
                            this.isSend = true;
                        }
                    },1000)
                }

            },
            //监听telphone
            checkTel(e){
                if(e.target.value.match(/^\s*$/)||!e.target.value.match(/^1[0-9][0-9]\d{8}$/)){
                    this.isSend = false;
                }
                else{
                    this.isSend = true;
                }
            }

        },
        created(){
            this.timer = null;
            this.isSubmit = true;
        },
        beforeDestroy(){
            clearImmediate(this.timer);
        },
        components:{
            subHeader
        }
    }
</script>

<style scoped>
    .page{width:100%;height:100vh;background-color: white;}
    .page .content{padding-top: 1rem;}
    .page .content .item-wrap{width:6.75rem;height:0.84rem;display: flex;align-items: center;border:1px solid #efefef;
    margin:0.4rem auto;}
    .page .content .item-wrap2{width:90.6%;height:0.84rem;margin: 0.4rem auto;}
    .page .content .item-wrap .vcode{width:5.2rem;height:0.7rem;margin-left:0.2rem;border-right: 1px solid #efefef;font-size: 0.32rem;}
    .page .content .item-wrap .vcode-img{width:1.36rem;height:0.48rem;text-align: center;}
    .page .content .item-wrap .vcode-img img{width:80%;height:100%;}
    .page .content .item-wrap2 .tel{width:4.04rem;height:0.73rem;padding-left: 0.2rem;border-right: 1px solid #efefef;font-size:0.32rem;border-radius: 2px;}
    .page .content .item-wrap2 .msg-code{width:2.4rem;height:0.86rem;margin-left: 0.1rem;background-color: #eaeaea;color:#717376;font-size:0.28rem;}
    .page .content .item-wrap2 .msg-code.active{border:1px solid #eb1625;color:#eb1625;background-color:white;}
    .page .content .item-wrap .code{width:95%;height:100%;margin-left: 0.2rem;line-height: 0.84rem;}
    .page .content .item-wrap .passwd{width:5.2rem;height:0.7rem;margin-left:0.2rem;border-right: 1px solid #efefef;font-size: 0.32rem;}
    .page .content .sure-btn{width:85%;height:0.8rem;margin: 0.4rem auto;background-color: #eb1625;color:#fff;font-size: 0.36rem;text-align: center;line-height: 0.8rem;border-radius:0.1rem;}
    .page .content .item-wrap .switch{width:1.24rem;height:0.64rem;margin-right: 0.2rem}
</style>