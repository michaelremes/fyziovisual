import React, { useState, useEffect } from 'react';
import { Handle, Position, } from 'react-flow-renderer';
import { Card, Button, Collapse, Tooltip, Input, Form } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import '../../../styles/Pipeline/CustomNode/AnalyticalNode.css';
import { api_url } from "../../../config/config"

const { Panel } = Collapse;

let intervalId;

const AnalyticalNode = (props) => {

  const [display, setDisplay] = useState("delete-btn-hidden");
  const [scriptPath, setScriptPath] = useState(props.data.node_config.script_path);
  const [data, setData] = useState([]);


  const layout = {
    labelCol: { span: 30 },
    wrapperCol: { span: 14, padding: "5px" },
  };
  useEffect(() => {
    intervalId = setInterval(() => {
      loadData();
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, []);


  const loadData = () => {
    
    console.log(props.data)
    fetch(api_url + '/modules/' + props.data.sub_type )
      .then(res => res.json())
      .then(
        (response) => {
          setData(response.data)
        },
        (error) => {

        }
      )

  }

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
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'rgb(64, 63, 105)',
          zIndex: 999,
          border: '1px solid rgb(115, 113, 181)',
          width: '27px',
          height: 'calc(100% + 2px)',
          borderRadius: '0px 10px 10px 0px',
          right: '-26px',
          top: '-1px',
          transform: 'translateY(0px)',
        }}
      />


      <Card id='node-card' title={props.data.label} extra={
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
            >
              <Form.Item
                name='source'
                label="Cesta k modulu:"
                initialValue={scriptPath}
              >
                <Input id='python_script' disabled={true} />
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
        <Collapse >
          <Panel header="Zobrazit data">
            <Card id='data-card' title="Výstupní data" bordered={false}>
            <h4 className="mb-3" style={{color: "blue"}}>{Math.round(data[data.length-1])}</h4>
            </Card>
          </Panel>
        </Collapse>

      </Card>
    </div>);
}

export default AnalyticalNode;