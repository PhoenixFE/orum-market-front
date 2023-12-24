import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IProduct, IProductImage, IUserStore } from '../../type';
import { api } from '../../api/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  ImageList,
  ImageListItem,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import { useUserStore } from '../../lib/store';
import { BreadcrumbsNavBar } from '../../components/BreadcrumbsNavBar';
import useAddToCart from '../../hooks/useAddToCart';
import VerifiedIcon from '@mui/icons-material/Verified';

import { QUALITY } from '../../constants';
import CustomTooltip from '../../components/CustomTooltip';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const userId = localStorage.getItem('_id');
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);
  const { isLoggedIn } = useUserStore() as IUserStore;
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  useScrollToTop();

  const getQualityName = (value: string | number) => {
    const quality = QUALITY.find((quality) => quality.value === value);
    return quality ? quality.name : 'Unknown';
  };

  const fetchProduct = async () => {
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
  };

  const checkBookmark = async () => {
    if (!productId || !isLoggedIn) {
      setIsBookmarked(false);
      return;
    }

    try {
      console.log('Bookmark ID:', productId);
      const response = await api.getBookmark(Number(productId));
      if (response.data.ok === 1) {
        setIsBookmarked(true);
        setBookmarkId(response.data.item._id);
      } else {
        setIsBookmarked(false);
      }
    } catch (error) {
      if ((error as any).response && (error as any).response.status === 404) {
        setIsBookmarked(false);
      } else {
        console.error(
          'API Error:',
          (error as any).response || (error as any).message || error,
        );
      }
    }
  };

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      return;
    }

    if (isBookmarked) {
      try {
        await api.removeBookmark(Number(bookmarkId));
        setIsBookmarked(false);
        alert('북마크가 삭제되었습니다.');
      } catch (error) {
        console.error('Error removing bookmark:', error);
      }
    } else {
      try {
        const response = await api.addBookmark(
          Number(productId),
          Number(userId),
        );
        setIsBookmarked(true);
        alert('북마크가 추가되었습니다.');
        setBookmarkId(response.data.item._id);
      } catch (error) {
        console.error('Error adding bookmark:', error);
      }
    }
  };

  useEffect(() => {
    fetchProduct();
    if (isLoggedIn) {
      checkBookmark();
    }
  }, [productId, isLoggedIn]);

  if (!product) {
    return <Typography>상품이 없습니다.</Typography>;
  }

  return (
    <Box sx={{ p: 4, mb: 5 }}>
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
          <Grid item xs={12}></Grid>
        </Container>
      )}
    </Box>
  );
}

const ProductImageGallery = ({ images }: { images: IProductImage[] }) => {
  const [selectedImage, setSelectedImage] = useState(
    images && images[0] ? images[0].path : '',
  );

  const imageContainerStyle = {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    height: 0,
    paddingTop: '100%',
    margin: '10px 10px',
  };
  const imageListStyle = {
    width: '100%',
    height: '100%',
  };

  interface OverlaySkeletonProps {
    imageUrl?: string;
  }

  const OverlaySkeleton: React.FC<OverlaySkeletonProps> = ({ imageUrl }) => {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          overflow: 'hidden',
          height: 0,
          margin: '10px 10px',
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'gray',
          }}
        />

        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: 'auto',
              opacity: 0.7,
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        margin: '4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {(!images || images.length === 0) && (
        <>
          <OverlaySkeleton imageUrl="../../assets/orum-favicon-orange.png" />
        </>
      )}

      {images.length > 0 && (
        <>
          <Box sx={imageContainerStyle}>
            <img
              src={selectedImage}
              alt="Selected-Image"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
          <ImageList sx={imageListStyle} cols={3} gap={9}>
            {images.map((image, index) => (
              <ImageListItem key={index}>
                <img
                  src={image.path}
                  alt={`Product ${image.id}`}
                  loading="lazy"
                  onClick={() => setSelectedImage(image.path)}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border:
                      selectedImage === image.path ? '2px solid #EF5B2A' : '',
                    filter:
                      selectedImage === image.path ? '' : 'brightness(0.5)',
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}
    </Box>
  );
};

interface IProductDetailsCard {
  product: IProduct;
  getQualityName: (value: string | number) => string;
  handleBookmark: () => Promise<void>;
  isBookmarked: boolean;
}

const ProductDetailsCard: React.FC<IProductDetailsCard> = ({
  product,
  getQualityName,
  handleBookmark,
  isBookmarked,
}) => {
  const { isLoggedIn } = useUserStore() as { isLoggedIn: boolean };
  const navigate = useNavigate();

  const handleNotLoggedIn = () => {
    const confirmLogin = confirm(
      '로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?',
    );
    if (confirmLogin) {
      navigate('/sign-in');
    }
  };

  const addProductToCart = useAddToCart();

  const perchaseProduct = () => {
    if (!isLoggedIn) {
      handleNotLoggedIn();
    } else {
      alert('결제 페이지로 이동합니다');
      navigate('/checkout', { state: { product } });
    }
  };

  const generateQualityIcons = (value: number) => {
    const qualityIndex = QUALITY.findIndex(
      (quality) => quality.value === value,
    );
    return [...Array(qualityIndex + 1)].map((_, index) => (
      <VerifiedIcon key={index} />
    ));
  };

  return (
    <Card
      sx={{
        maxWidth: '100%',
        boxShadow: 0,
        mt: 3,
        borderRadius: '10px',
        padding: '10px',
      }}
    >
      <CardContent>
        {/* 제목 태그 */}
        <Typography variant="h5" component="div">
          {product.name}
        </Typography>
        <Stack direction="row" spacing={1} my={2}>
          <Chip label="#캠프라인" variant="outlined" />
          <Chip label="#풀박" variant="outlined" />
        </Stack>

        {/* 가격 적립금 */}
        <Typography variant="h6" gutterBottom>
          {product.price.toLocaleString('ko-KR')} 원
        </Typography>
        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          적립포인트 {(product.price / 100).toLocaleString('ko-KR')}M
        </Typography>

        {/* 배송료 */}
        <Stack direction="row" alignItems="center" spacing={2} my={3}>
          <Box
            sx={{
              width: '70px',
              textAlign: 'left',
              mb: 0,
            }}
          >
            <Typography variant="body2" fontWeight={800}>
              배송료
            </Typography>
          </Box>
          <Typography variant="body2">
            {product.shippingFees === 0
              ? '무료배송'
              : `${product.shippingFees.toLocaleString('ko-KR')} 원`}
          </Typography>
        </Stack>

        {/* 상품 등급 */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{ width: '70px', textAlign: 'left', justifyContent: 'start' }}
          >
            <Typography variant="body2" fontWeight={800} component="legend">
              품질
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {generateQualityIcons(product.extra.sort || 0)}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={700}
              sx={{ ml: 1 }}
            >
              {getQualityName(product.extra.sort || 0)}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{ width: '70px', textAlign: 'left', justifyContent: 'start' }}
          >
            <Typography
              variant="body2"
              fontWeight={800}
              component="legend"
            ></Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {`(하<중<상<최상)`}
            </Typography>
          </Box>
        </Stack>

        {/* 구매 장바구니 북마크 버튼 */}
        <Stack spacing={2} direction="column" mt={5}>
          <CustomTooltip title="바로 구매하기">
            <Button
              variant="contained"
              startIcon={<PaymentIcon />}
              onClick={perchaseProduct}
              fullWidth
            >
              바로구매
            </Button>
          </CustomTooltip>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              borderRadius: '5px',
            }}
          >
            <CustomTooltip title="장바구니에 담기">
              <Button
                variant="outlined"
                startIcon={<ShoppingCartOutlinedIcon />}
                sx={{ flexGrow: 1, mr: 1 }}
                onClick={() => addProductToCart(product)}
              >
                장바구니
              </Button>
            </CustomTooltip>
            <CustomTooltip title="찜하기 목록에 추가/삭제">
              <Button
                variant="outlined"
                startIcon={
                  isBookmarked ? <FavoriteIcon /> : <FavoriteBorderIcon />
                }
                sx={{ flexGrow: 1, ml: 1 }}
                onClick={() => handleBookmark()}
                {...(!isLoggedIn && { onClick: handleNotLoggedIn })}
              >
                찜하기
              </Button>
            </CustomTooltip>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
