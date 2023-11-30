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
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
      {CATEGORY.depth2.map((category) => (
        <Button
          key={category.id}
          component={Link}
          to={`/category/${category.dbName}`}
          color={currentCategory === category.dbName ? 'primary' : 'inherit'}
        >
          {category.name}
        </Button>
      ))}
    </Box>
  );
};

export default CategoryNavBar;
