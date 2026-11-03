import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import type { Product } from '../types';
import ProductsPage from './ProductsPage';

const products: Product[] = [
    { id: '1', name: 'Apple', price: 0.5, description: 'Red apple', image: 'apple.png', reviews: [], inStock: true },
    { name: 'Grapes', price: 3, reviews: [], inStock: true },
    { id: '3', name: 'Orange', price: 1.25, image: 'orange.png', reviews: [], inStock: false },
    { id: '4', name: 'Pear', price: 2, reviews: [], inStock: true }
];

const addToCart = vi.fn();

const renderProductsPage = () => render(
    <MemoryRouter>
        <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
            <ProductsPage />
        </CartContext.Provider>
    </MemoryRouter>
);

const successfulResponse = (index: number) => ({
    ok: true,
    json: async () => products[index]
});

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn()
            .mockImplementationOnce(() => Promise.resolve(successfulResponse(0)))
            .mockImplementationOnce(() => Promise.resolve(successfulResponse(1)))
            .mockImplementationOnce(() => Promise.resolve(successfulResponse(2)))
            .mockImplementationOnce(() => Promise.resolve(successfulResponse(3))));
        addToCart.mockClear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('shows loading while products are being fetched', () => {
        vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

        renderProductsPage();

        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('renders loaded products and supports adding in-stock products to the cart', async () => {
        renderProductsPage();

        expect(await screen.findByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
        expect(screen.getByText('Red apple')).toBeInTheDocument();
        expect(screen.getByText('Grapes')).toBeInTheDocument();

        fireEvent.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);

        expect(addToCart).toHaveBeenCalledWith(products[0]);
        expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();
    });

    it('opens a product review, submits it, and prepends it to the displayed reviews', async () => {
        renderProductsPage();
        const appleImage = await screen.findByRole('img', { name: 'Apple' });

        fireEvent.click(appleImage);
        expect(screen.getByRole('heading', { name: 'Reviews for Apple' })).toBeInTheDocument();
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Sam' } });
        fireEvent.change(screen.getByPlaceholderText('Your review'), { target: { value: 'Crisp and fresh' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() => {
            expect(screen.getByText('Crisp and fresh')).toBeInTheDocument();
        });
        expect(screen.getByText(/Sam/)).toBeInTheDocument();
    });

    it('logs a failed product request and leaves the loading state', async () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

        renderProductsPage();

        expect(await screen.findByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
        expect(error).toHaveBeenCalledWith('Error loading products:', expect.any(Error));
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
    });

    it('requires a cart context provider', () => {
        expect(() => render(<ProductsPage />)).toThrow('CartContext must be used within a CartProvider');
    });
});
