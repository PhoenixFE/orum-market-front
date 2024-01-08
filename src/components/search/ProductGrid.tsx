import { Grid, Typography, Box, Grow } from '@mui/material';
// import { Skeleton } from '@mui/material';
import { IProduct } from '../../type';
import { ProductCard } from '../../pages/product/ProductCard';

interface ProductGridProps {
  // isLoading: boolean;
  isDataFetched: boolean;
  filteredProducts: IProduct[];
  itemsPerPage: number;
  handleSaveRecentlyViewed: (product: IProduct) => void;
}

export const ProductGrid = ({
  // isLoading,
  isDataFetched,
  filteredProducts,
  itemsPerPage,
  handleSaveRecentlyViewed,
}: ProductGridProps) => {
  // 아이템 사이즈를 계산하는 함수
  const getItemSize = () => {
    if (itemsPerPage === 8) return { xs: 6, sm: 3, md: 2, lg: 2, xl: 2 };
    return { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 };
  };

  // const ProductSkeleton = () => {
  //   return (
  //     <Grid container spacing={4} m={4}>
  //       {Array.from(new Array(itemsPerPage)).map((_, index) => (
  //         <Grid item key={index} {...getItemSize()}>
  //           <Skeleton variant="rectangular" height={200} />
  //           <Skeleton variant="text" />
  //           <Skeleton variant="text" />
  //         </Grid>
  //       ))}
  //     </Grid>
  //   );
  // };

  const renderNoProductsMessage = () => {
    if (isDataFetched && filteredProducts.length === 0) {
      return (
        <Grid item xs={12} style={{ height: '100%' }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ height: '100%' }}
          >
            <Typography variant="h6" color="textSecondary">
              찾으시는 상품이 없습니다.
            </Typography>
          </Box>
        </Grid>
      );
    }
    return null;
  };

  const renderProductsOrSkeletons = () => {
    // if (isLoading) {
    //   return <ProductSkeleton />;
    // }

    return (
      <>
        {filteredProducts.map((product: IProduct) => (
          <Grow
            in={true}
            key={product._id}
            style={{ transformOrigin: '0 0 0' }}
            {...{ timeout: 1000 }}
            onClick={() => handleSaveRecentlyViewed(product)}
          >
            <Grid item {...getItemSize()}>
              <ProductCard product={product} />
            </Grid>
          </Grow>
        ))}
      </>
    );
  };

  return (
    <Grid container spacing={4} rowSpacing={8}>
      {renderProductsOrSkeletons()}
      {renderNoProductsMessage()}
    </Grid>
  );
};
