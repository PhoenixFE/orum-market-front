import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { ICartStore } from '../../type';

export default function CheckOut() {
  const { items, clearCart } = useCartStore() as ICartStore;
  const [userInfo, setUserInfo] = useState({
    name: '집',
    email: '',
    address: '',
  });
  const [address, setAddress] = useState({ name: '', value: userInfo.address });

  const userId = localStorage.getItem('_id');

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
    } catch (error) {
      console.error('주문 실패:', error);
    }
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
        label="배송지 이름"
        name="name"
        value={address.name}
        onChange={handleAddressChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="배송지 주소"
        name="value"
        value={address.value}
        onChange={handleAddressChange}
        fullWidth
        margin="normal"
      />
      <Button
        onClick={handlePurchase}
        variant="contained"
        color="primary"
        disabled={isCartEmpty}
      >
        결제하기
      </Button>
    </Container>
  );
}
