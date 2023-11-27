import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IProduct } from '../../type';
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
              <ProductDetailsCard
                productId={product._id}
                sellerId={product.seller_id}
                price={product.price}
              />
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

const ProductDetailsCard = ({
  productId,
  sellerId,
  price,
}: {
  productId: number;
  sellerId: number;
  price: number;
}) => {
  // Replace "addProductToCart" with your actual function for handling the purchase
  const addProductToCart = () => {
    console.log('Product added to cart');
  };

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Seller ID: {sellerId}
        </Typography>
        <Typography variant="h5" component="div">
          테이라 오프로드 코스 후드 자켓 ({productId})
        </Typography>
        <Typography variant="h6">₩{price.toLocaleString('ko-KR')}</Typography>
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
          <Button size="small">Wishlist</Button>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="large" variant="contained" onClick={addProductToCart}>
          구매하기
        </Button>
        <Button size="large">장바구니</Button>
      </CardActions>
    </Card>
  );
};
