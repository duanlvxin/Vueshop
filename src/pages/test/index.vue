<template>
    
    <div>
        <button type="button" @click="Login()">登录</button>
    </div>
</template>

<script>
    import axios from 'axios';
    import {request} from "../../assets/js/utils/request";
    export default {
        name: "index",
        data(){
          return{
              axiosConfig:{
                  url:"http://localhost:8080/api/patient/login",
                  method:"post",
                  data:{'username':'eeee','password':'dddd'}
              },
          }
        },
        methods:{
            Login(){
                axios(this.axiosConfig).then(res=>{
                    console.log(res);
                })
            }
        },
        created(){
                request("http://localhost:8080/api/getRSAKey").then((res)=>{
                    console.log(res);
                })
        }
    }
</script>

<style scoped>
    button {width:50px;height:20px;border: 1px solid black;background-color: bisque}
</style>