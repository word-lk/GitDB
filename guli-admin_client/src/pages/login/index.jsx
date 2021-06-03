import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.less'

import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'

import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'




export default class Login extends Component {

    onFinish =async (values) => {
        const {username,password}=values
       try{
        const result = await reqLogin(username,password)
        if(result.status===0){
           //提示登陆成功
           message.success('登录成功')
           const user=result.data
           memoryUtils.user=user  //保存在内存工具中
           storageUtils.saveUser(user)
           //跳转到管理界面
           this.props.history.replace('/')
        }else{
            //提示错误信息
            message.error(result.msg)
        }
      }catch(error){
          console.log('请求出错了',error.message)
      }
    };


    // 自定义密码校验
    validatorPwd=(_,value)=>{
        if(!value){return Promise.reject(new Error('密码为空'))}
        else if(value.trim()===''){return Promise.reject(new Error('密码不能全为空格'))}
        else if(value.length<4){return Promise.reject(new Error('密码必须大于4位'))}
        else if(value.length>12){return Promise.reject(new Error('密码必须小于4位'))}
        else if(!/^[0-9a-zA-Z_]{1,}$/.test(value)){return Promise.reject(new Error('密码要由字母数字和下划线组成'))}
        else return Promise.resolve()
    }



    render() {
        //如果用户已经登录，自动跳转到管理界面
        const user=memoryUtils.user
        console.log(!user&&!user._id)
        if(user&&user._id){
            return <Redirect to ='/'/>
        }
        return (
            <div className='login'>
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>guli后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                        
                    >
                        {/*rule校验
                          1，必须输入：require:true
                          2,必须大于4位 min:4
                          3,必须小于12位，max:12
                          3,必须是英文，数字，下划线组成 pattern:'^[0-9a-zA-Z_]{1,}$'
                        */}
                        <Form.Item
                            name="username"
                            rules={[
                                {required: true,whitespace:true,message: '输入有误'},
                                {min:4,message:'长度需大于4'},
                                {max:12,message:'长度需小于12'},
                                {pattern:'^[0-9a-zA-Z_]{1,}$',message:'必须是英文数字下划线'},
                            ]}
                            
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    validator:this.validatorPwd,
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>

                </section>
            </div>
        )
    }
}
