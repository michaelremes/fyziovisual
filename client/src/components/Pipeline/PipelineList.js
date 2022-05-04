import React, { Component } from "react";
import { api_url } from "../../config/config"
import Sidebar from "../Sidebar/Sidebar";
import { Modal, Result } from 'antd';

import '../../styles/Table/Table-common.css';
import '../../styles/Pipeline/PipelineList.css';
import { Tooltip, notification, Button } from 'antd'
import AntTable from "../Table/AntTable";
import { ExclamationCircleTwoTone, InfoCircleOutlined, EditTwoTone, DeleteFilled } from '@ant-design/icons';
import PipelineConfig from "./PipelineConfig";


//lists existing users
class PipelineList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pipelines: [],
      columns: [],
      isLoading: false,
      tableIsLoading: true,
      visibleDeleteModal: false,
      confirmPreLoading: false,
      confirmLoading: false,
      visible: false,
      idToUpdate: '',
      pipelineToBeDeleted: '',
      pipelineToBeUpdated: null,
      edit: false,
    };
    this._isMounted = false;

    this.onCreateNewPipeline = this.onCreateNewPipeline.bind(this);
    this.handleOkDeletePipeline = this.handleOkDeletePipeline.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showModal = this.showModal.bind(this);
    this.deleteWarning = this.deleteWarning.bind(this);
    this.loadPipelinesData = this.loadPipelinesData.bind(this);

  }

  loadPipelinesData() {
    fetch(api_url + '/pipelines')
      .then(res => res.json())
      .then(
        (response) => {
          this._isMounted && this.setState({
            tableIsLoading: false,
            pipelines: response.data
          });
        },
        (error) => {
          this.setState({
            tableIsLoading: true,
            error
          });
        }
      )
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.loadPipelinesData();

  }
  componentDidUpdate() {
   this._isMounted && this.loadPipelinesData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }


  onCreateNewPipeline = () => {
    this.setState({
      edit: true,
    })
  }

  deleteWarning = (record) => {
    this.setState({
      visibleDeleteModal: true,
      pipelineToBeDeleted: record,
    });
  }
  handleOkDeletePipeline = () => {
    const { pipelineToBeDeleted } = this.state;
    this.setState({ confirmPreLoading: true });

    setTimeout(() => {
      this.setState({
        confirmLoading: true,
        confirmPreLoading: false,
      });
    },
      1000);
    setTimeout(() => {
      fetch(api_url + '/pipelines/delete/' + pipelineToBeDeleted._id, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(
          (response) => {
            this.setState({
              visible: false,
              visibleDeleteModal: false,
              confirmLoading: false,
              pipelineToBeDeleted: ''
            });
          },
          (error) => {
          }
        )
    }, 2000);


  };

  handleCancel = () => {
    this.setState({
      visible: false,
      visibleDeleteModal: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };



  render() {
    const {
      tableIsLoading,
      confirmPreLoading,
      confirmLoading,
      visibleDeleteModal,
      pipelines,
      pipelineToBeDeleted,
      pipelineToBeUpdated,
      edit,
    } = this.state;

    const columns = [
      { key: '_id', title: 'ID', dataIndex: '_id' },
      { key: 'name', title: 'Název', dataIndex: 'name' },
      { key: 'author', title: 'Autor', dataIndex: 'author' },
      {
        title: 'Akce',
        key: 'action',
        render: (record) => (
          <>
            <Tooltip title="Upravit pipeline">
              <Button icon={<EditTwoTone />} onClick={() => {
                this.setState({
                  edit: true,
                  pipelineToBeUpdated: record,
                });
              }} />
            </Tooltip>

            <Tooltip title="Odstranit pipeline">
              <Button danger icon={<DeleteFilled />} onClick={() => { this.deleteWarning(record) }} />
            </Tooltip>
          </>
        ),
      }
    ];



    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'Vítejte na stránce s pipelinami',
        duration: 8,
        description:
          'Pipeline je konfigurace modulů, příjmá na vstup signál ze senzorů, nad signálem je prováděna vybraná analýza a výstup ukládán do Influx databáze.',
      });
    };

    return (

      <div>
        {edit ? <PipelineConfig pipelineInstance={pipelineToBeUpdated} /> : <>
          <header className="Pipeline-header">
            Seznam pipeline
          </header>

          <div className="pipelineList-content">
            <Sidebar />
            <div className="info-btn">
              <Tooltip title="Nápověda">
                <Button type="primary"
                  shape="circle"
                  icon={<InfoCircleOutlined />}
                  onClick={() => openNotificationWithIcon('info')} />
              </Tooltip>
            </div>
            <div className="data-table">
              <Modal
                title={<div><ExclamationCircleTwoTone twoToneColor="#f5222d" /> Varování</div>}
                visible={visibleDeleteModal}
                onOk={this.handleOkDeletePipeline}
                confirmLoading={confirmPreLoading}
                onCancel={this.handleCancel}
                footer={this.state.confirmLoading ?
                  <Button form="creation-form" onClick={this.handleCancel} >
                    Zavřít
                  </Button>
                  :
                  [
                    <Button key='cancel' form="creation-form" onClick={this.handleCancel} >
                      Zavřít
                    </Button>,
                    <Button key='confirm' danger type="primary" loading={confirmPreLoading} onClick={this.handleOkDeletePipeline}>
                      Odstranit pipeline
                    </Button>,

                  ]
                }
              > {confirmLoading ?
                <Result
                  status="success"
                  title="Pipelina byla úspěšně smazána!"
                />
                :
                <>
                  Opravdu si přejete odstranit pipeline<b> {pipelineToBeDeleted.name}</b> ?
                </>


                }

              </Modal>
              <button type="button" className="btn btn-primary btn-lg"
                onClick={this.onCreateNewPipeline}>+ Vytvořit pipeline</button>
              <AntTable data={pipelines} columns={columns} isLoading={tableIsLoading} />
            </div>
          </div>
        </>
        }

      </div>
    );

  }

}

export default PipelineList;