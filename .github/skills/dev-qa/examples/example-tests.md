# Example unit tests

These short examples illustrate the `dev-qa` conventions. Adapt the setup and assertions to the component under test.

## Happy path: empty cart

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CartProvider } from '../context/CartContext';
import CartPage from './CartPage';

describe('CartPage', () => {
    it('shows the empty-cart message', () => {
        // Arrange
        const page = <CartProvider><CartPage /></CartProvider>;

        // Act
        render(page);

        // Assert
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    });
});
```

## Mocked child: confirming checkout

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CartContext, type CartItem } from '../context/CartContext';
import CartPage from './CartPage';

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm }: { onConfirm: () => void }) => (
        <button onClick={onConfirm}>Confirm order</button>
    )
}));

describe('CartPage checkout', () => {
    it('clears the cart after checkout is confirmed', async () => {
        // Arrange
        const user = userEvent.setup();
        const clearCart = vi.fn();
        const cartItems: CartItem[] = [{
            id: 'apple',
            name: 'Apple',
            price: 1,
            quantity: 1,
            image: 'apple.png',
            reviews: [],
            inStock: true
        }];
        render(
            <CartContext.Provider value={{ cartItems, addToCart: vi.fn(), clearCart }}>
                <CartPage />
            </CartContext.Provider>
        );

        // Act
        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(screen.getByRole('button', { name: 'Confirm order' }));

        // Assert
        expect(clearCart).toHaveBeenCalledOnce();
    });
});
```
