import {
  Box,
  FormLabel,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DaumPost from '../DaumPost';
import { IAddressData, IAddressIamPort } from '../../type';
import React from 'react';

interface NewAddressInputProps {
  deliveryInfo: IAddressData;
  setDeliveryInfo: (info: IAddressData) => void;
  telParts: {
    telPart1: string;
    telPart2: string;
    telPart3: string;
  };
  setTelParts: (parts: {
    telPart1: string;
    telPart2: string;
    telPart3: string;
  }) => void;
  handleAddressSearchComplete: (data: IAddressIamPort) => void; // Adjust based on actual function signature
  openAddressDialog: boolean;
  setOpenAddressDialog: (open: boolean) => void;
  addAddressToBook: boolean;
  setAddAddressToBook: (add: boolean) => void;
}

const NewAddressInput: React.FC<NewAddressInputProps> = ({
  deliveryInfo,
  setDeliveryInfo,
  telParts,
  setTelParts,
  handleAddressSearchComplete,
  openAddressDialog,
  setOpenAddressDialog,
  addAddressToBook,
  setAddAddressToBook,
}) => {
  const handleReceiverChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setDeliveryInfo({ ...deliveryInfo, receiver: e.target.value });
  };

  const handleAddressNameChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setDeliveryInfo({ ...deliveryInfo, addressName: e.target.value });
  };

  const handleTelChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const newTelParts = { ...telParts, [name]: value };
    setTelParts(newTelParts);
    const newTelNumber = Object.values(newTelParts).join('-');
    setDeliveryInfo({ ...deliveryInfo, tel: newTelNumber });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
      gap={1}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
        <FormLabel sx={{ width: '60px', fontWeight: '700' }}>수령인</FormLabel>
        <TextField
          value={deliveryInfo.receiver}
          placeholder="수령인 이름을 적으세요"
          fullWidth
          onChange={handleReceiverChange}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
        <FormLabel sx={{ width: '60px', fontWeight: '700' }}>연락처</FormLabel>
        <Box gap={1} sx={{ display: 'flex' }}>
          <TextField
            name="telPart1"
            value={telParts.telPart1}
            placeholder="010"
            onChange={handleTelChange}
          />
          <TextField
            name="telPart2"
            value={telParts.telPart2}
            placeholder="1234"
            onChange={handleTelChange}
          />
          <TextField
            name="telPart3"
            value={telParts.telPart3}
            placeholder="5678"
            onChange={handleTelChange}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
        <FormLabel sx={{ width: '60px', fontWeight: '700' }}>배송지</FormLabel>
        <TextField
          value={deliveryInfo.addressName}
          placeholder="배송지 이름"
          fullWidth
          onChange={handleAddressNameChange}
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
          onClick={() => setOpenAddressDialog(true)}
        >
          주소검색
        </Button>
        <Dialog
          open={openAddressDialog}
          onClose={() => setOpenAddressDialog(false)}
        >
          <DialogTitle>주소 검색</DialogTitle>
          <DialogContent>
            <DaumPost onSearchComplete={handleAddressSearchComplete} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddressDialog(false)}>닫기</Button>
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
      <FormControlLabel
        control={
          <Checkbox
            checked={addAddressToBook}
            onChange={(e) => setAddAddressToBook(e.target.checked)}
          />
        }
        label="주소록에 추가"
      />
    </Box>
  );
};

export default NewAddressInput;
