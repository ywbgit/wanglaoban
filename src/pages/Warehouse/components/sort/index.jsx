/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import './index.css';

const sortDirNextMap = {
  none: 'down',
  down: 'up',
  up: 'none',
};

export default (props) => {
  const { sort = [] } = props;
  const handleChangeSortItem = useCallback(
    ({ sortKey, sortDir }) => {
      if (props.onChangeSort) {
        props.onChangeSort(
          sort.map((item) => {
            if (item.sortKey === sortKey) {
              return {
                ...item,
                sortKey,
                sortDir: sortDirNextMap[sortDir],
              };
            }
            return item;
          }),
        );
      }
    },
    [sort],
  );
  const renderIcon = useCallback((sortDir) => {
    if (sortDir === 'none') {
      return <ArrowDownOutlined />;
    }
    if (sortDir === 'up') {
      return <ArrowUpOutlined />;
    }
    return <ArrowDownOutlined />;
  }, []);
  return (
    <div className="warehouse-actions_sort">
      {sort.map((item) => {
        return (
          <div
            className={`warehouse-actions_sort-item ${
              item.sortDir !== 'none' ? 'active' : ''
            }`}
            key={item.sortKey}
            onClick={() => handleChangeSortItem(item)}
          >
            <span>{item.sortName}</span>
            {renderIcon(item.sortDir)}
          </div>
        );
      })}
    </div>
  );
};
