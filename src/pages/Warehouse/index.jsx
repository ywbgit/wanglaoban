/* eslint-disable function-paren-newline */
/* eslint-disable array-callback-return */
/* eslint-disable no-confusing-arrow */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-shadow */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Row,
  Col,
  Pagination,
  Checkbox,
  Button,
  Image,
  message,
  Input,
} from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import _get from 'lodash/get';
import _sortBy from 'lodash/sortBy';
import Sort from './components/sort';
import Shelves from './components/shelves';
import API from '../../api';
import './index.css';

const { Search } = Input;

const defaultSort = [
  {
    sortName: '时间',
    sortKey: 'time',
    sortDir: 'none',
  },
  {
    sortName: '价钱',
    sortKey: 'price',
    sortDir: 'none',
  },
];

export default () => {
  const wanglaobanRequestParams = window.localStorage.getItem(
    'wanglaobanRequestParams',
  );
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [shelvesVisible, setShelvesVisible] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [sort, setSort] = useState(defaultSort);
  const canShelvesList = useMemo(() => {
    return list.filter((item) => item.status === 0);
  }, [list]);
  const sortList = useMemo(() => {
    const effictiveSort = (sort || []).filter(
      (item) => item.sortDir !== 'none',
    );
    if (effictiveSort.length === 0) {
      return canShelvesList;
    }
    return _sortBy(
      canShelvesList,
      effictiveSort.map((effictiveSortItem) => {
        if (effictiveSortItem.sortKey === 'time') {
          return (listOne) => {
            return effictiveSortItem.sortDir === 'down'
              ? listOne.tradableTime
              : -listOne.tradableTime;
          };
        }
        if (effictiveSortItem.sortKey === 'price') {
          return (listOne) => {
            const price = _get(listOne, 'priceInfo.price', '');
            return effictiveSortItem.sortDir === 'down' ? price : -price;
          };
        }
      }),
    );
  }, [canShelvesList, sort]);
  const searchList = useMemo(() => {
    if (!searchVal) {
      return sortList;
    }
    return sortList.filter((item) => {
      const name = _get(item, 'baseItemInfo.name', '');
      return name.indexOf(searchVal) > -1;
    });
  }, [sortList, searchVal]);
  const displayList = useMemo(() => {
    const pageStart = (currentPage - 1) * pageSize;
    const pageEnd = currentPage * pageSize;
    return searchList.filter((item, index) => {
      return index >= pageStart && index < pageEnd;
    });
  }, [currentPage, pageSize, searchList]);
  const isAllChecked = useMemo(
    () =>
      // eslint-disable-next-line prettier/prettier
      (displayList.length === 0 ? false : displayList.every((item) => item.checked === true)),
    [displayList],
  );
  const selectList = useMemo(() => {
    return displayList
      .filter((item) => !!item.checked)
      .map((item) => {
        const assetId = _get(item, 'baseItemInfo.assetId', '');
        const itemId = _get(item, 'baseItemInfo.itemId', '');
        const name = _get(item, 'baseItemInfo.name', '');
        const quantity = _get(item, 'baseItemInfo.quantity', '');
        const imageUrl = _get(item, 'baseItemInfo.imageUrl', '');
        const wear = _get(item, 'assetInfo.wear', '');
        const token = _get(item, 'token', '');
        const manualDeliverPrice = _get(
          item,
          'priceInfo.manualDeliverPrice',
          '',
        );
        const autoDeliverPrice = _get(item, 'priceInfo.autoDeliverPrice', '');
        return {
          assetId,
          itemId,
          name,
          quantity,
          imageUrl,
          wear,
          token,
          sellPrice: autoDeliverPrice,
          lowestPrice: manualDeliverPrice,
          differencePrice: 0.01,
          combineList: [],
        };
      });
  }, [displayList]);

  const handlePageChange = useCallback(
    (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
      setList(
        list.map((item) => {
          return {
            ...item,
            checked: false,
          };
        }),
      );
    },
    [list],
  );

  const handleSelectOne = useCallback(
    (select) => {
      const selectId = select.baseItemInfo.assetId;
      const { checked } = select;
      setList(
        list.map((item) => {
          if (selectId === item.baseItemInfo.assetId) {
            // eslint-disable-next-line no-param-reassign
            item.checked = !checked;
          }
          return item;
        }),
      );
    },
    [list],
  );

  const handleSelectAll = useCallback(
    (e) => {
      setList(
        list.map((item) => {
          const inDisplayItem = displayList.find(
            (displayOne) => displayOne.assetId === item.assetId,
          );
          if (inDisplayItem) {
            return {
              ...item,
              checked: e.target.checked,
            };
          }
          return item;
        }),
      );
    },
    [displayList, list],
  );

  const handleOpenShelves = useCallback(() => {
    if (!selectList || selectList.length === 0) {
      return message.warn('大哥, 你选个东西在上架呀');
    }
    setShelvesVisible(true);
  }, [selectList]);

  const handleToShelves = useCallback((shelvesList) => {
    const itemList = shelvesList.map(
      ({
        assetId,
        token,
        sellPrice,
        lowestPrice,
        differencePrice,
        itemId,
      }) => ({
        assetId,
        token,
        sellPrice,
        lowestPrice,
        differencePrice,
        itemId,
      }),
    );
    API.makeShelves(itemList).then((res) => {
      if (res) {
        message.success('上架成功');
        window.location.reload();
      }
    });
  }, []);

  const loopGetWarehouseList = useCallback(
    (params) => {
      API.getWarehouseList(params).then((data) => {
        if (data.lastAssetId) {
          loopGetWarehouseList({
            ...params,
            startAssetId: data.lastAssetId,
          });
        }
        setList([...list, ...(data.list || [])]);
        setTotal(total + (data.total || 0));
      });
    },
    [total, list],
  );

  useEffect(() => {
    API.setReqeustParams(wanglaobanRequestParams);
    loopGetWarehouseList({
      startAssetId: 0,
      count: 500,
    });
  }, []);

  const skuList = useMemo(
    () =>
      displayList.map((item) => {
        const baseItemInfo = _get(item, 'baseItemInfo', {});
        const priceInfo = _get(item, 'priceInfo', {});
        const assetInfo = _get(item, 'assetInfo', {});
        const selected = item.checked;
        return (
          <Col className="gutter-row" span={6} key={baseItemInfo?.assetId}>
            <div
              key={baseItemInfo?.assetId}
              className="warehouse-sku-item"
              onClick={() => handleSelectOne(item)}
            >
              <div
                className={`warehouse-sku-img ${selected ? 'selected' : ''}`}
              >
                <Image
                  width={200}
                  src={baseItemInfo?.imageUrl}
                  preview={false}
                />
                <div className="warehouse-sku-img-select-icon">
                  <CheckCircleTwoTone />
                </div>
              </div>
              <div className="warehouse-sku-info">
                <div className="warehouse-sku-price-list">
                  {priceInfo?.price && (
                    <div className="warehouse-sku-price">
                      <span>最小：</span>
                      <span>{priceInfo?.price}</span>
                    </div>
                  )}
                  {priceInfo?.autoDeliverPrice && (
                    <div className="warehouse-sku-price">
                      <span>自动：</span>
                      <span>{priceInfo?.autoDeliverPrice}</span>
                    </div>
                  )}
                  {priceInfo?.manualDeliverPrice && (
                    <div className="warehouse-sku-price">
                      <span>人工：</span>
                      <span>{priceInfo?.manualDeliverPrice}</span>
                    </div>
                  )}
                </div>
                <div className="warehouse-sku-extra">
                  {assetInfo?.wear && (
                    <div className="warehouse-sku-extra-item">
                      <span>磨损度：</span>
                      <span>{assetInfo?.wear}</span>
                    </div>
                  )}
                </div>
                <div className="warehouse-sku-name">{baseItemInfo?.name}</div>
              </div>
            </div>
          </Col>
        );
      }),
    [displayList],
  );

  return wanglaobanRequestParams ? (
    <div className="warehouse-wrap">
      <div className="warehouse-actions">
        <div className="warehouse-actions_left">
          <div className="warehouse-actions_select">
            <Checkbox onChange={handleSelectAll} checked={isAllChecked}>
              全选
            </Checkbox>
          </div>
          <div className="warehouse-actions_operations">
            <Button type="primary" onClick={handleOpenShelves}>
              上架
            </Button>
          </div>
        </div>
        <div className="warehouse-actions_right">
          <Sort sort={sort} onChangeSort={setSort} />
          <Search
            placeholder="老板请输入"
            onSearch={setSearchVal}
            style={{ width: 200, marginLeft: 10 }}
            enterButton
          />
        </div>
      </div>
      <div className="warehouse-list">
        <Row gutter={[30, 15]}>{skuList}</Row>
      </div>
      <div className="warehouse-pagination">
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          total={searchList.length}
        />
      </div>
      <Shelves
        visible={shelvesVisible}
        data={selectList}
        onShelves={handleToShelves}
        onCancel={() => setShelvesVisible(false)}
      />
    </div>
  ) : null;
};
