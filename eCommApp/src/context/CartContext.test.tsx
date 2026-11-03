import { fireEvent, render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { describe, expect, it } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import type { Product } from '../types';

const product: Product = {
    id: 'apple',
    name: 'Apple',
    price: 0.5,
    image: 'apple.png',
    reviews: [],
    inStock: true
};
const secondProduct: Product = {
    id: 'pear',
    name: 'Pear',
    price: 2,
    reviews: [],
    inStock: true
};

const CartControls = () => {
    const cart = useContext(CartContext);
    if (!cart) throw new Error('CartContext is missing');

    return (
        <>
            <button onClick={() => cart.addToCart(product)}>Add apple</button>
            <button onClick={() => cart.addToCart(secondProduct)}>Add pear</button>
            <button onClick={() => cart.clearCart()}>Clear cart</button>
            <output data-testid="cart-state">
                {cart.cartItems.map(item => `${item.name}:${item.quantity}`).join(',')}
            </output>
        </>
    );
};

describe('CartProvider', () => {
    it('starts with an empty cart', () => {
        render(<CartProvider><CartControls /></CartProvider>);
        expect(screen.getByTestId('cart-state')).toHaveTextContent('');
    });

    it('adds a product with quantity one', () => {
        render(<CartProvider><CartControls /></CartProvider>);

        fireEvent.click(screen.getByRole('button', { name: 'Add apple' }));

        expect(screen.getByTestId('cart-state')).toHaveTextContent('Apple:1');
    });

    it('increments quantity when the same product is added again', () => {
        render(<CartProvider><CartControls /></CartProvider>);

        fireEvent.click(screen.getByRole('button', { name: 'Add apple' }));
        fireEvent.click(screen.getByRole('button', { name: 'Add apple' }));

        expect(screen.getByTestId('cart-state')).toHaveTextContent('Apple:2');
    });

    it('keeps distinct products as separate cart items', () => {
        render(<CartProvider><CartControls /></CartProvider>);

        fireEvent.click(screen.getByRole('button', { name: 'Add apple' }));
        fireEvent.click(screen.getByRole('button', { name: 'Add pear' }));

        expect(screen.getByTestId('cart-state')).toHaveTextContent('Apple:1,Pear:1');
    });

    it('clears all cart items', () => {
        render(<CartProvider><CartControls /></CartProvider>);

        fireEvent.click(screen.getByRole('button', { name: 'Add apple' }));
        fireEvent.click(screen.getByRole('button', { name: 'Clear cart' }));

        expect(screen.getByTestId('cart-state')).toHaveTextContent('');
    });
});
