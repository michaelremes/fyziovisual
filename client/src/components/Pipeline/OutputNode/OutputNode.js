import React, { useState } from 'react';
import { Handle, Position, } from 'react-flow-renderer';
import { Card, Button, Collapse, Form, Input, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import '../../../styles/Pipeline/CustomNode/OutputNode.css';

const { Panel } = Collapse;


const OutputNode = (props) => {
  const [display, setDisplay] = useState("delete-btn-hidden");

  const [url, setUrl] = useState(props.data.node_config.influx_config.url);
  const [org, setOrg] = useState(props.data.node_config.influx_config.org);
  const [bucket, setBucket] = useState(props.data.node_config.influx_config.bucket);





  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18},
  };

  const showButton = e => {
    e.preventDefault();
    setDisplay("delete-btn-visible");
  };

  const hideButton = e => {
    e.preventDefault();
    setDisplay("delete-btn-hidden");
  };

  return (
    <div className='mainNodeDiv'
      onMouseEnter={e => showButton(e)}
      onMouseLeave={e => hideButton(e)}
    >
      <Handle
        id="handle"
        type="target"
        position={Position.Left}
        style={{
          background: 'rgb(64, 63, 105)',
          zIndex: 999,
          border: '1px solid rgb(115, 113, 181)',
          width: '27px',
          height: 'calc(100% + 2px)',
          borderRadius: '10px 0px 0px 10px',
          left: '-26px',
          top: '-1px',
          transform: 'translateY(0px)',

        }}
      />


      <Card title={props.data.label} extra={
        <Tooltip title="Odstanit uzel">
          <Button
            className={display}
            icon={<DeleteOutlined />}
            type='danger'

            label='Odstranit'
            onClick={() => {
              props.data.onElemRemove(props.id);
            }}
          />
        </Tooltip>

      }
        style={{
          width: 'auto',
          height: 'auto',
          border: '2px solid rgb(115, 113, 181)',
        }}
      >

        <Collapse >
          <Panel header="Nastavení připojení">
            <Form
              {...layout}
              name="basic"
            >
              <Form.Item
                name='url'
                label="url"
                initialValue={url}

              >
                <Input />
              </Form.Item>
              <Form.Item
                name='org'
                label="org"
                initialValue={org}

              >
                <Input />
              </Form.Item>
              <Form.Item
                name='bucket'
                label="bucket"
                initialValue={bucket}

              >
                <Input />
              </Form.Item>

            </Form>
          </Panel>
        </Collapse>

      </Card>
    </div>
  );
}

export default OutputNode;