import React, { useState, useEffect } from 'react';
import { api_url } from "../../config/config"
import { Form, Input, Radio } from 'antd';

const layout = {
    labelCol: {
        span: 11,
    },


};


const ModuleForm = ({ moduleData, editForm, setConfirmLoading, setConfirmPreLoading, setVisible }) => {

    const [form] = Form.useForm();
    const [formFilled, setFormFilled] = useState(false);
    const [resetFields, setResetFields] = useState(true);
    const [module, setModule] = useState(null);
    const [moduleCategory, setModuleCategory] = useState(null);
    const [moduleType, setModuleType] = useState(null);

    useEffect(() => {
        if ((editForm && !formFilled) || (editForm && module !== moduleData)) {
            form.setFieldsValue(moduleData);
            setResetFields(true);
            setFormFilled(true);
            setModule(moduleData);
            setModuleCategory(moduleData.category);
            setModuleType(moduleData.type);
            console.log('module data: ' + JSON.stringify(moduleData));
        }
        if (!editForm && resetFields) {
            form.resetFields();
            setResetFields(false);
            setFormFilled(false);
        }
    });


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleOkAddModule = (values) => {
        setConfirmPreLoading(true);
        setTimeout(() => {
            /*should check if values are correct, no duplicity etc. */
            /*....*/
            setConfirmLoading(true);
            setConfirmPreLoading(false);
        }, 1000);
        setTimeout(() => {
            /* user values are correct save to mongo */
            if (editForm) {
                fetch(api_url + '/modules/update/' + moduleData._id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: values.name,
                        category: values.category,
                        type: values.type,
                        data: {
                            script_path: values.script_path,
                            sample_rate: values.sample_rate,
                            input_source: values.input_source,
                            influx_config: {
                                url: values.url,
                                org: values.org,
                                bucket: values.bucket,
                            },
                        }
                    }),
                })
                    .then(res => res.json())
                    .then(json => {
                        setVisible(false);
                        setConfirmLoading(false);
                        if (json.code === 200) {
                            console.log("Module succesfully updated");
                        } else {
                            console.log("Error occured");
                        }
                    })
            }
            else {
                /* add new user to database */
                fetch(api_url + '/modules/add/module', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: values.name,
                        category: values.category,
                        type: values.type,
                        data: {
                            script_path: values.script_path,
                            sample_rate: values.sample_rate,
                            input_source: values.input_source,
                            influx_config: {
                                url: values.url,
                                org: values.org,
                                bucket: values.bucket,
                                token: values.token,
                            },
                        }
                    }),
                })
                    .then(res => res.json())
                    .then(json => {
                        setVisible(false);
                        setConfirmLoading(false);
                        if (json.code === 200) {
                            console.log("Module succesfully added");
                        } else {
                            console.log("Error occured");
                        }
                    })
            }

        }, 2000);

    };

    const handleModuleCategoryChange = e => {
        setModuleCategory(e.target.value);
    };
    const handleModuleTypeChange = e => {
        setModuleType(e.target.value);
    };

    const renderTypeOptions = () => {
        let optionItems = [];
        let optionItemsInput = [
            <Radio.Button key='0' value="ecg">EKG</Radio.Button>,
            <Radio.Button key='1' value="respiration">Dech</Radio.Button>,
            <Radio.Button key='2' value="temperature">Teplota</Radio.Button>
        ];
        let optionItemsAnalytical = [
            <Radio.Button key='0' value="bpm">BPM</Radio.Button>,
            <Radio.Button key='1' value="resp_rate">Dechová frekvence</Radio.Button>
        ];
        let optionItemsOutput = [
            <Radio.Button key='0' value="influx">InfluxDB</Radio.Button>
        ];
        switch (moduleCategory) {
            case 'input':
                optionItems = optionItemsInput;
                break;
            case 'analytical':
                optionItems = optionItemsAnalytical;
                break;
            case 'output':
                optionItems = optionItemsOutput;
                break;
            default:
                optionItems = [];
        }

        return (
            <>
                {optionItems}
            </>
        )
    }


    return (
        <Form {...layout}
            key={moduleData}
            name="creation-form"
            form={form}
            onFinish={(values) => handleOkAddModule(values)}
            onFinishFailed={onFinishFailed}>

            <Form.Item
                name='name'
                label="Název modulu:"
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
                name='category'
                label="Kategorie modulu" rules={[
                    {
                        required: true,
                        message: 'Povinná položka',
                    },
                ]}
            >
                <Radio.Group size="large" buttonStyle="solid" onChange={handleModuleCategoryChange}>
                    <Radio.Button value="input">Vstupní modul</Radio.Button>
                    <Radio.Button value="analytical">Analyzační modul</Radio.Button>
                    <Radio.Button value="output">Výstupní modul</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                name='type'
                label="Typ modulu" rules={[
                    {
                        required: true,
                        message: 'Povinná položka',
                    },
                ]}
            >

                <Radio.Group onChange={handleModuleTypeChange} buttonStyle="solid" style={{ marginTop: 10 }}>

                    {renderTypeOptions()}
                </Radio.Group>



            </Form.Item>
            {moduleCategory === 'input' ?
                <Form.Item
                    name='input_source'
                    label="Zdroj"
                //  initialValue={moduleData.data ? moduleData.data.input_source : null}
                >
                    <Input id='input_source' placeholder='URL adresa senzoru' />
                </Form.Item>
                : null}
            {moduleCategory === 'analytical' ?
                <>
                    <Form.Item
                        name='sample_rate'
                        label="Vzorkovací frekvence"
                        rules={[
                            {
                                required: false,
                                message: 'Povinná položka pro analytický modul',
                            },
                        ]}
                    >
                        <Input id='sample_rate' />
                    </Form.Item>
                    <Form.Item
                        name='script_path'
                        label="Cesta ke skriptu"
                        rules={[
                            {
                                required: false,
                                message: 'Povinná položka pro analytický modul',
                            },
                        ]}
                    >
                        <Input id='python_script' placeholder='Relativní cesta na serveru' />
                    </Form.Item>
                </>
                : null}
            {moduleCategory === 'output' && moduleType === 'influx' ?
                <>
                    <Form.Item
                        name='url'
                        label="url"
                        initialValue={moduleData.data ? moduleData.data.influx_config.url : null}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='org'
                        label="org"
                        initialValue={moduleData.data ? moduleData.data.influx_config.org : null}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='bucket'
                        label="bucket"
                        initialValue={moduleData.data ? moduleData.data.influx_config.bucket : null}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='token'
                        label="token"
                        initialValue={moduleData.data ? moduleData.data.influx_config.token : null}
                    >
                        <Input />
                    </Form.Item>
                </>
                : null}
        </Form>
    );
};

export default ModuleForm;