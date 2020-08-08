<template>
    <div class="page">
        <sub-header title="选择收货地址"></sub-header>
        <div class="content">
            <div class="address-nav">
                <div class="address-nav-name name1">配送地址</div>
                <div class="address-nav-name name2" @click="$router.push('/address/add')">+添加收货地址</div>
            </div>
            <div class="address-list" v-for="(item,index) in address" :key="index" @click="selectAddress(item.aid)">
                <div class="address-info-wrap">
                    <div class="check-mark" v-if="item.isdefault==='1'"></div>
                    <div class="address-info" >
                        <div class="person">
                            <span class="name">{{item.name}}</span>
                            <span class="telphone">{{item.cellphone}}</span>
                        </div>
                        <div class="address">
                            <div class="default" v-if="item.isdefault==='1'">默认</div>
                            <span class="text">{{item.province}}{{item.city}}{{item.area}}{{item.address}}</span>
                        </div>
                    </div>
                </div>
                <div class="handle-wrap">
                    <div class="image-wrap">
                        <img src="../../../assets/images/home/cart/edit.png" @click.stop="$router.push('/address/mod?aid='+address[index].aid)">
                        <img src="../../../assets/images/home/cart/del.png" @click.stop="deleteAddress(index,item.aid)">
                    </div>
                </div>
            </div>
            <div class="no-data" v-if="address.length===0">您还没有添加收货地址!</div>
        </div>
    </div>
</template>

<script>
    import subHeader from "../../../components/sub-header";
    import {mapState,mapActions} from 'vuex';
    import {Dialog} from 'vant';
    export default {
        name: "index",
        components:{
          subHeader
        },
        computed:{
            ...mapState({
                address:(state)=>state.address.address
            })
        },
        methods:{
            ...mapActions({
                getAddressList:"address/getAddressList",
                CLEAR_KWYEORDS:"address/deleteAddress",
            }),
            //删除收货地址
            deleteAddress(index,aid){
                Dialog.confirm({
                    title:'',
                    message:'确认要删除吗？'
                }).then(()=>{
                    this.CLEAR_KWYEORDS({'index':index,'aid':aid});
                }).catch(()=>{

                })
            },
            //选择收货地址
            selectAddress(aid){
                sessionStorage['addsid'] = aid;
                this.$router.go(-1);
            }
        },
        mounted(){
            document.title = this.$route.meta.title;
        },
        created(){
            this.$utils.safeUser(this);
            this.getAddressList();
        }
    }
</script>

<style scoped>
    .page{width:100%;min-height:100vh;background-color: white;overflow: hidden;}
    .page .content{width:100%;background-color: white;margin-top: 1rem;}
    .page .content .address-nav{width:100%;height:0.8rem;background-color: #d3c6be;display: flex;justify-content: space-between;}
    .page .content .address-nav .address-nav-name{font-size:0.32rem;line-height: 0.8rem;}
    .page .content .address-nav .address-nav-name.name1{padding-left: 0.2rem;}
    .page .content .address-nav .address-nav-name.name2{padding-right: 0.2rem;}
    .page .content .address-list{width:100%;height:2.24rem;border-bottom: 1px solid #c6c6c6;}
    .page .content .address-list .address-info-wrap{width:90%;height:1.42rem;border-bottom: 1px dashed #c6c6c6;margin: 0 auto;
    display: flex;align-items: center;}
    .page .content .address-list .address-info-wrap .check-mark{width:0.4rem;height:0.4rem;background-image: url("../../../assets/images/home/cart/gou.png");background-position-x: 50%;background-repeat: no-repeat;background-size: 100%;
    margin-right: 0.2rem;}
    .page .content .address-list .address-info-wrap .address-info{width:90%;height:1.22rem;margin: 0 auto;}
    .page .content .address-list .address-info-wrap .person{width:100%;height:0.52rem;overflow: hidden;border-bottom: 1px solid #efefef;margin-left: 0.2rem;}
    .page .content .address-list .address-info-wrap .person .name{font-size:0.28rem;}
    .page .content .address-list .address-info-wrap .person .telphone{font-size:0.28rem;margin-left: 0.2rem;margin-top: 0;}
    .page .content .address-list .address-info-wrap .address{width:100%;height:0.6rem;margin-top:0.1rem;align-items: center;
    display: flex;}
    .page .content .address-list .address-info-wrap .address .default{width:0.68rem;height:0.42rem;background-color: #fdb709;
    border-radius: 0.08rem;font-size:0.24rem;color:white;text-align: center;line-height: 0.42rem;}
    .page .content .address-list .address-info-wrap .address .text{width:auto;height:auto;font-size:0.32rem;margin-left: 0.2rem;}
    .page .content .address-list .handle-wrap{width:100%;height:0.76rem;display: flex;justify-content:flex-end;position: relative;align-items: center;}
    .page .content .address-list .handle-wrap .image-wrap{width:auto;height:0.4rem;position: absolute;right:0;
    line-height:0.4rem;}
    .page .content .address-list .handle-wrap .image-wrap img{width:0.4rem;height:0.4rem;padding-right: 0.2rem;}
    .page .content .no-data{width:100%;height:auto;text-align: center}
</style>