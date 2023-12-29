import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IProduct, IUserStore } from '../../type';
import { QUALITY } from '../../constants';
import { api } from '../../api/api';
import { useUserStore } from '../../lib/store';
import useBookmark from '../../hooks/useBookmark';

import { BreadcrumbsNavBar } from '../../components/BreadcrumbsNavBar';
import ProductImageGallery from './ProductImageGallery';
import ProductDetailsCard from './ProductDetailsCard';
// import MobileProductActionBar from '../../components/navbar/MobileProductActionBar';
const MobileProductActionBar = lazy(
  () => import('../../components/navbar/MobileProductActionBar'),
);

import {
  Box,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const userId = localStorage.getItem('_id');
  const [product, setProduct] = useState<IProduct | null>(null);
  const { isLoggedIn } = useUserStore() as IUserStore;
  // const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down('sm'));

  const { isBookmarked, addBookmark, removeBookmark, fetchBookmark } =
    useBookmark(Number(productId), userId);

  const fetchProduct = useCallback(async () => {
    if (productId) {
      try {
        const response = await api.getProduct(Number(productId));
        setProduct(response.data.item);
      } catch (error) {
        console.error('API Error:', error);
      }
    } else {
      console.log('id가 없습니다.');
    }
  }, [productId]);

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      return;
    }

    if (isBookmarked) {
      await removeBookmark();
    } else {
      await addBookmark();
    }
  };

  const getQualityName = (value: string | number) => {
    const quality = QUALITY.find((quality) => quality.value === value);
    return quality ? quality.name : 'Unknown';
  };

  const handlePurchase = () => {
    if (!isLoggedIn) {
      handleNotLoggedIn();
    } else {
      alert('결제 페이지로 이동합니다');
      navigate('/checkout', { state: { product } });
    }
  };

  const handleNotLoggedIn = () => {
    const confirmLogin = confirm(
      '로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?',
    );
    if (confirmLogin) {
      navigate('/sign-in');
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeAndCheckBookmark = async () => {
      setIsLoading(true);
      await fetchProduct();
      if (isLoggedIn) {
        await fetchBookmark();
      }
      setIsLoading(false);
    };

    initializeAndCheckBookmark();
  }, [productId, isLoggedIn, fetchProduct, fetchBookmark]);

  return (
    <Box pb={20}>
      {!product && <Typography>상품이 없습니다.</Typography>}

      {product && (
        <Container>
          <Grid container spacing={2}>
            <Grid item sm={12} md={8}>
              <BreadcrumbsNavBar />
              <ProductImageGallery images={product.mainImages} />
            </Grid>
            <Grid item sm={12} md={4}>
              <ProductDetailsCard
                product={product}
                getQualityName={getQualityName}
                handleBookmark={handleBookmark}
                isBookmarked={isBookmarked}
                handlePurchase={handlePurchase}
                handleNotLoggedIn={handleNotLoggedIn}
                isLoggedIn={isLoggedIn}
                isLoading={isLoading}
                matchesXS={matchesXS}
              />
              <Typography variant="h5" gutterBottom component="h2" m={3}>
                상품 설명
              </Typography>
              <Typography
                paragraph
                dangerouslySetInnerHTML={{ __html: product.content }}
                sx={{ fontSize: '1rem', color: 'text.secondary', margin: 3 }}
              />
            </Grid>
          </Grid>
        </Container>
      )}
      {matchesXS && (
        <Suspense fallback={<div>Loading...</div>}>
          <MobileProductActionBar
            product={product}
            userId={userId}
            productId={productId}
            handlePurchase={handlePurchase}
            isLoggedIn={isLoggedIn}
          />
        </Suspense>
      )}
    </Box>
  );
}
