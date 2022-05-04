import React, { useState, useEffect } from 'react';
import { api_url } from "../../config/config"
import { Form, Input, Select } from 'antd';
const { Option } = Select;
const layout = {
    labelCol: {
        span: 9,
    },
    wrapperCol: {
        span: 15,
    },
};

const validateMessages = {
    required: '${label} je povinná položka.',
    types: {
        email: 'Nejedná se o validní emailovou adresu.',
    },
};
const UserForm = ({ userData, editForm, setConfirmLoading, setConfirmPreLoading, setVisible }) => {

    const [form] = Form.useForm();
    const [formFilled, setFormFilled] = useState(false);
    const [resetFields, setResetFields] = useState(true);
    const [user, setUser] = useState(null);


    useEffect(() => {
        if ((editForm && !formFilled) ||(editForm && user !== userData) ) {
            form.setFieldsValue(userData);
            setResetFields(true);
            setFormFilled(true);
            setUser(userData);
        }
         if(!editForm && resetFields){
             form.resetFields();
             setResetFields(false);
             setFormFilled(false);
         }
    });

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleOkAddUser = (values) => {
        setConfirmPreLoading(true);
        setTimeout(() => {
            /*check if values are correct, no duplicity etc. */
            setConfirmLoading(true);
            setConfirmPreLoading(false);
        }, 1000);
        setTimeout(() => {
            /* user values are correct save to mongo */
            if (editForm) {
                fetch(api_url + '/users/update/' + userData._id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        first_name: values.first_name,
                        last_name: values.last_name,
                        email: values.email,
                        password: values.password,
                        role: values.role,
                    }),
                })
                    .then(res => res.json())
                    .then(json => {
                        setVisible(false);
                        setConfirmLoading(false);
                        if (json.code === 200) {
                            console.log("User succesfully updated");
                        } else {
                            console.log("Error occured");
                        }
                    })
            }
            else {
                /* add new user to database */
                fetch(api_url + '/users/add/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        first_name: values.first_name,
                        last_name: values.last_name,
                        email: values.email,
                        password: values.password,
                        role: values.role,
                    }),
                })
                    .then(res => res.json())
                    .then(json => {
                        setVisible(false);
                        setConfirmLoading(false);
                        if (json.code === 200) {
                            console.log("User succesfully added");
                        } else {
                            console.log("Error occured");
                        }
                    })
            }

        }, 2000);

    };


    return (
        <Form {...layout}
            name="creation-form"
            form={form}
            onFinish={(values) => handleOkAddUser(values)}
            validateMessages={validateMessages}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                name='first_name'
                label="Jméno"

                rules={[
                    {
                        required: true,
                        message: 'Povinná položka',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name='last_name'
                label="Příjmení"

                rules={[
                    {
                        required: true,
                        message: 'Povinná položka',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name='email'
                label="Email"

                rules={[
                    {
                        type: 'email',
                        required: true
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name='password'
                label="Heslo"

                rules={[
                    {
                        required: true,
                        message: 'Povinná položka',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name='role'
                label="Role"
                rules={[
                    {
                        message: 'Povinná položka',
                        required: true
                    }
                ]}
            >
                <Select
                    placeholder="Vyberte jednu z možností"
                >
                    <Option value="admin">Admin</Option>
                    <Option value="guest">Host</Option>
                </Select>
            </Form.Item>
        </Form>
    );
};

export default UserForm;