import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReviewModal from './ReviewModal';
import type { Product } from '../types';

const product: Product = {
    id: 'apple',
    name: 'Apple',
    price: 0.5,
    reviews: [{ author: 'Pat', comment: 'Tasty', date: '2024-01-15T00:00:00.000Z' }],
    inStock: true
};

describe('ReviewModal', () => {
    it('renders nothing when no product is selected', () => {
        const { container } = render(<ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('shows existing reviews and closes when the backdrop or close button is clicked', () => {
        const onClose = vi.fn();
        render(<ReviewModal product={product} onClose={onClose} onSubmit={vi.fn()} />);

        expect(screen.getByText('Reviews for Apple')).toBeInTheDocument();
        expect(screen.getByText('Tasty')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Reviews for Apple'));
        expect(onClose).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('submits review details and resets the form', () => {
        const onSubmit = vi.fn();
        render(<ReviewModal product={{ ...product, reviews: [] }} onClose={vi.fn()} onSubmit={onSubmit} />);

        fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Alex' } });
        fireEvent.change(screen.getByPlaceholderText('Your review'), { target: { value: 'Wonderful' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).toHaveBeenCalledWith({
            author: 'Alex',
            comment: 'Wonderful',
            date: expect.any(String)
        });
        expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your review')).toHaveValue('');
    });
});
