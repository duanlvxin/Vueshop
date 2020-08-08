<template>
    
    <div class="page">
        <sub-header title="收货地址管理"></sub-header>
        <div class="content">
            <div class="address-list" v-for="(item,index) in address" :key="index" @click="$router.push('/address/mod?aid='+address[index].aid+'&from=user')">
                <div class="address-info-wrap">
                    <div class="address-info">
                        <div class="person">
                            <span class="name">{{item.name}}</span>
                            <span class="telphone">{{item.cellphone}}</span>
                        </div>
                        <div class="address">
                            <div class="default" v-if="item.isdefault==='1'">默认</div>
                            <span class="text">{{item.province}}{{item.city}}{{item.area}}{{item.address}}</span>
                        </div>
                        <div class="right-arrow"></div>
                    </div>
                </div>
            </div>
            <div class="no-data" v-if="address.length===0">您还没有添加收货地址!</div>
        </div>
        <div class="footer">
            <div class="add-btn" @click="$router.push('/address/add')">+ 添加新地址</div>
        </div>
    </div>
</template>

<script>
    import subHeader from '../../../components/sub-header';
    import {mapState,mapActions} from 'vuex';
    import {Dialog} from 'vant';
    export default {
        name: "index",
        components:{
            subHeader
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
        },
        computed:{
            ...mapState({
                address:(state)=>state.address.address
            })
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
    .page{width:100%;min-height:90vh;background-color: white;}
    .page .content{width:100%;height:auto;background-color: white;margin-top: 1rem;margin-bottom:1.4rem;}
    .page .content .address-list{width:100%;height:1.2rem;border-bottom: 1px solid #c6c6c6;}
    .page .content .address-list .address-info-wrap{width:100%;height:100%;border-bottom: 1px solid #efefef;margin: 0 auto;
        display: flex;align-items: center;position:relative;}
    .page .content .address-list .address-info-wrap .address-info{width:100%;height:1.22rem;margin: 0 auto;}
    .page .content .address-list .address-info-wrap .person{width:90%;height:0.4rem;overflow: hidden;margin-left: 0.2rem;
    margin-top: 0.2rem;}
    .page .content .address-list .address-info-wrap .person .name{font-size:0.28rem;}
    .page .content .address-list .address-info-wrap .person .telphone{font-size:0.28rem;margin-left: 0.2rem;margin-top: 0;}
    .page .content .address-list .address-info-wrap .address{width:90%;height:0.4rem;margin-top:0.05rem;align-items: center;
        display: flex;}
    .page .content .address-list .address-info-wrap .address .default{width:0.68rem;height:0.42rem;background-color: #fdb709;
        border-radius: 0.08rem;font-size:0.24rem;color:white;text-align: center;line-height: 0.42rem;margin-left: 0.2rem;}
    .page .content .address-list .address-info-wrap .address .text{width:auto;height:auto;font-size:0.24rem;margin-left: 0.2rem;}
    .page .content .address-list .address-info-wrap .right-arrow{width:0.3rem;height:0.3rem;background-image:url('../../../assets/images/common/right_arrow.png');background-position: center;background-size: 100%;background-repeat: no-repeat;
    position:absolute;top:0.4rem;right:0.4rem;}
    .page .content .no-data{width:100%;height:auto;text-align: center}
    .page .footer {width:100%;height:1.4rem;background-color:white;}
    .page .footer .add-btn{width:80%;height:0.8rem;background-color: #eb1625;position:fixed;z-index:1;bottom:0.4rem;text-align: center;font-size: 0.28rem;line-height: 0.8rem;color:white;left:10%;border-radius: 0.1rem;}
</style>