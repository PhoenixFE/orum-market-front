import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '../../lib/store';
import { api } from '../../api/api';
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { ICartItem, ICartStore } from '../../type';
import { useLocation, useNavigate } from 'react-router-dom';
declare const IMP: any;

export default function CheckOut() {
  const { items, clearCart } = useCartStore() as ICartStore;
  const navigate = useNavigate();
  const location = useLocation();
  const [checkoutItems, setCheckoutItems] = useState<ICartItem[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: '집',
    email: '',
    address: '',
  });
  const [address, setAddress] = useState({ name: '', value: userInfo.address });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const userId = localStorage.getItem('_id');

  const addressNameRef = useRef<HTMLInputElement>(null);
  const addressValueRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const singleProduct = location.state?.product;
    if (singleProduct) {
      setCheckoutItems([singleProduct]);
      setTotalCost(singleProduct.price);
    } else {
      setCheckoutItems(items);
      setTotalCost(items.reduce((total, item) => total + item.price, 0));
    }
  }, [items, location.state?.product]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!userId) {
          throw new Error('사용자 ID가 없습니다');
        }
        const response = await api.getUserInfo(userId);
        setUserInfo({
          name: response.data.item.name,
          email: response.data.item.email,
          address: response.data.item.address,
        });
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePurchase = async () => {
    if (!address.name.trim()) {
      alert('배송지 이름을 입력해주세요.');
      if (addressNameRef.current) {
        addressNameRef.current.focus();
      }
      return;
    }

    if (!address.value.trim()) {
      alert('배송지 주소를 입력해주세요.');
      if (addressValueRef.current) {
        addressValueRef.current.focus();
      }
      return;
    }

    try {
      const orderData = {
        products: checkoutItems.map((item) => ({
          _id: item._id,
          quantity: 1,
        })),
        value: address,
      };

      await api.checkOut(orderData);
      alert('주문이 완료되었습니다.');
      if (location.state?.product === undefined) {
        clearCart();
      }
      navigate('/');
    } catch (error) {
      console.error('주문 실패:', error);
    }
  };

  const isCheckoutItemEmpty = checkoutItems.length === 0;
  const handlePurchaseEnabled = () => {
    return agreedToTerms && agreedToPrivacy && !isCheckoutItemEmpty;
  };

  // function requestPayment() {
  //   PortOne.requestPayment({
  //     storeId: 'store-6303d710-90d0-4d2d-8536-bb48f6ab4f21',
  //     paymentId: 'paymentId_{now()}',
  //     orderName: '나이키 와플 트레이너 2 SD',
  //     totalAmount: 1000,
  //     currency: 'CURRENCY_KRW',
  //     pgProvider: 'PG_PROVIDER_TOSSPAYMENTS',
  //     payMethod: 'CARD',
  //   });
  // }
  function requestPayment(pg: string) {
    let paymentData = {
      pg: 'kcp',
      pay_method: 'card',
      merchant_uid: `mid_${new Date().getTime()}`,
      name: '주문명:결제테스트',
      amount: totalCost,
      buyer_email: userInfo.email,
      buyer_name: userInfo.name,
      buyer_tel: '010-1234-5678',
      buyer_addr: address.value,
      buyer_postcode: '123-456',
    };

    if (pg === 'kakao') {
      paymentData.pg = 'kakaopay';
    }

    IMP.init('imp38488078');
    IMP.request_pay(paymentData, (response: PaymentResponse) => {
      // 결제 완료 후 콜백 함수
      if (response.success) {
        // 결제 성공 시 로직
        console.log('결제 성공', response);
      } else {
        // 결제 실패 시 로직
        console.error('결제 실패', response);
      }
    });
  }
  interface PaymentResponse {
    success: boolean;
  }
  // 결제 성공 response 예시
  // {
  //   apply_num: '';
  //   bank_name: null;
  //   buyer_addr: '1';
  //   buyer_email: 'jin@gmail.com';
  //   buyer_name: 'Jinwoo Choi';
  //   buyer_postcode: '123-456';
  //   buyer_tel: '010-1234-5678';
  //   card_name: null;
  //   card_number: '';
  //   card_quota: 0;
  //   currency: 'KRW';
  //   custom_data: null;
  //   imp_uid: 'imp_045064202407';
  //   merchant_uid: 'mid_1702745063484';
  //   name: '주문명:결제테스트';
  //   paid_amount: 47000;
  //   paid_at: 1702745085;
  //   pay_method: 'point';
  //   pg_provider: 'kakaopay';
  //   pg_tid: 'T57dd3e83ad74821055e';
  //   pg_type: 'payment';
  //   receipt_url: 'https://mockup-pg-web.kakao.com/v1/confirmation/p/T57dd3e83ad74821055e/4f2a3da6fddf5e8fd2ac750cfaaf9d792d99c49e2b1b631d843d36cfd6cc3893';
  //   status: 'paid';
  //   success: true;
  // }

  return (
    <Container>
      <Typography variant="h2">결제하기</Typography>
      {isCheckoutItemEmpty ? (
        <Typography variant="h4">장바구니가 비어있습니다.</Typography>
      ) : (
        <List sx={{ mb: 2 }}>
          {checkoutItems.map((item, index) => (
            <ListItem key={index}>
              <img
                src={item.mainImages[0]}
                alt={item.name}
                style={{ width: '100px', height: '100px', marginRight: '20px' }}
              />
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      )}
      <TextField
        label="이름"
        value={userInfo.name}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        label="연락처"
        value={userInfo.email}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        inputRef={addressNameRef}
        label="배송지 이름"
        name="name"
        value={address.name}
        onChange={handleAddressChange}
        fullWidth
        margin="normal"
      />
      <TextField
        inputRef={addressValueRef}
        label="배송지 주소"
        name="value"
        value={address.value}
        onChange={handleAddressChange}
        fullWidth
        margin="normal"
      />
      <Typography variant="h6" sx={{ my: 2 }}>
        총 금액: ₩{totalCost.toLocaleString()}
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
        }
        label="이용약관에 동의합니다. (필수)"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={agreedToPrivacy}
            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
          />
        }
        label="비회원 개인정보수집 이용에 동의합니다. (필수)"
      />
      {/* <Button
        onClick={requestKakaoPayment}
        variant="contained"
        color="primary"
        disabled={!handlePurchaseEnabled()}
      >
        카카오페이 결제하기
      </Button>{' '} */}
      <Button
        onClick={() => requestPayment('kakao')}
        variant="text"
        style={{
          backgroundColor: '#FEE500',
          color: 'black',
          fontWeight: 'bold',
          padding: '10px 20px',
          margin: '10px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        disabled={!handlePurchaseEnabled()}
      >
        <img
          src="/assets/kakaopay.png" // 카카오페이 로고 이미지 경로
          alt="카카오페이"
          style={{ marginRight: '10px', height: '24px' }}
        />
        카카오페이
      </Button>{' '}
      <Button
        onClick={() => requestPayment('kcp')}
        variant="outlined"
        color="primary"
        disabled={!handlePurchaseEnabled()}
      >
        일반카드 결제하기
      </Button>{' '}
    </Container>
  );
}
