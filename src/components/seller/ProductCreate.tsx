import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Input, TextField } from '@mui/material';
import { api } from '../../api/api';
import { validateProductTitle } from '../../lib/validation';
import { CleaningServices } from '@mui/icons-material';

export const data = {
  price: 22000,
  shippingFees: 3000,
  show: true,
  active: true,
  name: '',
  mainImages: ['/uploads/sample-janngu.jpg'],
  content: '',
  createdAt: '2023.10.12 12:34:56',
  updatedAt: '2023.10.12 12:34:56',
  extra: {
    isNew: true,
    isBest: true,
    category: ['PC02', 'PC0201'],
    quantity: 600,
    buyQuantity: 190,
    order: 7,
  },
};
export default function ProductCreate() {
  const [productData, setProductData] = useState({
    mainImages: '',
    category: '',
    quality: '',
    price: '',
    shippingFees: '',
    title: '',
    content: '',
  });

  const [isValid, setIsValid] = useState(true);
  const [contentError, setContentError] = useState('');
  const [numberError, setNumberError] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setProductData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCancel = () => {
    window.history.back();
  };

  const productSubmit = async () => {
    if (!isValid) {
      alert('양식이 올바르지 않습니다.');
      return;
    }
    try {
      const response = await api.createProduct(productData);
      console.log(response);
    } catch (error) {
      console.error('API Error:', error);
    }
  };
  return (
    <>
      ProductCreate
      <form>
        <>
          사진
          <TextField
            type="text"
            name="mainImages"
            value={productData.mainImages}
            onChange={handleAllChange}
          ></TextField>
        </>
        <br></br>
        <>
          카테고리:
          <TextField
            type="text"
            name="category"
            value={productData.category}
          ></TextField>
        </>
        <br></br>
        <>
          상품 품질:
          <TextField
            type="text"
            name="quality"
            value={productData.quality}
          ></TextField>
        </>
        <br></br>
        <>
          상품명:
          <TextField
            type="text"
            name="title"
            placeholder="상품명을 입력하세요."
            value={productData.title}
            onChange={handleAllChange}
          ></TextField>
          {!isValid && productData.title.length !== 0 ? (
            <div style={{ color: 'red' }}>{titleError}</div>
          ) : (
            <> </>
          )}
        </>
        <br></br>
        <>
          상품 가격:
          <TextField
            type="text"
            name="price"
            value={productData.price}
            onChange={handleAllChange}
          ></TextField>
          {numberError && <div style={{ color: 'red' }}>{numberError}</div>}
        </>
        <br></br>
        <>
          배송비:
          <TextField
            type="text"
            name="shippingFees"
            value={productData.shippingFees}
            onChange={handleAllChange}
          ></TextField>
          {numberError && <div style={{ color: 'red' }}>{numberError}</div>}
        </>
        <br></br>
        <>
          상품 설명:
          <TextField
            type="text"
            name="content"
            placeholder="상품 설명을 입력하세요."
            value={productData.content}
            onChange={handleAllChange}
          ></TextField>
          {/* 상품 설명을 10글자 이상 해야합니다 */}
          {contentError && <div style={{ color: 'red' }}>{contentError}</div>}
        </>
        <br></br>
        <button type="submit" onClick={productSubmit}>
          등록하기
        </button>
      </form>
      <button type="button" onClick={handleCancel}>
        취소
      </button>
    </>
  );
}
