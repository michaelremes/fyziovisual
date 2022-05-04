import React, { Component } from "react";
import { api_url } from "../../config/config"

import Sidebar from "../Sidebar/Sidebar";
import '../../styles/Users/Users.css';
import '../../styles/Table/Table-common.css';
import 'antd/dist/antd.min.css';

import AntTable from "../Table/AntTable";
import { ExclamationCircleTwoTone, InfoCircleOutlined, DeleteFilled, EditTwoTone } from '@ant-design/icons';

import { Button, Result, notification, Tooltip, Modal } from 'antd';
import UserForm from "./UserForm";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      visible: false,
      tableIsLoading: true,
      confirmLoading: false,
      confirmPreLoading: false,
      visibleDeleteModal: false,
      last_name: "",
      users: [],
      userToBeDeleted: '',
      userToUpdate: ''
    };

    /*is mounted is boolean used to prevent memory leaks 
      and synchronize fetching data and loading components*/
    this._isMounted = false;

    this.showModal = this.showModal.bind(this);
    this.handleOkDeleteUser = this.handleOkDeleteUser.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.deleteWarning = this.deleteWarning.bind(this);

    this.loadUsersData = this.loadUsersData.bind(this);

    this.formRef = React.createRef();

    /* setters for UserForm */
    this.setConfirmLoading = this.setConfirmLoading.bind(this);
    this.setConfirmPreLoading = this.setConfirmPreLoading.bind(this);
    this.setVisible = this.setVisible.bind(this);

  }

  loadUsersData() {
    fetch(api_url + '/users')
      .then(res => res.json())
      .then(
        (response) => {
          this._isMounted && this.setState({
            tableIsLoading: false,
            users: response.data
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
    this._isMounted && this.loadUsersData();

  }
  componentDidUpdate() {
    /* resetting form values to show correct inital values */
    if (this.state.edit && this.formRef.current) this.formRef.current.resetFields();

    this._isMounted && this.loadUsersData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }


  showModal() {
    this.setState(
      {
        visible: true,
        confirmLoading: false,
      });

  };

  handleOkDeleteUser = () => {
    const { userToBeDeleted } = this.state;

    this.setState({ confirmPreLoading: true });

    setTimeout(() => {
      this.setState({
        confirmLoading: true,
        confirmPreLoading: false,
      });
    },
      1000);
    setTimeout(() => {
      fetch(api_url + '/users/delete/' + userToBeDeleted._id, {
        method: 'DELETE',
      })
        .then(res => res.json())
        .then(
          (response) => {
            this.setState({
              visible: false,
              visibleDeleteModal: false,
              confirmLoading: false,
              userToBeDeleted: ''
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
      userToUpdate: '',
    });
  };

  deleteWarning = (record) => {
    this.setState({
      visibleDeleteModal: true,
      userToBeDeleted: record,
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
      tableIsLoading,
      confirmPreLoading,
      confirmLoading,
      users,
      userToBeDeleted,
      userToUpdate,
    } = this.state;


    const columns = [
      { key: 'first_name', title: 'Křestní jméno', dataIndex: 'first_name' },
      { key: 'last_name', title: 'Přijmení', dataIndex: 'last_name' },
      { key: 'email', title: 'Email', dataIndex: 'email' },
      { key: 'role', title: 'Role', dataIndex: 'role' },
      {
        title: 'Akce',
        key: 'action',
        render: (record) => (
          <>
            <Tooltip title="Upravit uživatele">
              <Button icon={<EditTwoTone />} onClick={() => {
                    this.setState(
                      {
                        userToUpdate: record,
                        edit: true,
                      },() =>  this.showModal());                        
              }} />
            </Tooltip>

            <Tooltip title="Odstranit uživatele">
              <Button danger icon={<DeleteFilled />} onClick={() => { this.deleteWarning(record) }} />
            </Tooltip>
          </>
        ),
      }
    ];







    const openNotificationWithIcon = type => {
      notification[type]({
        message: 'Vítejte na stránce s uživateli',
        duration: 7,
        description:
          'Zde můžete přidávat nové uživatele, upravovat již vytvořené, nebo je odstranit.',
      });
    };


    return (
      <div>

        <header className="Users-header">
          Seznam uživatelů
        </header>

        <div className='content'>
          <Sidebar />
          <div className="info-btn">
            <Tooltip title="Nápověda">
              <Button type="primary"
                shape="circle"
                icon={<InfoCircleOutlined />}
                onClick={() => openNotificationWithIcon('info')} />
            </Tooltip>
          </div>

          <Modal
            title={edit ? "Upravit uživatele" : "Přidat nového uživatele"}
            visible={visible}
            confirmLoading={confirmPreLoading}
            onCancel={this.handleCancel}
            footer={confirmLoading ?
              <Button onClick={this.handleCancel} >
                Zavřít
              </Button> :
              [
                <Button type="primary"
                  form="creation-form"
                  key="submit" htmlType="submit"
                  loading={confirmPreLoading}
                >
                  {edit ? "Uložit" : "Přidat"}
                </Button>,
                <Button key="cancel" onClick={this.handleCancel} >
                  Zavřít
                </Button>
              ]}
          >
            {confirmLoading ?
              <Result
                status="success"
                title={edit ? "Uživatel byl úspěšně uložen!" : "Uživatel byl úspěšně přidán!"}
              />
              :
              <UserForm userData={userToUpdate} editForm={edit} 
              setConfirmLoading={this.setConfirmLoading} setConfirmPreLoading={this.setConfirmPreLoading} setVisible={this.setVisible}/>
            }
          </Modal>

          <Modal
            title={<div><ExclamationCircleTwoTone twoToneColor="#f5222d" /> Varování</div>}
            visible={this.state.visibleDeleteModal}
            onOk={this.handleOkDeleteUser}
            confirmLoading={this.state.confirmPreLoading}
            onCancel={this.handleCancel}
            footer={confirmLoading ?
              <Button form="creation-form" onClick={this.handleCancel} >
                Zavřít
              </Button>
              :
              [
                <Button key='cancel' form="creation-form" onClick={this.handleCancel} >
                  Zavřít
                </Button>,
                <Button key='submit' danger type="primary" loading={confirmPreLoading} onClick={this.handleOkDeleteUser}>
                  Odstranit uživatele
                </Button>,

              ]
            }
          > {confirmLoading ?
            <Result
              status="success"
              title="Uživatel byl úspěšně smazán!"
            />
            :
            <>
              Opravdu si přejete odstranit uživatle<b> {userToBeDeleted.first_name} {userToBeDeleted.last_name}</b> ?
            </>
            }
          </Modal>
          <div className="data-table">
            <button type="button" className="btn btn-primary btn-lg"
              onClick={this.showModal}>+ Přidat uživatele</button>
            <AntTable data={users} columns={columns} isLoading={tableIsLoading} />
          </div>
        </div>
      </div>
    );

  }

}

export default UserList;