import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { IOrderItem } from '../type';

export default function useGetOrderList() {
  const [orderList, setOrderList] = useState<IOrderItem[]>([]);

  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const response = await api.getOrderProductInfo();
        setOrderList(response.data.item);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrderList();
  }, []);

  return orderList;
}
