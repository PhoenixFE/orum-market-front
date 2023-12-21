import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

type AddressListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  addresses: any[];
  onSelect: (address: any) => void;
};

const AddressListDialog: React.FC<AddressListDialogProps> = ({
  isOpen,
  onClose,
  addresses,
  onSelect,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>배송지 목록을 선택하세요</DialogTitle>
      <DialogContent>
        {addresses.map((address) => (
          <Box
            sx={{
              py: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderBottom: '1px solid #eee',
            }}
            key={address.id}
            onClick={() => {
              onSelect(address);
              onClose();
            }}
          >
            <Box sx={{ mr: 1 }}>
              <Typography variant="body1" fontWeight={700} mb={2}>
                {address.addressName}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {address.receiver}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {address.tel}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {address.mainAddress} {address.subAddress}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                onSelect(address);
                onClose();
              }}
              sx={{ borderRadius: '0' }}
            >
              선택
            </Button>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressListDialog;
