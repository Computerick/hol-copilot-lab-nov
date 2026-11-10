import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
    it('confirms checkout when the shopper continues', async () => {
        // Arrange
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);

        // Act
        await user.click(screen.getByRole('button', { name: 'Continue Checkout' }));

        // Assert
        expect(onConfirm).toHaveBeenCalledOnce();
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('returns to the cart when checkout is canceled', async () => {
        // Arrange
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        const onCancel = vi.fn();
        render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);

        // Act
        await user.click(screen.getByRole('button', { name: 'Return to cart' }));

        // Assert
        expect(onCancel).toHaveBeenCalledOnce();
        expect(onConfirm).not.toHaveBeenCalled();
    });
});
