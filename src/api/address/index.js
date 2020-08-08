import config from '../../assets/js/conf/config'
import {request} from '../../assets/js/utils/request'

//获取收货地址列表
export function getAddressListData(uid) {
    return request(config.baseApi + "/user/address/index?uid=" + uid + "&token=" + config.token);
}

//删除收货地址
export function deleteAddressData(uid,aid) {
    return request(config.baseApi + "/user/address/del?uid=" + uid+ "&aid=" + aid +"&token=" + config.token);
}

//添加收货地址
export function addAddressData(data){
    return request(config.baseApi + "/user/address/add?token=" + config.token,"post",data);
}

//获取收货地址
export function getAddressData(data) {
    return request(config.baseApi + "/user/address/info?uid=" + data.uid + "&aid=" + data.aid + "&token=" + config.token);
}

//修改收货地址
export function modifyAddressData(data){
    console.log(config.baseApi + "/user/address/mod?token=" + config.token,"post",data);
    return request(config.baseApi + "/user/address/mod?token=" + config.token,"post",data)
}

//获取默认收货地址
export function getDefaultAddressData(uid){
    return request(config.baseApi + "/user/address/defaultAddress?uid="+uid+"&token="+config.token);
}