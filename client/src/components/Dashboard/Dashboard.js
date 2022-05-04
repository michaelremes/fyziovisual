import React, { Component } from 'react';
import { Table, Button } from 'antd';
import Sidebar from '../Sidebar/Sidebar';
import "../../styles/Dashboard/Dashboard.css";
import "../../styles/Table/Table-common.css";

import 'antd/dist/antd.min.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: '',
      visible: false,
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.showModal = this.showModal.bind(this);
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



    return (
      <div>
        <header className="Dashboard-header">
          Hlavní stránka
        </header>

        <div className="dashboard-content">
          <Sidebar />
          <div className="mainDash">
            {/* <h1 id="h1_title" className='display-5'>Moje Pipeliny</h1>
            <Table columns={columns} dataSource={data} pagination={false} /> */}
          </div>
        </div>
      </div>
    );

  }
}

export default Dashboard;