import { useEffect } from 'react';
import { api } from '../api/api';

export default function useSetOrderList(setOrderList) {
  const getOrderProductInfo = async () => {
    try {
      const response = await api.getOrderProductInfo();
      setOrderList(response.data.item);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderProductInfo();
  }, []);
}
