import axios from "axios";
import router from "@/router";
import Element from "element-ui";

// http://54.219.47.84/
// axios.defaults.baseURL = "http://54.219.47.84:8081"
axios.defaults.baseURL = "http://localhost:8081"
const request = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': "application/json; charset=utf-8"
    }
})

request.interceptors.request.use(config => {
    config.headers['Authorization'] = localStorage.getItem("token")
    return config
})
// 定义一个axios对象，将公用的值放入这个对象：1、超时时间 2、headers Content-Type为json类型
// const request = axios.create({
//     timeout: 5000,
//     // headers: {
//     //     'Content-Type': "application/x-www-form-urlencoded; charset=utf-8",
//     // }
//     headers: {
//         'Content-Type': "application/json; charset=utf-8"
//     }
// })

// 设置一个request请求interceptor拦截器
// 第一个是config配置，因为是请求发送前的操作，需要放入jwt
// request.interceptors.request.use(config=>{
//     console.log("请求发出之前添加jwt" + localStorage.getItem("jwt"))
//     config.headers['Authorization'] = localStorage.getItem("jwt");
//     console.log("请求1")
//     config.headers.Authorization = localStorage.getItem("jwt");
//     console.log("请求2")
//     // config.headers.set('Authorization', localStorage.getItem("jwt"));
//     console.log("请求3")
//     console.log("config：")
//     console.log(config)
//     return config;
// })

// 设置一个response请求interceptor拦截器
// 参数1.正常返回结果
// 参数2.返回异常处理
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
        router.push("login");
    }
    // 401没有权限返回login页面
    if(error.response.status === 400){
        router.push("login");
    }
    // 错误弹窗，持续3s
    Element.Message.error(error.massage, {duration: 3000})
    return Promise.reject(error);
})

// 暴露给外部
export default request

