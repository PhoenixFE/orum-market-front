import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  OutlinedInput,
  Box,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { FormLabel, ListItemDecorator, Menu, Textarea } from '@mui/joy';
import {
  FormatBold,
  FormatItalic,
  KeyboardArrowDown,
} from '@mui/icons-material';
import Check from '@mui/icons-material/Check';

import { api } from '../../api/api';
import { CATEGORY, QUALITY } from '../../constants/index';
import { IProduct } from '../../type';
import {
  validateProductName,
  validateProductContent,
  validateProductPrice,
  validateProductShippingFees,
} from '../../lib/validation';
import FileUpload from '../FileUpload';

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

interface FilePreview {
  id: string;
  path: string;
}

export default function ProductUpdate() {
  const [productData, setProductData] = useState<IProduct>(initCreateData);
  const [isValid, setIsValid] = useState(true);
  const [italic, setItalic] = useState(false);
  const [fontWeight, setFontWeight] = useState('normal');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<string | number>('');
  const [existingImages, setExistingImages] = useState<FilePreview[]>([]);
  const { productId } = useParams();
  const navigate = useNavigate();

  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [shippingFeesError, setShippingFeesError] = useState('');
  const [contentError, setContentError] = useState('');

  const handleFilesChange = useCallback((files: FilePreview[]) => {
    setProductData((prevData) => ({
      ...prevData,
      mainImages: [...prevData.mainImages, ...files],
    }));
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        if (productId !== undefined) {
          const response = await api.getProduct(Number(productId));
          const fetchedProductData = response.data.item;
          const images = fetchedProductData.mainImages.map(
            (image: { id: number; path: string }) => ({
              id: image.id,
              path: image.path,
            }),
          );
          setExistingImages(images);
          if (fetchedProductData.extra && fetchedProductData.extra.category) {
            setSelectedCategory(fetchedProductData.extra.category[1]);
          }
          if (fetchedProductData.extra && fetchedProductData.extra.sort) {
            setSelectedQuality(fetchedProductData.extra.sort);
          }

          setProductData(fetchedProductData);
          handleFilesChange(images);
        }
      } catch (error) {
        console.error('Failed to fetch product data:', error);
      }
    };

    if (productId) {
      fetchProductData();
    }

    return () => {
      setProductData(initCreateData);
    };
  }, [productId, handleFilesChange]);

  //뒤로가기
  const handleMoveBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.confirm('작성한 내용이 저장되지 않습니다. 취소하시겠습니까?'))
      navigate(-1);
  };

  //카테고리 상태값 업데이트
  const handleCategoryChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string | null,
  ) => {
    event.preventDefault();
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
      setProductData({
        ...productData,
        extra: {
          ...productData.extra,
          category: ['H01', newCategory],
        },
      });
    }
  };

  //품질 상태값 업데이트
  const handleQualityChange = (
    _: React.MouseEvent<HTMLElement>,
    newQuality: number,
  ) => {
    if (newQuality !== null) {
      setSelectedQuality(newQuality);
      setProductData({
        ...productData,
        extra: {
          ...productData.extra,
          sort: newQuality,
        },
      });
    }
  };

  //가격, 배송료, 상품명, 상품 설명 상태값 업데이트
  const handleAllChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  //상품데이터 form submit
  const handleUpdateData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      alert('양식이 올바르지 않습니다.');
      return;
    }
    if (productData.mainImages.length > 10) {
      console.log('productData', productData);
      alert('You can upload a maximum of 10 images.');
      return;
    }
    if (productData.mainImages.length === 0) {
      alert('상품 사진을 등록해주세요.');
      return;
    }
    try {
      if (productId) {
        const response = await api.updateProduct(productId, productData);
        console.log(response);
        alert('상품 정보가 성공적으로 업데이트되었습니다.');
        navigate(`/user/seller/products/${productId}`);
      } else {
        console.error('Invalid product ID');
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  console.log('productData', productData);

  return (
    <form onSubmit={handleUpdateData}>
      {productData && (
        <>
          {/* 제목 */}
          <Box
            sx={{
              position: 'sticky',
              top: '64px',
              backgroundColor: '#fff',
              zIndex: 1100,
              overscrollBehavior: 'contain',
            }}
            m={0}
            pt={2}
            px={2}
          >
            <FormLabel sx={{ fontSize: 'x-large' }}>상품 등록</FormLabel>
            <Divider />
          </Box>

          {/* 카테고리, 품질, 상품명, 가격, 배송비, 설명, 사진 업로드 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
            m={2}
            p={4}
            gap={4}
          >
            <Box>
              <FormLabel sx={{ fontSize: 'medium' }}>카테고리:</FormLabel>

              <ToggleButtonGroup
                value={selectedCategory}
                exclusive
                onChange={handleCategoryChange}
                aria-label="category"
              >
                {CATEGORY.depth2.map((menu) => (
                  <ToggleButton
                    key={menu.id}
                    value={menu.dbCode}
                    aria-label={menu.name}
                  >
                    {menu.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            <Box>
              <FormLabel sx={{ fontSize: 'medium' }}>상품 품질:</FormLabel>
              <ToggleButtonGroup
                value={selectedQuality}
                exclusive
                onChange={handleQualityChange}
                aria-label="quality"
              >
                {QUALITY.map((quality) => (
                  <ToggleButton
                    key={quality.id}
                    value={quality.value}
                    aria-label={quality.name}
                  >
                    {quality.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
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
                endAdornment={
                  <InputAdornment position="end">원</InputAdornment>
                }
                inputProps={{ step: 1000, min: 0 }}
                value={productData.price}
                onChange={handleAllChange}
              ></OutlinedInput>
              {!isValid ? (
                <div style={{ color: 'red' }}>{priceError}</div>
              ) : (
                <></>
              )}
            </Box>

            <Box>
              <FormLabel sx={{ fontSize: 'medium' }}>배송비:</FormLabel>
              <OutlinedInput
                type="number"
                name="shippingFees"
                endAdornment={
                  <InputAdornment position="end">원</InputAdornment>
                }
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
                minRows={4}
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
                    <Button
                      onClick={(event) => setAnchorEl(event.currentTarget)}
                    >
                      <FormatBold />
                      <KeyboardArrowDown />
                    </Button>
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
                            {fontWeight === weight && (
                              <Check fontSize="small" />
                            )}
                          </ListItemDecorator>
                          {weight === '200' ? 'lighter' : weight}
                        </MenuItem>
                      ))}
                    </Menu>
                    <Button
                      color={italic ? 'primary' : 'inherit'}
                      aria-pressed={italic}
                      onClick={() => setItalic((bool) => !bool)}
                    >
                      <FormatItalic />
                    </Button>
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
            {existingImages && (
              <FileUpload
                originalFiles={existingImages}
                onFilesChange={handleFilesChange}
              />
            )}
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
            <Button type="submit" variant="contained" size="large">
              수정하기
            </Button>
          </Box>
        </>
      )}
    </form>
  );
}
