import {
  Box,
  Button,
  Grid,
  Grow,
  Skeleton,
  Slide,
  Typography,
  styled,
} from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CircularProgress } from '@mui/material';

import ProductCard from './ProductCard';
import { SearchSection } from '../../components/search/SearchSection';
import { useSearchStore, useRecentViewProductStore } from '../../lib/store';
import StickyNavbar from '../../components/NavigationBar';
import { useSort } from '../../hooks/useSort';
import { useEffect, useState } from 'react';
import { IProduct } from '../../type';
import {
  CATEGORY,
  PRICE_BOUNDARIES,
  PRICE_RANGE,
  SHIPPING_FEE,
} from '../../constants';
import { useFetchProducts } from '../../hooks/useFetchProducts';

export function SearchPage() {
  const { searchResult, setSearchResult } = useSearchStore();
  const [sortedProducts, setCurrentSortOrder] = useSort(
    searchResult,
    '최신순',
  ) as any;
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('전체');
  const [selectedShippingFee, setSelectedShippingFee] = useState('전체');
  const [isDataFetched, setIsDataFetched] = useState(false);

  const { addRecentViewProduct } = useRecentViewProductStore() as {
    addRecentViewProduct: Function;
  };

  const handleSaveRecentlyViewed = (product: IProduct) => {
    addRecentViewProduct({ ...product });
  };

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }
  const productListQuery = {};
  const { data, error, isLoading } = useFetchProducts(productListQuery);

  useEffect(() => {
    if (data) {
      setSearchResult(Array.isArray(data.data.item) ? data.data.item : []);
      setIsDataFetched(true);
    }
  }, [data, setSearchResult]);

  if (error) {
    console.error('Error fetching products:', error);
    return <div>Error fetching products</div>;
  }

  const handleDisplayChange = (value: number) => {
    setItemsPerPage(value);
  };

  // 아이템 사이즈를 계산하는 함수
  const getItemSize = () => {
    if (itemsPerPage === 8) return { xs: 6, sm: 3, md: 2, lg: 2, xl: 2 };
    return { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 };
  };

  // 카테고리, 가격, 배송료에 따라 필터링된 상품 목록
  const selectedPriceRange = PRICE_BOUNDARIES[selectedPrice];

  const filteredProducts = sortedProducts.filter((product: IProduct) => {
    const withinCategory =
      selectedCategory === 'all' ||
      product.extra?.category?.includes(selectedCategory);
    const withinPriceRange =
      product.price >= selectedPriceRange.min &&
      product.price <= selectedPriceRange.max;
    let withinShippingFee = true;

    if (selectedShippingFee !== '전체') {
      withinShippingFee =
        (selectedShippingFee === '무료배송' && product.shippingFees === 0) ||
        (selectedShippingFee === '유료배송' && product.shippingFees > 0);
    }

    return withinCategory && withinPriceRange && withinShippingFee;
  });

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedPrice('전체');
    setSelectedShippingFee('전체');
  };

  const ProductSkeleton = () => {
    return (
      <Grid container spacing={4} m={4}>
        {Array.from(new Array(itemsPerPage)).map((_, index) => (
          <Grid item key={index} {...getItemSize()}>
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderNoProductsMessage = () => {
    if (!isLoading && isDataFetched && filteredProducts.length === 0) {
      return (
        <Grid item xs={12} style={{ height: '100%' }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{ height: '100%' }}
          >
            <Typography variant="h6" color="textSecondary">
              찾으시는 상품이 없습니다.
            </Typography>
          </Box>
        </Grid>
      );
    }
    return null;
  };

  const renderProductsOrSkeletons = () => {
    if (isLoading) {
      return <ProductSkeleton />;
    }

    return (
      <>
        {filteredProducts.map((product: IProduct) => (
          <Grow
            in={true}
            key={product._id}
            style={{ transformOrigin: '0 0 0' }}
            {...{ timeout: 1000 }}
            onClick={() => handleSaveRecentlyViewed(product)}
          >
            <Grid item {...getItemSize()}>
              <ProductCard product={product} />
            </Grid>
          </Grow>
        ))}
        {/* {filteredProducts.length === 0 && (
          <Grid item xs={12} style={{ height: '100%' }}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ height: '100%' }}
            >
              <Typography variant="h6" color="textSecondary">
                찾으시는 상품이 없습니다.
              </Typography>
            </Box>
          </Grid>
        )} */}
      </>
    );
  };

  // 상품 목록 Grid
  const productGrid = (
    <Grid container spacing={4} rowSpacing={8}>
      {renderProductsOrSkeletons()}
      {renderNoProductsMessage()}
    </Grid>
  );

  // 사이드바 Grid
  const sidebarGrid = (
    <Grid item xs={3}>
      <Box
        sx={{
          width: '100%',
          position: 'sticky',
          top: '128px',
          paddingY: '10px',
          boxShadow: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="text" color="inherit" onClick={resetFilters}>
            필터 초기화
            <RefreshIcon sx={{ marginLeft: '5px' }} />
          </Button>
        </Box>
        <CustomAccordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="body2" fontWeight={800}>
              카테고리
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Button
              key="all"
              variant="text"
              color="inherit"
              onClick={() => setSelectedCategory('all')}
              startIcon={
                selectedCategory === 'all' ? (
                  <CheckBoxIcon />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )
              }
              sx={{
                fontWeight: selectedCategory === 'all' ? 'bold' : 'light',
              }}
            >
              전체
            </Button>
            {CATEGORY.depth2.map((category) => (
              <Button
                key={category.id}
                variant="text"
                color="inherit"
                onClick={() => setSelectedCategory(category.dbCode)}
                startIcon={
                  selectedCategory === category.dbCode ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )
                }
                sx={{
                  fontWeight:
                    selectedCategory === category.dbCode ? 'bold' : 'light',
                }}
              >
                {category.name}
              </Button>
            ))}
          </AccordionDetails>
        </CustomAccordion>
        <CustomAccordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography variant="body2" fontWeight={800}>
              가격
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {PRICE_RANGE.map((price) => (
              <Button
                key={price.id}
                variant="text"
                color="inherit"
                onClick={() => setSelectedPrice(price.label)}
                startIcon={
                  selectedPrice === price.label ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )
                }
                sx={{
                  fontWeight: selectedPrice === price.label ? 'bold' : 'light',
                }}
              >
                {price.label}
              </Button>
            ))}
          </AccordionDetails>
        </CustomAccordion>
        <CustomAccordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography variant="body2" fontWeight={800}>
              배송료
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {SHIPPING_FEE.map((fee) => (
              <Button
                key={fee.label}
                variant="text"
                color="inherit"
                onClick={() => setSelectedShippingFee(fee.value)}
                startIcon={
                  selectedShippingFee === fee.value ? (
                    <CheckBoxIcon />
                  ) : (
                    <CheckBoxOutlineBlankIcon />
                  )
                }
                sx={{
                  fontWeight:
                    selectedShippingFee === fee.value ? 'bold' : 'light',
                }}
              >
                {fee.label}
              </Button>
            ))}
          </AccordionDetails>
        </CustomAccordion>
      </Box>
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3, padding: '0px', marginBottom: '120px' }}>
      <SearchSection />
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          padding: '0px',
          display: 'flex',
          justifyContent: 'center',
        }}
      ></Box>

      <StickyNavbar
        totalProducts={filteredProducts.length}
        handleSort={setCurrentSortOrder}
        handleDisplayChange={handleDisplayChange}
        handleToggel={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <Box sx={{ marginTop: '50px', maxWidth: '100%', paddingX: '20px' }}>
        <Grid container spacing={3}>
          <Slide
            direction="right"
            in={isSidebarOpen}
            mountOnEnter
            unmountOnExit
          >
            {sidebarGrid}
          </Slide>
          <Grid item xs={isSidebarOpen ? 9 : 12}>
            {productGrid}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

const CustomAccordion = styled(Accordion)(({ theme }) => {
  return {
    boxShadow: 'none',
    border: `none`,
    borderRadius: '10px',
    backgroundColor: theme.palette.background.paper,
    '.MuiAccordionDetails-root': {},
    '.MuiAccordionSummary-root': {},
  };
});
