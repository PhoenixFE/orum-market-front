import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import BookmarkListTable from './BookmarkListTable';
import useGetBookmark from '../../hooks/useGetBookmark';

export default function BuyerFavorite() {
  const bookmarkList = useGetBookmark();

  if (!bookmarkList || bookmarkList?.length === 0) {
    return (
      <>
        <Typography variant="h6">북마크된 상품이 없습니다.</Typography>
        <Link to={`/`}>
          <Button type="button" variant="outlined" size="medium">
            상품 보러 가기
          </Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <BookmarkListTable myBookmarkList={bookmarkList} />
    </>
  );
}
