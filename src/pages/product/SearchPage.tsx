import { Box, Button, Container, Grid, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ProductCard from './ProductCard';
import { SearchSection } from '../../components/search/SearchSection';
import { useSearchStore } from '../../lib/store';
import StickyNavbar from '../../components/NavigationBar';
import { useSort } from '../../hooks/useSort';
import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { IProduct } from '../../type';
import { CATEGORY } from '../../constants';
import { CheckBox } from '@mui/icons-material';

export function SearchPage() {
  const { searchResult, setSearchResult } = useSearchStore();
  const [sortedProducts, setCurrentSortOrder] = useSort(
    searchResult,
    '최신순',
  ) as any;
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await api.getProductList();
        setSearchResult(response.data.item);
      } catch (error) {
        console.error('상품 검색 실패:', error);
      }
    };

    fetchAllProducts();
  }, []);

  const handleDisplayChange = (value: number) => {
    setItemsPerPage(value);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // 아이템 사이즈를 계산하는 함수
  const getItemSize = () => {
    if (itemsPerPage === 8) return { xs: 6, sm: 3, md: 2, lg: 2, xl: 2 };
    return { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 };
  };

  // 상품 목록 Grid
  const productGrid = (
    <Grid container spacing={4} rowSpacing={8}>
      {sortedProducts.map((product: IProduct) => (
        <Grid item {...getItemSize()} key={product._id}>
          <ProductCard product={product} />
        </Grid>
      ))}
      {sortedProducts.length === 0 && (
        <Typography>찾으시는 상품이 없습니다.</Typography>
      )}
    </Grid>
  );

  // 사이드바 Grid
  const sidebarGrid = (
    <Grid item xs={2}>
      <Box
        sx={{
          width: '100%',
          position: 'sticky',
          top: '128px',
          paddingY: '10px',
          boxShadow: 'none',
        }}
      >
        <Accordion
          expanded={expanded === `panel${0}`}
          onChange={handleAccordionChange(`panel${0}`)}
          sx={{
            boxShadow: 'none',
            borderBottom: '1px solid #bdbdbd',
            borderRadius: '0px',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${0}bh-content`}
            id={`panel${0}bh-header`}
            sx={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Typography variant="body1" fontWeight={800}>
              카테고리
            </Typography>
          </AccordionSummary>
          {CATEGORY.depth2.map((category) => (
            <AccordionDetails sx={{ paddingLeft: 0, paddingRight: 0 }}>
              <Button
                key={category.id}
                component={Button}
                variant="text"
                onClick={() => {
                  setSelectedCategory(category.id);
                }}
                sx={{
                  backgroundColor:
                    category.id === selectedCategory ? '#eeeeee' : '#ffffff',
                  color:
                    category.id === selectedCategory ? '#212121' : '#212121',
                  fontWeight: category.id === selectedCategory ? 800 : 400,
                }}
              >
                {category.name}
              </Button>
            </AccordionDetails>
          ))}
        </Accordion>
        <Accordion
          expanded={expanded === `panel${1}`}
          onChange={handleAccordionChange(`panel${1}`)}
          sx={{
            boxShadow: 'none',
            borderBottom: '1px solid #bdbdbd',
            borderRadius: '0px',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${1}bh-content`}
            id={`panel${1}bh-header`}
            sx={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Typography variant="body1" fontWeight={800}>
              가격
            </Typography>
          </AccordionSummary>
          100,000원 이하
        </Accordion>
        <Accordion
          expanded={expanded === `panel${2}`}
          onChange={handleAccordionChange(`panel${2}`)}
          sx={{
            boxShadow: 'none',
            borderBottom: '1px solid #bdbdbd',
            borderRadius: '0px',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${2}bh-content`}
            id={`panel${2}bh-header`}
            sx={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Typography variant="body1" fontWeight={800}>
              배송료
            </Typography>
          </AccordionSummary>
          <CheckBox /> 무료배송
        </Accordion>
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
      >
        <Button onClick={toggleSidebar} variant="outlined" color="inherit">
          {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
        </Button>
      </Box>

      <StickyNavbar
        totalProducts={sortedProducts.length}
        handleSort={setCurrentSortOrder}
        handleDisplayChange={handleDisplayChange}
        handleToggel={toggleSidebar}
      />
      <Box sx={{ marginTop: '50px', maxWidth: '100%', paddingX: '20px' }}>
        <Grid container spacing={3}>
          {isSidebarOpen && sidebarGrid}
          <Grid item xs={isSidebarOpen ? 10 : 12}>
            {productGrid}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
