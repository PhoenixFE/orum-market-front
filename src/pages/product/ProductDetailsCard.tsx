import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import PaymentIcon from '@mui/icons-material/Payment';
import VerifiedIcon from '@mui/icons-material/Verified';

import { QUALITY } from '../../constants';
import { IProduct } from '../../type';
import CustomTooltip from '../../components/CustomTooltip';
import useAddToCart from '../../hooks/useAddToCart';

interface IProductDetailsCard {
  product: IProduct;
  getQualityName: (value: string | number) => string;
  handleBookmark: () => Promise<void>;
  isBookmarked: boolean;
  handlePurchase: () => void;
  handleNotLoggedIn: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  matchesXS: boolean;
}

export default function ProductDetailsCard({
  product,
  getQualityName,
  handleBookmark,
  isBookmarked,
  handlePurchase,
  handleNotLoggedIn,
  isLoggedIn,
  isLoading,
  matchesXS,
}: IProductDetailsCard) {
  const handleAddToCart = useAddToCart();

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
        paddingY: '10px',
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
        {!matchesXS && (
          <Stack spacing={2} direction="column" mt={5}>
            <CustomTooltip title="바로 구매하기">
              <Button
                variant="contained"
                startIcon={<PaymentIcon />}
                onClick={handlePurchase}
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
                  onClick={() => handleAddToCart(product)}
                >
                  장바구니
                </Button>
              </CustomTooltip>
              <CustomTooltip title="찜하기 목록에 추가/삭제">
                <Button
                  variant="outlined"
                  startIcon={
                    isLoading ? (
                      <CircularProgress
                        color="secondary"
                        size={20}
                        variant="indeterminate"
                      />
                    ) : isBookmarked ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )
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
        )}
      </CardContent>
    </Card>
  );
}
