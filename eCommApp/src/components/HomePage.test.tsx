import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HomePage from './HomePage';

describe('HomePage', () => {
    it('welcomes shoppers and points them to the products page', () => {
        // Arrange
        render(<MemoryRouter><HomePage /></MemoryRouter>);

        // Act
        const productLink = screen.getByRole('link', { name: 'Products' });

        // Assert
        expect(screen.getByRole('heading', { name: 'Welcome to the The Daily Harvest!' })).toBeInTheDocument();
        expect(screen.getByText('Check out our products page for some great deals.')).toBeInTheDocument();
        expect(productLink).toHaveAttribute('href', '/products');
        expect(screen.getByText('© 2025 The Daily Harvest. All rights reserved.')).toBeInTheDocument();
    });
});
