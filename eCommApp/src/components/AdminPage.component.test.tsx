import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AdminPage from './AdminPage';

describe('AdminPage', () => {
    it('applies a numeric sale and ends it on request', async () => {
        // Arrange
        const user = userEvent.setup();
        render(<MemoryRouter><AdminPage /></MemoryRouter>);

        // Act
        await user.clear(screen.getByRole('textbox', { name: /set sale percent/i }));
        await user.type(screen.getByRole('textbox', { name: /set sale percent/i }), '25');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        // Assert
        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();

        // Act
        await user.click(screen.getByRole('button', { name: 'End Sale' }));

        // Assert
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /set sale percent/i })).toHaveValue('0');
    });

    it('shows an error when the sale value is not numeric', async () => {
        // Arrange
        const user = userEvent.setup();
        render(<MemoryRouter><AdminPage /></MemoryRouter>);
        const saleInput = screen.getByRole('textbox', { name: /set sale percent/i });
        await user.clear(saleInput);
        await user.type(saleInput, 'not a number');

        // Act
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        // Assert
        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('links back to the storefront', () => {
        // Arrange
        render(<MemoryRouter><AdminPage /></MemoryRouter>);

        // Act
        const storefrontLink = screen.getByRole('link', { name: 'Back to Storefront' });

        // Assert
        expect(storefrontLink).toHaveAttribute('href', '/');
    });
});
