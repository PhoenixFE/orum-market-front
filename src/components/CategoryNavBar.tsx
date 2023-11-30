// CategoryNavBar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { CATEGORY } from '../constants/index';

const CategoryNavBar = () => {
  const location = useLocation();

  const getCurrentCategory = () => {
    const path = location.pathname.split('/');
    return path[path.length - 1];
  };

  const [currentCategory, setCurrentCategory] = useState(getCurrentCategory());

  useEffect(() => {
    setCurrentCategory(getCurrentCategory());
  }, [location]);

  return (
    <Box
      sx={{
        position: 'fixed',
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%',
        left: 0,
        right: 0,
        mt: { xs: 9, sm: 8 },
        backgroundColor: 'white',
        boxShadow: 3,
        zIndex: 1,
      }}
    >
      {CATEGORY.depth2.map((category) => (
        <Button
          key={category.id}
          component={Link}
          to={`/category/${category.dbName}`}
          variant={currentCategory === category.dbName ? 'contained' : 'text'}
        >
          {category.name}
        </Button>
      ))}
    </Box>
  );
};

export default CategoryNavBar;
