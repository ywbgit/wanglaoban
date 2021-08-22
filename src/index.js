/* eslint-disable quote-props */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import SiderBar from 'components/SiderBar/SiderBar';
import ContentBox from 'components/ContentBox/ContentBox';
import { Layout, Form, Select, Input, Button, message } from 'antd';

import './index.css';

const { Header, Footer, Content } = Layout;

const steamIdList = {
  '叙利亚懵b悍匪': '76561198817228138',
  '小老鼠': '76561198928749878',
  '19204859': '76561199187028770',
  'csgo7': '76561199189831213',
  'csgo2': '76561199189878885',
  '2322': '76561199189886043',
  'csgo3': '76561199190125777',
  'csgo4': '76561199190229037',
  'csgo6': '76561199190259256',
  'csgo8': '76561199191024590',
  'csgo9': '76561199191698819',
};

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
                  rules={[{ required: true, message: '请选择你的steamId' }]}
                >
                  <Select>
                    {Object.entries(steamIdList || []).map(([key, val]) => {
                      return (
                        <Select.Option key={key} value={val}>
                          {key}
                        </Select.Option>
                      );
                    })}
                  </Select>
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
              赚大钱
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
