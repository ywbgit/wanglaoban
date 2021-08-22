/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React, { useCallback, useMemo, useState } from 'react';
import { Table, Modal, Checkbox, InputNumber, Image } from 'antd';
import BigNumber from 'bignumber.js';
import useDataSource from '../../hooks/useDataSource';
import './index.css';

const { Column } = Table;

export default (props) => {
  const [isCombine, setIsCombine] = useState(false);
  const [dataSource, setDataSource] = useDataSource(props.data || []);
  const displayData = useMemo(() => {
    const newDataSource = dataSource.map((item) => {
      item.combineList = [];
      return item;
    });
    if (!isCombine) {
      return newDataSource;
    }
    return newDataSource.reduce((cur, dataOne) => {
      const isExist = cur.find((curOne) => curOne.name === dataOne.name);
      if (isExist) {
        return cur.map((curOne) => {
          if (curOne.name === dataOne.name) {
            curOne.combineList.push(dataOne);
          }
          return curOne;
        });
      }
      cur.push(dataOne);
      return cur;
    }, []);
  }, [dataSource, isCombine]);
  const totalSellPrice = useMemo(() => {
    return dataSource.reduce((cur, item) => {
      if (
        item.sellPrice &&
        item.sellPrice !== null &&
        item.sellPrice !== undefined
      ) {
        cur = BigNumber(cur).plus(item.sellPrice);
        return cur.valueOf();
      }
      return cur;
    }, 0);
  }, [dataSource]);

  const handleOk = useCallback(() => {
    props.onShelves && props.onShelves(dataSource);
  }, [dataSource]);
  const handleCancel = useCallback(() => {
    props.onCancel && props.onCancel();
  }, []);
  const handleCombine = useCallback(() => {
    setIsCombine(!isCombine);
    setDataSource(
      dataSource.reduce((cur, dataOne) => {
        const existOne = cur.find((curOne) => curOne.name === dataOne.name);
        if (existOne) {
          dataOne = {
            ...dataOne,
            sellPrice: existOne.sellPrice,
            differencePrice: existOne.differencePrice,
            lowestPrice: existOne.lowestPrice,
          };
        }
        cur.push(dataOne);
        return cur;
      }, []),
    );
  }, [isCombine, dataSource]);
  const handleChangePrice = useCallback(
    (key, val, record) => {
      return setDataSource(
        dataSource.map((item) => {
          if (!isCombine && item.assetId === record.assetId) {
            return {
              ...item,
              [key]: val,
            };
          }
          if (isCombine && item.name === record.name) {
            return {
              ...item,
              [key]: val,
            };
          }
          return item;
        }),
      );
    },
    [isCombine, dataSource],
  );
  return (
    <Modal
      title="饰品上架"
      okText="上架"
      cancelText="取消"
      width={750}
      visible={props.visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="shelves-total-price">
        <span>初始定价合计：</span>
        <span>{totalSellPrice}</span>
      </div>
      <Table dataSource={displayData} rowKey="assetId">
        <Column
          title={
            <Checkbox onChange={handleCombine} checked={isCombine}>
              同名饰品合并上架
            </Checkbox>
          }
          dataIndex="assetId"
          key="assetId"
          render={(assetId, record) => {
            return (
              <div className="shelves-sku-item">
                <div className="shelves-sku-item-left">
                  <Image src={record.imageUrl} width={50} />
                </div>
                <div className="shelves-sku-item-right">
                  <div className="shelves-sku-item-name">
                    <span>{record.name}</span>
                    {record.combineList.length > 0 && (
                      <span>{` x${record.combineList.length + 1}`}</span>
                    )}
                  </div>
                  <div className="shelves-sku-item-wear">
                    <span>磨损度：</span>
                    <span>{record.wear}</span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Column
          title="初始定价"
          dataIndex="sellPrice"
          key="sellPrice"
          render={(sellPrice, record) => {
            return (
              <InputNumber
                value={sellPrice}
                onChange={(val) => handleChangePrice('sellPrice', val, record)}
              />
            );
          }}
        />
        <Column
          title="每次扣的价格"
          dataIndex="differencePrice"
          key="differencePrice"
          render={(differencePrice, record) => {
            return (
              <InputNumber
                value={differencePrice}
                onChange={(val) =>
                  handleChangePrice('differencePrice', val, record)
                }
              />
            );
          }}
        />
        <Column
          title="最低定价"
          dataIndex="lowestPrice"
          key="lowestPrice"
          render={(lowestPrice, record) => {
            return (
              <InputNumber
                value={lowestPrice}
                onChange={(val) =>
                  handleChangePrice('lowestPrice', val, record)
                }
              />
            );
          }}
        />
      </Table>
    </Modal>
  );
};
