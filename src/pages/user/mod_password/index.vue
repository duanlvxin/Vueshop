<template>

    <div class="page">
        <sub-header title="修改密码"></sub-header>
        <div class="content">
            <div class="input-wrap">
                <input class="passwd" :type="checked?'text':'password'" placeholder="请输入不小于6位的密码" v-model="password">
                <div class="switch">
                    <van-switch v-model="checked"  active-color="#eb1625" inactive-color="#ffffff"/>
                </div>
            </div>
            <div class="btn" @click="submit">提交</div>
        </div>
    </div>
</template>

<script>
    import subHeader from '../../../components/sub-header';
    import Vue from 'vue';
    import {Switch,Toast} from 'vant';
    import {mapActions} from 'vuex';

    Vue.use(Switch);
    export default {
        name: "index",
        components:{
            subHeader
        },
        data(){
            return{
                checked:false,
                password:'',
                isSubmit :true,
            }
        },
        created(){
            this.isSubmit = true;
        },
        methods:{
            ...mapActions({
                updatePassword:'user/updatePassword'
            }),
            submit(){
                if(this.password.match(/^\s*$/)){
                    Toast("密码不能全为空格");
                    return;
                }
                if(this.password.length<6){
                    Toast("请输入不小于6位的密码");
                    return;
                }

                if(this.isSubmit){
                    this.isSubmit = false;
                    this.updatePassword({password:this.password,success:(res)=>{
                            if(res.code===200){
                                Toast({
                                    message:'修改成功',
                                    duration:2000,
                                    onClose:()=>{
                                        this.$router.go(-1);
                                    }
                                })
                            }
                            else{
                                Toast(res.data);
                                this.isSubmit = true;
                            }
                        }})
                }

            }
        }
    }
</script>

<style scoped>
    .page{width:100%;min-height: 100vh;background-color: white;}
    .page .content{width:100%;height:auto;padding-top: 1rem;}
    .page .content .input-wrap{width:7.0rem;height:0.84rem;display: flex;align-items: center;margin: 0.4rem auto;
    border: 1px solid #c5cbcf}
    .page .content .input-wrap .passwd{width:5.2rem;height:0.7rem;margin-left:0.2rem;border-right: 1px solid #efefef;font-size: 0.32rem;}
    .page .content .input-wrap .switch{width:1.24rem;height:0.64rem;margin-right: 0.2rem}
    .page .content .btn{width:90%;height:0.8rem;border-radius: 0.1rem;margin: 0.2rem auto;text-align: center;
    font-size: 0.28rem;color: white;line-height: 0.8rem;background-color: #e42321}
</style>