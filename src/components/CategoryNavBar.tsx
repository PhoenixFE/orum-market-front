// CategoryNavBar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { CATEGORY } from '../constants/index';

export default function CategoryNavBar() {
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
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        p: 1,
        backgroundColor: 'white',
        boxShadow: 3,
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-evenly',
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
    </Box>
  );
}
