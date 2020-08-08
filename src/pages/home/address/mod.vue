<template>
    <div class="page">
        <sub-header title="修改收货地址" :right-text="$route.query.from==='user'?'删除':''" @submit="delAddress()"></sub-header>
        <div class="content">
            <ul>
                <li>收货人</li>
                <li><input type="text" v-model="name"></li>
            </ul>
            <ul>
                <li>联系方式</li>
                <li><input type="tel" v-model="cellphone"></li>
            </ul>
            <ul>
                <li>所在地区</li>
                <li><input type="text" readonly v-model="showArea" @click="show=true"></li>
            </ul>
            <ul>
                <li>详细地址</li>
                <li><input type="text"  v-model="address" ></li>
            </ul>
            <ul>
                <li>设置为默认地址</li>
                <li><input type="checkbox" v-model="isDefault"></li>
            </ul>
            <div class="save-btn" @click="modAddress">
                保存
            </div>
            <van-popup v-model="show" position="bottom">
                <van-area title="标题" :area-list="areaList" @cancel="show=false" @confirm="selectArea($event)"/>
            </van-popup>

        </div>
    </div>
</template>

<script>
    import subHeader from "../../../components/sub-header";
    import areaList from "../../../assets/data/area";
    import {mapActions} from "vuex";
    import Vue from "vue";
    import {Area,Toast,Popup,Dialog} from "vant";

    Vue.use(Area);
    Vue.use(Popup);
    export default {
        name: "mod",
        data(){
            return {
                name:"",
                cellphone:"",
                showArea:"",
                address:"",
                isDefault:false,
                areaList:areaList,
                show:false,
            }
        },
        components:{
            subHeader
        },
        methods: {
            ...mapActions({
                getAddress:"address/getAddress",
                modifyAddress:"address/modifyAddress",
                CLEAR_KWYEORDS:"address/deleteAddress",
            }),
            //选择所在地区
            selectArea(e) {
                let tempVal = [];
                if (e.length > 0) {
                    for (let i = 0; i < e.length; i++) {
                        tempVal[i] = e[i].name
                    }
                }
                this.showArea = tempVal.join(" ");
                this.show = false;
            },
            //修改收货地址
            modAddress(){
                if(this.name.match(/^\s*$/)){
                    Toast("请输入收货人姓名");
                    return;
                }
                if(this.cellphone.match(/^\s*$/)){
                    Toast("请输入收货人手机号");
                    return;
                }
                if(!this.cellphone.match(/^1[0-9][0-9]\d{8}$/)){
                    Toast("您输入的手机号有误");
                    return;
                }
                if(this.address.match(/^\s*$/)){
                    Toast("请输入详细地址");
                    return;
                }
                let data={
                    aid:this.aid,
                    name:this.name,
                    cellphone:this.cellphone,
                    province:this.showArea.split(" ")[0],
                    city:this.showArea.split(" ")[1],
                    area:this.showArea.split(" ")[2],
                    address:this.address,
                    isdefault: this.isDefault?"1":"0"
                }
                console.log(data);
                if(this.isSubmit){
                    this.isSubmit = false;
                    this.modifyAddress({data:data,success:(res)=>{
                            console.log(res);
                            if(res.code===200){
                                Toast({
                                    duration:2000,
                                    message:"修改成功",
                                    onClose:()=>{
                                        this.$router.go(-1);
                                    }
                                })
                            }
                            else{
                                Toast(res.data);
                                this.isSubmit = true;
                            }
                        }});
                }
            },
            //删除收货地址
            delAddress(){
                Dialog.confirm({
                    title:'',
                    message:'确认要删除吗？'
                }).then(()=>{
                    this.CLEAR_KWYEORDS({'aid':this.aid});
                    this.$router.go(-1);
                }).catch(()=>{

                })
            },
        },
        created(){
            this.isSubmit = true;
            this.aid = this.$route.query.aid?this.$route.query.aid:"";
            this.getAddress({aid:this.aid,success:(res)=>{
                    let oneAddress = res.data;
                    this.name = oneAddress.name;
                    this.cellphone = oneAddress.cellphone;
                    this.showArea = oneAddress.province+' '+ oneAddress.city+' '+ oneAddress.area;
                    this.address = oneAddress.address;

                    if(oneAddress.isdefault==='1'){
                        this.isDefault = true;
                    }
                    else{
                        this.isDefault = false;
                    }
                }});
        }
    }
</script>

<style scoped>
    .page{width:100%;height:100vh;background-color: white;}
    .page .content{width:100%;height:auto;padding-top: 1rem;}
    .page .content ul{width:100%;height:1.04rem;border-bottom: 1px solid #efefef;display: flex;}
    .page .content li:nth-child(1){width:auto;line-height:1.04rem;margin-left: 0.3rem;font-size:0.32rem;}
    .page .content li:nth-child(2){width:60%;height:100%;margin-left: 0.3rem;}
    .page .content li:nth-child(2) input{width:100%;overflow: visible;line-height: 1.04rem;font-size:0.32rem;}
    .page .content li:nth-child(2) input[type=checkbox]{width:0.4rem;height:0.4rem;margin-top: 0.3rem;}
    .page .content .save-btn{width:85%;height:0.8rem;margin: 0.32rem auto;background-color: #fcb40a;font-size:0.32rem;
        color:white;text-align: center;line-height: 0.8rem;border-radius: 0.1rem;}
</style>