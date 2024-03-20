import { useState } from 'react';

export default function useSortFilter(searchParams) {
  const [products, setProducts] = useState([]);

  return [products];
}
