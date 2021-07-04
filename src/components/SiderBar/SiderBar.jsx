import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
import { withRouter, NavLink } from 'react-router-dom';
import routersConfig from '../../router/routersConfig';
import './index.css';

const { Sider } = Layout;
const { SubMenu } = Menu;

class SiderBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: 'dark',
      collapsed: false,
    };
  }

  componentDidMount() {}

  renderSiderbar = (config) =>
    config.map((item) => {
      if (item.childRouters && item.childRouters.length) {
        return (
          <SubMenu
            key={item.name}
            title={
              <div style={{ display: 'flex' }}>
                <span style={{ marginRight: 5 }}>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            }
          >
            {this.renderSiderbar(item.childRouters)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={item.path}>
          <NavLink to={item.path}>
            <div style={{ display: 'flex' }}>
              <span style={{ marginRight: 5 }}>{item.icon}</span>
              <span>{item.name}</span>
            </div>
          </NavLink>
        </Menu.Item>
      );
    });

  changnTheme = () => {
    const { theme } = this.state;
    this.setState({
      theme: theme === 'dark' ? 'light' : 'dark',
    });
  };

  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
    });
  };

  render() {
    const { theme, collapsed } = this.state;
    const { location } = this.props;
    return (
      <Sider
        theme={theme}
        // collapsible
        collapsed={collapsed}
        // onCollapse={this.onCollapse}
        style={{
          minHeight: '100vh',
        }}
      >
        {/* <Switch
          checkedChildren="浅色"
          unCheckedChildren="深色"
          onChange={this.changnTheme}
        /> */}
        <div className="side_title">王老板的店</div>
        <Menu theme={theme} mode="inline" selectedKeys={[location.pathname]}>
          {this.renderSiderbar(routersConfig)}
        </Menu>
      </Sider>
    );
  }
}
export default withRouter(SiderBar);
