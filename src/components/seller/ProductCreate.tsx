import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Box,
  Divider,
  Card,
  CardActionArea,
  CardMedia,
  Badge,
  Typography,
} from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { api } from '../../api/api';
import { CATEGORY, QUALITY } from '../../constants/index';
import { IProduct } from '../../type';

import {
  validateProductName,
  validateProductContent,
  validateProductPrice,
  validateProductShippingFees,
} from '../../lib/validation';
import { FormLabel, ListItemDecorator, Menu, Textarea } from '@mui/joy';
import {
  FormatBold,
  FormatItalic,
  KeyboardArrowDown,
} from '@mui/icons-material';
import Check from '@mui/icons-material/Check';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const initCreateData = {
  price: 0,
  shippingFees: 0,
  show: true,
  active: true,
  name: '',
  mainImages: [],
  content: '',
  createdAt: '',
  updatedAt: '',
  quantity: 1,
  buyQuantity: 0,
  extra: {
    isNew: true,
    isBest: true,
    category: ['H01', 'H0101'],
    sort: 1,
  },
};

export default function ProductCreate() {
  const userId = localStorage.getItem('_id');

  const [productData, setProductData] =
    useState<Partial<IProduct>>(initCreateData);
  const [isValid, setIsValid] = useState(true);
  const [filePreview, setFilePreview] = useState([]);
  const [italic, setItalic] = useState(false);
  const [fontWeight, setFontWeight] = useState('normal');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [shippingFeesError, setShippingFeesError] = useState('');
  const [contentError, setContentError] = useState('');

  const navigate = useNavigate();

  //가격, 배송료, 상품명, 상품 설명 상태값 업데이트
  const handleAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'price' || name === 'shippingFees') {
      const numericValue = parseFloat(value);
      setProductData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  //상품 등록 유효성 검사
  useEffect(() => {
    if (!validateProductName(productData.name)) {
      setIsValid(false);
      setNameError('상품명은 2글자 이상 입력하세요.');
    } else {
      setIsValid(true);
      setNameError('');
    }
    if (!validateProductPrice(productData.price)) {
      setIsValid(false);
      setPriceError('상품 가격은 정수로 입력하세요.');
    } else {
      setPriceError('');
    }
    if (!validateProductShippingFees(productData.shippingFees)) {
      setIsValid(false);
      setShippingFeesError('배송비는 정수로 입력하세요.');
    } else {
      setShippingFeesError('');
    }
    if (!validateProductContent(productData.content)) {
      setIsValid(false);
      setContentError('상품 설명을 10글자 이상 입력하세요.');
    } else {
      setContentError('');
    }
  }, [handleAllChange]);

  //뒤로가기
  const handleMoveBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (window.confirm('작성한 내용이 저장되지 않습니다. 취소하시겠습니까?'))
      navigate(-1);
  };

  //카테고리 상태값 업데이트
  const handleCategory = (categorySelected: string) => {
    setProductData({
      ...productData,
      extra: {
        ...productData.extra,
        category: ['H01', categorySelected],
      },
    });
  };

  //품질 상태값 업데이트
  function handleQuantity(qualityGrade: number) {
    setProductData({
      ...productData,
      extra: {
        ...productData.extra,
        sort: qualityGrade,
      },
    });
  }

  //상품데이터 form submit
  const productAllSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      alert('양식이 올바르지 않습니다.');
      return;
    }
    try {
      const response = await api.createProduct(productData);
      setProductData(response.data.item);
      alert('판매 상품 등록이 완료되었습니다.');
      navigate(`/user/${userId}/seller-orderlist`);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  // 파일 업로드
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('attach', files[i]);
    }

    try {
      const response = await api.uploadFile(formData);
      let newPreviews = [];

      if (response.data.files) {
        newPreviews = response.data.files.map((file) => ({
          id: file.name,
          path: `${API_BASE_URL}${file.path}`,
        }));
      } else if (response.data.file) {
        const singleFile = response.data.file;
        newPreviews.push({
          id: singleFile.name,
          path: `${API_BASE_URL}${singleFile.path}`,
        });
      }

      setFilePreview((currentPreviews) => [...currentPreviews, ...newPreviews]);

      setProductData((currentData) => ({
        ...currentData,
        mainImages: currentData.mainImages.concat(newPreviews),
      }));
    } catch (error) {
      console.log('사진첨부에러발생', error);
    }
  };

  //파일 삭제
  const handleFileRemove = (indexToRemove) => {
    let updatedFilePreview = [...filePreview];
    updatedFilePreview = updatedFilePreview.filter(
      (item) => item.id !== indexToRemove,
    );
    setFilePreview(updatedFilePreview);

    setProductData({
      ...productData,
      mainImages: updatedFilePreview,
    });
  };

  console.log('preview', filePreview);
  console.log('data', productData);

  return (
    <form onSubmit={productAllSubmit}>
      <Box
        sx={{
          position: 'sticky',
          top: '64px',
          backgroundColor: '#fff',
          zIndex: 1100,
          // box shadow only bottom
          overscrollBehavior: 'contain',
        }}
        m={0}
        pt={2}
        px={2}
      >
        <FormLabel sx={{ fontSize: 'x-large' }}>상품 등록</FormLabel>
        <Divider />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
        m={2}
        p={4}
        gap={4}
      >
        {/* <Box>
          <FormLabel sx={{ fontSize: 'medium' }}>상품 사진:</FormLabel>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onChange={handleFileUpload}
          >
            파일 업로드
            <input hidden type="file" multiple name="attach" accept="image/*" />
          </Button>
          {filePreview.map((imageItem) => (
            <div key={imageItem.id}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => handleFileRemove(imageItem.id)}
                >
                  <DeleteIcon />
                </IconButton>
                <img
                  src={imageItem.path}
                  alt={`Preview ${imageItem.id}`}
                  style={{
                    marginTop: '10px',
                    maxWidth: '60%',
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                  }}
                />
              </Stack>
            </div>
          ))}
        </Box> */}

        <Box>
          <FormLabel sx={{ fontSize: 'medium' }}>카테고리:</FormLabel>
          <Select
            labelId="category-label"
            id="category-select"
            label="category"
            value={productData.extra.category[1]}
            onChange={(e) => handleCategory(e.target.value)}
            sx={{ width: '100px' }}
          >
            {CATEGORY.depth2.map((menu) => {
              return (
                <MenuItem key={menu.id} value={menu.dbCode}>
                  {menu.name}
                </MenuItem>
              );
            })}
          </Select>
        </Box>

        <Box>
          <FormLabel sx={{ fontSize: 'medium' }}>상품 품질:</FormLabel>
          <Select
            labelId="quantity-label"
            id="quantity-select"
            label="quantity"
            value={productData.extra.sort}
            onChange={(e) => handleQuantity(e.target.value)}
            sx={{ width: '100px' }}
          >
            {QUALITY.map((menu) => {
              return (
                <MenuItem key={menu.id} value={menu.value}>
                  {menu.name}
                </MenuItem>
              );
            })}
          </Select>
        </Box>

        <Box>
          <FormLabel sx={{ fontSize: 'medium' }}>상품명:</FormLabel>
          <TextField
            type="text"
            name="name"
            placeholder="상품명을 입력하세요."
            value={productData.name}
            onChange={handleAllChange}
          ></TextField>
          {!isValid && productData.name.length !== 0 ? (
            <div style={{ color: 'red' }}>{nameError}</div>
          ) : (
            <> </>
          )}
        </Box>

        <Box>
          <FormLabel sx={{ fontSize: 'medium' }}>상품 가격:</FormLabel>
          <OutlinedInput
            type="number"
            name="price"
            endAdornment={<InputAdornment position="end">원</InputAdornment>}
            inputProps={{ step: 1000, min: 0 }}
            value={productData.price}
            onChange={handleAllChange}
          ></OutlinedInput>
          {!isValid ? <div style={{ color: 'red' }}>{priceError}</div> : <></>}
        </Box>
        <Box>
          <FormLabel sx={{ fontSize: 'medium' }}>배송비:</FormLabel>
          <OutlinedInput
            type="number"
            name="shippingFees"
            endAdornment={<InputAdornment position="end">원</InputAdornment>}
            inputProps={{ step: 500, min: 0 }}
            value={productData.shippingFees}
            onChange={handleAllChange}
          ></OutlinedInput>
          {shippingFeesError && (
            <div style={{ color: 'red' }}>{shippingFeesError}</div>
          )}
        </Box>

        <Box>
          <FormLabel sx={{ fontSize: 'medium' }}>상품 설명:</FormLabel>
          <Textarea
            placeholder="상품 설명을 입력하세요."
            minRows={3}
            name="content"
            value={productData.content}
            onChange={handleAllChange}
            endDecorator={
              <Box
                sx={{
                  display: 'flex',
                  gap: 'var(--Textarea-paddingBlock)',
                  pt: 'var(--Textarea-paddingBlock)',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  flex: 'auto',
                }}
              >
                <IconButton
                  variant="plain"
                  color="neutral"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                >
                  <FormatBold />
                  <KeyboardArrowDown fontSize="md" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  size="sm"
                  placement="bottom-start"
                  sx={{ '--ListItemDecorator-size': '24px' }}
                >
                  {['200', 'normal', 'bold'].map((weight) => (
                    <MenuItem
                      key={weight}
                      selected={fontWeight === weight}
                      onClick={() => {
                        setFontWeight(weight);
                        setAnchorEl(null);
                      }}
                      sx={{ fontWeight: weight }}
                    >
                      <ListItemDecorator>
                        {fontWeight === weight && <Check fontSize="sm" />}
                      </ListItemDecorator>
                      {weight === '200' ? 'lighter' : weight}
                    </MenuItem>
                  ))}
                </Menu>
                <IconButton
                  variant={italic ? 'soft' : 'plain'}
                  color={italic ? 'primary' : 'neutral'}
                  aria-pressed={italic}
                  onClick={() => setItalic((bool) => !bool)}
                >
                  <FormatItalic />
                </IconButton>
              </Box>
            }
            sx={{
              minWidth: 300,
              fontWeight,
              fontStyle: italic ? 'italic' : 'initial',
            }}
          />
          {!isValid && productData.content.length > 0 ? (
            <div style={{ color: 'red' }}>{contentError}</div>
          ) : (
            <></>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '16px',
          }}
        >
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onChange={handleFileUpload}
            disabled={filePreview.length >= 10}
          >
            사진 업로드
            <input hidden accept="image/*" multiple type="file" />
          </Button>
          <Stack direction="row" spacing={2}>
            {filePreview.map((image, index) => (
              <Badge
                badgeContent={
                  <CloseIcon
                    onClick={() => handleFileRemove(image.id)}
                    sx={{
                      fontSize: '1rem',
                      color: 'white',
                      backgroundColor: 'red',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'darkred',
                      },
                    }}
                  />
                }
                overlap="circular"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                key={image.id}
              >
                <Card sx={{ width: 90, height: 90 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="90"
                      image={image.path}
                      alt={`Preview ${index + 1}`}
                    />
                  </CardActionArea>
                </Card>
              </Badge>
            ))}
          </Stack>
          <Box sx={{ alignSelf: 'center' }}>
            {filePreview.length > 0 && (
              <Typography variant="caption">{`${filePreview.length}/10`}</Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{ display: 'flex', justifyContent: 'center' }}
        m={2}
        p={2}
        gap={1}
      >
        <Button type="button" onClick={handleMoveBack} variant="outlined">
          취소
        </Button>
        <Button type="submit" variant="contained">
          등록하기
        </Button>
      </Box>
    </form>
  );
}
