import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  FormLabel,
  Button,
  Box,
} from '@mui/material';

import { api } from '../../api/api';
import { v4 as uuidv4 } from 'uuid';
import AddressForm from '../address/AddressForm';

export default function BuyerInfo() {
  const userId = localStorage.getItem('_id');
  const [userInfo, setUserInfo] = useState(null);
  const [updateUserInfo, setUpdateUserInfo] = useState({});
  const [isCreateAddress, setIsCreateAddress] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [selectAddressId, setSelectAddressId] = useState('');
  const [addressData, setAddressData] = useState({
    addressName: '',
    receiver: '',
    tel: '',
    mainAddress: '',
    subAddress: '',
  });
  const [addressEditData, setAddressEditData] = useState({
    addressName: '',
    receiver: '',
    tel: '',
    mainAddress: '',
    subAddress: '',
  });

  const resetData = (reset: boolean) => {
    if (reset) {
      setAddressData({
        addressName: '',
        receiver: '',
        tel: '',
        mainAddress: '',
        subAddress: '',
      });
      setIsCreateAddress(false);
    } else {
      setIsEditAddress(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      console.log('ID가 유효하지 않습니다.');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await api.getUserInfo(userId);
        setUserInfo(response.data.item);
        setUpdateUserInfo(response.data.item);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserInfo();
  }, []);

  // update userInfo name
  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateUserInfo({
      ...updateUserInfo,
      name: e.target.value,
    });
  };

  // update userInfo
  const handleUpdateUserInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmUpdateUserInfo = window.confirm(
      '내 정보 변경사항을 저장하시겠습니까?',
    );

    try {
      if (confirmUpdateUserInfo) {
        await api.updateUserInfo(userId, updateUserInfo);
        alert('내 정보가 수정되었습니다.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  // update address
  const handleSubmitAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const addressArray = Array.isArray(userInfo.extra.address)
        ? userInfo.extra.address
        : [];

      const uuid = uuidv4();
      const updateFormData = {
        ...userInfo,
        extra: {
          ...userInfo.extra,
          address: [...addressArray, { id: uuid, ...addressData }],
        },
      };

      await api.updateUserInfo(userId, updateFormData);
      alert('주소가 등록되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('주소 등록에 실패했습니다.');
    }
  };

  // delete address
  const handleRemoveAddress = async (addressId) => {
    const confirmRemoveAddress =
      window.confirm('해당 주소를 삭제하시겠습니까?');

    if (confirmRemoveAddress) {
      try {
        const addressArray = userInfo.extra.address.filter(
          (list) => list.id !== addressId,
        );

        const updateFormData = {
          ...userInfo,
          extra: {
            ...userInfo.extra,
            address: addressArray,
          },
        };

        await api.updateUserInfo(userId, updateFormData);
        alert('주소가 삭제되었습니다.');
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert('주소 삭제에 실패했습니다.');
      }
    }
  };

  // Edit Address
  const handleEditAddress = (editAddressId) => {
    setIsEditAddress(true);
    const selectAddress = userInfo.extra.address.find(
      (item) => item.id === editAddressId,
    );

    setAddressEditData({
      ...selectAddress,
      addressName: selectAddress.addressName,
      receiver: selectAddress.receiver,
      tel: selectAddress.tel,
      mainAddress: selectAddress.mainAddress,
      subAddress: selectAddress.subAddress,
    });

    setSelectAddressId(editAddressId);
  };

  const handleChangeEditAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressEditData({
      ...addressEditData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitEditAddress = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      const response = await api.getUserInfo(userId);
      const onEdit = response.data.item.extra.address.map((list) =>
        list.id === selectAddressId ? { ...list, ...addressEditData } : list,
      );

      const updateAddressData = {
        ...response.data.item,
        extra: {
          ...response.data.item.extra,
          address: [...onEdit],
        },
      };
      await api.updateUserInfo(userId, updateAddressData);
      alert('주소가 수정되었습니다.');
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert('주소 수정에 실패했습니다.');
    }
  };

  if (!userInfo) {
    return <>사용자 정보를 받아오지 못했습니다.</>;
  }

  return (
    <Container>
      {userInfo && !isCreateAddress && !isEditAddress && (
        <>
          <Typography variant="h5" fontWeight={700}>
            내 정보 수정
          </Typography>
          <form onSubmit={handleUpdateUserInfo}>
            <FormLabel>이메일</FormLabel>
            <TextField
              type="email"
              value={userInfo.email}
              variant="outlined"
              size="small"
              fullWidth
              required
              disabled
            />
            <FormLabel>이름</FormLabel>
            <TextField
              type="text"
              value={updateUserInfo.name || ''}
              onChange={handleChangeUserName}
              size="small"
              fullWidth
              required
            />

            <Button type="submit" variant="contained" size="large">
              정보 수정
            </Button>
          </form>
          <br />
          <br />
          {!userInfo.extra.address && <>주소록이 비어있습니다.</>}
          {userInfo?.extra?.address?.length === 0 && (
            <>주소록이 비어있습니다.</>
          )}

          {userInfo.extra.address && (
            <>
              {userInfo.extra.address.map((list) => (
                // 주소록 목록 테이블 형태로 출력
                <Box
                  key={list.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      배송지명: {list.addressName}
                    </Typography>
                    <Typography variant="body1">
                      메인주소: {list.mainAddress}
                      <br></br>
                      상세주소: {list.subAddress}
                    </Typography>
                    <Typography variant="body2">
                      수령인: {list.receiver}
                      <br></br>
                      전화번호: {list.tel}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    gap={1}
                  >
                    <Button
                      onClick={() => handleEditAddress(list.id)}
                      variant="contained"
                      size="medium"
                    >
                      수정
                    </Button>
                    <Button
                      onClick={() => handleRemoveAddress(list.id)}
                      variant="contained"
                      size="medium"
                    >
                      삭제
                    </Button>
                  </Box>
                </Box>
              ))}
            </>
          )}

          <Box>
            <Button
              onClick={() => setIsCreateAddress(true)}
              variant="contained"
              size="large"
            >
              주소록 추가하기
            </Button>
          </Box>
        </>
      )}

      {userInfo && isCreateAddress && (
        <>
          <AddressForm
            data={addressData}
            func={handleChangeAddress}
            setData={resetData}
            submit={handleSubmitAddress}
            title={'주소록 추가하기'}
            reset={true}
          />
        </>
      )}

      {userInfo && isEditAddress && (
        <>
          <AddressForm
            data={addressEditData}
            func={handleChangeEditAddress}
            setData={setIsEditAddress}
            submit={handleSubmitEditAddress}
            title={'주소록 수정하기'}
            reset={false}
          />
        </>
      )}
    </Container>
  );
}
