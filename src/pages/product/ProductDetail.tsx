import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ICartStore, IProduct } from '../../type';
import { api } from '../../api/api';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  ImageList,
  ImageListItem,
  Typography,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useCartStore, useUserStore } from '../../lib/store';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    if (id) {
      const response = await api.getProduct(id);
      setProduct(response.data.item);
      console.log(response.data.item);
    } else {
      console.log('id가 없습니다.');
    }
  };

  return (
    <>
      {product && (
        <>
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={12} sm={6}>
              <ProductImageGallery images={product.mainImages} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ProductDetailsCard product={product} />
            </Grid>
            <Grid item xs={12}>
              <h2>상품 설명</h2>
            </Grid>
            <Typography
              paragraph
              dangerouslySetInnerHTML={{ __html: product.content }}
            />
          </Grid>
        </>
      )}
    </>
  );
}

const ProductImageGallery = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Display the selected image in a larger size */}
      <Box sx={{ marginBottom: 2 }}>
        <img
          src={selectedImage}
          alt="Selected"
          style={{ width: '100%', maxWidth: 500 }}
        />
      </Box>
      {/* List of all images */}
      <ImageList sx={{ width: 500 }} cols={3}>
        {images.map((image: string, index: number) => (
          <ImageListItem key={index}>
            <img
              src={image}
              alt={`Product ${index}`}
              loading="lazy"
              onClick={() => setSelectedImage(image)}
              style={{
                cursor: 'pointer',
                border: selectedImage === image ? '2px solid orange' : '',
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

const ProductDetailsCard = ({ product }: { product: IProduct }) => {
  const { isLoggedIn } = useUserStore();
  const navigate = useNavigate();
  const { items } = useCartStore((state) => state) as ICartStore;
  const productAlreadyInCart = items.some((item) => item._id === product._id);
  const { addToCart } = useCartStore((state) => state) as ICartStore;

  const handleNotLoggedIn = () => {
    const confirmLogin = confirm(
      '로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?',
    );
    if (confirmLogin) {
      navigate('/sign-in');
    }
  };

  const addProductToCart = () => {
    if (!isLoggedIn) {
      handleNotLoggedIn();
    } else {
      if (productAlreadyInCart) {
        alert('이미 장바구니에 있는 상품입니다.');
        return;
      }
      addToCart({ ...product, quantity: 1 });
      const confirmAddToCart = confirm(
        '장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?',
      );
      if (confirmAddToCart) {
        navigate('/cart');
      }
    }
  };

  const perchaseProduct = () => {
    if (!isLoggedIn) {
      handleNotLoggedIn();
    } else {
      alert('결제 페이지로 이동합니다');
      navigate('/checkout');
    }
  };

  const addToWishlist = () => {
    if (!isLoggedIn) {
      handleNotLoggedIn();
    } else {
      alert('위시리스트에 추가되었습니다');
    }
  };

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Seller ID: {product.seller_id}
        </Typography>
        <Typography variant="h5" component="div">
          {product.name} ({product._id})
        </Typography>
        <Typography variant="h6">
          ₩{product.price.toLocaleString('ko-KR')}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 2,
          }}
        >
          <Typography variant="body2">
            4.0
            <FavoriteBorderIcon fontSize="small" />
          </Typography>
          <Button size="small" onClick={addToWishlist}>
            Wishlist
          </Button>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="large" variant="contained" onClick={perchaseProduct}>
          구매하기
        </Button>
        <Button size="large" onClick={addProductToCart}>
          장바구니
        </Button>
      </CardActions>
    </Card>
  );
};
