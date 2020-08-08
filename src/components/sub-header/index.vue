<template>
    <div>
        <div class="sub-header">
            <div class="back-wrap">
                <div class="back" @click="$router.go(-1)" v-show="isBack"></div>
            </div>
            <div class="title">{{title}}</div>
            <div class="right-btn" v-if="rightText?true:false" @click="submit">{{rightText}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        props:{
            title:{
                type:String,
                default:''
            },
            isBack:{
                type:Boolean,
                default: true
            },
            rightText:{
                type:String,
                default:''
            }
        },
        methods:{
            submit(){
                this.$emit("submit");
            }
        }
    }
</script>

<style scoped>
    .sub-header{width:100%;height:1.02rem;background-color:white;align-items: center;display: flex;
        position:fixed;top:0;z-index:1;border-bottom: 1px solid #efefef;}
    .sub-header .back-wrap{width:0.8rem;height:0.8rem;}
    .sub-header .back-wrap .back{width:100%;height:100%;background-image: url("../../assets/images/home/goods/back.png");
        background-position: center;background-repeat: no-repeat;background-size: 100%;}
    .sub-header .title{width:80%;height:100%;line-height: 1.02rem;text-align: center;font-size:0.32rem;}
    .sub-header .right-btn{width:1rem;height:auto;text-align: center;font-size: 0.32rem;white-space: nowrap;
    margin-right: 0.2rem;}
</style>