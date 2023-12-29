import styled from 'styled-components';
import {
  Container,
  Typography,
  TextField,
  FormLabel,
  Button,
} from '@mui/material';
import {
  useQuery,
  useMutation,
  QueryClientProvider,
  QueryClient,
} from 'react-query';
import { api } from '../../api/api';
import CustomBackdrop from '../CustomBackdrop';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
  gap: 0.5rem;
`;

const queryClient = new QueryClient();

export default function SellerInfo() {
  const userId = localStorage.getItem('_id');

  const {
    data: sellerInfoData,
    isLoading,
    error,
  } = useQuery('sellerInfo', async () => {
    if (!userId) {
      throw new Error('ID가 유효하지 않습니다.');
    }
    const response = await api.getUserInfo(userId);
    return response.data.item;
  });

  const updateMutation = useMutation(
    (newInfo) => api.updateUserInfo(userId, newInfo),
    {
      onSuccess: () => {
        // Optionally invalidate and refetch
        queryClient.invalidateQueries('sellerInfo');
      },
    },
  );

  const handleUpdateUserInfo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMutation.mutate({
      ...sellerInfoData,
    });
  };

  if (isLoading) {
    return (
      <div>
        <CustomBackdrop open={isLoading} />
      </div>
    );
  }

  if (error) {
    const err = error as Error;
    return <div>Error: {err.message}</div>;
  }

  const handleChangeUserName = (newName: string) => {
    // Optimistically update the UI while mutation is in progress
    queryClient.setQueryData('sellerInfo', {
      ...sellerInfoData,
      name: newName,
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        {sellerInfoData && (
          <>
            <Typography variant="h4">판매자 정보 수정</Typography>
            <Form onSubmit={handleUpdateUserInfo}>
              <FormLabel>이메일</FormLabel>
              <TextField
                type="email"
                value={sellerInfoData.email || ''}
                variant="outlined"
                size="small"
                fullWidth
                required
                disabled
              />
              <FormLabel>이름</FormLabel>
              <TextField
                type="text"
                value={sellerInfoData.name || ''}
                onChange={(e) => handleChangeUserName(e.target.value)}
                size="small"
                fullWidth
              />
              <Button type="submit" variant="contained" size="large">
                판매자 정보 수정하기
              </Button>
            </Form>
          </>
        )}
      </Container>
    </QueryClientProvider>
  );
}
