import { Box, Container, Grid, Link, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  return (
    <Box sx={{ padding: '20px 0' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <img
              src="/assets/logo.png"
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
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom></Typography>
            <Typography variant="subtitle2">
              (주)오름마켓
              <br></br>대표자 : 우승미
              <br></br>개인정보 보호책임자: 최진우
              <br></br> 사업자 등록번호 : 215-00-00000
              <br></br>통신판매신고번호 : 제2023-서울서초-0000호 <br></br>
              <a
                target="_blank"
                href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=1108127101"
              >
                사업자정보확인
              </a>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} spacing={4}>
            <Typography variant="h6" gutterBottom>
              Project Member
            </Typography>
            <Link
              href="https://github.com/wSeungMi"
              target="_blank"
              variant="body1"
              display="block"
              color="inherit"
              style={{ textDecoration: 'none' }}
            >
              <GitHubIcon />
              우승미
            </Link>
            <Link
              href="https://github.com/veryyounng"
              target="_blank"
              variant="body1"
              display="block"
              color="inherit"
              style={{ textDecoration: 'none' }}
            >
              <GitHubIcon />
              최소영
            </Link>
            <Link
              href="https://github.com/jingoworld"
              target="_blank"
              variant="body1"
              display="block"
              color="inherit"
              style={{ textDecoration: 'none' }}
            >
              <GitHubIcon />
              최진우
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
