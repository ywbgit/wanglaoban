import React from 'react';
import Warehouse from 'pages/Warehouse';
// import Pageone from 'pages/Pageone/Pageone';
import { HomeOutlined } from '@ant-design/icons';

const routersConfig = [
  {
    path: '/',
    name: '仓库',
    icon: <HomeOutlined />,
    component: () => <Warehouse />,
    showSiderbar: true,
  },
  // {
  //   path: '/pageone',
  //   name: 'pageone',
  //   icon: <SolutionOutlined />,
  //   component: () => <Pageone />,
  //   showSiderbar: true,
  // },
  // {
  //   path: '/pagetwo',
  //   name: 'pages',
  //   icon: <SolutionOutlined />,
  //   showSiderbar: true,
  //   childRouters: [
  //     {
  //       path: '/pagetwo',
  //       name: 'pagetwo',
  //       icon: <SolutionOutlined />,
  //       component: () => <Pageone />,
  //       showSiderbar: true,
  //     },
  //     {
  //       path: '/pagethree',
  //       name: 'pagethree',
  //       icon: <SolutionOutlined />,
  //       component: () => <Pageone />,
  //       showSiderbar: true,
  //     },
  //   ],
  // },
];

export default routersConfig;
