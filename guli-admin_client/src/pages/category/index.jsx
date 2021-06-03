import React, { Component } from 'react'

import AddForm from './add-form'
import Demo from './update-form'
import { 
    Card,
    Button,
    Table,
    message,
    Modal
} from 'antd';
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons';//加号
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'
import LinkButton from '../../components/link-button'
export default class Category extends Component {
 
    state={
        categorys:[],//一级分类列表
        subCategorys:[],//二级分类列表
        parentId:'0',//当前需要显示的分类列表的父分类Id
        parentName:'',//当前需要显示的分类列表的父分类名称
        visible:false
    }
 
    /**
     * 初始化Table的所有列数组
     */
    initColumns=()=>{
        this.columns=[
            {
              title: '分类名称',
              dataIndex: 'name',              
            },
            {
              title: '操作',
              width:300,
              render:(category)=>(
                  <span>
                      <LinkButton onClick={()=>{this.showUpdate(category)}}>修改分类</LinkButton>
                      {this.state.parentId==='0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
                  </span>
              )
            }
          ];
    }
    //异步获取一级/二级分类列表显示
    getCategorys=async(parentId)=>{
        parentId = parentId || this.state.parentId
        //发异步ajax请求，获取数据
        const result=await reqCategorys(parentId)
        if(result.status===0){
            const categorys=result.data //数据数组，可能是一级可能是二级
            if(parentId==='0'){
                this.setState({categorys})
            }else{
                this.setState({subCategorys:categorys})
            }
        }else{
            message.error('获取分类列表失败')
        }
    }
    //显示二级分类列表
    showSubCategorys=(category)=>{
        console.log(category)
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{
            this.getCategorys()
        })
    }
    showCategorys=()=>{   //回到上一级，展示一级分类列表
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[]
        })
    }
    /*
    显示修改的确认框
    */
    showUpdate = (category) => {
        // 保存分类对象
        this.category=category
        this.setState({visible:true})    
    }
    /*
    添加分类
    */
    addCategory = () => {
        console.log('addCategory')
        // this.form.validateFields(async (err, values) => {
        // if (!err) {
        //     // 隐藏确认框
        //     this.setState({
        //     showStatus: 0
        //     })

        //     // 收集数据, 并提交添加分类的请求
        //     const {parentId, categoryName} = values
        //     // 清除输入数据
        //     this.form.resetFields()
        //     const result = await reqAddCategory(categoryName, parentId)
        //     if(result.status===0) {

        //     // 添加的分类就是当前分类列表下的分类
        //     if(parentId===this.state.parentId) {
        //         // 重新获取当前分类列表显示
        //         this.getCategorys()
        //     } else if (parentId==='0'){ // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
        //         this.getCategorys('0')
        //     }
        //     }
        // }
        // })
    }
     
    /*
    更新分类
    */
    updateCategory = () => {
        console.log('updateCategory()')      
        // 进行表单验证, 只有通过了才处理
        // this.form.validateFields(async (err, values) => {
        // if(!err) {
        //     // 1. 隐藏确定框
        // this.setState({
        // showStatus: 0
        // })

        // //     // 准备数据
        // const categoryId = this.category._id
        // //     const {categoryName} = values
        // //     // 清除输入数据
        // //     this.form.resetFields()

        // 2. 发请求更新分类
        // const result = await reqUpdateCategory({categoryId, categoryName})
        // if (result.status===0) {
        // // 3. 重新显示列表
        //     this.getCategorys()
        // }
        // }
        // })


    }
    

    hideUserModal =(newVisible)=>{
        this.setState({visible:newVisible})
    }

   

    //为第一次render准备数据
    UNSAFE_componentWillMount(){
        this.initColumns();
    }
    //执行异步任务，发异步ajax请求
    componentDidMount(){
        this.getCategorys()//根据初始值，获取一级分类列表
    }


    render() {
        const {categorys,subCategorys,parentId,parentName,visible}=this.state
        // 读取指定的分类
        const category = this.category || {}// 如果还没有指定一个空对象
        if(!category.name){   //若为空则赋值空字符串
            category.name=''
        }
        
        const title =parentId==='0'?'一级分类标题':(
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight:5}}/>
                <span>{parentName}</span>
            </span>
        )
        const extra=(
            <Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                <span>添加</span>
            </Button>
        )
        
        return (
            <Card title={title} extra={extra} >
                <Table 
                    bordered
                    rowKey='_id'
                    dataSource={parentId==='0' ? categorys:subCategorys} 
                    columns={this.columns}
                    pagination={{defaultPageSize:5,showQuickJumper:true}} />
                
                   <Demo   visiblex={visible} category={category.name} hideUserModal={this.hideUserModal}/>
            </Card>
            
        )
    }
}
