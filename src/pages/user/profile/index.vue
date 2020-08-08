<template>
    <div class="page">
        <sub-header title="个人资料" right-text="保存" @submit="save"></sub-header>
        <div class="avater">
            <span>头像</span>
            <img :src="headImg">
            <input type="file" @change="uploadAvater($event)">
        </div>
        <div class="item">
            <span>昵称</span>
            <input type="text" v-model="nickname">
            <div class="right-arrow"></div>
        </div>
        <div class="item" @click="isShow=!isShow">
            <span>性别</span>
            <span>{{gender}}</span>
            <div class="right-arrow"></div>
        </div>
        <van-action-sheet
                v-model="isShow"
                :actions="genders"
                cancel-text="取消"
                title="请选择您的性别"
                @select="selectGender($event)"
        />
    </div>
</template>

<script>
    import subHeader from '../../../components/sub-header';
    import {ActionSheet,Toast} from 'vant';
    import Vue from 'vue';
    import {mapActions,mapState} from 'vuex';

    Vue.use(ActionSheet);
    export default {
        name: "index",
        components: {
            subHeader
        },
        computed:{
            ...mapState({
                uid:(state)=>state.user.uid,
            })
        },
        data(){
            return{
                genders:[
                    {
                        name:'男',
                    },
                    {
                        name:'女'
                    }
                ],
                isShow:false,
                gender:'',
                trueGender:'',
                headImg:require('../../../assets/images/user/my/default-head.png'),
                nickname:'xxx',
                headImgName:''
            }
        },
        methods: {
            ...mapActions({
                asyncUploadAvater:'user/uploadAvater',
                updateUserInfo:'user/updateUserInfo',
                getUserInfo:'user/getUserInfo',
            }),
            selectGender(e){
                this.gender = e.name;
                if(this.gender==='男'){
                    this.trueGender = 1;
                }
                else if(this.gender==='女'){
                    this.trueGender = 2;
                }
                else{
                    this.trueGender = '';
                }
                this.isShow = false;
            },
            uploadAvater(e){
                if(e.target.files[0]){
                    this.asyncUploadAvater({headfile:e.target.files[0],success:(res)=>{
                        this.headImgName = res.msbox;
                        this.headImg = 'http://vueshop.glbuys.com/userfiles/head/' + res.msbox
                    }})
                }
            },
            //修改信息
            save(){
                if(this.nickname.match(/^\s*$/)){
                    Toast("请输入昵称");
                    return;
                }
                if(this.gender.length===0){
                    Toast("请选择性别");
                    return;
                }

                if(this.isSubmit){
                    this.isSubmit = false;
                    this.updateUserInfo({nickname: this.nickname,gender:this.trueGender,head:this.headImgName,success:(res)=>{
                            if(res.code===200){
                                Toast({
                                    message:"修改成功",
                                    duration:2000,
                                    onClose:()=>{
                                        this.$router.go(-1);
                                    }
                                });
                            }
                            else{
                                Toast(res.data);
                            }
                            this.isSubmit=true;
                        }});
                }
            }
        },
        mounted() {
            document.title = this.$route.meta.title;
        },
        created(){
            this.isSubmit = true;
            this.getUserInfo({uid:this.uid,success:(data)=>{
                    this.nickname=data.nickname;
                    this.gender=data.gender==='1'?'男':data.gender==='2'?'女':'';
                    this.trueGender=data.gender;
                    this.headImg=data.head;
            }});
        }
    }
</script>

<style scoped>
    .page {
        width: 100%;
        min-height: 100vh;
        background-color: white;
    }

    .page .avater {
        width: 100%;
        height: 1.2rem;
        padding-top: 1rem;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #efefef;
        position:relative;
    }

    .page .avater img {
        width: 1rem;
        height: 1rem;
        border-radius: 100%;
        margin: auto 0.6rem;
    }

    .page .avater input{
        width: 1rem;
        height: 1rem;
        position:absolute;
        top:1rem;
        right:0.6rem;
        opacity: 0;
    }

    .page .avater span {
        width: auto;
        height: auto;
        font-size: 0.28rem;
        margin-left: 0.4rem;
        line-height: 1.2rem;
    }

    .page .item {
        width: 100%;
        height: 0.8rem;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #efefef;
        position: relative
    }

    .page .item span:first-child {
        width: auto;
        height: auto;
        font-size: 0.28rem;
        margin-left: 0.4rem;
        line-height: 0.8rem;
    }

    .page .item input{
        width:3.76rem;
        height:100%;
        font-size: 0.28rem;
        position: absolute;
        right:0.8rem;
        text-align: right;
    }

    .page .item span:nth-child(2) {
        width: auto;
        height: auto;
        font-size: 0.28rem;
        line-height: 0.8rem;
        position: absolute;
        right: 1rem;
    }

    .page .item .right-arrow {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url('../../../assets/images/common/right_arrow.png');
        margin: auto 0.2rem;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100%;
    }

    .van-action-sheet__header .van-icon{display: none}
</style>