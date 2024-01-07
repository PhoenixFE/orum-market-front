import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import TuneIcon from '@mui/icons-material/Tune';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import { styled, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { SORT_OPTIONS } from '../../constants';
import CustomTooltip from '../CustomTooltip';

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
  const [selectedSortOrder, setSelectedSortOrder] = useState<string>('latest');
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  const onSortChange = (sortValue: string) => {
    setSelectedSortOrder(sortValue);
    handleSort(sortValue);
  };

  const handleGridChange = (value: number) => {
    setItemsPerPage(value);
    handleDisplayChange(value);
  };

  const isSortSelected = (sortOrder: string) => {
    return selectedSortOrder === sortOrder;
  };

  return (
    <StickyNavbar color="inherit">
      <NavbarContent>
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
          <Button variant="text" color="inherit" onClick={handleToggel}>
            {isSidebarOpen ? '필터 닫기' : '필터 열기'}
          </Button>
          <CustomTooltip title="필터 열기/닫기">
            <IconButton onClick={handleToggel}>
              <TuneIcon
                style={{
                  color: isSidebarOpen ? 'inherit' : 'darkgray',
                }}
              />
            </IconButton>
          </CustomTooltip>
          <Typography variant="h6">총 {totalProducts}개의 상품</Typography>
        </Box>

        {isMdDown ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <Select
                labelId="filter-select-label"
                id="filter-select"
                value={selectedSortOrder}
                sx={{ fontSize: '0.9rem', borderRadius: 0 }}
                onChange={(event) => onSortChange(event.target.value as string)}
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
                onClick={() => onSortChange(option.value)}
                sx={{
                  fontWeight: isSortSelected(option.value) ? '700' : '300',
                }}
              >
                {option.label}
              </Button>
            ))}
            <CustomTooltip title="아이템 크게 보기">
              <IconButton
                onClick={() => handleGridChange(4)}
                sx={{
                  color: itemsPerPage === 4 ? 'inherit' : 'darkgray',
                }}
              >
                <GridViewRoundedIcon />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip title="아이템 많이 보기">
              <IconButton
                onClick={() => handleGridChange(8)}
                sx={{
                  color: itemsPerPage === 8 ? 'inherit' : 'darkgray',
                }}
              >
                <AppsRoundedIcon />
              </IconButton>
            </CustomTooltip>
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

const NavbarContent = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: 0,
  margin: '0 auto',
  width: '100%',
});
