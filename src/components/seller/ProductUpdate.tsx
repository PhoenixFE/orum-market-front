import { Button, Input } from '@mui/material';
import { useState } from 'react';
import { api } from '../../api/api';

export default function ProductUpdate() {
  const [productData, setProductData] = useState({
    mainImages: '',
    category: '',
    quality: '',
    price: '',
    shippingFees: '',
    title: '',
    content: '',
  });
  const [contentError, setContentError] = useState('');
  const handleMoveBack = () => {
    window.history.back();
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'content' && value.length < 10) {
      // content의 길이가 10 미만인 경우 에러 메시지 설정
      setContentError('상품 설명이 10글자 이상이여야 합니다.');
    } else {
      // 유효한 경우 에러 메시지 초기화
      setContentError('');
    }
    setProductData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    if (contentError) {
      alert('양식이 올바르지 않습니다.');
      return;
    }

    try {
      const response = await api.createProduct(productData);
      console.log(response);
      setProductData({
        ...productData,
        title: response.data.title,
        price: response.data.price,
        shippingFees: response.data.shippingFess,
        content: response.data.content,
      });
    } catch (error) {
      console.error('API Error:', error);
    }
  };
  return (
    <div>
      ProductUpdate
      <div>
        사진
        <Input
          type="text"
          name="mainImages"
          value={productData.mainImages}
          onChange={handleChange}
        ></Input>
      </div>
      <div>
        카테고리:
        <Input
          type="text"
          name="category"
          value={productData.category}
          onChange={handleChange}
        ></Input>
      </div>
      <div>
        상품 품질:
        <Input
          type="text"
          name="quality"
          value={productData.quality}
          onChange={handleChange}
        ></Input>
      </div>
      <div>
        상품명:
        <Input
          type="text"
          name="title"
          placeholder="상품명을 입력하세요."
          value={productData.title}
          onChange={handleChange}
        ></Input>
      </div>
      <div>
        상품 가격:
        <Input
          type="text"
          name="price"
          value={productData.price}
          onChange={handleChange}
        ></Input>
      </div>
      <div>
        배송비:
        <Input
          type="text"
          name="shippingFees"
          value={productData.shippingFees}
          onChange={handleChange}
        ></Input>
      </div>
      <div>
        상품 설명:
        <Input
          type="text"
          name="content"
          placeholder="상품 설명을 입력하세요."
          value={productData.content}
          onChange={handleChange}
        ></Input>
        {/* 상품 설명을 10글자 이상 해야합니다 */}
        {contentError && <div style={{ color: 'red' }}>{contentError}</div>}
      </div>
      <Button onClick={handleSubmit}>수정하기</Button>
      <Button onClick={handleMoveBack}>취소</Button>
    </div>
  );
}
