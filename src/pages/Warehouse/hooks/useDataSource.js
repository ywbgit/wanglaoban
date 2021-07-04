import { useEffect, useState } from 'react';

export default (data) => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    setDataSource(data);
  }, [data]);
  return [dataSource, setDataSource];
};
