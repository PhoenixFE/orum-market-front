import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IProduct } from '../../type';
import { api } from '../../api/api';
import ProductCard from './ProductCard';
import {
  Box,
  Button,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slider,
  Toolbar,
  Typography,
} from '@mui/material';
import { PRICE_MARKS } from '../../constants/index';
import InboxIcon from '@mui/icons-material/MoveToInbox';

const drawerWidth = 240;

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<IProduct[]>([]);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const initialPriceRange = [
    parseInt(searchParams.get('minPrice') || '0', 10),
    parseInt(searchParams.get('maxPrice') || '100000', 10),
  ];
  const [priceRange, setPriceRange] = useState<number[]>(initialPriceRange);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const query = searchParams.get('query') || '';
      const response = await api.searchProducts(
        query,
        priceRange[0],
        priceRange[1],
      );
      setResults(response.data.item);
    };

    fetchSearchResults();
  }, [searchParams]);

  const handleSearchClick = () => {
    setSearchParams({
      query: searchParams.get('query') || '',
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    });
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Item 1" />
          </ListItemButton>
        </ListItem>
        {/* ... 기타 아이템들 ... */}
        <ListItem>
          <Typography variant="h6">가격 범위</Typography>
        </ListItem>
        <ListItem>
          <Slider
            value={priceRange}
            onChange={(event, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="on"
            min={0}
            max={100000}
            step={5000}
            marks={PRICE_MARKS}
          />
        </ListItem>
        <ListItem>
          <Button variant="contained" onClick={handleSearchClick}>
            검색
          </Button>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* 모바일 버전에서는 Drawer가 토글되도록 합니다. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* 데스크톱 버전에서는 항상 Drawer가 표시됩니다. */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          검색 결과
        </Typography>

        <Typography variant="h6">
          '{searchParams.get('query') || ''}' 검색 결과 {results.length}개의
          상품이 있습니다.
        </Typography>
        {/* <Box sx={{ width: '100%', my: 2 }}>
          <Typography>가격 범위:</Typography>
          <Slider
            value={priceRange}
            onChange={(event, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="on"
            min={0}
            max={100000}
            step={5000}
            marks={PRICE_MARKS}
          />
          <Button variant="contained" onClick={handleSearchClick}>
            검색
          </Button>
        </Box> */}
        <Grid container spacing={2}>
          {results &&
            Array.isArray(results) &&
            results.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          {results.length === 0 && <h2>검색 결과가 없습니다.</h2>}
        </Grid>
      </Box>
    </Box>
  );
}
