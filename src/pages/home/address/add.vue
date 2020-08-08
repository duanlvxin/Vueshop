<template>
    <div class="page">
        <sub-header title="添加收货地址"></sub-header>
        <div class="content">
            <ul>
                <li>收货人</li>
                <li><input type="text" placeholder="收货人姓名" v-model="name"></li>
            </ul>
            <ul>
                <li>联系方式</li>
                <li><input type="tel" placeholder="联系人手机号" v-model="cellphone"></li>
            </ul>
            <ul>
                <li>所在地区</li>
                <li><input type="text" placeholder="请选择收货地址" readonly :value="showArea" @click="show=true"></li>
            </ul>
            <ul>
                <li>详细地址</li>
                <li><input type="text" placeholder="街道详细地址" v-model="address" ></li>
            </ul>
            <ul>
                <li>设置为默认地址</li>
                <li><input type="checkbox" v-model="isDefault"></li>
            </ul>
            <div class="save-btn" @click="theAddAddress">
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
    import {Area,Toast,Popup} from "vant";

    Vue.use(Area);
    Vue.use(Popup);
    export default {
        name: "add",
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
        methods:{
            ...mapActions({
                addAddress:'address/addAddress'
            }),
            //选择所在地区
            selectArea(e){
                let tempVal = [];
                if(e.length>0){
                    for(let i=0;i<e.length;i++){
                        tempVal[i] = e[i].name
                    }
                }
                this.showArea = tempVal.join(" ");
                this.show=false;
            },
            //增加收货地址
            theAddAddress(){
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
                    name:this.name,
                    cellphone:this.cellphone,
                    province:this.showArea.split(" ")[0],
                    city:this.showArea.split(" ")[1],
                    area:this.showArea.split(" ")[2],
                    address:this.address,
                    isdefault: this.isDefault?"1":"0"
                }
                if(this.isSubmit){
                    this.isSubmit = false;
                    this.addAddress({data:data,success:(res)=>{
                            console.log(res);
                            if(res.code===200){
                                Toast({
                                    duration:2000,
                                    message:"添加成功",
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
            }
        },
        created(){
            this.isSubmit = true;
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