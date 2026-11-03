import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
    it('calls the confirmation callback', () => {
        const onConfirm = vi.fn();
        render(<CheckoutModal onConfirm={onConfirm} onCancel={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Continue Checkout' }));

        expect(onConfirm).toHaveBeenCalledOnce();
    });

    it('calls the cancel callback', () => {
        const onCancel = vi.fn();
        render(<CheckoutModal onConfirm={vi.fn()} onCancel={onCancel} />);

        fireEvent.click(screen.getByRole('button', { name: 'Return to cart' }));

        expect(onCancel).toHaveBeenCalledOnce();
    });
});
