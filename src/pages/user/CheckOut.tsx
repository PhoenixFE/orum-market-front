import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useCartStore } from '../../lib/store';
import { api } from '../../api/api';
import {
  Container,
  Button,
  Typography,
  List,
  ListItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  Tabs,
  Tab,
  styled,
} from '@mui/material';
import {
  IAddressData,
  IAddressIamPort,
  ICartItem,
  ICartStore,
  IUserInfo,
} from '../../type';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import AddressListDialog from '../../components/address/AddressListDialog';
import NewAddressInput from '../../components/address/NewAddressForm';
import CustomTooltip from '../../components/CustomTooltip';
declare const IMP: any;
type TelPartsType = {
  telPart1: string;
  telPart2: string;
  telPart3: string;
};

export default function CheckOut() {
  const { items, clearCart } = useCartStore() as ICartStore;
  const navigate = useNavigate();
  const location = useLocation();
  const [checkoutItems, setCheckoutItems] = useState<ICartItem[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    id: 0,
    name: '',
    email: '',
    address: '',
    extra: {
      address: [
        {
          id: 0,
          addressName: '',
          receiver: '',
          tel: 0,
          name: '',
          mainAddress: '',
          subAddress: '',
        },
      ],
    },
  });
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState<boolean>(false);
  const [deliveryInfo, setDeliveryInfo] = useState<IAddressData>({
    addressName: '',
    receiver: '',
    tel: '',
    name: '',
    mainAddress: '',
    subAddress: '',
  });
  const [tabValue, setTabValue] = useState(0);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addAddressToBook, setAddAddressToBook] = useState(false);
  const [showMoreItems, setShowMoreItems] = useState(false);
  const [telParts, setTelParts] = useState<TelPartsType>({
    telPart1: '010',
    telPart2: '',
    telPart3: '',
  });

  const userId = localStorage.getItem('_id');
  const isCheckoutItemEmpty = checkoutItems.length === 0;

  useEffect(() => {
    const singleProduct = location.state?.product;
    if (singleProduct) {
      setCheckoutItems([singleProduct]);
      setTotalCost(singleProduct.price + singleProduct.shippingFees);
    } else {
      setCheckoutItems(items);
      const total = items.reduce(
        (total, item) => total + item.price + (item.shippingFees ?? 0),
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
        const userData = response.data.item;

        setUserInfo(userData);

        const addresses = userData.extra?.address || [];

        if (addresses.length > 0) {
          const defaultAddress = addresses[0];
          setDeliveryInfo({
            addressName: defaultAddress.addressName,
            receiver: defaultAddress.receiver,
            tel: defaultAddress.tel,
            mainAddress: defaultAddress.mainAddress,
            subAddress: defaultAddress.subAddress,
          });
        }

        setAddressList(addresses);
      } catch (error) {
        console.error('사용자 정보를 가져오는데 실패했습니다', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddressSearchComplete = (data: IAddressIamPort) => {
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
    setOpenAddressDialog(false);
  };

  const handlePurchase = async () => {
    const orderData = {
      products: checkoutItems.map((item) => ({
        _id: item._id,
        quantity: 1,
      })),
      value: deliveryInfo,
    };
    try {
      await api.checkOut(orderData);
      alert('주문이 완료되었습니다.');
      if (addAddressToBook) {
        const addresses = userInfo.extra.address || [];
        const newAddress = {
          ...deliveryInfo,
          id: uuidv4(),
        };
        const updateAddressData = {
          ...userInfo,
          extra: {
            ...userInfo.extra,
            address: [...addresses, newAddress],
          },
        };
        console.log('updateAddressData', updateAddressData);

        await api.updateUserInfo(userId, updateAddressData);
      }
      if (location.state?.product === undefined) {
        clearCart();
      }
      navigate('/');
    } catch (error) {
      console.error('주문 실패:', error);
    }
  };

  const handlePurchaseEnabled = () => {
    return agreedToTerms && agreedToPrivacy && !isCheckoutItemEmpty;
  };

  const pgMembers = [
    { id: 'kcp', name: 'kcp' },
    { id: 'html5_inicis', name: 'KG 이니시스' },
    { id: 'payco', name: 'payco' },
    { id: 'tosspay', name: 'tosspay' },
    { id: 'smilepay', name: 'smilepay' },
    { id: 'danal_tpay', name: '다날' },
  ];
  function requestPayment(pg: string) {
    let paymentData = {
      pg: 'kcp',
      pay_method: 'card',
      merchant_uid: `mid_${new Date().getTime()}`,
      name: '주문명:결제테스트',
      amount: totalCost,
      buyer_email: userInfo.email,
      buyer_name: userInfo.name,
      buyer_tel: deliveryInfo.tel,
      buyer_addr: deliveryInfo.mainAddress,
      buyer_postcode: '123-456',
    };

    switch (pg) {
      case 'kakao':
        paymentData.pg = 'kakaopay';
        break;
      case 'kcp':
        paymentData.pg = 'kcp';
        break;
      case 'html5_inicis':
        paymentData.pg = 'html5_inicis';
        break;
      case 'payco':
        paymentData.pg = 'payco.PARTNERTEST';
        break;
      case 'tosspay':
        paymentData.pg = 'tosspay.tosstest';
        break;
      case 'smilepay':
        paymentData.pg = 'smilepay.cnstest25m';
        break;
      case 'danal_tpay':
        paymentData.pg = 'danal_tpay';
        break;
    }

    IMP.init('imp38488078');
    IMP.request_pay(paymentData, async (response: PaymentResponse) => {
      if (response.success) {
        try {
          await handlePurchase();
          alert('결제가 완료되었습니다.');
        } catch (error) {
          console.error('결제 정보 저장 실패:', error);
        }
      } else {
        console.error('결제 실패', response);
      }
    });
  }
  interface PaymentResponse {
    success: boolean;
  }

  console.log('deliveryInfo', deliveryInfo);
  return (
    <Container sx={{ marginY: '50px' }}>
      <Typography variant="h4" fontWeight={700} mb={5}>
        주문하기
      </Typography>
      <Grid container rowGap={10} m={0}>
        {/* Left section */}
        <Grid item xs={12} md={7} sx={{ margin: 0 }}>
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
          <CustomTabs
            variant="fullWidth"
            value={tabValue}
            onChange={handleTabChange}
            aria-label="address tabs"
          >
            <CustomTab label="기본주소" />
            <CustomTab label="새로입력" />
          </CustomTabs>

          {tabValue === 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="body1">{deliveryInfo.receiver}</Typography>
                <Typography variant="body1">{deliveryInfo.tel}</Typography>
                <Typography variant="body1">
                  {deliveryInfo.mainAddress} {deliveryInfo.subAddress}
                </Typography>
              </Box>
              <CustomTooltip title="배송지 목록에서 고르기">
                <Button
                  variant="outlined"
                  color="inherit"
                  style={{ height: '56px' }}
                  onClick={() => setIsAddressDialogOpen(true)}
                >
                  배송지 목록
                </Button>
              </CustomTooltip>
              <AddressListDialog
                isOpen={isAddressDialogOpen}
                onClose={() => setIsAddressDialogOpen(false)}
                addresses={addressList}
                onSelect={(selectedAddress) => {
                  setDeliveryInfo({
                    ...deliveryInfo,
                    addressName: selectedAddress.addressName,
                    receiver: selectedAddress.receiver,
                    tel: selectedAddress.tel,
                    mainAddress: selectedAddress.mainAddress,
                    subAddress: selectedAddress.subAddress,
                  });
                }}
              />
            </Box>
          )}

          {tabValue === 1 && (
            <NewAddressInput
              deliveryInfo={deliveryInfo}
              setDeliveryInfo={setDeliveryInfo}
              telParts={telParts}
              setTelParts={setTelParts}
              handleAddressSearchComplete={handleAddressSearchComplete}
              openAddressDialog={openAddressDialog}
              setOpenAddressDialog={setOpenAddressDialog}
              addAddressToBook={addAddressToBook}
              setAddAddressToBook={setAddAddressToBook}
            />
          )}
        </Grid>

        {/* Right section */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            margin: 0,
            paddingLeft: { md: 5 },
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={3}>
            주문 내역
          </Typography>
          {isCheckoutItemEmpty ? (
            <Typography variant="h4">주문할 상품이 없습니다.</Typography>
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
                  {item.mainImages.length === 0 ? (
                    <img
                      src="/assets/no-image.jpg"
                      alt={item.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        marginRight: '20px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <img
                      src={item.mainImages[0]?.path}
                      alt={item.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        marginRight: '20px',
                        objectFit: 'cover',
                      }}
                    />
                  )}

                  <Box>
                    <Typography variant="h6">{item.name}</Typography>

                    {item.shippingFees !== undefined &&
                      item.shippingFees == 0 && (
                        <Typography variant="body2">무료배송</Typography>
                      )}

                    {item.shippingFees !== undefined &&
                      item.shippingFees > 0 && (
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
              label="회원 개인정보수집 이용에 동의합니다. (필수)"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
            }}
            gap={1}
            mt={4}
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
                flex: '1',
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
                  style={{ height: '24px' }}
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
              카카오페이 결제
            </Button>
            <Button
              onClick={handlePurchase}
              variant="outlined"
              color="primary"
              style={{ height: '56px' }}
              disabled={!handlePurchaseEnabled()}
            >
              멋사가 결제
            </Button>
          </Box>

          <Button
            onClick={() => setShowMoreItems(!showMoreItems)}
            color="inherit"
          >
            결제 수단 더보기
            {showMoreItems ? ' ▲' : ' ▼'}
          </Button>

          {showMoreItems && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'end',
                alignItems: 'center',
                mt: 2,
              }}
              gap={1}
            >
              {pgMembers.map((pg) => (
                <Button
                  onClick={() => requestPayment(pg.id)}
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  style={{ height: '56px' }}
                  disabled={!handlePurchaseEnabled()}
                >
                  {pg.name} 결제
                </Button>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

const CustomTab = styled(Tab)({
  '&.MuiTab-root': {
    color: '#777',
    backgroundColor: '#ccc',
    fontWeight: '300',
    fontSize: '0.9rem',
  },
  '&.Mui-selected': {
    border: '1px solid #000',
    backgroundColor: '#fff',
    fontWeight: '800',
    fontSize: '1rem',
  },
  marginBottom: '20px',
});

const CustomTabs = styled(Tabs)({
  '.MuiTabs-indicator': {
    display: 'none',
  },
});
