/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
import axios from 'axios';
import { message } from 'antd';

let steamId = null;
let appId = null;

const instance = axios.create({
  timeout: 3000,
  baseURL: BASE_URL,
});

const getWarehouseList = ({ startAssetId, count }) => {
  return instance({
    method: 'get',
    url: `/trade/v1/inventory/${steamId}/${appId}/?startAssetId=${startAssetId}&count=${count}`,
  })
    .then((res) => {
      return res.data.data;
    })
    .catch(() => {
      message.error('请求失败');
    });
};

const makeShelves = (itemList) => {
  return instance({
    method: 'get',
    url: '/trade/v1/sale',
    data: {
      itemList,
      steamId,
      appId,
    },
  })
    .then((res) => {
      return res.data.data;
    })
    .catch(() => {
      message.error('请求失败');
    });
};

const setReqeustParams = (params) => {
  if (params) {
    params = JSON.parse(params);
    steamId = params.steamId;
    appId = params.appId;
  }
};

export default {
  getWarehouseList,
  makeShelves,
  setReqeustParams,
};
