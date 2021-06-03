// 能发送ajax的请求的函数模块返回值是promise对象
// 封装axios库
/*
1.优化，统一处理请求异常
    在外层包裹一个promise，成功返回响应，失败直接提示错误信息
 */
import axios from "axios";
import {message} from 'antd'


export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise
        //1.执行异步ajax请求
        if (type === 'GET') { //发送GET请求
            promise = axios.get(url, {  //配置对象
                params: data   //指定请求参数
            })
        } else {  //发送post请求
            promise = axios.post(url, data)
        }
        //2成功了，调用resolve
        promise.then(response=>{
            resolve(response.data)
        //3如果失败了，不调用reject，而是提示异常信息
        }).catch(error=>{
            //reject(error)
            message.error('请求出错了：'+error.message)
        })
        
    })

}