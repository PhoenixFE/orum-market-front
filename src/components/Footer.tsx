import { Box, Container, Grid, Link, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', padding: '20px 0' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography>
              Brief description of the company or website. You can put a few
              sentences here to introduce visitors to your brand.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            {/* Add your links here */}
            <Link href="#" variant="body1" display="block">
              Home
            </Link>
            <Link href="#" variant="body1" display="block">
              Products
            </Link>
            <Link href="#" variant="body1" display="block">
              Contact
            </Link>
            <Link href="#" variant="body1" display="block">
              About
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            {/* Add your contact information here */}
            <Typography variant="body1">Phone: +82 123 4567</Typography>
            <Typography variant="body1">Email: info@example.com</Typography>
            <Typography variant="body1">Address: 123 Street, Seoul</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
