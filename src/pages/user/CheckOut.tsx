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
import { ICartStore } from '../../type';
import { useNavigate } from 'react-router-dom';

export default function CheckOut() {
  const { items, clearCart } = useCartStore() as ICartStore;
  const [userInfo, setUserInfo] = useState({
    name: '집',
    email: '',
    address: '',
  });
  const [address, setAddress] = useState({ name: '', value: userInfo.address });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const userId = localStorage.getItem('_id');
  const totalCost = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const navigate = useNavigate();

  const addressNameRef = useRef<HTMLInputElement>(null);
  const addressValueRef = useRef<HTMLInputElement>(null);

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
        console.log(userInfo);
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다', error);
      }
    };

    fetchUserInfo();
    console.log(userInfo);
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePurchase = async () => {
    if (!address.name.trim()) {
      alert('배송지 이름을 입력해주세요.');
      if (addressNameRef.current) {
        addressNameRef.current.focus(); // Ref를 사용하여 포커스
      }
      return;
    }

    if (!address.value.trim()) {
      alert('배송지 주소를 입력해주세요.');
      if (addressValueRef.current) {
        addressValueRef.current.focus(); // Ref를 사용하여 포커스
      }
      return;
    }

    try {
      const orderData = {
        products: items.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
        })),
        value: address,
      };

      await api.checkOut(orderData);
      alert('주문이 완료되었습니다.');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('주문 실패:', error);
    }
  };

  const handlePurchaseEnabled = () => {
    return agreedToTerms && agreedToPrivacy && !isCartEmpty;
  };

  const isCartEmpty = items.length === 0;

  return (
    <Container>
      <Typography variant="h2">결제하기</Typography>

      {isCartEmpty ? (
        <Typography variant="h4">장바구니가 비어있습니다.</Typography>
      ) : (
        <List sx={{ mb: 2 }}>
          {items.map((item, index) => (
            <ListItem key={index}>
              <img
                src={item.mainImages[0]}
                alt={item.name}
                style={{ width: '100px', height: '100px', marginRight: '20px' }}
              />
              <ListItemText
                primary={item.name}
                secondary={`수량: ${item.quantity}`}
              />
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

      <Button
        onClick={handlePurchase}
        variant="contained"
        color="primary"
        disabled={!handlePurchaseEnabled()}
      >
        결제하기
      </Button>
    </Container>
  );
}
