import { useState, useEffect } from 'react';
import { api } from '../api/api';

export default function useGetBookmark() {
  const [myBookmarkList, setMyBookmarkList] = useState([]);

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        const response = await api.getMyBookMark();
        setMyBookmarkList(response.data.item);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookmark();
  }, []);

  return myBookmarkList;
}
