import React, { Component } from "react";
import { api_url } from "../../config/config"

import Sidebar from "../Sidebar/Sidebar";
import '../../styles/Table/Table-common.css';
import '../../styles/Module/ModuleList.css';
import { Button, Result, Tooltip, Modal, notification } from 'antd';
import { ExclamationCircleTwoTone, InfoCircleOutlined, DeleteFilled, EditTwoTone } from '@ant-design/icons';
import AntTable from "../Table/AntTable";
import ModuleForm from "./ModuleForm";

const layout = {

};

//lists existing Modules
class ModuleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableIsLoading: true,
      edit: false,
      visible: false,
      confirmLoading: false,
      confirmPreLoading: false,
      visibleDeleteModal: false,
      modules: [],
      moduleToBeDeleted: '',
      moduleToUpdate: '',
      moduleCategory: '',
    };

    this._isMounted = false;
    this.formRef = React.createRef();
    this.loadModulesData = this.loadModulesData.bind(this);

    this.showModal = this.showModal.bind(this);
    this.handleOkDeleteModule = this.handleOkDeleteModule.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.deleteWarning = this.deleteWarning.bind(this);

    /* setters for ModuleForm */
    this.setConfirmLoading = this.setConfirmLoading.bind(this);
    this.setConfirmPreLoading = this.setConfirmPreLoading.bind(this);
    this.setVisible = this.setVisible.bind(this);
  }

  loadModulesData() {
    fetch(api_url + '/modules')
      .then(res => res.json())
      .then(
        (response) => {
          this._isMounted && this.setState({
            tableIsLoading: false,
            modules: response.data
          });
        },
        (error) => {
          this.setState({
            tableIsLoading: true,
          });
        }
      )
  }


  componentDidMount() {
    this._isMounted = true;
    this._isMounted && this.loadModulesData();

  }
  componentDidUpdate() {
    /* resetting form values to show correct initial values */
    if (this.state.edit && this.formRef.current) this.formRef.current.resetFields();

    this._isMounted && this.loadModulesData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }




  showModal = (edit) => {
    this.setState({
      visible: true,
      confirmLoading: false,
    });
  };



  handleOkDeleteModule = () => {
    const { moduleToBeDeleted } = this.state;

    this.setState({ confirmPreLoading: true });

    setTimeout(() => {
      this.setState({
        confirmLoading: true,
        confirmPreLoading: false,
      });
    },
      1000);
    setTimeout(() => {
      fetch(api_url + '/modules/delete/' + moduleToBeDeleted._id, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(
          (response) => {
            this.setState({
              visible: false,
              visibleDeleteModal: false,
              confirmLoading: false,
              moduleToBeDeleted: ''
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
      edit: false,
      moduleToUpdate: '',
    });
  };

  deleteWarning = (record) => {
    this.setState({
      visibleDeleteModal: true,
      moduleToBeDeleted: record,
    });
  }

  setVisible(bool) {
    this.setState({
      visible: bool
    })
  }
  setConfirmLoading(bool) {
    this.setState({
      confirmLoading: bool
    })
  }
  setConfirmPreLoading(bool) {
    this.setState({
      confirmPreLoading: bool
    })
  }

  render() {

    const {
      visible,
      edit,
      confirmPreLoading,
      confirmLoading,
      modules,
      tableIsLoading,
      moduleToBeDeleted,
      moduleToUpdate,
      moduleCategory
    } = this.state;

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    const columns = [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
      },
      {
        title: 'N??zev',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Kategorie',
        dataIndex: 'category',
        key: 'category',
      },
      {
        title: 'Typ',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Akce',
        key: 'action',
        render: (record) => (
          <>
            <Tooltip title="Upravit modul">
              <Button icon={<EditTwoTone />} onClick={() => {
                this.setState(
                  {
                    moduleToUpdate: record,
                    edit: true,
                  }, () => this.showModal());
              }} />
            </Tooltip>

            <Tooltip title="Odstranit modul">
              <Button danger icon={<DeleteFilled />} onClick={() => { this.deleteWarning(record) }} />
            </Tooltip>
          </>
        ),
      }
    ];

    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'V??tejte na str??nce s moduly',
        duration: 8,
        description:
          'Moduly jsou z??kladn?? analyza??n?? komponenty konfigurace. Z modul?? lze poskl??dat pipeline(strom modul??)',
      });
    };



    return (
      <div>
        <header className="Module-header">
          Moduly
        </header>
        <div className='modules-content'>
          <Sidebar />
          <div className="info-btn">
            <Tooltip title="N??pov??da">
              <Button type="primary"
                shape="circle"
                icon={<InfoCircleOutlined />}
                onClick={() => openNotificationWithIcon('info')} />
            </Tooltip>
          </div>

          <Modal
            title={edit ? "Upravit modul" : "P??idat nov?? modul"}
            visible={visible}
            confirmLoading={confirmPreLoading}
            onCancel={this.handleCancel}
            footer={this.state.confirmLoading ?
              <Button onClick={this.handleCancel} >
                Zav????t
              </Button> :
              [
                <Button type="primary"
                  form="creation-form"
                  key="submit" htmlType="submit"
                  loading={confirmPreLoading}
                >
                  {edit ? "Ulo??it" : "P??idat"}
                </Button>,
                <Button key='cancel' onClick={this.handleCancel} >
                  Zav????t
                </Button>
              ]}
          >
            {confirmLoading ?
              <Result
                status="success"
                title={edit ? "Modul byl ??sp????n?? ulo??en!" : "Modul byl ??sp????n?? p??id??n!"}
              />
              :
              <ModuleForm moduleData={moduleToUpdate}
                editForm={edit}
                setConfirmLoading={this.setConfirmLoading}
                setConfirmPreLoading={this.setConfirmPreLoading}
                setVisible={this.setVisible}
              />
            }
          </Modal>
          <Modal
            title={<div><ExclamationCircleTwoTone twoToneColor="#f5222d" /> Varov??n??</div>}
            visible={this.state.visibleDeleteModal}
            onOk={this.handleOkDeleteModule}
            confirmLoading={this.state.confirmPreLoading}
            onCancel={this.handleCancel}
            footer={this.state.confirmLoading ?
              <Button form="creation-form" onClick={this.handleCancel} >
                Zav????t
              </Button>
              :
              [
                <Button key='cancel' form="creation-form" onClick={this.handleCancel} >
                  Zav????t
                </Button>,
                <Button key='submit' danger type="primary" loading={confirmPreLoading} onClick={this.handleOkDeleteModule}>
                  Odstranit modul
                </Button>
              ]
            }
          > {this.state.confirmLoading ?
            <Result
              status="success"
              title="Modul byl ??sp????n?? smaz??n!"
            />
            :
            <>
              Opravdu si p??ejete odstranit modul<b> {moduleToBeDeleted.name}</b> ?
            </>
            }


          </Modal>


          <div className="data-table">
            <button type="button" className="btn btn-primary btn-lg"
              onClick={this.showModal}>+ Vytvo??it modul</button>
            <AntTable data={modules} columns={columns} isLoading={tableIsLoading} />
          </div>
        </div>
      </div>
    );

  }

}

export default ModuleList;