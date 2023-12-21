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
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ICartItem, ICartStore } from '../../type';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import DaumPost from '../../components/\bDaumPost';
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
  });
  const [address, setAddress] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    addressName: '집',
    receiver: '홍길동',
    tel: '01012341234',
    mainAddress: '',
    subAddress: '',
  });

  const [openDialog, setOpenDialog] = useState(false);

  const userId = localStorage.getItem('_id');

  const addressNameRef = useRef<HTMLInputElement>(null);
  const addressValueRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const singleProduct = location.state?.product;
    if (singleProduct) {
      setCheckoutItems([singleProduct]);
      setTotalCost(singleProduct.price + singleProduct.shippingFees);
    } else {
      setCheckoutItems(items);
      const total = items.reduce(
        (total, item) => total + item.price + item.shippingFees,
        0,
      );
      setTotalCost(total);
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
        });
        setDeliveryInfo({
          addressName: response.data.item.extra.address[0].addressName,
          receiver: response.data.item.extra.address[0].receiver,
          tel: response.data.item.extra.address[0].tel,
          mainAddress: response.data.item.extra.address[0].mainAddress,
          subAddress: response.data.item.extra.address[0].subAddress,
        });
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAddressSearchComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
    }

    // 주소 데이터를 deliveryInfo에 설정
    setDeliveryInfo((prevInfo) => ({
      ...prevInfo,
      mainAddress: fullAddress,
      subAddress: extraAddress,
    }));

    // 다이얼로그 닫기
    setOpenDialog(false);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // const handlePurchase = async () => {
  //   if (!address.name.trim()) {
  //     alert('배송지 이름을 입력해주세요.');
  //     if (addressNameRef.current) {
  //       addressNameRef.current.focus();
  //     }
  //     return;
  //   }

  //   if (!address.value.trim()) {
  //     alert('배송지 주소를 입력해주세요.');
  //     if (addressValueRef.current) {
  //       addressValueRef.current.focus();
  //     }
  //     return;
  //   }

  //   try {
  //     const orderData = {
  //       products: checkoutItems.map((item) => ({
  //         _id: item._id,
  //         quantity: 1,
  //       })),
  //       value: address,
  //     };

  //     await api.checkOut(orderData);
  //     alert('주문이 완료되었습니다.');
  //     if (location.state?.product === undefined) {
  //       clearCart();
  //     }
  //     navigate('/');
  //   } catch (error) {
  //     console.error('주문 실패:', error);
  //   }
  // };

  const isCheckoutItemEmpty = checkoutItems.length === 0;
  const handlePurchaseEnabled = () => {
    return agreedToTerms && agreedToPrivacy && !isCheckoutItemEmpty;
  };

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
    <Container sx={{ marginY: '50px' }}>
      <Typography variant="h4" fontWeight={700} mb={5}>
        결제하기
      </Typography>
      <Grid container spacing={3}>
        {/* Left section */}
        <Grid item xs={12} md={7} sx={{ padding: '2rem' }}>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" fontWeight={700} my={3}>
              주문 고객
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <Typography variant="body1">{userInfo.name}</Typography>
              <Typography variant="body1">{userInfo.email}</Typography>
            </Box>
          </Box>
          <Divider />
          <Typography variant="h6" fontWeight={700} my={3}>
            배송지 정보
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
            gap={1}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
              <FormLabel sx={{ width: '50px', fontWeight: '700' }}>
                수령인
              </FormLabel>
              <TextField
                value={deliveryInfo.receiver}
                placeholder="수령인 이름을 적으세요"
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
              <FormLabel sx={{ width: '50px', fontWeight: '700' }}>
                연락처
              </FormLabel>
              <TextField
                value={deliveryInfo.tel}
                placeholder="ex) 01012341234"
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
              <FormLabel sx={{ width: '50px', fontWeight: '700' }}>
                배송지
              </FormLabel>
              <TextField
                value={deliveryInfo.addressName}
                placeholder="배송지 이름"
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }} gap={1}>
              <TextField
                value={deliveryInfo.mainAddress}
                placeholder="성남시 중원구 광명로 293"
                fullWidth
                onChange={(e) =>
                  setDeliveryInfo({
                    ...deliveryInfo,
                    mainAddress: e.target.value,
                  })
                }
              />
              <Button
                variant="outlined"
                color="primary"
                sx={{ width: '100px', height: '56px' }}
                onClick={() => setOpenDialog(true)}
              >
                주소검색
              </Button>
              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>주소 검색</DialogTitle>
                <DialogContent>
                  <DaumPost onSearchComplete={handleAddressSearchComplete} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDialog(false)}>닫기</Button>
                </DialogActions>
              </Dialog>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }} gap={5}>
              <TextField
                value={deliveryInfo.subAddress}
                placeholder="상세 주소 입력"
                fullWidth
                onChange={(e) =>
                  setDeliveryInfo({
                    ...deliveryInfo,
                    subAddress: e.target.value,
                  })
                }
              />
            </Box>
          </Box>
        </Grid>

        {/* Right section */}
        <Grid
          item
          xs={12}
          md={5}
          mt={2}
          sx={{
            padding: '2rem',
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={3}>
            주문 내역
          </Typography>
          {isCheckoutItemEmpty ? (
            <Typography variant="h4">장바구니가 비어있습니다.</Typography>
          ) : (
            <List sx={{ mb: 2 }}>
              {checkoutItems.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    alignItems: 'start',
                    borderBottom: '1px solid lightgray',
                  }}
                >
                  <img
                    src={item.mainImages[0].path}
                    alt={item.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      marginRight: '20px',
                    }}
                  />
                  <Box>
                    <Typography variant="h6">{item.name}</Typography>

                    {item.shippingFees == 0 ? (
                      <Typography variant="body2">무료배송</Typography>
                    ) : (
                      <Typography variant="body2">
                        배송비{' '}
                        {item.shippingFees.toLocaleString('KR-kr', {
                          style: 'currency',
                          currency: 'KRW',
                        })}
                      </Typography>
                    )}
                    <Typography variant="body1" fontWeight={700}>
                      {item.price.toLocaleString('KR-kr', {
                        style: 'currency',
                        currency: 'KRW',
                      })}
                    </Typography>
                  </Box>
                  <Divider />
                </ListItem>
              ))}
            </List>
          )}
          <Typography variant="h6" sx={{ my: 2, fontWeight: '800' }}>
            총 금액: {totalCost.toLocaleString()} 원
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'end',
              alignItems: 'end',
            }}
            mt={5}
          >
            <FormControlLabel
              required
              control={
                <Checkbox
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
              }
              label="이용약관에 동의합니다. (필수)"
            />
            <FormControlLabel
              required
              control={
                <Checkbox
                  checked={agreedToPrivacy}
                  onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                />
              }
              label="비회원 개인정보수집 이용에 동의합니다. (필수)"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
            }}
            mt={2}
            gap={1}
          >
            <Button
              onClick={() => requestPayment('kakao')}
              style={{
                height: '56px',
                color: handlePurchaseEnabled() ? '#111' : '#aaa',
                fontWeight: 'bold',
                padding: '10px 20px',
                margin: '10px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: handlePurchaseEnabled()
                  ? '#f7e600'
                  : '#e0e0e0',
                border:
                  '1px solid ' +
                  (handlePurchaseEnabled() ? '#f7e600' : 'white'),
              }}
              disabled={!handlePurchaseEnabled()}
            >
              {handlePurchaseEnabled() ? (
                <img
                  src="/assets/kakaopay.png"
                  alt="카카오페이"
                  style={{ marginRight: '10px', height: '24px' }}
                />
              ) : (
                <img
                  src="/assets/kakaopay.png"
                  alt="카카오페이"
                  style={{
                    marginRight: '10px',
                    height: '24px',
                    opacity: '0.3',
                  }}
                />
              )}
              카카오페이 결제하기
            </Button>{' '}
            <Button
              onClick={() => requestPayment('kcp')}
              variant="outlined"
              color="primary"
              style={{ height: '56px' }}
              disabled={!handlePurchaseEnabled()}
            >
              일반카드 결제하기
            </Button>{' '}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
