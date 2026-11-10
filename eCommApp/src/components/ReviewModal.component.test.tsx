import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Product } from '../types';
import ReviewModal from './ReviewModal';

const product: Product = {
    id: 'pear',
    name: 'Pear',
    price: 2.5,
    reviews: [{ author: 'Sam', comment: 'Crisp and sweet', date: '2025-01-02T00:00:00.000Z' }],
    inStock: true
};

describe('ReviewModal', () => {
    it('renders nothing when no product is selected', () => {
        // Arrange
        const onClose = vi.fn();
        const onSubmit = vi.fn();

        // Act
        const { container } = render(<ReviewModal product={null} onClose={onClose} onSubmit={onSubmit} />);

        // Assert
        expect(container).toBeEmptyDOMElement();
    });

    it('shows existing reviews and submits a new review', async () => {
        // Arrange
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onSubmit = vi.fn();
        render(<ReviewModal product={product} onClose={onClose} onSubmit={onSubmit} />);
        await user.type(screen.getByPlaceholderText('Your name'), 'Alex');
        await user.type(screen.getByPlaceholderText('Your review'), 'A lovely snack');

        // Act
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        // Assert
        expect(screen.getByText('Crisp and sweet')).toBeInTheDocument();
        expect(onSubmit).toHaveBeenCalledWith({
            author: 'Alex',
            comment: 'A lovely snack',
            date: expect.any(String)
        });
        expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
        expect(onClose).not.toHaveBeenCalled();
    });

    it('shows an empty state and closes only when the backdrop or close button is selected', async () => {
        // Arrange
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onSubmit = vi.fn();
        const emptyProduct = { ...product, reviews: [] };
        const { container } = render(
            <ReviewModal product={emptyProduct} onClose={onClose} onSubmit={onSubmit} />
        );

        // Act
        await user.click(screen.getByRole('heading', { name: 'Reviews for Pear' }));

        // Assert
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
        expect(onClose).not.toHaveBeenCalled();

        // Act
        await user.click(container.firstElementChild!);

        // Assert
        expect(onClose).toHaveBeenCalledOnce();
    });
});
