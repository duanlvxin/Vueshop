<template>
    
    <div class="page">
        <sub-header title="绑定手机"></sub-header>
        <div class="tip-wrap">
            <div class="tip-icon"></div>
            <div class="tip">新手机号验证后，即可绑定成功!</div>
        </div>
        <div class="input-wrap wrap-1">
            <input type="tel" placeholder="绑定手机号" v-model="cellphone" @input="checkTel($event)">
        </div>
        <div class="input-wrap wrap-2">
            <input type="tel" placeholder="请输入短信验证码" v-model="msgCode">
            <div :class="{btn:true,active:isSend}" @click="getMsgCode">{{msgCodeText}}</div>
        </div>
        <div class="sure-btn" @click="submit">下一步</div>
    </div>
</template>

<script>
    import subHeader from '../../../components/sub-header';
    import {Toast} from 'vant';
    import {mapActions} from 'vuex';
    export default {
        name: "index",
        components:{
            subHeader
        },
        data(){
            return {
                cellphone:'',
                msgCodeText:"获取验证码",
                isSend:false,
                isSubmit:true,
                msgCode:''
            }
        },
        methods:{
            ...mapActions({
                isReg:'user/isReg',
                updateCellphone:'user/updateCellphone'
            }),
            //绑定
            async submit(){

                if(this.cellphone.match(/^\s*$/)){
                    Toast("请输入手机号");
                    return;
                }
                if(!this.cellphone.match(/^1[0-9][0-9]\d{8}$/)){
                    Toast("您输入的手机号格式不正确");
                    return;
                }
                let regData = await this.isReg({username:this.cellphone});
                if(regData.data.isreg==='1'){
                    Toast("该手机号已经注册过了~");
                    return;
                }
                if(this.msgCode.match(/^\s*$/)){
                    Toast("请输入短信验证码");
                    return;
                }

                this.updateCellphone({cellphone:this.cellphone,vcode:this.msgCode,success:(res)=>{
                    if(res.code===200){
                        Toast({
                            message:'修改成功!',
                            duration:2000,
                            onClose:()=>{
                                this.$router.go(-1);
                            }
                        })
                    }
                    else{
                        Toast(res.data);
                    }
                }})
            },
            //获取短信验证码
            async getMsgCode(){
                if(this.isSend){

                    if(this.cellphone.match(/^\s*$/)){
                        Toast("请输入手机号");
                        return;
                    }
                    if(!this.cellphone.match(/^1[0-9][0-9]\d{8}$/)){
                        Toast("您输入的手机号格式不正确");
                        return;
                    }
                    let regData = await this.isReg({username:this.cellphone});
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
                            this.msgCodeText="获取验证码";
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
            this.$utils.safeUser(this);
            document.title = this.$route.meta.title;
            this.isSubmit = true;
        },
        beforeDestroy(){
            clearImmediate(this.timer);
        },
    }
</script>

<style scoped>
    .page{width:100%;min-height: 100vh;background-color: white;}
    .page .tip-wrap{width:100%;height:1rem;background-color: #f3f5c4;display: flex;padding-top: 1rem;align-items: center;}
    .page .tip-wrap .tip-icon{width:0.4rem;height:0.4rem;background-image: url('../../../assets/images/user/mobile/tip.png');
    margin-left: 0.4rem;background-size: 100%;background-position: center;background-repeat:no-repeat;}
    .page .tip-wrap .tip{font-size:0.28rem;color:#ac7700;margin-left: 0.2rem;}
    .page .input-wrap{width:90%;height:0.84rem;display: flex;align-items: center;border: 1px solid #c5cbcf;border-radius:4px;}
    .page .input-wrap.wrap-1{margin-top:0.5rem;margin-left: 5%;}
    .page .input-wrap.wrap-2{margin: 0.2rem auto;}
    .page .input-wrap.wrap-1 input{width:90%;margin-left: 0.2rem;height: 90%;text-align: left;}
    .page .input-wrap.wrap-2 input{width:70%;margin-left: 0.2rem;height: 90%;text-align: left;}
    .page .input-wrap.wrap-2 .btn{width:1.9rem;height:95%;font-size:0.28rem;text-align: center;color:#717376;line-height: 0.84rem;border-left: 1px solid #efefef;}
    .page .input-wrap.wrap-2 .btn.active{color:#eb1625;}
    .page .sure-btn{width:90%;height:0.8rem;border-radius:0.1rem;margin-top: 0.2rem;margin-left: 5%;background-color: #e42321;
    text-align: center;line-height: 0.8rem;color:white;font-size:0.28rem;}
</style>