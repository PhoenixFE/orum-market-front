import { useCartStore } from '../lib/store';
import { CartItem } from '../type';

export default function MyCart() {
  const { items, removeFromCart, clearCart } = useCartStore() as {
    items: CartItem[];
    removeFromCart: (id: number) => void;
    clearCart: () => void;
  };

  return (
    <main>
      {items.length === 0 && <p>Your cart is empty</p>}
      {items.length > 0 && (
        <p>장바구니에 {items.length} 개의 아이템이 있습니다.</p>
      )}
      {items.length > 0 && (
        <>
          {items.map((item: CartItem) => (
            <div key={item._id}>
              {item.name} - {item.quantity}
              <button onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          ))}
        </>
      )}
      <button onClick={clearCart}>Clear Cart</button>
    </main>
  );
}
