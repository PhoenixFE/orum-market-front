import { useState } from 'react';
import { Button } from '@mui/material';
import { CATEGORY } from '../../constants';

export default function TestApi() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSelectedCategory, setisSelectedCategory] = useState('all');

  console.log(selectedCategory);

  const onFilteredButton = (value: string) => {
    setSelectedCategory(value);
    setisSelectedCategory(value);
  };

  return (
    <>
      <Button
        key="all"
        variant="text"
        color="inherit"
        onClick={() => onFilteredButton('all')}
        sx={{
          fontWeight: isSelectedCategory === 'all' ? 'bold' : 'light',
        }}
      >
        전체
      </Button>
      {CATEGORY.depth2.map((category) => (
        <Button
          type="button"
          variant="text"
          color="inherit"
          key={category.id}
          onClick={() => onFilteredButton(category.dbCode)}
          sx={{
            fontWeight:
              isSelectedCategory === category.dbCode ? 'bold' : 'light',
          }}
        >
          {category.name}
        </Button>
      ))}
    </>
  );
}
