import { Box, Container, Grid, Link, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  return (
    // 푸터 디폴트 색상을 검정, 다크 모드에서는 흰색으로 변경
    <Box sx={{ bgcolor: 'black', color: 'white', paddingY: '50px' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <img
              src="/assets/logo-gray.png"
              alt="logo"
              width={100}
              height={100}
              // cover
              style={{
                display: 'block',
                maxWidth: '50%',
                maxHeight: '50%',
                width: 'auto',
                height: 'auto',
                marginTop: '10px',
                objectFit: 'cover',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Typography variant="h6" gutterBottom></Typography>
            <Typography variant="subtitle2">
              (주)오름마켓
              <br></br>대표자 : 우승미
              <br></br>개인정보 보호책임자: 최진우
              <br></br> 사업자 등록번호 : 215-00-00000
              <br></br>통신판매신고번호 : 제2023-서울서초-0000호 <br></br>
              <Link
                href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=1108127101"
                target="_blank"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}
              >
                사업자정보확인
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} spacing={4}>
            <Typography variant="h6" gutterBottom>
              Project Member
            </Typography>
            <Box display="flex" alignItems="center" gap={1} sx={{ my: 1 }}>
              <GitHubIcon />
              <Link
                href="https://github.com/wSeungMi"
                target="_blank"
                color="inherit"
                sx={{ textDecoration: 'none' }}
              >
                우승미
              </Link>
            </Box>
            <Box display="flex" alignItems="center" gap={1} sx={{ my: 1 }}>
              <GitHubIcon />
              <Link
                href="https://github.com/veryyounng"
                target="_blank"
                color="inherit"
                sx={{ textDecoration: 'none' }}
              >
                최소영
              </Link>
            </Box>
            <Box display="flex" alignItems="center" gap={1} sx={{ my: 1 }}>
              <GitHubIcon />
              <Link
                href="https://github.com/jingoworld"
                target="_blank"
                color="inherit"
                sx={{ textDecoration: 'none' }}
              >
                최진우
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
