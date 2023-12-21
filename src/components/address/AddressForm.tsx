import { Typography, TextField, FormLabel, Button, Box } from '@mui/material';

export default function AddressForm({
  data,
  func,
  setData,
  submit,
  title,
  reset,
}) {
  return (
    <>
      <Typography variant="h5" fontWeight={700} marginBottom={1}>
        {title}
      </Typography>

      <form onSubmit={(e) => submit(e)}>
        <FormLabel>배송지명*</FormLabel>
        <TextField
          type="text"
          value={data?.addressName || ''}
          placeholder="배송지명을 입력하세요. ex)집, 회사 등"
          name="addressName"
          size="small"
          fullWidth
          required
          sx={{ marginBottom: '10px' }}
          onChange={func}
        />
        <FormLabel>수령인*</FormLabel>
        <TextField
          type="text"
          value={data?.receiver || ''}
          placeholder="이름"
          name="receiver"
          size="small"
          fullWidth
          required
          sx={{ marginBottom: '10px' }}
          onChange={func}
        />
        <FormLabel>연락처*</FormLabel>
        <TextField
          type="tel"
          value={data?.tel || ''}
          placeholder="-없이 입력"
          name="tel"
          size="small"
          fullWidth
          required
          sx={{ marginBottom: '10px' }}
          onChange={func}
        />
        <FormLabel>배송 주소*</FormLabel>
        <TextField
          type="text"
          value={data?.mainAddress || ''}
          placeholder="예) 서울특별시 강남구 테헤란로 443 "
          name="mainAddress"
          size="small"
          fullWidth
          required
          sx={{ marginBottom: '6px' }}
          onChange={func}
        />
        <TextField
          type="text"
          value={data?.subAddress || ''}
          placeholder="나머지 주소를 입력하세요 "
          name="subAddress"
          size="small"
          fullWidth
          required
          onChange={func}
        />
        <Box sx={{ display: 'flex', flexDirection: 'row' }} gap={1.2} my={1.6}>
          <Button type="submit" size="large" variant="contained" fullWidth>
            저장
          </Button>
          <Button
            onClick={() => setData(reset)}
            variant="outlined"
            size="large"
            fullWidth
          >
            취소
          </Button>
        </Box>
      </form>
    </>
  );
}
