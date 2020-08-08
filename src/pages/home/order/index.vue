<template>

    <div class="page">
        <sub-header title="确认订单"></sub-header>
        <div class="content">
            <div class="address">
                <div class="text" v-if="JSON.stringify(defaultAddrInfo)==='{}'">您的收货地址为空,点击添加收货地址</div>
                <div class="addressInfo-wrap" v-else>
                    <div class="person">
                        <span>收货人:{{name?name:defaultAddrInfo.name}}</span>
                        <span>{{cellphone?cellphone:defaultAddrInfo.cellphone}}</span>
                    </div>
                    <div class="addressInfo">
                        <img class="icon" src="../../../assets/images/home/cart/map.png">
                        <span>{{showArea?showArea:defaultAddrInfo.province+defaultAddrInfo.city+defaultAddrInfo.area+defaultAddrInfo.address}}</span>
                    </div>
                </div>
                <div class="rightArrow" @click="$router.push('/address/index')"></div>
            </div>
            <div class="address-border">
                <div class="border color-0"></div>
                <div class="border color-1"></div>
                <div class="border color-0"></div>
                <div class="border color-1"></div>
                <div class="border color-0"></div>
                <div class="border color-1"></div>
                <div class="border color-0"></div>
                <div class="border color-1"></div>
                <div class="border color-0"></div>
                <div class="border color-1"></div>
            </div>
            <div class="goods-list" v-for="(item,index) in newCartData" :key="index">
                <div class="goods-img">
                    <img :src="item.img">
                </div>
                <div class="goods-detail">
                    <div class="goods-title">{{item.title}}</div>
                    <div class="goods-attrs-wrap" >
                        <div class="goods-attr" v-for="(item2,index2) in item.attrs" :key="index2">{{item2.title}}: {{item2.param[0].title}}</div>
                    </div>
                    <div class="goods-amount">x {{item.amount}}</div>
                    <div class="goods-price">￥{{item.price}}</div>
                </div>
            </div>
            <div class="cost">
                <div class="item">
                    <div class="text">商品总额</div>
                    <div class="total">￥{{total}}</div>
                </div>
                <div class="item">
                    <div class="text">运费</div>
                    <div class="total">￥{{freight}}</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="total-cost">
                <div class="text">实际金额：<span>￥{{total+freight}}</span></div>
            </div>
            <div class="submit-btn" @click="submit">提交订单</div>
        </div>
    </div>
</template>

<script>
    import {mapState,mapGetters,mapActions} from 'vuex';
    import subHeader from '../../../components/sub-header'
    export default {
        name: "index",
        data(){
            return{
                defaultAddrInfo:{},
                aid:sessionStorage['addsid'],
                name:"",
                cellphone:"",
                showArea:""
            }
        },
        components:{
            subHeader
        },
        methods:{
            ...mapActions({
                getDefaultAddress:"address/getDefaultAddress",
                getAddress:"address/getAddress",
                addOrder:"order/addOrder",
            }),
            //提交订单
            submit(){
               if(this.isSubmit){
                   this.isSubmit = false;
                   if(this.cartData.length>0){
                       this.addOrder({'freight':this.freight,'addsid':sessionStorage['addsid'],
                           'goodsData':JSON.stringify(this.cartData),success:()=>{
                               this.$router.push('/balance/end');
                               this.isSubmit = true;
                       }});
                   }
               }

            }
        },
        computed:{
            ...mapState({
                cartData:(state)=>state.cart.cartData
            }),
            ...mapGetters({
                total:"cart/total",
                freight:"cart/freight"
            }),
            newCartData(){
                if(this.cartData.length>0){
                    let data = this.cartData.filter((item)=>{
                        return item.checked;
                    })
                    return data;
                }
                else{
                    return []
                }
            }
        },
        created(){
            this.$utils.safeUser(this);
            this.isSubmit = true;
            this.getDefaultAddress({success:(res)=>{
                if(res.code===200){
                    this.defaultAddrInfo = res.data;
                    sessionStorage['addsid'] = res.data.aid;
                }
                else{
                    this.defaultAddrInfo = {};
                }
            }});
            this.getAddress({aid:this.aid,success:(res)=>{
                this.name = res.data.name;
                this.cellphone = res.data.cellphone;
                this.showArea = res.data.province+res.data.city+res.data.area+res.data.address;
            }});
        },
        mounted(){
            document.title = this.$route.meta.title;
        }
    }
</script>

<style scoped>
    .page {width:100%;height:100vh;background-color: white;}
    .page .content{width:100%;height:auto;background-color: white;padding-top: 1rem;margin-bottom: 0.9rem;}
    .page .content .address{width:100%;height:1.9rem;padding-top: 0.2rem;display: flex;align-items: center;position: relative;}
    .page .content .address .text{width:auto;height:auto;font-size:0.28rem;flex-wrap:no-wrap;margin-left: 1.2rem;}
    .page .content .address .addressInfo-wrap{width:85%;height:100%;margin-left: 0.4rem;}
    .page .content .address .addressInfo-wrap .person{width:100%;height:auto;margin-top: 0.2rem;border-bottom: 1px solid #efefef;}
    .page .content .address .addressInfo-wrap .person span{font-weight: 700;}
    .page .content .address .addressInfo-wrap .person span:first-child{font-size:0.28rem;margin-right:1.4rem;}
    .page .content .address .addressInfo-wrap .person span:nth-child(2){font-size:0.32rem;}
    .page .content .address .addressInfo-wrap .addressInfo{width:100%;height:auto;margin-top: 0.4rem;display: flex;}
    .page .content .address .addressInfo-wrap .addressInfo img{width:0.4rem;height:0.4rem;}
    .page .content .address .addressInfo-wrap .addressInfo span{height:0.32rem;line-height:0.4rem;font-size:0.24rem;margin-left: 0.2rem;margin-bottom: 0}
    .page .content .address .rightArrow{width:0.32rem;height:0.32rem;position: absolute;right:0.4rem;
    background-image: url("../../../assets/images/common/right_arrow.png");background-color: white;background-size: 100%;background-position: center;background-repeat: no-repeat;}
    .page .content .address-border{width:100%;height:auto;display: flex;justify-content: space-between;}
    .page .content .address-border .border{width:6%;margin-left: 1%;margin-right: 1%;}
    .page .content .address-border .border.color-0{border-bottom: .08rem solid #fdcd4d;border-right: .08rem solid transparent;border-left: .08rem solid transparent}
    .page .content .address-border .border.color-1{border-top: .08rem solid #84614d;border-left: .08rem solid transparent;
    border-right: .08rem solid transparent;}
    .page .content .goods-list{width:92%;height:2rem;display: flex;align-items: center;margin: 0.4rem auto;}
    .page .content .goods-list .goods-img{width:1.2rem;height:1.2rem;text-align: center;padding-left: 0.1rem;}
    .page .content .goods-list .goods-img img{width:100%;height:100%;}
    .page .content .goods-list .goods-detail{width:auto;height:100%;margin-left: 0.2rem;padding-top: 0.2rem;}
    .page .content .goods-list .goods-detail .goods-title{width:5.18rem;height:0.4rem;font-size:0.28rem;overflow: hidden;}
    .page .content .goods-list .goods-detail .goods-attrs-wrap{width:100%;height:auto;display: flex;margin-top: 0.12rem;
    flex-wrap: wrap;}
    .page .content .goods-list .goods-detail .goods-attrs-wrap .goods-attr{margin-right: 0.3rem;font-size:0.28rem;color:#868686}
    .page .content .goods-list .goods-detail .goods-amount{width:auto;height:auto;font-size:0.24rem;color:#868686;
    margin-top: 0.1rem;}
    .page .content .goods-list .goods-detail .goods-price{width:auto;height:auto;font-size: 0.28rem;color:#f51d2a;margin-top: 0.1rem;}
    .page .content .cost{width:100%;height:auto;margin-top: 0.4rem;}
    .page .content .cost .item{width:92%;display: flex;justify-content: space-between;margin: 0 auto;padding-bottom: 0.3rem;}
    .page .content .cost .item .text{font-size:0.32rem;color:#787878}
    .page .content .cost .item .total{font-size: 0.32rem;color:#f51d2a}

    .page .footer{width:100%;height:1rem;position: fixed;bottom: 0;z-index:1;border-top:1px solid #efefef;display: flex;
    background-color: white;}
    .page .footer .total-cost{width:70%;height:100%;}
    .page .footer .total-cost .text{width:auto;line-height:1rem;font-size:0.32rem;text-align: right;padding-right: 0.2rem;}
    .page .footer .total-cost span{color:#f51d2a;}
    .page .footer .submit-btn{width:30%;height:100%;background-color: #cc0004;color:#fff;font-size:0.32rem;text-align: center;line-height:1rem;}
</style>