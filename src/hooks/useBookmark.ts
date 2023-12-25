import { useCallback, useState } from 'react';
import { api } from '../api/api';

const useBookmark = (productId: number, userId: string | null) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);

  const fetchBookmark = useCallback(async () => {
    if (!productId || !userId) {
      setIsBookmarked(false);
      setBookmarkId(null);
      return;
    }

    try {
      const response = await api.getBookmark(productId);
      if (response.data.ok === 1) {
        setIsBookmarked(true);
        setBookmarkId(response.data.item._id);
      } else {
        setIsBookmarked(false);
        setBookmarkId(null);
      }
    } catch (error) {
      setIsBookmarked(false);
      setBookmarkId(null);
    }
  }, [productId, userId]);

  const addBookmark = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await api.addBookmark(productId, Number(userId));
      setIsBookmarked(true);
      setBookmarkId(response.data.item._id);
    } catch (error) {
      console.error('Error adding bookmark:', error);
      fetchBookmark();
    }
  }, [productId, userId, fetchBookmark]);

  const removeBookmark = useCallback(async () => {
    if (!bookmarkId) return;

    try {
      await api.removeBookmark(Number(bookmarkId));
      setIsBookmarked(false);
      setBookmarkId(null);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      fetchBookmark();
    }
  }, [bookmarkId, fetchBookmark]);

  return {
    isBookmarked,
    addBookmark,
    removeBookmark,
    fetchBookmark,
  };
};

export default useBookmark;
