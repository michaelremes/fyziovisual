import React, { useState } from 'react';
import { Handle, Position, } from 'react-flow-renderer';
import { Card, Button, Collapse, Form, Input, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import '../../../styles/Pipeline/CustomNode/InputNode.css';
import ECGChart from './Charts/ECGChart';
import RespirationChart from './Charts/RespirationChart';
import TemperatureChart from './Charts/TemperatureChart';

const { Panel } = Collapse;


const layout = {
  labelCol: { span: 30 },
  wrapperCol: { span: 23, padding: "5px" },
};

export const randomNum = 18;
const InputNode = (props) => {
  const [display, setDisplay] = useState("delete-btn-hidden");

  const [sensorUrl, setSensorUrl] = useState(props.data.node_config.input_source);


  const showButton = e => {
    e.preventDefault();
    setDisplay("delete-btn-visible");
  };

  const hideButton = e => {
    e.preventDefault();
    setDisplay("delete-btn-hidden");
  };
  const renderGraph = (type) => {
    switch (type) {
      case 'ecg':
        return <ECGChart sensor_url={sensorUrl} />;
      case 'respiration':
        return <RespirationChart sensor_url={sensorUrl} />;
      case 'temperature':
        return <TemperatureChart sensor_url={sensorUrl} />;
      default:
        return <></>
    }
  }

  return (
    <div className='mainNodeDiv'
      onMouseEnter={e => showButton(e)}
      onMouseLeave={e => hideButton(e)}
    >
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'rgb(64, 63, 105)',
          zIndex: 999,
          border: '1px solid rgb(115, 113, 181)',
          width: '27px',
          height: 'calc(100% + 1px)',
          borderRadius: '0px 10px 10px 0px',
          right: '-26px',
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

        <Collapse>
          <Panel header="Nastavení">
            <Form
              {...layout}
              name="basic"
              layout="vertical"
            >
              <Form.Item
                name='source'
                label="Zdroj:"
                initialValue={sensorUrl}
              >
                <Input onChange={(e) => { setSensorUrl(e.target.value) }} />
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>

        <Collapse>
          <Panel header="Zobrazit data">
            <div className='input-graph'>
              {renderGraph(props.data.sub_type)}
            </div>
          </Panel>
        </Collapse>

      </Card>
    </div>
  );
}

export default InputNode;