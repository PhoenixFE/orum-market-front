import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import TuneIcon from '@mui/icons-material/Tune';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import { styled, useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
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
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  const onSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newSortOrder = event.target.value as string;
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
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
          <Button variant="text" color="inherit" onClick={handleToggel}>
            {isSidebarOpen ? '필터 닫기' : '필터 열기'}
          </Button>
          <IconButton onClick={handleToggel}>
            <TuneIcon
              style={{
                color: isSidebarOpen ? 'black' : 'lightgray',
              }}
            />
          </IconButton>

          <Typography variant="h6">총 {totalProducts}개의 상품</Typography>
        </Box>

        {isMdDown ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="filter-select-label">정렬</InputLabel>
              <Select
                labelId="filter-select-label"
                id="filter-select"
                value={selectedSortOrder}
                label="Filter"
                onChange={onSortChange}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : (
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
        )}
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
}));
