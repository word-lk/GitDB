/*
包含应用中所有接口请求函数的模块
*/
import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'

const BASE = 'http://120.55.193.14:5000'
//登录
export const reqLogin=(username,password)=>ajax(BASE + '/login',{username,password},'post');

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')


//添加用户 user是包含用户注册数据的对象
export const reqAddUser = (user)=>ajax(BASE + '/manage/user/add',user,'POST')
 
//json请求的天气接口请求函数
export const reqWeather=(city)=>{
    return new Promise((resolve, reject) => {
        const url=`https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=63fe24526faeb42194db3890c15c594d`
        jsonp(url,{},(err,data)=>{
            if (!err && data.status==='1') {
                // 取出需要的数据           
                const {temperature,weather} = data.lives[0]               
                resolve({temperature, weather})
            } else {
                // 如果失败了
                message.error('获取天气信息失败!')
            }
        })
    })    
}





