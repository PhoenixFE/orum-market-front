import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { api } from '../../api/api';
import { CATEGORY, QUALITY } from '../../constants/index';
import { IUpdateProduct, IProductImage, IProduct } from '../../type/index';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import {
  validateProductName,
  validateProductContent,
  validateProductPrice,
  validateProductShippingFees,
} from '../../lib/validation';

export default function ProductUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState<Partial<IProduct>>();
  const [filePreview, setFilePreview] = useState<IProductImage[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [shippingFeesError, setShippingFeesError] = useState('');
  const [contentError, setContentError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {}, [productData]);

  const checkValidate = () => {
    if (productData) {
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
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    checkValidate();
  };

  const handelSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    checkValidate();
  };

  //뒤로가기
  const handleMoveBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(-1);
  };

  //상품 데이터 조회
  const fetchProduct = async () => {
    try {
      const response = await api.getProduct(Number(id));
      const mainImagesWithId = response.data.item.mainImages.map(
        (image: any, index: any) => ({
          img_id: image.id || index.toString(),
          path: image.path || image,
        }),
      );

      setProductData({
        ...response.data.item,
        mainImages: mainImagesWithId,
      });

      setFilePreview(mainImagesWithId);
    } catch (error) {
      console.log('제품불러오기실패', error);
    }
  };

  //전체 form submit
  const updateAllDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProduct(id!, productData!);
      alert('상품 수정이 완료되었습니다.');
      navigate(`/user/${id}/product-manager`);
    } catch (error) {
      console.log('상품수정오류', error);
    }
  };

  //파일 업로드를 눌렀을때 실행
  const clickFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = (e.target as HTMLInputElement).files;

    if (!fileInput) return;

    const totalFiles = filePreview.length + fileInput.length;

    if (totalFiles > 3) {
      alert('이미지는 3개까지 첨부가능합니다');
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < fileInput.length; i++) {
      formData.append('attach', fileInput[i]);
    }

    try {
      const response = await api.uploadFile(formData);

      //파일이 여러개일때
      if (response.data.files) {
        let fileObject = response.data.files;
        const resImgUrl = fileObject.map((images: any) => ({
          img_id: images.name,
          path: `${API_BASE_URL}${images.path}`,
        }));
        setFilePreview([...filePreview, ...resImgUrl]);
        setProductData({
          ...productData,
          mainImages: [...filePreview, ...resImgUrl],
        });
      }
      //단일파일일때
      else {
        let fileObject: IProductImage = {
          img_id: response.data.file.name,
          path: `${API_BASE_URL}${response.data.file.path}`,
        }!;

        setFilePreview([...filePreview, fileObject]);
        setProductData({
          ...productData,
          mainImages: [...filePreview, fileObject],
        });
      }
    } catch (error) {
      console.log('사진첨부에러발생', error);
    }
  };
  //이미지 삭제 로직
  const handleFileRemove = (
    e: React.MouseEvent<HTMLButtonElement>,
    idToRemove: string,
  ) => {
    e.preventDefault();
    setFilePreview((prevPreview: any) =>
      prevPreview.filter((item: any) => item.img_id !== idToRemove),
    );
    setProductData((prevData) => ({
      ...prevData,
      mainImages: prevData!.mainImages!.filter(
        (item) => item.img_id !== idToRemove,
      ),
    }));
  };

  //상품 설명 onChange
  const contentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {productData && (
        <>
          <form onSubmit={updateAllDataSubmit}>
            <>
              <InputLabel>상품사진</InputLabel>
              <h3>이미지는 3개까지 첨부 가능합니다.</h3>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onChange={clickFileUpload}
              >
                파일 업로드
                <input hidden type="file" multiple accept="image/*" />
              </Button>
              {filePreview.map((item) => (
                <div key={item.img_id}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      aria-label="delete"
                      size="large"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        handleFileRemove(e, item.img_id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  <img
                    key={item.img_id}
                    src={item.path}
                    alt={'File Preview'}
                    style={{ marginTop: '10px', maxWidth: '60%' }}
                  />
                </div>
              ))}
            </>
            <br />
            <br />
            <InputLabel id="category-label">카테고리</InputLabel>
            <Select
              labelId="category-label"
              id="category-select"
              label="category"
              sx={{ width: '100px' }}
              value={productData.extra?.category[1] || ''}
              onChange={(e) => {
                const selectedDBCode = e.target.value;
                setProductData((prevData) => ({
                  ...prevData,
                  extra: {
                    ...prevData!.extra,
                    category: ['H01', selectedDBCode],
                  },
                }));
              }}
            >
              {CATEGORY.depth2.map((menu) => (
                <MenuItem key={menu.id} value={menu.dbCode}>
                  {menu.name}
                </MenuItem>
              ))}
            </Select>
            <br />
            <br />
            <>
              상품 품질:
              <FormControl>
                <InputLabel id="quantity-label">상품 품질</InputLabel>
                <Select
                  labelId="quantity-label"
                  id="quantity-select"
                  label="quantity"
                  name="quantity"
                  value={
                    productData.quantity && productData.quantity >= 5
                      ? '2'
                      : productData.quantity || ''
                  }
                  sx={{ width: '100px' }}
                  onChange={handelSelectChange}
                >
                  {QUALITY.map((menu) => {
                    return (
                      <MenuItem key={menu.id} value={menu.value}>
                        {menu.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </>
            <br />
            <br />
            <>
              상품명:
              <TextField
                type="text"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
              ></TextField>
              {!isValid && productData.name?.length !== 0 ? (
                <div style={{ color: 'red' }}>{nameError}</div>
              ) : (
                <> </>
              )}
            </>
            <br />
            <br />
            <>
              상품 가격:
              <TextField
                type="text"
                name="price"
                value={productData.price || ''}
                onChange={handleInputChange}
              ></TextField>
              {!isValid ? (
                <div style={{ color: 'red' }}>{priceError}</div>
              ) : (
                <></>
              )}
            </>
            <br />
            <br />
            <>
              배송비:
              <TextField
                type="text"
                name="shippingFees"
                value={productData.shippingFees || ''}
                onChange={handleInputChange}
              ></TextField>
              {shippingFeesError && (
                <div style={{ color: 'red' }}>{shippingFeesError}</div>
              )}
            </>
            <br />
            <br />
            <>
              상품 설명:
              {productData.content && (
                <TextField
                  type="text"
                  name="content"
                  placeholder="상품 설명을 입력하세요."
                  value={productData.content}
                  onChange={contentChange}
                ></TextField>
              )}
              {!isValid && productData.content?.length! > 0 ? (
                <div style={{ color: 'red' }}>{contentError}</div>
              ) : (
                <></>
              )}
            </>
            <br />
            <Button type="submit" variant="contained">
              등록하기
            </Button>
          </form>
          <Button type="button" variant="outlined" onClick={handleMoveBack}>
            취소
          </Button>
        </>
      )}
    </>
  );
}
