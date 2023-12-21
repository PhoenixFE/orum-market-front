import { ModalClose, Modal } from '@mui/joy';
import { Box, Button, Rating, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useState } from 'react';

interface IProps {
  open: boolean;
  handleClose: () => void;
  ratingValue: number;
  setRatingValue: React.Dispatch<React.SetStateAction<number>>;
  handleCloseBtn: () => void;
  submitRating: () => void;
}

export default function RatingModal({
  open,
  handleClose,
  ratingValue,
  setRatingValue,
  handleCloseBtn,
  submitRating,
}: IProps) {
  const labels = {
    0: '선택하세요',
    1: '1점(별로예요)',
    2: '2점(그저그래요)',
    3: '3점(괜찮아요)',
    4: '4점(좋아요)',
    5: '5점(최고예요)',
  } as { [key: number]: string };

  function getLabelText(ratingValue: number) {
    return `${ratingValue} Star${ratingValue !== 1 ? 's' : ''}, ${
      labels[ratingValue]
    }`;
  }
  const [hover, setHover] = useState(-1);
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            align="center"
            fontWeight={700}
            sx={{ paddingBottom: '10px', borderBottom: '1px solid #e2e2e2' }}
          >
            별점후기
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '25px 25px 5px 25px',
            }}
          >
            <Typography variant="h6" marginBottom={1}>
              상품은 만족하셨나요?
            </Typography>
            <Rating
              name="simple-controlled"
              value={ratingValue}
              getLabelText={getLabelText}
              size="large"
              onChange={(event, newValue) => {
                setRatingValue(newValue || 0);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={
                <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
              }
              style={{ color: '#ef5b2a' }}
            />
            {ratingValue !== null && (
              <Box sx={{ mt: 1.5, mb: 3 }}>
                <Typography variant="body2">
                  {labels[hover !== -1 ? hover : ratingValue]}
                </Typography>
              </Box>
            )}
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => submitRating()}
            >
              후기제출
            </Button>
          </Box>
          <ModalClose variant="plain" onClick={() => handleCloseBtn()} />
        </Box>
      </Modal>
    </>
  );
}
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 60,
  pt: 1.5,
  pb: 3,
};
