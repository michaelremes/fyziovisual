import React, { Component } from "react";
import { Link } from "react-router-dom";
import 'antd/dist/antd.min.css';
import { Menu, Button, notification } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';


import '../../styles/Sidebar/Sidebar.css'

import home_icon from '../../assets/icons/home.png'
import pipeline_icon from '../../assets/icons/pipeline_icon.png'
import user_icon from '../../assets/icons/user.png'
import logout_icon from '../../assets/icons/log-out.png'
import modules_icon from '../../assets/icons/gears.png'


class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selectedItem: 'dashboard',
      user_role: ''
    };

    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.logout = this.logout.bind(this);
    this.openNotificationWithIcon = this.openNotificationWithIcon.bind(this);
  }

  componentWillMount() {
    /* minor fix to higlight selected component of the sidebar */
    const currentURL = window.location.href;
    const currentComponent = currentURL.split("/");
    if (currentComponent != null) {
      this.setState({
        selectedItem: currentComponent[3],
        collapsed: this.props.collapsed,
      });
    }

    this.setState({ user_role: localStorage.getItem('user_role') });


  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  openNotificationWithIcon(type, message) {
    notification[type]({
      message: message,
    });
  };
  logout() {
    localStorage.clear();
    this.openNotificationWithIcon('success', 'Úspěšné odhlášení');
  }


  render() {
    return (
      <div className="sidebarDiv">

        {/* Make selected item highlighted */}
        <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
          {React.createElement(this.state.collapsed ? RightOutlined : LeftOutlined)}
        </Button>
        <Menu
          defaultSelectedKeys={this.state.selectedItem}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="dashboard" icon={<img src={home_icon} style={{ width: 32, height: 32 }} alt="home_icon" />}>
            <Link to="/dashboard">Hlavní stránka</Link>
          </Menu.Item>
          <Menu.Item key="modules" icon={<img src={modules_icon} style={{ width: 32, height: 32 }} alt="modules_icon" />}>
            <Link to="/modules">Moduly</Link>
          </Menu.Item>
          <Menu.Item key="pipelines" icon={<img src={pipeline_icon} style={{ width: 32, height: 32 }} alt="pipelines_icon" />}>
            <Link to="/pipelines"> Pipeline </Link>
          </Menu.Item>

          {this.state.user_role === 'admin' ?
            <Menu.Item key="users" icon={<img src={user_icon} style={{ width: 32, height: 32 }} alt="user_icon" />}>
              <Link to="/users"> Uživatelé </Link>
            </Menu.Item>
            : <></>
          }
          <Menu.Item id='log-out' key="5" icon={<img src={logout_icon} style={{ width: 32, height: 32 }} alt="logout_icon" />}>
            <Link to="/" onClick={this.logout} >Odhlásit se</Link>
          </Menu.Item>

        </Menu>
      </div>
    );
  }
}

export default Sidebar;