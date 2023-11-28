import { useCartStore } from '../lib/store';

export default function MyCart() {
  const { items, removeFromCart, clearCart } = useCartStore();
  console.log(items);

  return (
    <main>
      {items.length === 0 && <p>Your cart is empty</p>}
      {items.length > 0 && (
        <p>장바구니에 {items.length} 개의 아이템이 있습니다.</p>
      )}
      {items.length > 0 && (
        <>
          {items.map((item) => (
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
