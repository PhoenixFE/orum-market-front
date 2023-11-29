import { TextField } from '@mui/material';

export interface IUserInfoAddress {
  address: string;
  handleChangeUserAddress: (address: string) => void;
}

export default function AddressForm({
  address,
  handleChangeUserAddress,
}: IUserInfoAddress) {
  return (
    <>
      <TextField
        type="text"
        placeholder="주소를 입력해주세요"
        value={address}
        onChange={(e) => {
          handleChangeUserAddress(e.target.value);
        }}
        size="small"
        fullWidth
      />
    </>
  );
}