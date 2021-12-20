import axios from "axios";
import router from "@/router";
import Element from "element-ui";

// Define a domain name + port, here is a cross-domain problem during development, don’t let go
// 54.219.47.84
axios.defaults.baseURL = "http://54.219.47.84:8081"
const request = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
    }
})

request.interceptors.request.use(config => {
    config.headers['Authorization'] = localStorage.getItem("token")
    return config
})

request.interceptors.response.use(response=>{

    let res = response.data;

    if(res.code === 200) {
        return response;
    } else {
        // 否则弹窗显示msg 并返回结果
        Element.Message.error(!res.msg? '系统异常': res.msg);
        return Promise.reject(response.data.msg);
    }
}, error => {

    if(error.response.data){
        error.massage = error.response.data.msg;
    }
    // 401没有权限返回login页面
    if(error.response.status === 401){
        router.push("/login");
    }
    // 401没有权限返回login页面
    if(error.response.status === 400){
        router.push("/login");
    }
    // 错误弹窗，持续3s
    Element.Message.error(error.massage, {duration: 3000})
    return Promise.reject(error);
})

// 暴露给外部
export default request

