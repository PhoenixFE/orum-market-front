import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IProduct } from '../../type';
import { api } from '../../api/api';
import ProductCard from './ProductCard';
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  Slider,
  Toolbar,
  Typography,
} from '@mui/material';
import { PRICE_MARKS } from '../../constants/index';

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<IProduct[]>([]);

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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ width: '50%', marginY: 8 }}>
        <Slider
          size="medium"
          value={priceRange}
          onChange={(event, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="on"
          min={0}
          max={200000}
          step={5000}
          marks
        />
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          가격 범위: {priceRange[0].toLocaleString()}원 ~{' '}
          {priceRange[1].toLocaleString()}원
        </Typography>
        <Button
          variant="contained"
          onClick={handleSearchClick}
          sx={{ marginTop: 2 }}
        >
          검색
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        검색 결과
      </Typography>
      <Typography variant="h6">
        '{searchParams.get('query') || ''}' 검색 결과 {results.length}개의
        상품이 있습니다.
      </Typography>

      <Grid container spacing={2}>
        {results.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {results.length === 0 && <Typography>검색 결과가 없습니다.</Typography>}
      </Grid>
    </Box>
  );
}
