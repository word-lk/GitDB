import React, { Component } from 'react'
import { Link,withRouter} from 'react-router-dom'

import logo from '../../assets/images/logo.png'
import './index.less'

import { Menu } from 'antd';//菜单模板引入
import menuList from '../../config/menuConfig'//引入菜单数据

const { SubMenu } = Menu;


/**
 * 左侧导航组件
 */

 class LeftNav extends Component {
    
    /**
     *根据menu的数据数组生成对应的标签数组
     map()+递归调用
     */
    getMenuNodes_map=(menuList)=>{
        return menuList.map(item=>{
            if(!item.children){
                return(
                    <Menu.Item key={item.key} icon={<item.icon />}>
                        <Link to ={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            }else{
                return(
                    <SubMenu key={item.key} icon={<item.icon />} title={item.title}>
                        {this.getMenuNodes_map(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    
    /**
     * 根据menu的数据数组生成对应的标签数组
     reduce()+递归调用
     */
     getMenuNodes_reduce=(menuList)=>{
         // 得到当前请求的路由路径
        const path = this.props.location.pathname
        return menuList.reduce((pre,item)=>{
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key} icon={<item.icon />}>
                        <Link to ={item.key}>{item.title}</Link>
                    </Menu.Item>
                ))
            }else{
                //查找一个与当前请求路径匹配的子Item,存在，则对应的父菜单需要展开
                const cItem=item.children.find(cItem=>cItem.key===path)
                if(cItem){
                     this.openKey=item.key
                }
                pre.push((
                    <SubMenu key={item.key} icon={<item.icon />} title={item.title}>
                        {this.getMenuNodes_reduce(item.children)}
                    </SubMenu>
                ))
            }
            return pre
        },[])
     }

UNSAFE_componentWillMount(){
    this.menuNodes=this.getMenuNodes_reduce(menuList)
}
    render() {
        const path=this.props.location.pathname
        const openKey=this.openKey
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo" />
                    <h1>guili后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.menuNodes
                    }
                    {/* <Menu.Item key="/home" icon={<PieChartOutlined />}>
                        <Link to ='/home'>首页</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                        <Menu.Item key="/category" icon={<MailOutlined />}><Link to='/category'>品类管理</Link></Menu.Item>
                        <Menu.Item key="/product" icon={<MailOutlined />}><Link to='/product'>商品管理</Link></Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user" icon={<PieChartOutlined />}>
                        <Link to ='/user'>用户管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/role" icon={<PieChartOutlined />}>
                        <Link to ='/role'>角色管理</Link>
                    </Menu.Item>
                    <SubMenu key="/bar" icon={<MailOutlined />} title="图形图标">
                        <Menu.Item key="/bar" icon={<MailOutlined />}><Link to='/bar'>柱形图</Link></Menu.Item>
                        <Menu.Item key="/line" icon={<MailOutlined />}><Link to='/line'>折线图</Link></Menu.Item>
                        <Menu.Item key="/pie" icon={<MailOutlined />}><Link to='/pie'>饼图</Link></Menu.Item>
                    </SubMenu> */}
                </Menu>
            </div>
        )
    }
}
//给普通组件添加路由3大属性,history,location,match
export default withRouter(LeftNav)