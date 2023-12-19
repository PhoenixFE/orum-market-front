import { api } from '../api/api';

export default async function deleteBookmark(bookmarkId: number) {
  const confirmRemoveBookmark =
    window.confirm('찜한 상품에서 삭제하시겠습니까?');

  if (confirmRemoveBookmark) {
    try {
      await api.removeBookmark(Number(bookmarkId));
      alert('찜한 상품에서 삭제되었습니다.');
      window.location.reload();
    } catch (error) {
      console.log('찜한 상품 삭제에 실패했습니다.');
    }
  }
}
