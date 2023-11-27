import { useCartStore } from '../lib/store';

export default function MyCart() {
  const { items, removeFromCart, clearCart } = useCartStore();
  console.log(items);
  return (
    <main>
      <>
        {items.map((item) => (
          <div key={item.id}>
            {item.name} - {item.quantity}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))}
        <button onClick={clearCart}>Clear Cart</button>
      </>
    </main>
  );
}
