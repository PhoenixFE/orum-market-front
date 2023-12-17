import { Button, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import BookmarkListTable from './BookmarkListTable';
import useGetBookmark from '../../hooks/useGetBookmark';

export default function BuyerFavorite() {
  const bookmarkList = useGetBookmark();

  if (!bookmarkList || bookmarkList?.length === 0) {
    return (
      <>
        <Typography variant="h5" fontWeight={700}>
          찜한 상품 ({bookmarkList.length})
        </Typography>
        <Typography variant="h6">찜한 상품 목록이 없습니다.</Typography>
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
      <Typography variant="h5" fontWeight={700}>
        찜한 상품 ({bookmarkList.length})
      </Typography>
      <Grid container spacing={4} rowSpacing={4}>
        <BookmarkListTable myBookmarkList={bookmarkList} />
      </Grid>
    </>
  );
}
