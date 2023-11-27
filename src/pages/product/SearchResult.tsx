import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IProduct } from '../../type';
import { api } from '../../api/api';
import ProductCard from './ProductCard';
import { Grid } from '@mui/material';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const query = searchParams.get('query');
      if (query) {
        const response = await api.searchProducts(query);
        setResults(response.data.item);
        console.log(response.data.item);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  return (
    <>
      <h1>Search Results</h1>
      {/* // 검색어를 표시해주자. 검색 상품 수도 표시해주자 */}
      <h3>
        '{searchParams.get('query')}' 검색 결과 {results.length}개의 상품이
        있습니다.
      </h3>
      <Grid container spacing={2}>
        {results &&
          Array.isArray(results) &&
          results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        {results.length === 0 && <h2>검색 결과가 없습니다.</h2>}
      </Grid>
    </>
  );
}
