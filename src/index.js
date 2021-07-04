/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import SiderBar from 'components/SiderBar/SiderBar';
import ContentBox from 'components/ContentBox/ContentBox';
import { Layout, Form, Input, Button, message } from 'antd';

import './index.css';

const { Header, Footer, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // console.log(routersConfig);
  }

  handleFinish = (values) => {
    window.localStorage.setItem(
      'wanglaobanRequestParams',
      JSON.stringify(values),
    );
    message.success('应用成功');
    window.location.reload();
  };

  handleClear = () => {
    window.localStorage.removeItem('wanglaobanRequestParams');
    message.success('清除应用成功');
    window.location.reload();
  };

  render() {
    let wanglaobanRequestParams = window.localStorage.getItem(
      'wanglaobanRequestParams',
    );
    if (wanglaobanRequestParams) {
      wanglaobanRequestParams = JSON.parse(wanglaobanRequestParams);
    } else {
      wanglaobanRequestParams = {
        appId: '',
        steamId: '',
      };
    }
    return (
      <HashRouter>
        <Layout>
          <SiderBar />

          <Layout className="site-layout">
            <Header className="site-layout-background">
              <Form
                name="basic"
                layout="inline"
                onFinish={this.handleFinish}
                initialValues={{ ...wanglaobanRequestParams }}
              >
                <Form.Item
                  label="appId"
                  name="appId"
                  rules={[{ required: true, message: '请输入你的appId' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="steamId"
                  name="steamId"
                  rules={[{ required: true, message: '请输入你的steamId' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    应用
                  </Button>
                </Form.Item>

                <Form.Item>
                  <Button type="default" onClick={this.handleClear}>
                    清除应用
                  </Button>
                </Form.Item>
              </Form>
            </Header>
            <Content
              style={{
                margin: '0 16px',
              }}
            >
              <ContentBox />
            </Content>
            <Footer
              style={{
                textAlign: 'center',
              }}
            >
              老板真帅、真有钱
            </Footer>
          </Layout>
        </Layout>
      </HashRouter>
    );
  }
}

const divNode = document.createElement('div');
divNode.id = 'app';

document.body.appendChild(divNode);

ReactDOM.render(<App />, document.getElementById('app'));
