import { fireEvent, render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const createCartContext = (cartItems = mockCartItems) => ({
    cartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
});

const renderWithCartContext = (cartContext = createCartContext()) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays cart items when cart has items', () => {
        renderWithCartContext();
        
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    });

    it('displays empty cart message when cart is empty', () => {
        renderWithCartContext(createCartContext([]));
        expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();
    });

    it('renders only the item supplied in a single-item cart', () => {
        renderWithCartContext(createCartContext([mockCartItems[0]]));
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
    });

    it('opens the checkout confirmation when checkout is selected', () => {
        renderWithCartContext();

        fireEvent.click(screen.getByRole('button', { name: 'Checkout' }));

        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
    });

    it('closes checkout confirmation without clearing the cart when canceled', () => {
        const cartContext = createCartContext();
        renderWithCartContext(cartContext);

        fireEvent.click(screen.getByRole('button', { name: 'Checkout' }));
        fireEvent.click(screen.getByTestId('cancel-checkout'));

        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        expect(cartContext.clearCart).not.toHaveBeenCalled();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    it('clears the cart and displays the processed order after confirmation', () => {
        const cartContext = createCartContext();
        renderWithCartContext(cartContext);

        fireEvent.click(screen.getByRole('button', { name: 'Checkout' }));
        fireEvent.click(screen.getByTestId('confirm-checkout'));

        expect(cartContext.clearCart).toHaveBeenCalledOnce();
        expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
    });

    it('requires a cart context provider', () => {
        expect(() => render(<CartPage />)).toThrow('CartContext must be used within a CartProvider');
    });
});
