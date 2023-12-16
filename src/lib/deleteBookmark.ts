import { api } from '../api/api';

export default async function deleteBookmark(bookmarkId: number) {
  const confirmRemoveBookmark = window.confirm('북마크를 삭제하시겠습니까?');

  if (confirmRemoveBookmark) {
    try {
      await api.removeBookmark(Number(bookmarkId));
      alert('bookmark 삭제 성공');
      window.location.reload();
    } catch (error) {
      console.log('북마크 삭제에 실패했습니다.');
    }
  }
}
