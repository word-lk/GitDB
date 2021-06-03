import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';


// 当“窗体关闭”时重置窗体字段
const useResetFormOnCloseModal = ({ form, visible }) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;
  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();  //重置一组字段到 initialValues
    }
  }, [visible]);
};
//弹窗模块hooks
const ModalForm = ({ visible, onCancel,category }) => {   
  const [form] = Form.useForm();
  useResetFormOnCloseModal({
    form,
    visible,
  });

  const onOk = () => {
    form.submit();
  };

  return (
    <Modal title="Basic Drawer" visible={visible} onOk={onOk} onCancel={onCancel}>
      <Form form={form} layout="vertical" name="userForm">
        <Form.Item
          name="name"
          label="User Name"//输入框标语
          initialValue={category}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
          name="age"
          label="User Age"//输入框标语
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};


const Demo=(props)=>{
  // const [visible, setVisible] = useState(false);  //hook中保存state
  
  // const showUserModal = () => {  //展示user弹窗 
  //   setVisible(true);
  // };
  
  const hideUserModal = () => {  //隐藏user躺床
    // setVisible(false);
    props.hideUserModal(false)
  };
  
  // const onFinish = (values) => {  //验证完毕回调，values是输入弹窗的值
  //   console.log('Finish:', values);
  // };

  return (
    <>
      <Form.Provider
        onFormFinish={(name, { values, forms }) => {    //包裹的fOrm表单的提交时触发，onFormChange是改变时触发
          if (name === 'userForm') {                    //当userForm表单提交时触发，此代表弹窗表单内的
            const { basicForm } = forms;
            const users = basicForm.getFieldValue('users') || [];
            basicForm.setFieldsValue({
              users: [...users, values],
            });
            hideUserModal();
          }
        }}
      >
        <ModalForm visible={props.visiblex} onCancel={hideUserModal} category={props.category}/>
      </Form.Provider>
    </>
  );
};
export default Demo;