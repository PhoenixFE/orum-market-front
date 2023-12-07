import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { SORT_OPTIONS } from '../constants';

interface INavigationBar {
  totalProducts: number;
  handleToggel: () => void;
  handleSort: (value: string) => void;
  handleDisplayChange: (value: number) => void;
  isSidebarOpen: boolean;
}

export default function NavigationBar({
  totalProducts,
  handleToggel,
  isSidebarOpen,
  handleSort,
  handleDisplayChange,
}: INavigationBar) {
  const [selectedSortOrder, setSelectedSortOrder] = useState<string>('최신순');
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);

  const onSortChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newSortOrder = event.currentTarget.value;
    setSelectedSortOrder(newSortOrder);
    handleSort(newSortOrder);
  };

  const handleGridChange = (value: number) => {
    setItemsPerPage(value);
    handleDisplayChange(value);
  };

  const isSortSelected = (sortOrder: string) => {
    return selectedSortOrder === sortOrder;
  };

  return (
    <StickyNavbar>
      <NavbarContent>
        <Button variant="text" color="inherit" onClick={handleToggel}>
          {isSidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
        </Button>
        <IconButton onClick={handleToggel}>
          <TuneIcon
            style={{
              color: isSidebarOpen ? 'black' : 'lightgray',
            }}
          />
        </IconButton>

        <Typography variant="h6">총 {totalProducts}개의 상품</Typography>
        <Box sx={{ marginLeft: 'auto' }}>
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              value={option.value}
              color="inherit"
              onClick={onSortChange}
              sx={{
                fontWeight: isSortSelected(option.value) ? '700' : '300',
              }}
            >
              {option.label}
            </Button>
          ))}
          <IconButton
            onClick={() => handleGridChange(4)}
            sx={{
              color: itemsPerPage === 4 ? 'black' : 'lightgray',
            }}
          >
            <GridViewRoundedIcon />
          </IconButton>
          <IconButton
            onClick={() => handleGridChange(8)}
            sx={{
              color: itemsPerPage === 8 ? 'black' : 'lightgray',
            }}
          >
            <AppsRoundedIcon />
          </IconButton>
        </Box>
      </NavbarContent>
    </StickyNavbar>
  );
}

const StickyNavbar = styled(AppBar)(({ theme }) => ({
  position: 'sticky',
  top: '64px',
  width: '100%',
  margin: 0,
  padding: 0,
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  zIndex: theme.zIndex.drawer + 1,
}));

const NavbarContent = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: 0,
  margin: '0 auto',
  width: '100%',
  maxWidth: '1200px',
}));
