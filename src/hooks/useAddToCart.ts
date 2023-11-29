import { useNavigate } from 'react-router-dom';
import { useCartStore, useUserStore } from '../lib/store';
import { ICartStore, IProduct, IUserStore } from '../type';

// 장바구니에 상품 추가하는 커스텀 훅
export const useAddToCart = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserStore() as IUserStore;
  const { items, addToCart } = useCartStore() as ICartStore;

  const handleAddToCart = (product: IProduct) => {
    if (!isLoggedIn) {
      const confirmLogin = window.confirm(
        '로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?',
      );
      if (confirmLogin) {
        navigate('/sign-in');
      }
      return;
    }

    const productAlreadyInCart = items.some((item) => item._id === product._id);
    if (productAlreadyInCart) {
      alert('이미 장바구니에 있는 상품입니다.');
      return;
    }

    addToCart({ ...product, quantity: 1 });
    const confirmAddToCart = window.confirm(
      '장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?',
    );
    if (confirmAddToCart) {
      navigate('/cart');
    }
  };

  return handleAddToCart;
};
