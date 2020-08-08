<template>
    <div class="page">
        <sub-header title="购物车" :isBack="$route.query.from==='goods_details'"></sub-header>
        <div class="content">
            <div class="cart-list" v-for="(item,index) in cartData" :key="index">
                <div :class="{'select-btn':true,active:item.checked}" @click="selectItem(index)"></div>
                <div class="image-wrap">
                    <div class="image"><img :src="item.img"></div>
                    <div class="delete" @click="deleteItem({index:index})">删除</div>
                </div>
                <div class="details-wrap">
                    <div class="goods-title">{{item.title}}</div>
                    <div class="attrs-wrap">
                        <div class="attr" v-for="(item2,index2) in item.attrs" :key="index2">{{item2.title}}:
                            <span v-for="(item3,index3) in item2.param" :key="index3">{{item3.title}}</span>
                        </div>
                    </div>
                    <div class="buy-wrap">
                        <div class="price">￥{{item.price}}元</div>
                        <div class="counter">
                            <div :class="{btn:true,dec:true,notactive:item.amount<=1}" @click="DEC_AMOUNT({index:index})">-</div>
                            <div class="btn"><input type="text" :value="item.amount" @input="SET_AMOUNT({index:index,amount:$event.target.value})"></div>
                            <div class="btn add" @click="ADD_AMOUNT({index:index})">+</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ordered-wrap">
            <div class="select-area">
                <div class="all" @click="allSelect">
                    <div :class="{'check-btn':true,active:isSelectAll}" ></div>
                    <div class="select-all" >全选</div>
                </div>
                <div class="total-price">
                    <div class="price-item">快递：{{freight}}元</div>
                    <div class="price-item">总价：{{total}}元</div>
                </div>
            </div>
            <div :class="{'ordered-btn':true,disabled:total<=0}" @click="statement">去结算</div>
        </div>
    </div>
</template>

<script>
    import subHeader from '../../../components/sub-header';
    import {mapState,mapGetters,mapMutations} from 'vuex';
    export default {
        name: "news",
        data(){
            return{
                isSelectAll:true,
            }
        },
        methods:{
            ...mapMutations({
                deleteItems:'cart/DELETE_ITEMS',
                SET_AMOUNT:'cart/SET_AMOUNT',
                DEC_AMOUNT:'cart/DEC_AMOUNT',
                ADD_AMOUNT:'cart/ADD_AMOUNT',
                SELECT_ITEM:'cart/SELECT_ITEM',
                ALL_SELECT_ITEM:'cart/ALL_SELECT_ITEM'
            }),
            deleteItem(index){
                this.deleteItems(index);
                this.checkSelectAll();
            },
            selectItem(index){
                this.SELECT_ITEM({index:index});
                this.checkSelectAll();
            },
            checkSelectAll(){
                let isAll=false;
                if(this.cartData.length>0){
                    isAll = true;
                    for(let i=0;i<this.cartData.length;i++){
                        if(!this.cartData[i].checked){
                            isAll = false;
                            break;
                        }
                    }
                }
                this.isSelectAll = isAll;
            },
            //全选
            allSelect(){
                if(this.cartData.length<=0){
                    this.isSelectAll = false;
                }
                else{
                    this.isSelectAll = !this.isSelectAll;
                    this.ALL_SELECT_ITEM({'isSelectAll':this.isSelectAll});
                }
            },
            //去结算
            statement(){
               if(this.total>0){
                   this.$router.push("/order");
               }
            }
        },
        computed:{
            ...mapState({
                cartData: (state)=>state.cart.cartData,
            }),
            ...mapGetters({
                total:"cart/total",
                freight:'cart/freight',
            }),
        },
        components:{
           subHeader
        },
        created(){
            this.checkSelectAll();
        },
    }
</script>

<style scoped>
    .page{width:100%;height: auto;}
    .page .header{width:100%;height:1.02rem;background-color:white;align-items: center;display: flex;
    position:fixed;top:0;z-index:1;}
    .page .header .back{width:0.8rem;height:0.8rem;background-image: url("../../../assets/images/home/goods/back.png");
    background-position: center;background-repeat: no-repeat;background-size: 100%;border-bottom: 1px solid #efefef;}
    .page .header .title{width:80%;height:100%;line-height: 1.02rem;text-align: center;font-size:0.32rem;}

    .page .content{width:100%;height:auto;margin-top: 1.02rem;}
    .page .content .cart-list{width:100%;height:2.2rem;align-items: center;display: flex;background-color: white;
    margin-bottom: 0.1rem;}
    .page .content .cart-list .select-btn{width:0.44rem;height:0.44rem;margin:auto 0;border-radius:100%;border:1px solid #efefef;background-size: 100%;background-repeat: no-repeat;background-position: center;margin-left: 0.2rem}
    .page .content .cart-list .select-btn.active{background-image: url("../../../assets/images/home/cart/checkmark.png");}
    .page .content .cart-list .image-wrap{width:1.2rem;margin-left: 0.2rem;}
    .page .content .cart-list .image-wrap .image{width:1.2rem;height:1.2rem;}
    .page .content .cart-list .image-wrap img{width:100%;height:100%;}
    .page .content .cart-list .image-wrap .delete{width:100%;height:auto;font-size:0.24rem;text-align: center;color:#b5b5b5;
    margin-top: 0.2rem;}
    .page .content .cart-list .details-wrap{width:4.8rem;height:100%;margin-left: 0.3rem;}
    .page .content .cart-list .details-wrap .goods-title{width:100%;height:0.64rem;font-size:0.24rem;margin-top: 0.3rem;overflow: hidden;}
    .page .content .cart-list .details-wrap .attrs-wrap{width:100%;display: flex}
    .page .content .cart-list .details-wrap .attrs-wrap .attr{font-size:0.25rem;margin-right: 0.2rem;margin-top: 0.1rem;}
    .page .content .cart-list .details-wrap .buy-wrap{width:100%;margin-top: 0.2rem;display: flex;justify-content: space-between;}
    .page .content .cart-list .details-wrap .buy-wrap .price{color:#cc0004;font-size:0.28rem;padding-top: 0.2rem;}
    .page .content .cart-list .details-wrap .buy-wrap .counter{width: 2rem;height: 0.5rem;margin-right: 0.2rem;border: 1px solid black;border-radius: 0.1rem;display: flex;}
    .page .content .cart-list .details-wrap .buy-wrap .counter .btn{width: 33%;height: 0.4rem;text-align: center;line-height: 0.4rem;margin: auto auto;}
    .page .content .cart-list .details-wrap .buy-wrap .counter .btn.notactive{color:#b5b5b5;}
    .page .content .cart-list .details-wrap .buy-wrap .counter .btn input{width:100%;height:0.4rem;text-align: center}
    .page .content .cart-list .details-wrap .buy-wrap .counter .btn.dec{border-right:1px solid black;}
    .page .content .cart-list .details-wrap .buy-wrap .counter .btn.add{border-left:1px solid black;}

    .page .ordered-wrap{width:100%;height:1rem;position:fixed;bottom:1.2rem;z-index:1;display: flex;background-color: white;}
    .page .ordered-wrap .select-area{width:5.62rem;height:100%;align-items: center;display: flex;justify-content: space-between;}
    .page .ordered-wrap .select-area .all{width:1.5rem;height:100%;display: flex;align-items: center;}
    .page .ordered-wrap .select-area .all .check-btn{width:0.44rem;height:0.44rem;margin:auto 0;background-position: center;background-repeat: no-repeat;background-size: 100%;margin-left: 0.2rem;border-radius: 100%;border: 1px solid #efefef;}
    .page .ordered-wrap .select-area .all .check-btn.active{background-image: url("../../../assets/images/home/cart/checkmark.png");}
    .page .ordered-wrap .select-area .all .select-all{width:auto;height:1rem;text-align: center;line-height: 1rem;margin-left: 0.1rem;font-size:0.24rem;}
    .page .ordered-wrap .select-area .total-price{width:auto;height: 100%;display: flex;}
    .page .ordered-wrap .select-area .total-price .price-item{width:auto;margin-right:0.1rem;font-size:0.22rem;text-align: center;line-height: 1rem;}
    .page .ordered-wrap .ordered-btn{width:1.86rem;height:100%;background-color: #cc0004;color:white;font-size:0.32rem;text-align: center;line-height: 1rem;}
    .page .ordered-wrap .ordered-btn.disabled{background-color:#bfbfbf;}
</style>