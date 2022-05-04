import React, { useState, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  removeElements,
  Controls,
  Background,
} from 'react-flow-renderer';
import { api_url } from "../../config/config"
import ModulesSidebar from './ModuleSidebar';
import ButtonEdge from './ButtonEdge';

import InputNode from './InputNode/InputNode';
import AnalyticalNode from './AnalyticalNode/AnalyticalNode';
import OutputNode from './OutputNode/OutputNode';

import "../../styles/Pipeline/PipelineConfig.css";
import "../../styles/Pipeline/dnd.css";
import Sidebar from '../Sidebar/Sidebar';

import { Button, Modal, Result, Input, Form, Tooltip } from "antd";

import { SaveOutlined, CloseOutlined, DoubleRightOutlined, PauseOutlined } from '@ant-design/icons';

import '../../styles/Pipeline/CustomNode/InputNode.css';

let nodeId = 0;
const getId = () => `dndnode_${nodeId++}`;



const PipelineConfig = ({ pipelineInstance }) => {
  const reactFlowWrapper = useRef(null);
  const [form] = Form.useForm();
  const _isMounted = useRef(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState([]);
  const [pipelineId, setPipelineId] = useState('');
  const [pipelineInitilized, setPipelineInitilized] = useState(false);
  const [pipelineName, setPipelineName] = useState('Pipeline Name');
  const [visibleSaveModal, setSaveModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmPreLoading, setConfirmPreLoading] = useState(false);
  const [pipelineStart, setPipelineStart] = useState(false);
  const [userEmail, setUserEmail] = useState(false);
  const onConnect = (params) => setElements((els) => addEdge(
    {
      ...params,
      type: 'buttonedge',
      data: { onElemRemove: onElemRemove },
      animated: false,
    }, els));
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));




  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);



  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };
  const initializePipeline = () => {

    /* setup after component is mounted */
    if (_isMounted.current) {

      pipelineInstance.data.filter(elem => {
        console.log('elem: ' + JSON.stringify(elem));
        let elemId = elem.id.split('_')[1];

        console.log(elemId);
      })



      for (let elemObj of pipelineInstance.data) {

        /* create data object if doesnt work */
        if (elemObj.data === undefined) elemObj.data = {};

        elemObj.data.onElemRemove = onElemRemove;

        let elemId = elemObj.id.split('_')[1];
        if (elemId > nodeId) nodeId = elemId;
        else nodeId++;

        setElements((es) => es.concat(elemObj));

      }

      setPipelineName(pipelineInstance.name);
      setPipelineId(pipelineInstance._id);
    }

  }
  /* component did mount */
  useEffect(() => {

    /*load pipeline only after reactflow is initialized and call just once */
    if (pipelineInstance !== null && reactFlowInstance !== null && !pipelineInitilized) {
      initializePipeline();
      setPipelineInitilized(true);
    }
  });
  /* run once when mounting*/
  useEffect(() => {
    setUserEmail(localStorage.getItem('email'));
    _isMounted.current = true;
    /* run when component unmounts */
    return () => {
      _isMounted.current = false;
    };
  }, []);


  const showSaveModal = () => {
    setSaveModalVisible(true);
  };
  const handleCancel = () => {
    setSaveModalVisible(false);
  };
  /* refresh page to close modelling tool */
  const refreshPage = () => {
    stopPipeline();
    window.location.reload();
  }
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };


  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const category = event.dataTransfer.getData('application/node_category');
    const sub_type = event.dataTransfer.getData('application/node_type');
    const label = event.dataTransfer.getData('application/node_label');
    const node_config = event.dataTransfer.getData('application/node_config');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const newNode = {
      id: getId(),
      type: category,
      label,
      position,
      data: { onElemRemove: onElemRemove, label: `${label}`, sub_type: sub_type, node_config: JSON.parse(node_config) },
    };

    setElements((es) => es.concat(newNode));
  };
  const nodeTypes = {
    fv_input: InputNode,
    fv_analytical: AnalyticalNode,
    fv_output: OutputNode,
  };

  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdate = (oldEdge, newConnection) =>
    setElements((els) => PipelineConfig(oldEdge, newConnection, els));


  const onElemRemove = (elemId) => {
    let currentInstanceElements = reactFlowInstance.toObject().elements;
    /* filter out item to delete by id 
    and set new elements, also delete all corresponding edges */
    setElements(currentInstanceElements.filter(
      item => item.id !== elemId && item.source !== elemId && item.target !== elemId
    ));
    console.log("remove called on entity with id: " + elemId);
  }


  const edgeTypes = {
    buttonedge: ButtonEdge,
  };

  const savePipelineToDB = (name) => {

    let pipelineElements = reactFlowInstance.toObject().elements;
    for (let elemObj of pipelineElements) {
      /* set animated false before save */
      if (elemObj.type === 'buttonedge') {
        elemObj.animated = false;
      }
    }
    if (pipelineId !== '') {

      fetch(api_url + '/pipelines/update/' + pipelineId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          author: userEmail,
          data: pipelineElements,

        }),
      })
        .then(res => res.json())
        .then(json => {
          setConfirmLoading(false);
          setSaveModalVisible(false);
          setPipelineName(name);
          if (json.code === 200) {
            console.log("Pipeline succesfully updated");
          } else {
            console.log("Error occured");
          }
        })
    }
    else {
      /* save pipeline */
      fetch(api_url + '/pipelines/add/pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          author: userEmail,
          data: pipelineElements,
          /*save reactFlowInstance.toObject() to include zoom and graph position */
        }),
      })
        .then(res => res.json())
        .then(json => {
          console.log(json)
          setConfirmLoading(false);
          setSaveModalVisible(false);
          setPipelineName(name);
          form.setFieldsValue({ name: name });
          setPipelineId(json.data._id)
          if (json.code === 200) {
            console.log("Pipeline saved");
          } else {
            console.log("Error occured");
          }
        })
    }
  };


  const savePipeline = async (values) => {

    setConfirmPreLoading(true);

    setTimeout(() => {
      setConfirmPreLoading(false);
      setConfirmLoading(true);
    }, 1000);
    setTimeout(() => {
       savePipelineToDB(values.name)
    }, 2000);
  };

  const runPipeline = async () => {
    
    setPipelineStart(true);
    let staticEdges = [];
    let animEdges = [];
    for (let elemObj of reactFlowInstance.toObject().elements) {
      /* remove edges and add animated edges instead */
      if (elemObj.type === 'buttonedge') {
        staticEdges.push(elemObj);
        let elemObjAnim = elemObj;
        elemObjAnim.animated = true;
        animEdges.push(elemObjAnim);
      }
    }
    
    onElementsRemove(staticEdges);
    setElements((es) => es.concat(animEdges));
    savePipelineToDB(pipelineName);
    /* run pipeline */
    fetch(api_url + '/pipelines/run/' + pipelineId)
      .then(res => res.json())
      .then(console.log('pipeline ' + pipelineId + ' run'))

  }

  const stopPipeline = () => {
    setPipelineStart(false);

    let staticEdges = [];
    let animEdges = [];
    for (let elemObj of reactFlowInstance.toObject().elements) {
      /* remove edges and add animated edges instead */
      if (elemObj.type === 'buttonedge') {
        animEdges.push(elemObj);
        let elemObjStatic = elemObj;
        elemObjStatic.animated = false;
        staticEdges.push(elemObjStatic);
        elemObj.animated = false;
      }
    }
    onElementsRemove(animEdges);
    setElements((es) => es.concat(staticEdges));


    /* stop pipeline on server */
    fetch(api_url + '/pipelines/stop')
      .then(res => res.json())
      .then(console.log('pipeline ' + pipelineId + ' stopped'))

  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <header className="PipelineConfig-header">
        {pipelineName === '' ? "Konfigurace Pipeline" : pipelineName}
      </header>

      <div className='content'>

        <Sidebar collapsed={true} />

        <div className='pipeline-editor'>
          <div className="dndflow">

            <ReactFlowProvider>
              <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                <ReactFlow
                  elements={elements}
                  onConnect={onConnect}
                  onElementsRemove={onElementsRemove}
                  onLoad={onLoad}
                  onDrop={onDrop}
                  edgeTypes={edgeTypes}
                  onDragOver={onDragOver}
                  onEdgeUpdate={onEdgeUpdate}
                  nodeTypes={nodeTypes}
                >
                  <Controls />
                  <Background
                    variant="dots"
                    gap={30}
                    size={1}
                    color='#9e9e9e'
                  />
                  <Tooltip title="Zavřít modelovací nástroj">
                    <Button
                      id='close-button'
                      icon={<CloseOutlined />}
                      type='danger'
                      size='large'
                      shape='circle'
                      label='Odstranit'
                      onClick={refreshPage}
                    />
                  </Tooltip>
                  <Modal
                    title="Uložit pipeline"
                    visible={visibleSaveModal}
                    confirmLoading={confirmPreLoading}
                    onCancel={handleCancel}
                    footer={confirmLoading ?
                      <Button onClick={handleCancel} >
                        Zavřít
                      </Button>
                      :
                      [
                        <Button type="primary"
                          form="creation-form"
                          key="submit" htmlType="submit"
                          loading={confirmPreLoading}
                          icon={<SaveOutlined />}
                        >
                          Uložit
                        </Button>,
                        <Button key='cancel' onClick={handleCancel} >
                          Zavřít
                        </Button>
                      ]}
                  >
                    {confirmLoading ?
                      <Result
                        status="success"
                        title="Pipeline byla úspěšně uložena."
                      />
                      :
                      <Form {...layout}
                        name="creation-form"
                        form={form}
                        onFinish={(values) => savePipeline(values)}
                        onFinishFailed={onFinishFailed}>
                        <Form.Item
                          name='name'
                          label="Název"
                          initialValue={pipelineName}
                          rules={[
                            {
                              required: true,
                              message: 'Povinná položka',
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Form>
                    }
                  </Modal>
                  <div className="action-buttons">
                    <Button icon={<SaveOutlined />} size="large" loading={confirmPreLoading} onClick={showSaveModal}>
                      Uložit
                    </Button>,
                    {pipelineStart ?
                      <Button type="danger"
                        icon={<PauseOutlined />}
                        size="large"
                        onClick={stopPipeline}
                      >
                        Zastavit
                      </Button>
                      :
                      <Button type="primary"
                        icon={<DoubleRightOutlined />}
                        size="large"
                        onClick={runPipeline}
                      >
                        Spustit
                      </Button>}
                  </div>

                </ReactFlow>

              </div>

              <ModulesSidebar />

            </ReactFlowProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineConfig;
