import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CartContext } from '../context/CartContext';
import type { Product } from '../types';
import ProductsPage from './ProductsPage';

const products: Product[] = [
    {
        id: 'apple',
        name: 'Apple',
        price: 1.25,
        description: 'A crisp red apple.',
        image: 'apple.png',
        reviews: [],
        inStock: true
    },
    {
        name: 'Grapes',
        price: 3,
        reviews: [],
        inStock: false
    },
    {
        id: 'orange',
        name: 'Orange',
        price: 1.75,
        reviews: [],
        inStock: true
    },
    {
        id: 'pear',
        name: 'Pear',
        price: 2.5,
        reviews: [],
        inStock: true
    }
];

const renderProductsPage = (addToCart = vi.fn()) => render(
    <MemoryRouter>
        <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
            <ProductsPage />
        </CartContext.Provider>
    </MemoryRouter>
);

const mockProductResponses = (items: Product[] = products) => {
    vi.stubGlobal('fetch', vi.fn()
        .mockResolvedValueOnce({ ok: true, json: async () => items[0] })
        .mockResolvedValueOnce({ ok: true, json: async () => items[1] })
        .mockResolvedValueOnce({ ok: true, json: async () => items[2] })
        .mockResolvedValueOnce({ ok: true, json: async () => items[3] }));
};

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('ProductsPage', () => {
    it('loads products, shows stock availability, and adds an available product to the cart', async () => {
        // Arrange
        const user = userEvent.setup();
        const addToCart = vi.fn();
        mockProductResponses();
        renderProductsPage(addToCart);

        // Act
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
        await screen.findByRole('heading', { name: 'Our Products' });
        await user.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);

        // Assert
        expect(screen.getByText('A crisp red apple.')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Apple' })).toHaveAttribute(
            'src',
            'products/productImages/apple.png'
        );
        expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();
        expect(addToCart).toHaveBeenCalledWith(products[0]);
        expect(fetch).toHaveBeenCalledTimes(4);
    });

    it('opens a product review form and displays the submitted review', async () => {
        // Arrange
        const user = userEvent.setup();
        mockProductResponses();
        renderProductsPage();
        await screen.findByRole('heading', { name: 'Our Products' });

        // Act
        await user.click(screen.getByRole('img', { name: 'Apple' }));
        await user.type(screen.getByPlaceholderText('Your name'), 'Jamie');
        await user.type(screen.getByPlaceholderText('Your review'), 'Fresh and tasty');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        // Assert
        expect(screen.getByText('Fresh and tasty')).toBeInTheDocument();

        // Act
        await user.click(screen.getByRole('button', { name: 'Close' }));

        // Assert
        expect(screen.queryByRole('heading', { name: 'Reviews for Apple' })).not.toBeInTheDocument();
    });

    it('stops loading and reports a failed product request', async () => {
        // Arrange
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        renderProductsPage();

        // Act
        await screen.findByRole('heading', { name: 'Our Products' });

        // Assert
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        expect(consoleError).toHaveBeenCalledWith(
            'Error loading products:',
            expect.objectContaining({ message: 'Failed to load apple.json' })
        );
    });

    it('requires a cart context provider', async () => {
        // Arrange
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        // Act
        expect(() => render(<ProductsPage />)).toThrow('CartContext must be used within a CartProvider');

        // Assert
        expect(consoleError).toHaveBeenCalled();
    });
});
