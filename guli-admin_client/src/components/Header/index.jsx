import React, { Component } from 'react'
import { withRouter} from 'react-router-dom'

import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import LinkButton from '../link-button'
import menuList from '../../config/menuConfig'
import {reqWeather} from '../../api'
import {formateDate} from '../../utils/dataUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import './index.less'
class Header extends Component {

    state={
        currentTime:formateDate(Date.now()),
        temperature:'',//气温
        weather:'',//天气
        
    }
    getTime=()=>{ //时间动态展示
        this.intervalId=setInterval(()=>{
            const currentTime=formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather=async()=>{  //获得天气数据
        const {temperature,weather} = await reqWeather('福州')
        this.setState({temperature,weather})
    }

    getTitle=()=>{
        const path=this.props.location.pathname     
        let title  
        menuList.forEach(item=>{
            if(item.key===path){
                title=item.title
            }else if(item.children){
                const cItem=item.children.find(cItem=>cItem.key===path)
                if(cItem){
                    title=cItem.title
                }
            }
        })
        return title
    }
    /**
     * 退出登录
     */
    Logout=()=>{
        //显示对话框
        Modal.confirm({
            title: '退出请求',
            icon: <ExclamationCircleOutlined />,
            content: '确定吗',
            onOk:()=>{  //输出保存的user数据 且跳转到/login
                storageUtils.removeUser()
                memoryUtils.user={}
                this.props.history.replace('/login')
            }
        })  
    }

    /**
     * 在第一次render之后执行一次
     * 一般在此执行异步操作，发ajax请求/发定时器
     */
    componentDidMount(){       
        this.getTime()   //获取当前的时间
        this.getWeather() //获取当前天气
    }
    componentWillUnmount(){
        clearInterval(this.intervalId)
    }
    render() {
        const {currentTime,temperature,weather} = this.state
        const username=memoryUtils.user.username
        const title=this.getTitle()
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎,{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        <span>{title}</span>
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <span>温度：{temperature}</span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)